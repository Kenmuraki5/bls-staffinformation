'use client'
import React from 'react';
import { Button, TextField, Container, Typography, Box, Grid } from '@mui/material';
import { login } from '../lib/action';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default function Auth() {

  const sigin = async (formData:FormData) => {
    await login(formData)
    redirect("/bualuang/BLS")
  }

  return (
    <div className="min-h-screen flex flex-col bg-blue-800">
      <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: 2,
          borderColor: "#1e3a8a",
          p: 2,
          backgroundColor: '#ffffff',
          borderRadius: 8,
          boxShadow: 1,
          width: '100%',
        }}
      >
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item>
            <Image src="/bls.png" width={150} height={150} alt="Logo" />
          </Grid>
          <Grid item xs={12}>
            <Typography component="h1" variant="h5" align="center" color={'black'}>
              STAFFINFORMATION
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <form action={sigin} style={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                name="email"
                label="Email Address or Staff ID"
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
          </Grid>
        </Grid>
      </Box>
    </Container>
    </div>
    
  );
}
