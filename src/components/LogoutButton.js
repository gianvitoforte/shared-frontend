import React from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.post('/api/auth/logout')
            .then(() => {
                alert('Logout effettuato');
                localStorage.clear();
                navigate('/login');
            })
            .catch(() => alert('Errore durante il logout'));
    };

    return (
        <Button variant="text" color="error" onClick={handleLogout}>
            Logout
        </Button>
    );
}

export default LogoutButton;




