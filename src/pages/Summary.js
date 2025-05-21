import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import {
    Container,
    Box,
    Typography,
    Paper,
    CssBaseline,
    ThemeProvider,
    createTheme,
    Divider,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from 'recharts';
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
    const [view, setView] = useState('month');
    const [monthlyTotal, setMonthlyTotal] = useState(0);
    const [weeklyTotal, setWeeklyTotal] = useState(0);
    const [monthlyHistory, setMonthlyHistory] = useState([]);
    const [weeklyHistory, setWeeklyHistory] = useState([]);

    useEffect(() => {
        const selectedGroup = localStorage.getItem('selectedGroup');
        if (selectedGroup && selectedGroup !== houseName) {
            setHouseName(selectedGroup);
        }
    }, []);

    useEffect(() => {
        if (houseName) {
            axios.get(`/api/expenses?houseName=${houseName}`, { withCredentials: true })
                .then(res => {
                    setExpenses(res.data);
                    calculateTotals(res.data);
                    calculateMonthlyHistory(res.data);
                    calculateWeeklyHistory(res.data);
                });
        }
    }, [houseName]);

    const handleGroupChange = (newGroup) => {
        setHouseName(newGroup);
        localStorage.setItem('selectedGroup', newGroup);
    };

    const handleViewChange = (_, newView) => {
        if (newView !== null) {
            setView(newView);
        }
    };

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

    const calculateMonthlyHistory = (data) => {
        const now = new Date();
        const months = Array.from({ length: 6 }).map((_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            return {
                name: d.toLocaleString('default', { month: 'short' }),
                year: d.getFullYear(),
                month: d.getMonth(),
                total: 0
            };
        }).reverse();

        data.forEach(e => {
            const d = new Date(e.date);
            const match = months.find(m => m.year === d.getFullYear() && m.month === d.getMonth());
            if (match) {
                match.total += e.amount;
            }
        });

        setMonthlyHistory(months.map(m => ({
            name: m.name,
            total: parseFloat(m.total.toFixed(2))
        })));
    };

    const calculateWeeklyHistory = (data) => {
        const now = new Date();
        const weeks = Array.from({ length: 6 }).map((_, i) => {
            const start = new Date(now);
            start.setDate(now.getDate() - now.getDay() - (5 - i) * 7);
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            return {
                label: `${start.getDate()}/${start.getMonth() + 1}`,
                start,
                end,
                total: 0
            };
        });

        data.forEach(e => {
            const d = new Date(e.date);
            weeks.forEach(w => {
                if (d >= w.start && d <= w.end) {
                    w.total += e.amount;
                }
            });
        });

        setWeeklyHistory(weeks.map(w => ({
            name: w.label,
            total: parseFloat(w.total.toFixed(2))
        })));
    };

    const selectedHistory = view === 'month' ? monthlyHistory : weeklyHistory;
    const selectedTotal = view === 'month' ? monthlyTotal : weeklyTotal;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="sm">
                <Paper
                    elevation={3}
                    sx={{
                        px: { xs: 3, sm: 4 },
                        py: { xs: 4, sm: 5 },
                        mt: { xs: 6, sm: 8 }
                    }}
                >
                    <GroupSelector onGroupChange={handleGroupChange} />
                    <Box textAlign="center" mb={3}>
                        <Typography variant="h4" gutterBottom>
                            Riepilogo Spese
                        </Typography>
                        <ToggleButtonGroup
                            value={view}
                            exclusive
                            onChange={handleViewChange}
                            sx={{ mt: 2 }}
                        >
                            <ToggleButton value="month">Mese</ToggleButton>
                            <ToggleButton value="week">Settimana</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    <Box mb={2}>
                        <Typography variant="h6">
                            {view === 'month' ? 'Totale mese corrente' : 'Totale settimana corrente'}
                        </Typography>
                        <Typography variant="body1">
                            € {selectedTotal}
                        </Typography>
                    </Box>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" gutterBottom>
                        Andamento ultime 6 {view === 'month' ? 'mesi' : 'settimane'}
                    </Typography>
                    <Box sx={{ height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={selectedHistory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div style={{
                                                    background: '#333',
                                                    color: '#fff',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.9rem',
                                                    boxShadow: '0 0 5px rgba(0,0,0,0.3)'
                                                }}>
                                                    <strong>{label}</strong><br />
                                                    Spese: € {payload[0].value}
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#90caf9"
                                    strokeWidth={2}
                                    dot
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default Summary;

















