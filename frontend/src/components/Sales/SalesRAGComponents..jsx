import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Calendar, 
  Search, 
  Loader2, 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  RefreshCw
} from 'lucide-react';
import VoiceInput from '../VoiceInput/VoiceInput.jsx';

const token = localStorage.getItem('accessToken');

const SalesRAGComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [timeline, setTimeline] = useState('alltime');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [useVoiceInput, setUseVoiceInput] = useState(false);

  const timelineOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'alltime', label: 'All Time' }
  ];

  const exampleQueries = [
    "What are my top 3 performing products by revenue?",
    "Show me the profit margins for each product",
    "Which products have declining sales?",
    "What's my average order value?",
    "Compare this month's performance with last month",
    "What are my most profitable products?",
    "Show me sales trends over time",
    "Which products need attention?"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('http://localhost:8000/api/v1/sales/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          query: query.trim(),
          timeFilter: timeline 
        })
      });

      const data = await res.json();

      if (data.success) {
        setResponse(data.data);
      } else {
        setError(data.message || 'Failed to process query');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Query error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQuery('');
    setTimeline('alltime');
    setResponse(null);
    setError(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formatResponse = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    const formatted = [];
    let currentList = [];
    let inList = false;

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        // Bold headers
        if (inList && currentList.length > 0) {
          formatted.push(<ul key={`list-${index}`} className="list-disc list-inside mb-4 space-y-1">{currentList}</ul>);
          currentList = [];
          inList = false;
        }
        formatted.push(
          <h3 key={index} className="font-bold text-lg text-gray-800 mt-6 mb-3 border-b-2 border-blue-200 pb-1">
            {trimmed.replace(/\*\*/g, '')}
          </h3>
        );
      } else if (trimmed.startsWith('*') || trimmed.startsWith('-') || trimmed.startsWith('•')) {
        // List items
        inList = true;
        currentList.push(
          <li key={index} className="text-gray-700 ml-2">
            {trimmed.substring(1).trim()}
          </li>
        );
      } else if (trimmed.match(/^\d+\./)) {
        // Numbered list
        if (inList && currentList.length > 0) {
          formatted.push(<ul key={`list-${index}`} className="list-disc list-inside mb-4 space-y-1">{currentList}</ul>);
          currentList = [];
          inList = false;
        }
        formatted.push(
          <div key={index} className="flex items-start gap-3 mb-3 p-3 bg-blue-50 rounded-lg">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {trimmed.match(/^(\d+)\./)[1]}
            </span>
            <span className="text-gray-700">{trimmed.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      } else if (trimmed.includes('$') && trimmed.match(/\$[\d,]+/)) {
        // Financial data
        if (inList && currentList.length > 0) {
          formatted.push(<ul key={`list-${index}`} className="list-disc list-inside mb-4 space-y-1">{currentList}</ul>);
          currentList = [];
          inList = false;
        }
        formatted.push(
          <div key={index} className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
            <p className="text-gray-700 font-medium">{trimmed}</p>
          </div>
        );
      } else if (trimmed.length > 0) {
        // Regular paragraphs
        if (inList && currentList.length > 0) {
          formatted.push(<ul key={`list-${index}`} className="list-disc list-inside mb-4 space-y-1">{currentList}</ul>);
          currentList = [];
          inList = false;
        }
        formatted.push(
          <p key={index} className="text-gray-700 mb-3 leading-relaxed">
            {trimmed}
          </p>
        );
      }
    });

    // Add remaining list items
    if (inList && currentList.length > 0) {
      formatted.push(<ul key="final-list" className="list-disc list-inside mb-4 space-y-1">{currentList}</ul>);
    }

    return formatted;
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white text-black font-bold rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#28282B] bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#28282B] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#36363a] text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">Sales Data Assistant</h2>
                <p className="text-blue-100 text-sm">Ask questions about your sales performance</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Input Section */}
          <div className="mb-6">
            <div className="space-y-4">
              {/* Query Input */}
              <div>
                <label className="block text-base font-medium font-poppins text-white mb-2">
                  Your Question
                </label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask anything about your sales data..."
                  className="w-full px-4 py-3 border bg-[#36363a] shadow-xl text-white rounded-lg "
                  rows="3"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
              </div>

              {/* Timeline Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Time Period
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-4 py-3 border bg-[#36363a] rounded-lg text-white"
                  disabled={isLoading}
                >
                  {timelineOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !query.trim()}
                  className="flex-1 bg-white text-black px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Ask Assistant
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-3 border bg-white text-black rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              {/* Voice Input Toggle */}
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="voiceInputToggle"
                  checked={useVoiceInput}
                  onChange={(e) => setUseVoiceInput(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="voiceInputToggle" className="text-sm text-white">
                  🎤 Enable Voice Input (Hindi, English & Indian languages)
                </label>
              </div>

              {/* Voice Input Component */}
              {useVoiceInput && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    🎙️ Voice Input - Speak in any language
                  </div>
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
                    placeholder="Ask about your sales using voice..."
                    className="mb-4"
                  />
                  <div className="text-xs text-blue-600 flex flex-wrap gap-2">
                    <span>💡 Examples:</span>
                    <span className="bg-white px-2 py-1 rounded">मेरी sales कितनी है?</span>
                    <span className="bg-white px-2 py-1 rounded">What&apos;s my revenue?</span>
                    <span className="bg-white px-2 py-1 rounded">আমার বিক্রয় কত?</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Example Queries */}
          {!response && !error && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-white mb-3">Try these example questions:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {exampleQueries.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(example)}
                    className="p-3 font-poppins text-sm text-center bg-gray-50 hover:bg-gray-100 text-black rounded-lg"
                    disabled={isLoading}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}

          {/* Response Display */}
          {response && (
            <div className="space-y-6">
              {/* Data Context */}
              {response.dataContext && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Transactions</p>
                    <p className="font-bold text-lg">{response.dataContext.totalTransactions}</p>
                  </div>
                  <div className="text-center">
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="font-bold text-lg">${response.dataContext.totalRevenue?.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Profit</p>
                    <p className="font-bold text-lg">${response.dataContext.totalProfit?.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Period</p>
                    <p className="font-bold text-sm">{timelineOptions.find(t => t.value === timeline)?.label}</p>
                  </div>
                </div>
              )}

              {/* AI Response */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-800">AI Analysis</h3>
                  </div>
                  <button
                    onClick={() => copyToClipboard(response.response)}
                    className="text-gray-500 hover:text-gray-700 p-2 rounded"
                    title="Copy response"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  {formatResponse(response.response)}
                </div>

                {/* Query Info */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Search className="w-4 h-4" />
                    <span>Query: "{response.query}"</span>
                    <span>•</span>
                    <Calendar className="w-4 h-4" />
                    <span>Period: {timelineOptions.find(t => t.value === timeline)?.label}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesRAGComponent;