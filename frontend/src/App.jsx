import Signup from "./pages/Signup.jsx";
import Signin from "./pages/Signin.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import SalesPage from "./pages/SalesPage.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InvoicePage from "./pages/InvoicePage.jsx";
import ExpensePage from "./pages/ExpensePage.jsx";
import ReportPage from "./pages/ReportPage.jsx";
import Payment from "./components/Payment/Payment.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/register" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
        <Route path="/inventory" element={<ProtectedRoute element={<InventoryPage />} />} />
        <Route path="/sales" element={<ProtectedRoute element={<SalesPage />} />} />
        <Route path="/Invoices" element={<ProtectedRoute element={<InvoicePage />} />} />
        <Route path="/Expenses" element={<ProtectedRoute element={<ExpensePage />} />} />
        <Route path="/Report" element={<ProtectedRoute element={<ReportPage />} />} />
        <Route path="/Payment" element={<ProtectedRoute element={<Payment />} />} />
      </Routes>
    </Router>
  );
}

export default App;
