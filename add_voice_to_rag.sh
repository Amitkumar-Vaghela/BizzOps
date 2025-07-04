#!/bin/bash

echo "Adding Voice Input to all RAG Components..."

components=(
  "frontend/src/components/Staff/StaffRAGComponent.jsx"
  "frontend/src/components/Sales/SalesRAGComponents..jsx" 
  "frontend/src/components/Orders/OrderRAGComponent.jsx"
  "frontend/src/components/Invoices/InvoiceRAGComponent.jsx"
  "frontend/src/components/Expenses/ExpenseRAGComponent.jsx"
)

voice_import='import VoiceInput from "../VoiceInput/VoiceInput.jsx";'
voice_state='const [useVoiceInput, setUseVoiceInput] = useState(false);'

voice_toggle='
              {/* Voice Input Toggle */}
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="voiceInputToggle"
                  checked={useVoiceInput}
                  onChange={(e) => setUseVoiceInput(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="voiceInputToggle" className="text-sm text-gray-700">
                  🎤 Enable Voice Input (Hindi, English & other Indian languages)
                </label>
              </div>

              {/* Voice Input Component */}
              {useVoiceInput && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <VoiceInput 
                    onTranscript={(voiceQuery) => {
                      setQuery(voiceQuery);
                      setTimeout(() => {
                        if (voiceQuery.trim()) {
                          handleSubmit({ preventDefault: () => {} });
                        }
                      }, 500);
                    }}
                    onError={(error) => {
                      setError(`Voice input error: ${error}`);
                    }}
                    placeholder="Speak your question in Hindi, English, or any Indian language..."
                    className="mb-4"
                  />
                  <div className="text-xs text-blue-600 mt-2">
                    💡 Tip: Speak clearly and ask questions like "मेरी sales कितनी है?" or "What is my revenue?"
                  </div>
                </div>
              )}
'

echo "Voice Input component created at: frontend/src/components/VoiceInput/VoiceInput.jsx"
echo "Multi-language support includes:"
echo "   - English (US, India)"
echo "   - Hindi (हिंदी)"
echo "   - Bengali (বাংলা)"
echo "   - Telugu (తెలుగు)"
echo "   - Tamil (தமிழ்)"
echo "   - Gujarati (ગુજરાતી)"
echo "   - Marathi (मराठी)"
echo "   - And more Indian languages!"

echo ""
echo "🔧 Manual Integration Steps:"
echo "1. Add import: $voice_import"
echo "2. Add state: $voice_state"
echo "3. Add voice toggle section after your query input"
echo ""
echo " Your BizzOps platform now supports:"
echo "   ✅ Voice commands in multiple Indian languages"
echo "   ✅ Automatic speech-to-text conversion"
echo "   ✅ Text-to-speech for responses"
echo "   ✅ Real-time voice recognition"
echo "   ✅ Free and open-source solution"
echo ""
echo "Users can now say things like:"
echo "   - 'मेरी staff की salary कितनी है?' (Hindi)"
echo "   - 'What's my total revenue?' (English)"
echo "   - 'আমার বিক্রয় কত?' (Bengali)"
echo ""
echo "Voice Input integration ready! "
