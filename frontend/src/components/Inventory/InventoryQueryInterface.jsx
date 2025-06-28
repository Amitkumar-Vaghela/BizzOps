import React, { useState } from 'react';
import { MessageSquare, Search, BarChart3, Loader2, AlertCircle } from 'lucide-react';


const token = localStorage.getItem('token');

const InventoryQueryInterface = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('query');

  // Example queries for user guidance
  const exampleQueries = [
    "What items are out of stock?",
    "Show me items in the 'fashion' category",
    "Which items have the highest stock?",
    "What's my total inventory count?",
    "Show me items added in the last month"
  ];

  const queryInventory = async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      
      const res = await fetch('http://localhost:8000/api/v1/inventory/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query })
      });

      const data = await res.json();

      if (data.success) {
        setResponse(data.data.response);
      } else {
        setError(data.message || 'Failed to process query');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Query error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInsights = async () => {
    setInsightsLoading(true);
    setError('');
    setInsights('');

    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch('/api/v1/inventory/insights', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        setInsights(data.data.insights);
      } else {
        setError(data.message || 'Failed to generate insights');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Insights error:', err);
    } finally {
      setInsightsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      queryInventory();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🤖 Inventory AI Assistant
        </h2>
        <p className="text-gray-600">
          Ask questions about your inventory and get intelligent insights
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-6 border-b">
        <button
          onClick={() => setActiveTab('query')}
          className={`px-4 py-2 font-medium flex items-center gap-2 ${
            activeTab === 'query'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare size={18} />
          Query Assistant
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2 font-medium flex items-center gap-2 ${
            activeTab === 'insights'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BarChart3 size={18} />
          AI Insights
        </button>
      </div>

      {activeTab === 'query' && (
        <div className="space-y-4">
          {/* Example Queries */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Try these example queries:</h3>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Query Input */}
          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything about your inventory... (e.g., 'What items are running low?', 'Show me all electronics', 'What's my total stock value?')"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
                disabled={loading}
              />
              <div className="absolute bottom-3 right-3">
                <button
                  onClick={queryInventory}
                  disabled={loading || !query.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      Ask AI
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Response Display */}
          {response && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <MessageSquare size={16} />
                AI Response:
              </h3>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {response}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">AI-Powered Inventory Analysis</h3>
            <p className="text-green-700 text-sm">
              Get comprehensive insights about your inventory including stock analysis, recommendations, and trends.
            </p>
          </div>

          <button
            onClick={getInsights}
            disabled={insightsLoading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {insightsLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Analyzing Inventory...
              </>
            ) : (
              <>
                <BarChart3 size={16} />
                Generate AI Insights
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {insights && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <BarChart3 size={16} />
                AI Insights & Recommendations:
              </h3>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {insights}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InventoryQueryInterface;