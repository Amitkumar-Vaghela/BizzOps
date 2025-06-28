import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Calendar, 
  Search, 
  Loader2, 
  Package,
  TrendingUp, 
  DollarSign, 
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  RefreshCw,
  Truck,
  AlertTriangle,
  ShoppingCart,
  Target
} from 'lucide-react';
const token = localStorage.getItem('accessToken');


const OrderRAGComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [timeline, setTimeline] = useState('alltime');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const timelineOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'alltime', label: 'All Time' }
  ];

  const exampleQueries = [
    "What orders are due for delivery this week?",
    "Show me my most profitable items",
    "Which orders are overdue?",
    "What's my order completion rate?",
    "Compare completed vs pending orders",
    "Show me upcoming deliveries",
    "Which items have the highest profit margins?",
    "What's the status of my recent orders?"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      
      const res = await fetch('http://localhost:8000/api/v1/orders/query', {
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
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
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
      } else if (trimmed.toLowerCase().includes('overdue') || trimmed.toLowerCase().includes('urgent')) {
        // Urgent/overdue items
        if (inList && currentList.length > 0) {
          formatted.push(<ul key={`list-${index}`} className="list-disc list-inside mb-4 space-y-1">{currentList}</ul>);
          currentList = [];
          inList = false;
        }
        formatted.push(
          <div key={index} className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-red-700 font-medium">{trimmed}</p>
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
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        >
          <Package className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r bg-[#36363a] text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">Order Management Assistant</h2>
                <p className="text-orange-100 text-sm">Ask questions about your orders and deliveries</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-orange-200 text-2xl font-bold"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Question
                </label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask anything about your orders and deliveries..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Time Period
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                  className="flex-1  disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
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
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Example Queries */}
          {!response && !error && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Try these example questions:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {exampleQueries.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(example)}
                    className="p-3 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
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
                    <ShoppingCart className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="font-bold text-lg">{response.dataContext.totalOrders}</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="font-bold text-lg">{response.dataContext.completedOrders}</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="font-bold text-lg">{response.dataContext.pendingOrders}</p>
                  </div>
                  <div className="text-center">
                    <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Completion Rate</p>
                    <p className="font-bold text-lg">{response.dataContext.completionRate?.toFixed(1)}%</p>
                  </div>
                </div>
              )}

              {/* Alert Cards */}
              {response.dataContext && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Upcoming Deliveries</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{response.dataContext.upcomingDeliveries || 0}</p>
                    <p className="text-sm text-blue-600">Next 7 days</p>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-800">Overdue Orders</span>
                    </div>
                    <p className="text-2xl font-bold text-red-900">{response.dataContext.overdueOrders || 0}</p>
                    <p className="text-sm text-red-600">Need attention</p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Total Revenue</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">
                      ${response.dataContext.totalRevenue?.toLocaleString() || '0'}
                    </p>
                    <p className="text-sm text-green-600">All selected period</p>
                  </div>
                </div>
              )}

              {/* AI Response */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Assistant Response
                  </h3>
                  <button
                    onClick={() => copyToClipboard(response.response)}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Copy response"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="prose prose-sm max-w-none">
                  {formatResponse(response.response)}
                </div>
              </div>

              {/* Query Details */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">Query Details</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>Question:</strong> {response.query}</div>
                  <div><strong>Time Filter:</strong> {timelineOptions.find(opt => opt.value === timeline)?.label}</div>
                  <div><strong>Data Points:</strong> {response.dataContext?.totalOrders || 0} orders analyzed</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderRAGComponent;