'use client'
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import React from 'react';

export default function Search() {
    const [searchBy, setSearchBy] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setSearchBy(event.target.value as string);
    };

    return (
        <div className="m-3">
            <div className='bg-blue-950 rounded'>
                <p className='text-white font-bold rounded px-5'>Search</p>
            </div>
            <div className="flex items-center">
                <FormControl sx={{ m: 2, minWidth: 150, width:250}} size='small'>
                    <InputLabel id="demo-simple-select-label">Search By</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={searchBy}
                        label="Search By"
                        onChange={handleChange}
                    >
                        <MenuItem value={"Staff ID"}>Staff ID</MenuItem>
                        <MenuItem value={"Name"}>Name</MenuItem>
                        <MenuItem value={"Organization Unit"}>Organization Unit</MenuItem>
                    </Select>
                </FormControl>
                {
                    searchBy && (<>
                        <TextField
                            label={searchBy}
                            fullWidth
                            id="outlined-size-small"
                            size="small"
                            onKeyDown={(ev) => {
                                console.log(`Pressed keyCode ${ev.key}`);
                                if (ev.key === 'Enter') {
                                  console.log("test")
                                }
                            }}
                        />
                        <Button sx={{ m: 2 }}>Search</Button>
                    </>)
                }
            </div>
        </div>
    );
}
