// Voice integration helper functions for RAG components
export const useVoiceRAG = (setQuery, handleSubmit, setError) => {
  const handleVoiceTranscript = (transcript) => {
    if (!transcript.trim()) return;
    
    setQuery(transcript);
    
    // Auto-submit after a short delay to allow user to see the transcribed text
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 500);
  };

  const handleVoiceError = (error) => {
    setError(`Voice input error: ${error}`);
  };

  return {
    handleVoiceTranscript,
    handleVoiceError
  };
};

// Common voice input props for consistency across RAG components
export const getVoiceInputProps = (context = 'general') => {
  const placeholders = {
    staff: "Ask about your staff using voice - salaries, performance, etc...",
    sales: "Ask about your sales using voice - revenue, trends, products...",
    orders: "Ask about your orders using voice - status, customers, amounts...",
    invoices: "Ask about your invoices using voice - payments, outstanding, totals...",
    expenses: "Ask about your expenses using voice - categories, amounts, trends...",
    inventory: "Ask about your inventory using voice - stock levels, items, categories...",
    customers: "Ask about your customers using voice - details, purchases, status...",
    general: "Ask anything about your business data using voice..."
  };

  return {
    placeholder: placeholders[context] || placeholders.general,
    className: "mb-4"
  };
};

// Language specific example queries for different business contexts
export const getContextExamples = (context, language = 'en') => {
  const examples = {
    en: {
      staff: [
        "Who are my highest paid employees?",
        "What's the average salary?",
        "Show me recent hires",
        "Which staff need salary reviews?"
      ],
      sales: [
        "What's my total revenue this month?",
        "Show me top selling products",
        "Which customer bought the most?",
        "What are my daily sales trends?"
      ],
      orders: [
        "How many pending orders do I have?",
        "Show me largest orders",
        "Which orders are overdue?",
        "What's my order completion rate?"
      ],
      invoices: [
        "How much money is outstanding?",
        "Show me overdue invoices",
        "What's my total invoice amount?",
        "Which customers haven't paid?"
      ],
      expenses: [
        "What are my biggest expense categories?",
        "Show me this month's expenses",
        "Which expenses are recurring?",
        "What's my total monthly cost?"
      ]
    },
    hi: {
      staff: [
        "मेरे सबसे ज्यादा वेतन वाले कर्मचारी कौन हैं?",
        "औसत वेतन क्या है?",
        "नए भर्ती हुए कर्मचारी दिखाएं",
        "किन कर्मचारियों की सैलरी रिव्यू की जरूरत है?"
      ],
      sales: [
        "इस महीने मेरी कुल आय क्या है?",
        "सबसे ज्यादा बिकने वाले उत्पाद दिखाएं",
        "किस ग्राहक ने सबसे ज्यादा खरीदा?",
        "मेरे दैनिक बिक्री रुझान क्या हैं?"
      ]
    }
  };

  return examples[language]?.[context] || examples.en[context] || [];
};
