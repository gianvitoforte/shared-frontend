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
    List,
    ListItem,
    ListItemText
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

function Balances() {
    const [houseName, setHouseName] = useState(localStorage.getItem('selectedGroup') || '');
    const [expenses, setExpenses] = useState([]);
    const [balances, setBalances] = useState([]);
    const [calculated, setCalculated] = useState(false);

    useEffect(() => {
        setHouseName(localStorage.getItem('selectedGroup') || '');
    }, []);

    useEffect(() => {
        if (houseName) {
            axios.get(`https://shared-backend.vercel.app/api/expenses?houseName=${houseName}`, { withCredentials: true })
                .then(res => {
                    setExpenses(res.data);
                    calculateBalances(res.data);
                    setCalculated(true);
                })
                .catch(() => {
                    setBalances([]);
                    setCalculated(true);
                });
        }
    }, [houseName]);

    const calculateBalances = (expenses) => {
        const memberTotals = {};

        expenses.forEach(exp => {
            const quota = exp.amount / exp.participants.length;
            const paidByEach = exp.paidByEach || [];

            exp.participants.forEach(p => {
                if (!paidByEach.includes(p)) {
                    memberTotals[p] = (memberTotals[p] || 0) - quota;
                    memberTotals[exp.paidBy] = (memberTotals[exp.paidBy] || 0) + quota;
                }
            });
        });

        const result = Object.entries(memberTotals).map(([name, balance]) => ({
            name,
            balance: parseFloat(balance.toFixed(2))
        }));

        setBalances(result);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                    <GroupSelector />
                    <Box textAlign="center" mb={3}>
                        <Typography variant="h4" gutterBottom>
                            Saldo
                        </Typography>
                    </Box>
                    {calculated && balances.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                            Nessuna spesa trovata per questo gruppo.
                        </Typography>
                    )}
                    {balances.length > 0 && (
                        <List>
                            {balances.map((b, i) => (
                                <ListItem key={i}>
                                    <ListItemText
                                        primary={b.name}
                                        secondary={`€ ${b.balance}`}
                                        secondaryTypographyProps={{
                                            color: b.balance > 0 ? 'success.main' : b.balance < 0 ? 'error.main' : 'text.secondary'
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default Balances;






