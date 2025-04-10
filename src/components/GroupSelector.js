import React, { useState, useEffect } from 'react';
import { Box, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

function GroupSelector() {
    const [selectedGroup, setSelectedGroup] = useState(localStorage.getItem('selectedGroup') || '');
    const [groups, setGroups] = useState([]);
    const userEmail = localStorage.getItem('userEmail') || 'utente@example.com';

    useEffect(() => {
        axios.get(`https://shared-backend.vercel.app/api/house/mygroups?email=${userEmail}`)
            .then(res => setGroups(res.data))
            .catch(() => setGroups([]));
    }, [userEmail]);

    useEffect(() => {
        localStorage.setItem('selectedGroup', selectedGroup);
    }, [selectedGroup]);

    return (
        <Box mb={3}>
            <FormControl fullWidth>
                <InputLabel>Seleziona Gruppo</InputLabel>
                <Select
                    value={selectedGroup}
                    label="Seleziona Gruppo"
                    onChange={(e) => setSelectedGroup(e.target.value)}
                >
                    {groups.map((group, i) => (
                        <MenuItem key={i} value={group}>{group}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            {selectedGroup && (
                <Typography variant="body2" mt={1} color="text.secondary">
                    Gruppo selezionato: {selectedGroup}
                </Typography>
            )}
        </Box>
    );
}

export default GroupSelector;


