import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const location = useLocation();
    const hideOnPaths = ['/login', '/register'];
    if (hideOnPaths.includes(location.pathname)) return null;

    return (
        <AppBar position="static" sx={{ backgroundColor: '#1c1f26' }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Shared
                </Typography>
                <Box>
                    <Button component={Link} to="/home" color="inherit">
                        Home
                    </Button>
                    <Button component={Link} to="/payments" color="inherit">
                        Pagamenti
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;


