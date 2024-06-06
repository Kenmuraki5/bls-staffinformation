'use client'
import React from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { login } from '../lib/action';
import { redirect } from 'next/navigation';

export default function Auth() {

  const sigin = async (formData:FormData) => {
    await login(formData)
    redirect("/bualuang/BLS")
  }
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
          Sign In
        </Typography>
        <form action={sigin}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            name="email"
            label="Email Address or StaffID"
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
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </form>
      </Box>
    </Container>
  );
}
