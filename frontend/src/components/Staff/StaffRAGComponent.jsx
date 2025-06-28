import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Loader2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  RefreshCw,
  Phone,
  Mail
} from 'lucide-react';
const token = localStorage.getItem('accessToken');

const StaffRAGComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const exampleQueries = [
    "Who are my highest paid staff members?",
    "Which staff members have outstanding balances?",
    "What's my total monthly salary expense?",
    "Show me staff members in credit vs debit",
    "Who joined most recently?",
    "What's the average salary of my staff?",
    "Which staff members need salary adjustments?",
    "Show me staff financial status summary",
    "Who has the highest credit balance?",
    "List staff members with contact details"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('http://localhost:8000/api/v1/staff/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          query: query.trim()
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
          <Users className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#36363a] text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">Staff Data Assistant</h2>
                <p className="text-purple-100 text-sm">Ask questions about your staff and payroll</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Question
                </label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask anything about your staff data..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !query.trim()}
                  className="flex-1 bg-[#36363a] text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Total Staff</p>
                    <p className="font-bold text-lg">{response.dataContext.totalStaff}</p>
                  </div>
                  <div className="text-center">
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Salary Expense</p>
                    <p className="font-bold text-lg">${response.dataContext.totalSalaryExpense?.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Avg Salary</p>
                    <p className="font-bold text-lg">${response.dataContext.averageSalary?.toFixed(0)}</p>
                  </div>
                  <div className="text-center">
                    <UserCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">In Credit</p>
                    <p className="font-bold text-lg">{response.dataContext.staffInCredit}</p>
                  </div>
                  <div className="text-center">
                    <UserX className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">In Debit</p>
                    <p className="font-bold text-lg">{response.dataContext.staffInDebit}</p>
                  </div>
                  <div className="text-center">
                    <TrendingDown className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Net Balance</p>
                    <p className="font-bold text-lg">${response.dataContext.totalBalance?.toLocaleString()}</p>
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

export default StaffRAGComponent;