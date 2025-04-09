import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Box,
    Typography,
    Paper,
    CssBaseline,
    ThemeProvider,
    createTheme,
    Divider
} from '@mui/material';
import GroupSelector from '../components/GroupSelector';

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

function Summary() {
    const [houseName, setHouseName] = useState(localStorage.getItem('selectedGroup') || '');
    const [expenses, setExpenses] = useState([]);
    const [monthlyTotal, setMonthlyTotal] = useState(0);
    const [weeklyTotal, setWeeklyTotal] = useState(0);

    useEffect(() => {
        setHouseName(localStorage.getItem('selectedGroup') || '');
    }, []);

    useEffect(() => {
        if (houseName) {
            axios.get(`https://shared-backend.vercel.app/api/expenses?houseName=${houseName}`, { withCredentials: true })
                .then(res => {
                    setExpenses(res.data);
                    calculateTotals(res.data);
                });
        }
    }, [houseName]);

    const calculateTotals = (data) => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());

        const monthly = data
            .filter(e => new Date(e.date) >= startOfMonth)
            .reduce((sum, e) => sum + e.amount, 0);

        const weekly = data
            .filter(e => new Date(e.date) >= startOfWeek)
            .reduce((sum, e) => sum + e.amount, 0);

        setMonthlyTotal(monthly.toFixed(2));
        setWeeklyTotal(weekly.toFixed(2));
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                    <GroupSelector />
                    <Box textAlign="center" mb={3}>
                        <Typography variant="h4" gutterBottom>
                            Riepilogo Spese
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6">Totale mese corrente</Typography>
                        <Typography variant="body1">€ {monthlyTotal}</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6">Totale settimana corrente</Typography>
                        <Typography variant="body1">€ {weeklyTotal}</Typography>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default Summary;


