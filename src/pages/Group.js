import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
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
    FormControl,
    InputLabel
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

function Group() {
    const [groupName, setGroupName] = useState('');
    const [userGroups, setUserGroups] = useState([]);
    const [selectedGroupToLeave, setSelectedGroupToLeave] = useState('');
    const email = localStorage.getItem('userEmail');

    useEffect(() => {
        if (email) {
            axios.get(`/api/house/mygroups?email=${email}`, { withCredentials: true })
                .then(res => setUserGroups(res.data))
                .catch(() => alert('Errore nel recupero dei gruppi'));
        }
    }, [email]);

    const handleCreate = () => {
        axios.post('/api/house/create', {
            name: groupName,
            email
        }, { withCredentials: true })
            .then(() => {
                localStorage.setItem('selectedGroup', groupName);
                alert('Gruppo creato');
                setGroupName('');
                refreshGroups();
            })
            .catch(() => alert('Errore nella creazione'));
    };

    const handleJoin = () => {
        axios.post('/api/house/join', {
            name: groupName,
            email
        }, { withCredentials: true })
            .then(() => {
                localStorage.setItem('selectedGroup', groupName);
                alert('Unito al gruppo');
                setGroupName('');
                refreshGroups();
            })
            .catch(() => alert('Errore nell\'unione'));
    };

    const handleLeave = () => {
        if (!selectedGroupToLeave) {
            alert('Seleziona un gruppo da abbandonare');
            return;
        }

        axios.post('/api/house/leave', {
            name: selectedGroupToLeave,
            email
        }, { withCredentials: true })
            .then(() => {
                setUserGroups(prev => prev.filter(g => g !== selectedGroupToLeave));
                if (localStorage.getItem('selectedGroup') === selectedGroupToLeave) {
                    localStorage.removeItem('selectedGroup');
                }
                setSelectedGroupToLeave('');
                alert('Hai abbandonato il gruppo');
            })
            .catch(() => alert('Errore durante l\'abbandono del gruppo'));
    };

    const refreshGroups = () => {
        axios.get(`/api/house/mygroups?email=${email}`, { withCredentials: true })
            .then(res => setUserGroups(res.data))
            .catch(() => {});
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="sm">
                <Stack spacing={4} mt={4}>
                    <Paper elevation={3} sx={{ padding: 4 }}>
                        <Box textAlign="center" mb={2}>
                            <Typography variant="h5" gutterBottom>
                                Crea o Unisciti a un Gruppo
                            </Typography>
                        </Box>
                        <Stack spacing={2}>
                            <TextField
                                label="Nome gruppo"
                                value={groupName}
                                onChange={e => setGroupName(e.target.value)}
                                fullWidth
                            />
                            <Button variant="outlined" onClick={handleCreate}>Crea Gruppo</Button>
                            <Button variant="outlined" onClick={handleJoin}>Unisciti al Gruppo</Button>
                        </Stack>
                    </Paper>

                    <Paper elevation={3} sx={{ padding: 4 }}>
                        <Box textAlign="center" mb={2}>
                            <Typography variant="h5" gutterBottom>
                                Abbandona un Gruppo
                            </Typography>
                        </Box>
                        <Stack spacing={2}>
                            <FormControl fullWidth>
                                <InputLabel id="select-group-label">Seleziona gruppo</InputLabel>
                                <Select
                                    labelId="select-group-label"
                                    value={selectedGroupToLeave}
                                    label="Seleziona gruppo"
                                    onChange={e => setSelectedGroupToLeave(e.target.value)}
                                >
                                    {userGroups.map(group => (
                                        <MenuItem key={group} value={group}>
                                            {group}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button variant="outlined" color="error" onClick={handleLeave}>
                                Abbandona il Gruppo
                            </Button>
                        </Stack>
                    </Paper>
                </Stack>
            </Container>
        </ThemeProvider>
    );
}

export default Group;






