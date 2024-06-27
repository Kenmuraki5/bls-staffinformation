'use client'
import { Alert, InputLabel, MenuItem, Select, Snackbar } from '@mui/material';
import dynamic from 'next/dynamic';
import React from 'react';
import { createAccount } from '@/app/lib/action';

const PersistentDrawerLeft = dynamic(() => import('@/components/drawer'));
const imageUrl = '/bls-header-logo.png';

export default function Page() {
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [errorResponse, setError] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');

    const Register = async (formData: FormData) => {
        try {
            await createAccount(formData)
            setSnackbarOpen(true);
            setError(false);
            setAlertMessage('Create Account successful');
        } catch (error) {
            setSnackbarOpen(true);
            setError(true);
            setAlertMessage(error.message);
        }
    }
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 flex items-center justify-center bg-white overflow-scroll mt-20">
                <PersistentDrawerLeft />
                <div className="max-w-screen-lg mx-auto flex-1 flex justify-center items-center">
                    <form action={Register} className="max-w-sm w-full p-10 bg-gray-100 rounded-lg shadow-md flex-1">
                        <p className='text-black text-xl font-bold text-center m-3'>Create Account BLS</p>
                        <div className="mb-5">
                            <label className="block mb-2 text-black font-medium">StaffID</label>
                            <input type="number" id="staffID" className="bg-gray-50 text-black border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="1234" required />
                        </div>
                        <div className="mb-5">
                            <label className="block mb-2 text-black font-medium">Email</label>
                            <input type="email" id="email"
                                name="email" className="bg-gray-50 text-black border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="example@bualuang.com" required />
                        </div>
                        <div className="mb-5">
                            <label className="block mb-2 text-black font-medium">Password</label>
                            <input type="password" id="password" name="password" className="bg-gray-50 text-black border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className="mb-5">
                            <label className="block mb-2 text-black font-medium">Confirm password</label>
                            <input type="password" id="password" className="bg-gray-50 text-black border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className="mb-5">
                            <InputLabel id="role-label" className="block mb-2 text-black font-medium">Role</InputLabel>
                            <Select
                                className="block mb-2 text-sm font-medium dark:border-gray-600"
                                labelId="role-label"
                                id="role"
                                label="Role"
                                name="role"
                            >
                                <MenuItem value={"user"}>user</MenuItem>
                                <MenuItem value={"admin"}>admin</MenuItem>
                            </Select>
                        </div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </form>
                    <div className="justify-center items-center p-10">
                        <img src={imageUrl} alt="Image" width={400} height={400} />
                    </div>
                </div>
            </main>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={!errorResponse ? "success" : "error"} variant="filled">
                    {alertMessage}
                </Alert>
            </Snackbar>
            <footer className='bg-pink-950 w-full p-2 text-white text-center'>
                Copyright 2011© Bualuang Securities PCL
            </footer>
        </div>
    );
}
