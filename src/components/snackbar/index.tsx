import { Alert, Snackbar } from '@mui/material'
import React from 'react'

export default function AlertResponse({snackbarOpen, setSnackbarOpen, alertMessage, errorResponse}:any) {
    return (
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
        >
            <Alert onClose={() => setSnackbarOpen(false)} severity={!errorResponse ? "success" : "error"} variant="filled">
                {alertMessage}
            </Alert>
        </Snackbar>
    )
}
