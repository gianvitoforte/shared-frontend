import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
    const isAuthenticated = localStorage.getItem('userEmail') !== null;

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                <Route path="/add" element={isAuthenticated ? <AddExpense /> : <Navigate to="/login" />} />
                <Route path="/group" element={isAuthenticated ? <Group /> : <Navigate to="/login" />} />
                <Route path="/summary" element={isAuthenticated ? <Summary /> : <Navigate to="/login" />} />
                <Route path="/balances" element={isAuthenticated ? <Balances /> : <Navigate to="/login" />} />
                <Route path="/payments" element={isAuthenticated ? <Payments /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;



