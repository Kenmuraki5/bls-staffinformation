'use client'
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Search = ({search} : any) => {
    const [searchBy, setSearchBy] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const router = useRouter();

    const handleChange = (event: SelectChangeEvent) => {
        setSearchBy(event.target.value as string);
        setSearchInput('');
    };

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };


    const handleKeyDown = async (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            search(searchBy, searchInput);
        }
    };
    

    return (
        <div className="m-3">
            <div className='bg-blue-950 rounded'>
                <p className='text-white font-bold rounded px-5'>Search</p>
            </div>
            <div className="flex items-center">
                <FormControl sx={{ m: 2, minWidth: 150, width: 250 }} size='small'>
                    <InputLabel id="demo-simple-select-label">Search By</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={searchBy}
                        label="Search By"
                        onChange={handleChange}
                    >
                        <MenuItem value={"employeeId"}>Staff ID</MenuItem>
                        <MenuItem value={"employeeName"}>Name</MenuItem>
                        <MenuItem value={"organizationUnit"}>Organization Unit</MenuItem>
                    </Select>
                </FormControl>
                {searchBy && (
                    <>
                        <TextField
                            label={searchBy}
                            fullWidth
                            id="outlined-size-small"
                            size="small"
                            value={searchInput}
                            onChange={handleSearchInputChange}
                            onKeyDown={handleKeyDown}
                        />
                        <Button sx={{ m: 2 }} onClick={() => {
                            search(searchBy, searchInput);
                        }}>Search</Button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Search;