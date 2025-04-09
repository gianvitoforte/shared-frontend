import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddExpense from './pages/AddExpense';
import Group from './pages/Group';
import Summary from './pages/Summary';
import Balances from './pages/Balances';
import Payments from './pages/Payments';
import Navbar from './components/Navbar';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/add" element={<AddExpense />} />
                <Route path="/group" element={<Group />} />
                <Route path="/summary" element={<Summary />} />
                <Route path="/balances" element={<Balances />} />
                <Route path="/payments" element={<Payments />} />
            </Routes>
        </Router>
    );
}

export default App;



