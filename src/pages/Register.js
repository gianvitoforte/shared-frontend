import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper, CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#1c1f26',
            paper: '#262b33'
        },
        primary: {
            main: '#cfcfcf'
        },
        text: {
            primary: '#e0e0e0',
            secondary: '#aaaaaa'
        }
    },
    typography: {
        fontFamily: 'Lato, Inter, Roboto, sans-serif'
    },
    shape: {
        borderRadius: 14
    }
});

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = () => {
        axios.post('https://shared-backend.vercel.app/api/auth/register', { email, password })
            .then(() => {
                alert('Registrazione effettuata');
                navigate('/login');
            })
            .catch(() => alert('Errore nella registrazione'));
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5">
                        Registrati
                    </Typography>
                    <form onSubmit={e => {
                        e.preventDefault();
                        handleRegister();
                    }} sx={{ mt: 1 }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Registrati
                        </Button>
                        <Button
                            type="button"
                            fullWidth
                            variant="text"
                            onClick={() => navigate('/login')}
                            sx={{ mt: 1, mb: 2 }}
                        >
                            Hai già un account? Vai al login
                        </Button>
                    </form>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default Register;






