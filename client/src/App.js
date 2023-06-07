import { Routes, Route, Navigate} from "react-router-dom";
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from "./pages/EmployeesPage";
import './App.css';
import LoginPage from "./pages/LoginPage";
import CustomersPage from "./pages/CustomersPage";
import TransactionsPage from "./pages/TransactionsPage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import UserVerificationPage from "./pages/UserVerificationPage";
import WithdrawalRequestPage from "./pages/WithdrawalRequestPage";

function App() {
  return (
    <div className="App">
       <Routes>
       <Route path="/" element={<Navigate to="/login" />} />
       <Route path="/login" element={<LoginPage/>} />
       <Route path="/settings" element={<AccountSettingsPage/>} />
       <Route path="/dashboard" element={<DashboardPage/>} />
       <Route path="/employees" element={<EmployeesPage/>} />
       <Route path="/customers" element={<CustomersPage/>} />
       <Route path="/transactions" element={<TransactionsPage/>} />
       <Route path="/verifications" element={<UserVerificationPage/>} />
       <Route path="/withdrawalRequests" element={<WithdrawalRequestPage/>} />
      </Routes>
    </div>
  );
}

export default App;
