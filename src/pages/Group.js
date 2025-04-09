import React, { useState } from 'react';
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
    createTheme
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
    const email = localStorage.getItem('userEmail');

    const handleCreate = () => {
        axios.post('https://shared-backend.vercel.app/api/house/create', {
            name: groupName,
            email
        }, { withCredentials: true })
            .then(() => {
                localStorage.setItem('selectedGroup', groupName);
                alert('Gruppo creato');
                setGroupName('');
            })
            .catch(() => alert('Errore nella creazione'));
    };

    const handleJoin = () => {
        axios.post('https://shared-backend.vercel.app/api/house/join', {
            name: groupName,
            email
        }, { withCredentials: true })
            .then(() => {
                localStorage.setItem('selectedGroup', groupName);
                alert('Unito al gruppo');
                setGroupName('');
            })
            .catch(() => alert('Errore nell\'unione'));
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                    <Box textAlign="center" mb={3}>
                        <Typography variant="h4" gutterBottom>
                            Gestione Gruppi
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
            </Container>
        </ThemeProvider>
    );
}

export default Group;



