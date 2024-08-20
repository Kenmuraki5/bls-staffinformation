import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Divider, Grid, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

export default function AddBranch({
  open,
  handleClose,
  addRecord,
  updateRecord,
  deleteRecord,
  setRows,
  setSnackbarOpen,
  setAlertMessage,
  setError,
  selectedRow,
  role
}: any) {
  const [branchId, setBranchId] = useState('');
  const [branchName, setBranchName] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!branchId) {
      newErrors.branchId = 'Branch ID must not be empty.';
    } else if (!/^[A-Z]+$/.test(branchId)) {
      newErrors.branchId = 'Branch ID must be uppercase letters only.';
    }

    if (!branchName) {
      newErrors.branchName = 'Branch Name must not be empty.';
    } else if (branchName.length > 255) {
      newErrors.branchName = 'Branch Name must not exceed 255 characters.';
    }

    if (!location) {
      newErrors.location = 'Location must not be empty.';
    } else if (location.length > 255) {
      newErrors.location = 'Location must not exceed 255 characters.';
    }

    if (!contact) {
      newErrors.contact = 'Contact must not be empty.';
    } else {
      const contactRegex = /^(?:\+?\d{1,3}[-.\s]?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/;
      if (!contactRegex.test(contact)) {
        newErrors.contact = 'Contact must be in a valid format (e.g., 123-456-7890, (123) 456-7890, 123 456 7890, 123.456.7890, +91 (123) 456-7890).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (selectedRow) {
      setBranchId(selectedRow.branchId || '');
      setBranchName(selectedRow.branchName || '');
      setContact(selectedRow.contact || '');
      setLocation(selectedRow.location || '');
    } else {
      resetState();
    }
  }, [selectedRow]);

  const resetState = () => {
    setBranchId('');
    setBranchName('');
    setContact('');
    setLocation('');
    setErrors({});
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const data = {
        branchId,
        branchName,
        contact,
        location
      };
      if (selectedRow) {
        await updateRecord(data);
        setRows((oldRows: any) =>
          oldRows.map((row: any) =>
            row.branchId === selectedRow.branchId ? { ...row, ...data } : row
          )
        );
      } else {
        await addRecord(data);
      }
      resetState();
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
            <Typography variant="h6" component="h2" className="ml-12 text-black font-bold">
              {selectedRow != null && role == "AdminStaffInformation" ? "Edit Branch" : selectedRow == null && role == "AdminStaffInformation" ? "Add Branch" : "Branch Information"}
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
                onClick={deleteRecord(selectedRow?.branchId)} // Replace with your delete function
                startIcon={<DeleteOutlineOutlinedIcon />}
              >
                Delete
              </Button>
            </Box>
          )}

        </Box>
        <Divider className="mb-4" />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Branch ID"
              variant="standard"
              fullWidth
              className="mb-4"
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              error={!!errors.branchId}
              helperText={errors.branchId}
              InputProps={{
                readOnly: role != "AdminStaffInformation",
              }}
            />
            <TextField
              label="Branch Name"
              variant="standard"
              fullWidth
              className="mb-4"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              error={!!errors.branchName}
              helperText={errors.branchName}
              InputProps={{
                readOnly: role != "AdminStaffInformation",
              }}
            />
            <TextField
              label="Contact"
              variant="standard"
              fullWidth
              className="mb-4"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              error={!!errors.contact}
              helperText={errors.contact}
              InputProps={{
                readOnly: role != "AdminStaffInformation",
              }}
            />
            <TextField
              label="Location"
              variant="standard"
              fullWidth
              className="mb-4"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              error={!!errors.location}
              helperText={errors.location}
              multiline
              minRows={4}
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
