import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Divider, Grid, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

export default function BranchModal({
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
  const [branchEngName, setBranchEngName] = useState('');
  const [branchThName, setBranchThName] = useState('');
  const [engAddr, setEngAddr] = useState('');
  const [thAddr, setThAddr] = useState('');
  const [telephone, setTelephone] = useState('');
  const [fax, setFax] = useState('');
  const [zoneCode, setZoneCode] = useState('');
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};

    if (!branchId) newErrors.branchId = 'Branch ID must not be empty.';
    if (!branchEngName) newErrors.branchEngName = 'English Name must not be empty.';
    if (!branchThName) newErrors.branchThName = 'Thai Name must not be empty.';
    if (!engAddr) newErrors.engAddr = 'English Address must not be empty.';
    if (!thAddr) newErrors.thAddr = 'Thai Address must not be empty.';

    const contactRegex = /^(?:\(\d{2,3}\)|\d{2,3})[-.\s]?\d{3,4}[-.\s]?\d{3,4}$/;
    if (!telephone || !contactRegex.test(telephone)) newErrors.telephone = 'Telephone is not in a valid format.';
    if (fax && !contactRegex.test(fax)) newErrors.fax = 'Fax is not in a valid format.';
    if (!zoneCode) newErrors.zoneCode = 'Zone Code must not be empty.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (selectedRow) {
      setBranchId(selectedRow.branchId || '');
      setBranchEngName(selectedRow.branchEngName || '');
      setBranchThName(selectedRow.branchThName || '');
      setEngAddr(selectedRow.engAddr || '');
      setThAddr(selectedRow.thAddr || '');
      setTelephone(selectedRow.telephone || '');
      setFax(selectedRow.fax || '');
      setZoneCode(selectedRow.zoneCode || '');
    } else {
      resetState();
    }
  }, [selectedRow]);

  const resetState = () => {
    setBranchId('');
    setBranchEngName('');
    setBranchThName('');
    setEngAddr('');
    setThAddr('');
    setTelephone('');
    setFax('');
    setZoneCode('');
    setErrors({});
  };

  const handleSave = async () => {
    if (!validate()) return;

    const data = {
      branchId,
      branchEngName,
      branchThName,
      engAddr,
      thAddr,
      telephone,
      fax,
      zoneCode
    };

    try {
      if (selectedRow) {
        await updateRecord(data);
        setRows((oldRows: any) =>
          oldRows.map((row: any) => (row.branchId === selectedRow.branchId ? { ...row, ...data } : row))
        );
      } else {
        await addRecord(data);
      }
      resetState();
      handleClose();
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
      BackdropProps={{ invisible: true }}
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
            <Typography variant="h6" component="h6" className="ml-12 text-black">
              {selectedRow != null && role == "AdminStaffInformation" ? "Edit Branch" : selectedRow == null && role == "AdminStaffInformation" ? "Add Branch" : "Domain Information"}
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
              value={branchId}
              onChange={(e: any) => setBranchId(e.target.value)}
              error={!!errors.branchId}
              helperText={errors.branchId}
              InputProps={{ readOnly: role !== 'AdminStaffInformation' }}
            />
            <TextField
              label="Branch English Name"
              variant="standard"
              fullWidth
              value={branchEngName}
              onChange={(e) => setBranchEngName(e.target.value)}
              error={!!errors.branchEngName}
              helperText={errors.branchEngName}
              InputProps={{ readOnly: role !== 'AdminStaffInformation' }}
            />
            <TextField
              label="Branch Thai Name"
              variant="standard"
              fullWidth
              value={branchThName}
              onChange={(e) => setBranchThName(e.target.value)}
              error={!!errors.branchThName}
              helperText={errors.branchThName}
              InputProps={{ readOnly: role !== 'AdminStaffInformation' }}
            />
            <TextField
              label="English Address"
              variant="standard"
              fullWidth
              value={engAddr}
              onChange={(e) => setEngAddr(e.target.value)}
              error={!!errors.engAddr}
              helperText={errors.engAddr}
              InputProps={{ readOnly: role !== 'AdminStaffInformation' }}
              multiline
            />
            <TextField
              label="Thai Address"
              variant="standard"
              fullWidth
              value={thAddr}
              onChange={(e) => setThAddr(e.target.value)}
              error={!!errors.thAddr}
              helperText={errors.thAddr}
              InputProps={{ readOnly: role !== 'AdminStaffInformation' }}
              multiline
            />
            <TextField
              label="Telephone"
              variant="standard"
              fullWidth
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              error={!!errors.telephone}
              helperText={errors.telephone}
              InputProps={{ readOnly: role !== 'AdminStaffInformation' }}
            />
            <TextField
              label="Fax"
              variant="standard"
              fullWidth
              value={fax}
              onChange={(e) => setFax(e.target.value)}
              error={!!errors.fax}
              helperText={errors.fax}
              InputProps={{ readOnly: role !== 'AdminStaffInformation' }}
            />
            <TextField
              label="Zone Code"
              variant="standard"
              fullWidth
              value={zoneCode}
              onChange={(e) => setZoneCode(e.target.value)}
              error={!!errors.zoneCode}
              helperText={errors.zoneCode}
              InputProps={{ readOnly: role !== 'AdminStaffInformation' }}
            />
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
