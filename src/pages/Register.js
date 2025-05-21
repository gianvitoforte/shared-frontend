import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    CssBaseline,
    ThemeProvider,
    createTheme,
    Box
} from '@mui/material';

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
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) newErrors.email = 'Email richiesta';
        else if (!emailRegex.test(email)) newErrors.email = 'Email non valida';

        if (!password) newErrors.password = 'Password richiesta';
        else if (password.length < 6) newErrors.password = 'Minimo 6 caratteri';

        if (confirmPassword !== password) newErrors.confirmPassword = 'Le password non coincidono';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = () => {
        if (!validate()) return;

        axios.post('/api/auth/register', { email, password })
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
                <Paper
                    elevation={6}
                    sx={{
                        px: { xs: 3, sm: 4 },
                        py: { xs: 4, sm: 5 },
                        mt: { xs: 6, sm: 8 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Registrati
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleRegister();
                        }}
                        sx={{ mt: 2, width: '100%' }}
                    >
                        <TextField
                            label="Email"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
                        />
                        <TextField
                            label="Conferma Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
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
                        >
                            Hai già un account? Vai al login
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default Register;









