import Signup from "./pages/Signup.jsx";
import Signin from "./pages/Signin.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import SalesPage from "./pages/SalesPage.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddInvoice from "./components/Invoices/AddInvoice.jsx";
import InvoiceTable from "./components/Invoices/InvoiceTable.jsx";
import Invoice from "./components/Invoices/Invoice.jsx";

function App() {

  return (
    <>
    
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage/>} />
          <Route path="/login" element={<Signin />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/Invoices" element={<Invoice />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;

