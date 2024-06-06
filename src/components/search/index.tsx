'use client'
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { SearchProps } from './type';

const Search: React.FC<SearchProps> = ({search}) => {
    const {domain} = useParams<{ domain: string; }>()
    const [searchBy, setSearchBy] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [searchResult, setSearchResult] = useState(null);
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
            router.replace(`?searchby=${searchBy}&domain=${domain}&searchinput=${searchInput}`)
            search();
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
                        <MenuItem value={"staffId"}>Staff ID</MenuItem>
                        <MenuItem value={"name"}>Name</MenuItem>
                        <MenuItem value={"organizationunit"}>Organization Unit</MenuItem>
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
                            
                        }}>Search</Button>
                    </>
                )}
            </div>
            {searchResult && (
                <div className="m-3">
                    <h3>Search Results:</h3>
                    <pre>{JSON.stringify(searchResult, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default Search;