'use client'
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Autocomplete } from '@mui/material';
import React, { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const Search = ({ search, organizationUnits }: any) => {
    const [searchBy, setSearchBy] = useState('');
    const [searchInput, setSearchInput] = useState('');

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
                const query = searchBy === 'employeeId' ? searchInput.replace(/^0+/, '') : searchInput;
                await search(searchBy, query);
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div className="mx-3 mt-3">
            {/* <div className='bg-blue-950 rounded'>
                <p className='text-white font-bold rounded px-5'>SEARCH</p>
            </div> */}
            <div className="flex items-center mt-3">
                <FormControl sx={{ minWidth: 150, width: 250, m: 1 }} size='small'>
                    <InputLabel id="demo-simple-select-label">Search By</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={searchBy}
                        label="Search By"
                        onChange={handleChange}
                    >
                        <MenuItem aria-label={"Employee ID"} value={"employeeId"}>Staff ID</MenuItem>
                        <MenuItem aria-label={"Employee Name"} value={"employeeName"}>Name/Surname (TH, EN)</MenuItem>
                        <MenuItem aria-label={"Employee NickName"} value={"employeenickName"}>Nick Name</MenuItem>
                        <MenuItem aria-label={"Organization Unit"} value={"organizationUnit"}>Organization Unit</MenuItem>
                    </Select>
                </FormControl>
                {searchBy && searchBy !== 'organizationUnit' && (
                    <>
                        <TextField
                            label="Search"
                            fullWidth
                            id="outlined-size-small"
                            size="small"
                            value={searchInput}
                            onChange={handleSearchInputChange}
                            sx={{ mr: 1 }}
                            onKeyDown={handleKeyDown}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button 
			    sx={{ backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' } }}
			    onClick={() => {
                            const query = searchBy === 'employeeId' ? searchInput.replace(/^0+/, '') : searchInput;
                            search(searchBy, query);
                        }}>Search</Button>
                    </>
                )}
                {searchBy === 'organizationUnit' && (
                    <>
                        <Autocomplete
                            disablePortal
                            options={organizationUnits}
                            fullWidth
                            size="small"
                            value={
                                organizationUnits.find((org: any) => org.organizationId === searchInput) || null
                            }
                            onChange={(event: any, newValue: any | null) => {
                                setSearchInput(newValue?.organizationId || '');
                            }}
                            sx={{ mr: 1 }}
                            onKeyDown={handleKeyDown}
                            getOptionLabel={(option: any) => option.organizationUnit || ''}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />


                        <Button 
			    sx={{ backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' } }}
			    onClick={() => {
                            const encodedSearchInput = encodeURIComponent(searchInput);
                            search(searchBy, encodedSearchInput);
                        }}>Search</Button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Search;
