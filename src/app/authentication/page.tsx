import React from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import Image from 'next/image';

export default function Auth() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
          border: 2,
          borderColor: "#1e3a8a",
          p:2,
        }}
      >
        <Typography component="h1" variant="h5">
          <Image src="/bls-header-logo.png" alt="" width={250} height={250} style={{ width: '100%', height: 'auto' }} priority />
          <p className='text-center'>Sign In</p>
        </Typography>
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address or StaffID"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
