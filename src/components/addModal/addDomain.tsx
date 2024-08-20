import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Divider, Grid, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

export default function AddDomain({
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
  const [domainId, setDomainId] = useState('');
  const [domainName, setDomainName] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!domainId) {
      newErrors.domainId = 'Domain ID must not be empty.';
    } else if (!/^[A-Z]+$/.test(domainId)) {
      newErrors.domainId = 'Domain ID must be uppercase letters only.';
    }

    if (!domainName) {
      newErrors.domainName = 'Domain Name must not be empty.';
    } else if (domainName.length > 255) {
      newErrors.domainName = 'Domain Name must not exceed 255 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (selectedRow) {
      setDomainId(selectedRow.domainId || '');
      setDomainName(selectedRow.domainName || '');
    } else {
      resetState();
    }
  }, [selectedRow]);

  const resetState = () => {
    setDomainId('');
    setDomainName('');
    setErrors({});
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    try {
      const data = {
        domainId,
        domainName
      };
      if (selectedRow != null) {
        await updateRecord(data);
        setRows((oldRows: any) =>
          oldRows.map((row: any) =>
            row.domainId === selectedRow.domainId ? { ...row, ...data } : row
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
              {selectedRow != null && role == "AdminStaffInformation" ? "Edit Domain" : selectedRow == null && role == "AdminStaffInformation" ? "Add Domain" : "Domain Information"}
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
                onClick={deleteRecord(selectedRow?.domainId)} // Replace with your delete function
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
              label="Domain ID"
              variant="standard"
              fullWidth
              className="mb-4"
              value={domainId}
              onChange={(e) => setDomainId(e.target.value)}
              error={!!errors.domainId}
              helperText={errors.domainId}
              InputProps={{
                readOnly: role != "AdminStaffInformation",
              }}
            />
            <TextField
              label="Domain Name"
              variant="standard"
              fullWidth
              className="mb-4"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              error={!!errors.domainName}
              helperText={errors.domainName}
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
