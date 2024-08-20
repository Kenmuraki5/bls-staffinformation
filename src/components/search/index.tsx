'use client'
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const Search = ({ search }: any) => {
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
            try {
                await search(searchBy, searchInput);
            } catch (error) {
                console.log(error);
            }
        }
    };


    return (
        <div className="m-3">
            <div className='bg-blue-950 rounded'>
                <p className='text-white font-bold rounded px-5'>SEARCH</p>
            </div>
            <div className="flex items-center mt-3">
                <FormControl sx={{ pr: 2, minWidth: 150, width: 250 }} size='small'>
                    <InputLabel id="demo-simple-select-label">Search By</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={searchBy}
                        label="Search By"
                        onChange={handleChange}
                    >
                        <MenuItem aria-label={"Employee ID"} value={"employeeId"}>Staff ID</MenuItem>
                        <MenuItem aria-label={"Employee Name"} value={"employeeName"}>Name (TH, EN)</MenuItem>
                        <MenuItem aria-label={"Employee NickName"} value={"employeenickName"}>Nick Name</MenuItem>
                        <MenuItem aria-label={"Organization Unit"} value={"organizationUnit"}>Organization Unit</MenuItem>
                    </Select>
                </FormControl>
                {searchBy && (
                    <>
                        <TextField
                            label="Search"
                            fullWidth
                            id="outlined-size-small"
                            size="small"
                            value={searchInput}
                            onChange={handleSearchInputChange}
                            onKeyDown={handleKeyDown}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
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