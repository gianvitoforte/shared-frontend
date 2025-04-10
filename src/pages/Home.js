import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Stack,
    Paper,
    CssBaseline,
    ThemeProvider,
    createTheme
} from '@mui/material';
import LogoutButton from '../components/LogoutButton';

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

function Home() {
    const navigate = useNavigate();

    const isAuthenticated = localStorage.getItem('userEmail') !== null;

    if (!isAuthenticated) {
        navigate('/login');
        return null;  // Return null while redirecting
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="sm">
                <Paper elevation={4} sx={{ padding: 4, marginTop: 8 }}>
                    <Box textAlign="center" mb={3}>
                        <Typography variant="h4" gutterBottom>
                            Shared
                        </Typography>
                        <Typography variant="subtitle1">
                            Menù principale
                        </Typography>
                    </Box>

                    <Stack spacing={1}>
                        <Button variant="outlined" fullWidth onClick={() => navigate('/add')}>
                            Aggiungi Spesa
                        </Button>
                        <Button variant="outlined" fullWidth onClick={() => navigate('/group')}>
                            Gestione Gruppi
                        </Button>
                        <Button variant="outlined" fullWidth onClick={() => navigate('/summary')}>
                            Riepilogo Spese
                        </Button>
                        <Button variant="outlined" fullWidth onClick={() => navigate('/balances')}>
                            Saldo
                        </Button>
                    </Stack>

                    <Box mt={4} textAlign="center">
                        <LogoutButton />
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default Home;








