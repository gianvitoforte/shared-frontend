import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    Paper,
    CssBaseline,
    ThemeProvider,
    createTheme,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    OutlinedInput,
    Chip
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

function AddExpense() {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [participants, setParticipants] = useState([]);
    const [houseName, setHouseName] = useState(localStorage.getItem('selectedGroup') || '');
    const [members, setMembers] = useState([]);
    const username = (localStorage.getItem('username') || '').trim().toLowerCase();

    useEffect(() => {
        if (houseName) {
            axios.get(`https://shared-backend.vercel.app/api/house/members?name=${houseName}`)
                .then(res => setMembers(res.data))
                .catch(() => setMembers([]));
        }
    }, [houseName]);

    const handleParticipantsChange = (event) => {
        const { target: { value } } = event;
        setParticipants(typeof value === 'string' ? value.split(',') : value);
    };

    const handleSubmit = () => {
        axios.post('https://shared-backend.vercel.app/api/expenses', {
            description,
            amount: parseFloat(amount),
            date,
            paidBy: username,
            participants: [...participants, username],
            houseName
        }, {
            withCredentials: true
        }).then(() => {
            alert('Spesa aggiunta');
            setDescription('');
            setAmount('');
            setDate('');
            setParticipants([]);
        }).catch(() => {
            alert('Errore nell\'aggiunta');
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                    <GroupSelector />
                    <Box textAlign="center" mb={3}>
                        <Typography variant="h4" gutterBottom>
                            Aggiungi Spesa
                        </Typography>
                    </Box>
                    <Stack spacing={2}>
                        <TextField label="Descrizione" fullWidth value={description} onChange={e => setDescription(e.target.value)} />
                        <TextField label="Importo" type="number" fullWidth value={amount} onChange={e => setAmount(e.target.value)} />
                        <TextField label="Data" type="date" fullWidth value={date} onChange={e => setDate(e.target.value)} InputLabelProps={{ shrink: true }} />
                        <FormControl fullWidth>
                            <InputLabel>Partecipanti</InputLabel>
                            <Select
                                multiple
                                value={participants}
                                onChange={handleParticipantsChange}
                                input={<OutlinedInput label="Partecipanti" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {members
                                    .filter(m => m.trim().toLowerCase() !== username)
                                    .map((user) => (
                                        <MenuItem key={user} value={user}>
                                            {user}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <Button variant="outlined" fullWidth onClick={handleSubmit}>
                            Aggiungi
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default AddExpense;















