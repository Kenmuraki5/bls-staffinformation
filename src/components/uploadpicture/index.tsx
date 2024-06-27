'use client';
import { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { getToken } from '@/app/lib/action';

export default function UploadPicture({ open, close, employeeID, alert, alertMessage }: any) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const token = await getToken("session");
    if (!employeeID || !file) {
      alert('Please provide both Employee ID and a file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1]; // Get the base64 string without the prefix
      const imageExtension = file.name.split('.').pop();

      const requestBody = {
        empId: employeeID,
        imageData: base64String,
        imageExtension: imageExtension
      };

      fetch('http://localhost:8080/staffinformation/employee/uploadPicture', {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
        .then(async response => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
          }
          alertMessage("Uploadpicture success")
          alert(true)
          return response.json();
        })
        .then(data => {
          console.log('Success:', data);
          close();
        })
        .catch((error) => {
          console.error('Error:', error);
          alert(`Error: ${error.message}`);
        });
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  };

  const handleClose = () => {
    close();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Upload Employee Picture</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please select a picture (*png) to upload for Employee ID: {employeeID}.
        </DialogContentText>
        <TextField
          label="Employee ID"
          variant="outlined"
          fullWidth
          margin="normal"
          value={employeeID}
          disabled
        />
        <div className="mb-4">
          <input
            accept='image/png'
            type="file"
            id="file-input"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-input"
            className="flex items-center justify-center cursor-pointer border-dashed border-2 border-gray-300 p-4 rounded-lg text-gray-600 hover:bg-gray-100 transition duration-200"
          >
            <CloudUploadIcon className="mr-2" />
            {file ? file.name : 'Select a file'}
          </label>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}
