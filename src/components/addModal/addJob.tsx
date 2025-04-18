import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Divider, Grid, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

export default function JobModal({ open, handleClose, addRecord, updateRecord, deleteRecord, setRows, setSnackbarOpen, setAlertMessage, setError, selectedRow, role }: any) {
  const [jobId, setJobId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!jobId) {
      newErrors.jobId = 'Job ID must not be empty.';
    } else if (!/^[A-Z0-9]+$/.test(jobId)) { // Assuming Job ID should be uppercase letters or numbers
      newErrors.jobId = 'Job ID must be uppercase letters and numbers only.';
    }

    if (!jobTitle) {
      newErrors.jobTitle = 'Job Title must not be empty.';
    } else if (jobTitle.length > 255) {
      newErrors.jobTitle = 'Job Title must not exceed 255 characters.';
    } else if (!/^[A-Za-z\s]+ \/ [\u0E00-\u0E7F\s]+$/.test(jobTitle)) {
      newErrors.jobTitle = 'Job Title must follow the format "English text / Thai text".';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetState = () => {
    setJobId('');
    setJobTitle('');
    setErrors({});
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    try {
      const data = {
        jobTitle
      };
      if (selectedRow != null) {
        await updateRecord(data);
        setRows((oldRows: any) =>
          oldRows.map((row: any) =>
            row.jobId === selectedRow.jobId ? { ...row, ...data } : row
          )
        );
      } else {
        await addRecord(data);
      }

      resetState(); // Reset the state after a successful save
      handleClose(true);
      setSnackbarOpen(true);
      setError(false);
      setAlertMessage('Successfully Updated');
    } catch (error: any) {
      setSnackbarOpen(true);
      setError(true);
      setAlertMessage(error.message);
    }
  };

  useEffect(() => {
    if (selectedRow) {
      setJobId(selectedRow.jobId || '');
      setJobTitle(selectedRow.jobTitle || '');
    } else {
      resetState();
    }
  }, [selectedRow]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      BackdropProps={{
        invisible: true,
      }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', zIndex: 1 }}
    >
      <Box
        className="bg-white p-6 shadow-lg"
        sx={{
          width: '100%',
          maxWidth: '600px',
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
          position: 'fixed',
          top: 64,
          right: 0,
          zIndex: 1200,
        }}
      >
        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center">
            <IconButton onClick={handleClose} className='hover:text-blue-500'>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="body1" className="ml-12 text-black">
              {selectedRow != null && role == "AdminStaffInformation" ? "Edit Job" : selectedRow == null && role == "AdminStaffInformation" ? "Add Job" : "Job Information"}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            {role === "AdminStaffInformation" && (
              <>
                <Button
                  variant="outlined"
                  onClick={handleSave}
                  startIcon={<SaveOutlinedIcon />}
                  sx={{ mr: 1 }} // Add some space between the buttons
                >
                  Save
                </Button>
              </>
            )}
          </Box>
          {role === "AdminStaffInformation" && selectedRow != null && (
            <Box>
              <Button
                color='error'
                variant="outlined"
                onClick={deleteRecord(selectedRow?.jobId)} // Replace with your delete function
                startIcon={<DeleteOutlineOutlinedIcon />}
              >
                Delete
              </Button>
            </Box>
          )}
        </Box>
        <Divider className="mb-4" />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Job ID"
              variant="standard"
              fullWidth
              className="mb-4"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              error={!!errors.jobId}
              helperText={errors.jobId}
              InputProps={{
                readOnly: role != "AdminStaffInformation",
              }}
            />
            <TextField
              label="Job Title"
              variant="standard"
              fullWidth
              className="mb-4"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              error={!!errors.jobTitle}
              helperText={errors.jobTitle}
              InputProps={{
                readOnly: role != "AdminStaffInformation",
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
