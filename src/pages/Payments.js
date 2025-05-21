import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Box,
    Typography,
    Paper,
    CssBaseline,
    ThemeProvider,
    createTheme,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Stack,
    Divider,
    Button,
    Chip,
    Switch,
    FormControl,
    FormLabel
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

function Payments() {
    const [expenses, setExpenses] = useState([]);
    const [houseName, setHouseName] = useState(localStorage.getItem('selectedGroup') || '');
    const [edited, setEdited] = useState({});
    const [showOnlyOpen, setShowOnlyOpen] = useState(false);
    const currentUser = localStorage.getItem('username');

    useEffect(() => {
        setHouseName(localStorage.getItem('selectedGroup') || '');
    }, []);

    useEffect(() => {
        if (houseName) {
            axios.get(`/api/expenses?houseName=${houseName}`, { withCredentials: true })
                .then(res => setExpenses(res.data));
        }
    }, [houseName]);

    const handleGroupChange = (selectedGroup) => {
        setHouseName(selectedGroup);
        localStorage.setItem('selectedGroup', selectedGroup);
    };

    const togglePayment = (expenseId, participant) => {
        setEdited(prev => {
            const original = expenses.find(e => e._id === expenseId)?.paidByEach || [];
            const current = new Set(prev[expenseId] || original);
            current.has(participant) ? current.delete(participant) : current.add(participant);
            return { ...prev, [expenseId]: Array.from(current) };
        });
    };

    const saveChanges = (expenseId) => {
        const paidByEach = edited[expenseId] || [];
        axios.patch(`/api/expenses/${expenseId}`, { paidByEach })
            .then(() => {
                alert('Aggiornato');
                setEdited(prev => {
                    const updated = { ...prev };
                    delete updated[expenseId];
                    return updated;
                });
                axios.get(`/api/expenses?houseName=${houseName}`, { withCredentials: true })
                    .then(res => setExpenses(res.data));
            });
    };

    const isFullyPaid = (exp) => {
        const paid = exp.paidByEach || [];
        return exp.participants.every(p => p === exp.paidBy || paid.includes(p));
    };

    const hasPendingChanges = (exp) => {
        const modified = edited[exp._id];
        if (!modified) return false;
        const original = exp.paidByEach || [];
        return JSON.stringify([...modified].sort()) !== JSON.stringify([...original].sort());
    };

    const userExpenses = expenses.filter(exp => exp.createdBy === currentUser);
    const openExpenses = userExpenses.filter(exp => !isFullyPaid(exp));
    const closedExpenses = userExpenses.filter(exp => isFullyPaid(exp));
    const displayedExpenses = showOnlyOpen ? openExpenses : [...openExpenses, ...closedExpenses];

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                    <GroupSelector onGroupChange={handleGroupChange} />
                    <Box textAlign="center" mb={3}>
                        <Typography variant="h4" gutterBottom>
                            Pagamenti Spese
                        </Typography>
                    </Box>
                    <FormControl component="fieldset" sx={{ mb: 3 }}>
                        <FormLabel component="legend">Filtro</FormLabel>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={showOnlyOpen}
                                    onChange={() => setShowOnlyOpen(!showOnlyOpen)}
                                />
                            }
                            label="Mostra solo spese non saldate"
                        />
                    </FormControl>
                    <Stack spacing={3}>
                        {displayedExpenses.map((exp) => {
                            const paidList = edited[exp._id] || exp.paidByEach || [];
                            const complete = isFullyPaid(exp);
                            const pending = hasPendingChanges(exp);

                            return (
                                <Box key={exp._id} sx={{
                                    border: '1px solid',
                                    borderColor: complete ? 'success.main' : '#444',
                                    padding: 2,
                                    borderRadius: 2,
                                    backgroundColor: complete ? '#26332c' : '#1e222a'
                                }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h6">{exp.description}</Typography>
                                        {complete && !pending && (
                                            <Chip label="Completato" color="success" size="small" />
                                        )}
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">€ {exp.amount}</Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <FormGroup>
                                        {exp.participants
                                            .filter(p => p !== exp.paidBy)
                                            .map((p) => (
                                                <FormControlLabel
                                                    key={p}
                                                    control={
                                                        <Checkbox
                                                            checked={paidList.includes(p)}
                                                            onChange={() => togglePayment(exp._id, p)}
                                                        />
                                                    }
                                                    label={p}
                                                />
                                            ))}
                                    </FormGroup>
                                    {pending && (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => saveChanges(exp._id)}
                                            sx={{ mt: 1 }}
                                        >
                                            Salva
                                        </Button>
                                    )}
                                </Box>
                            );
                        })}
                    </Stack>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default Payments;









