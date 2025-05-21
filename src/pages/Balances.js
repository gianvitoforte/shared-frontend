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
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
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
            axios.get(`/api/expenses?houseName=${houseName}`, { withCredentials: true })
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

    const handleGroupChange = (selectedGroup) => {
        setHouseName(selectedGroup);
        localStorage.setItem('selectedGroup', selectedGroup);
    };

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

    const creditors = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);
    const debtors = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);
    const maxLength = Math.max(creditors.length, debtors.length);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ padding: 5, marginTop: 8 }}>
                    <GroupSelector onGroupChange={handleGroupChange} />
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h4" gutterBottom>
                            Saldo
                        </Typography>
                    </Box>
                    {calculated && balances.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                            Nessuna spesa trovata per questo gruppo.
                        </Typography>
                    )}
                    {calculated && balances.length > 0 && (
                        <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
                            <Grid item xs={12} md={6}>
                                <Box sx={{ minWidth: 360 }}>
                                    <Typography variant="h6" gutterBottom textAlign="center">
                                        Utenti in attivo
                                    </Typography>
                                    <TableContainer component={Paper} sx={{ backgroundColor: '#1e222a' }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontSize: '1.05rem' }}>Nome</TableCell>
                                                    <TableCell align="right" sx={{ fontSize: '1.05rem' }}>Saldo</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {[...Array(maxLength)].map((_, i) => {
                                                    const user = creditors[i];
                                                    return user ? (
                                                        <TableRow key={i}>
                                                            <TableCell sx={{ fontSize: '1.05rem' }}>{user.name}</TableCell>
                                                            <TableCell align="right" sx={{ color: 'success.main', fontSize: '1.05rem' }}>
                                                                € {user.balance.toFixed(2)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        <TableRow key={i}>
                                                            <TableCell colSpan={2}>&nbsp;</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ minWidth: 360 }}>
                                    <Typography variant="h6" gutterBottom textAlign="center">
                                        Utenti in passivo
                                    </Typography>
                                    <TableContainer component={Paper} sx={{ backgroundColor: '#1e222a' }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontSize: '1.05rem' }}>Nome</TableCell>
                                                    <TableCell align="right" sx={{ fontSize: '1.05rem' }}>Saldo</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {[...Array(maxLength)].map((_, i) => {
                                                    const user = debtors[i];
                                                    return user ? (
                                                        <TableRow key={i}>
                                                            <TableCell sx={{ fontSize: '1.05rem' }}>{user.name}</TableCell>
                                                            <TableCell align="right" sx={{ color: 'error.main', fontSize: '1.05rem' }}>
                                                                € {user.balance.toFixed(2)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        <TableRow key={i}>
                                                            <TableCell colSpan={2}>&nbsp;</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default Balances;














