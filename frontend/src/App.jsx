import Signup from "./pages/Signup.jsx";
import Signin from "./pages/Signin.jsx";
import AddSales from "./components/AddSales";
import AddInventory from "./components/AddInventory";
import SalesTable from "./components/SalesTable";
import InventoryTable from "./components/InventoryTable";
import LandingPage from "./pages/LandingPage.jsx";
import Landing from "./components/Landing.jsx";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <>
      {/* <Login /> 
        <AddSales />
        <SalesTable />
        <InventoryTable/>
        <AddInventory/> */}
      {/* <Landing/> */}
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/register" element={<Signup />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;

