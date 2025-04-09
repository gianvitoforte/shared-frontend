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
    Button
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

    useEffect(() => {
        setHouseName(localStorage.getItem('selectedGroup') || '');
    }, []);

    useEffect(() => {
        if (houseName) {
            axios.get(`https://shared-backend.vercel.app/api/expenses?houseName=${houseName}`, { withCredentials: true })
                .then(res => setExpenses(res.data));
        }
    }, [houseName]);

    const togglePayment = (expenseId, participant) => {
        setEdited(prev => {
            const current = new Set(prev[expenseId] || expenses.find(e => e._id === expenseId)?.paidByEach || []);
            if (current.has(participant)) {
                current.delete(participant);
            } else {
                current.add(participant);
            }
            return { ...prev, [expenseId]: Array.from(current) };
        });
    };

    const saveChanges = (expenseId) => {
        const paidByEach = edited[expenseId] || [];
        axios.patch(`https://shared-backend.vercel.app/api/expenses/${expenseId}`, { paidByEach })
            .then(() => alert('Aggiornato'));
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                    <GroupSelector />
                    <Box textAlign="center" mb={3}>
                        <Typography variant="h4" gutterBottom>
                            Pagamenti Spese
                        </Typography>
                    </Box>
                    <Stack spacing={3}>
                        {expenses.map((exp) => (
                            <Box key={exp._id} sx={{ border: '1px solid #333', padding: 2, borderRadius: 2 }}>
                                <Typography variant="h6">{exp.description}</Typography>
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
                                                        checked={(
                                                            edited[exp._id] || exp.paidByEach || []
                                                        ).includes(p)}
                                                        onChange={() => togglePayment(exp._id, p)}
                                                        disabled={exp.createdBy !== localStorage.getItem('username')}
                                                    />
                                                }
                                                label={p}
                                            />
                                        ))}
                                </FormGroup>
                                {exp.createdBy === localStorage.getItem('username') && (
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
                        ))}
                    </Stack>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default Payments;



