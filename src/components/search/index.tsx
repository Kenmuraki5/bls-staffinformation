'use client'
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React from 'react'

export default function Search() {
    const [age, setAge] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };

    return (
        <div className="m-3">
            <div className='bg-rose-700 rounded'>
                <p className='text-white font-bold rounded px-5'>Search</p>
            </div>
            <FormControl sx={{ m: 2, minWidth: 200 }} size='small'>
                <InputLabel id="demo-simple-select-label">Search By</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    // value={age}
                    label="Age"
                // onChange={handleChange}
                >
                    <MenuItem value={10}>Staff ID</MenuItem>
                    <MenuItem value={20}>Name</MenuItem>
                    <MenuItem value={30}>Organization unit</MenuItem>
                </Select>
            </FormControl>
        </div>
    )
}
