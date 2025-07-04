/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Globe } from 'lucide-react';

const VoiceInput = ({ 
    onTranscript, 
    onError, 
    placeholder = "Click the mic and speak...", 
    className = "",
    supportedLanguages = null 
}) => {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('en-US');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [error, setError] = useState(null);
    
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    const languages = supportedLanguages || [
        { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
        { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
        { code: 'hi-IN', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
        { code: 'bn-IN', name: 'বাংলা (Bengali)', flag: '🇮🇳' },
        { code: 'te-IN', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
        { code: 'mr-IN', name: 'मराठी (Marathi)', flag: '🇮🇳' },
        { code: 'ta-IN', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
        { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
        { code: 'ur-IN', name: 'اردو (Urdu)', flag: '🇮🇳' },
        { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
        { code: 'ml-IN', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
        { code: 'or-IN', name: 'ଓଡ଼ିଆ (Odia)', flag: '🇮🇳' },
        { code: 'pa-IN', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
        { code: 'as-IN', name: 'অসমীয়া (Assamese)', flag: '🇮🇳' },
        { code: 'ne-NP', name: 'नेपाली (Nepali)', flag: '🇳🇵' },
        { code: 'si-LK', name: 'සිංහල (Sinhala)', flag: '🇱🇰' },
    ];

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        setIsSupported(!!SpeechRecognition);

        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            const recognition = recognitionRef.current;

            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = selectedLanguage;
            recognition.maxAlternatives = 1;
            
            if ('webkitSpeechRecognition' in window) {
                recognition.continuous = false;
                recognition.interimResults = true;
            }

            recognition.onstart = () => {
                setIsListening(true);
                setError(null);
            };

            recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                const currentTranscript = finalTranscript || interimTranscript;
                setTranscript(currentTranscript);
                
                if (finalTranscript && onTranscript) {
                    onTranscript(finalTranscript.trim());
                    setIsListening(false);
                }
            };

            recognition.onerror = (event) => {
                setIsListening(false);
                
                let errorMessage = '';
                switch(event.error) {
                    case 'no-speech':
                        errorMessage = 'No speech detected. Please try speaking louder and closer to your microphone.';
                        break;
                    case 'audio-capture':
                        errorMessage = 'Microphone not found. Please check your microphone connection.';
                        break;
                    case 'not-allowed':
                        errorMessage = 'Microphone access denied. Please allow microphone permissions and try again.';
                        break;
                    case 'network':
                        errorMessage = 'Network error. Please check your internet connection.';
                        break;
                    case 'aborted':
                        errorMessage = 'Speech recognition was aborted.';
                        break;
                    case 'language-not-supported':
                        errorMessage = 'Selected language is not supported. Please try English.';
                        break;
                    default:
                        errorMessage = `Speech recognition error: ${event.error}. Please try again.`;
                }
                
                if (onError) {
                    onError(errorMessage);
                }
            };

            recognition.onend = () => {
                setIsListening(false);
            };
        }

        const synth = synthRef.current;
        const loadVoices = () => {
            const availableVoices = synth.getVoices();
            const preferredVoice = availableVoices.find(voice => 
                voice.lang.startsWith(selectedLanguage.split('-')[0])
            );
            setSelectedVoice(preferredVoice || availableVoices[0]);
        };

        loadVoices();
        synth.addEventListener('voiceschanged', loadVoices);

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            synth.removeEventListener('voiceschanged', loadVoices);
        };
    }, [selectedLanguage, onTranscript, onError]);

    const startListening = async () => {
        if (recognitionRef.current && !isListening) {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                setTranscript('');
                setError(null);
                recognitionRef.current.lang = selectedLanguage;
                recognitionRef.current.start();
            } catch (err) {
                if (onError) {
                    onError('Microphone access denied. Please allow microphone permissions in your browser and try again.');
                }
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const speakText = (text) => {
        if (!text || !synthRef.current) return;
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        synthRef.current.speak(utterance);
    };

    const stopSpeaking = () => {
        synthRef.current.cancel();
        setIsSpeaking(false);
    };

    if (!isSupported) {
        return (
            <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <MicOff className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-yellow-700">
                    Voice input not supported in this browser
                </span>
            </div>
        );
    }

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex items-center space-x-3">
                <button
                    onClick={toggleListening}
                    disabled={!isSupported}
                    className={`p-3 rounded-full border-2 transition-all duration-200 ${
                        isListening
                            ? 'bg-red-500 border-red-500 text-white animate-pulse'
                            : 'bg-white border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500'
                    }`}
                    title={isListening ? 'Stop recording' : 'Start recording'}
                >
                    {isListening ? (
                        <MicOff className="w-5 h-5" />
                    ) : (
                        <Mic className="w-5 h-5" />
                    )}
                </button>
                <div className="flex-1">
                    <input
                        type="text"
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        placeholder={isListening ? "Listening..." : placeholder}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isListening ? 'border-red-300 bg-red-50' : ''
                        }`}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && transcript.trim()) {
                                if (onTranscript) {
                                    onTranscript(transcript.trim());
                                }
                            }
                        }}
                    />
                </div>
                <button
                    onClick={() => {
                        if (isSpeaking) {
                            stopSpeaking();
                        } else if (transcript) {
                            speakText(transcript);
                        }
                    }}
                    disabled={!transcript}
                    className={`p-2 rounded border transition-colors ${
                        isSpeaking
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={isSpeaking ? 'Stop speaking' : 'Speak text'}
                >
                    {isSpeaking ? (
                        <VolumeX className="w-4 h-4" />
                    ) : (
                        <Volume2 className="w-4 h-4" />
                    )}
                </button>
            </div>
            {isListening && (
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2 text-red-600">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Listening... Speak now</span>
                    </div>
                    <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                        💡 <strong>Tips:</strong> Speak clearly and wait for the microphone icon to turn red. 
                        Say something like &quot;मेरी staff की salary कितनी है?&quot; or &quot;What&apos;s my revenue?&quot;
                    </div>
                </div>
            )}
            {!isListening && !isSupported && (
                <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                    ⚠️ Voice input not supported in this browser. Please use Chrome, Edge, or Safari.
                </div>
            )}
            {error && (
                <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                    ❌ {error}
                    <div className="mt-1 text-gray-600">
                        <strong>Try:</strong> Speaking louder, checking microphone permissions, or using a different browser.
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoiceInput;
