import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Divider, Grid, IconButton, Autocomplete } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getAllDepartments, getAllDepartmentsClientSide } from '@/app/api/departments';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { getAlldomainClientSide } from '@/app/api/domain';

export default function OrganizationModal({ open, handleClose, addRecord, updateRecord, deleteRecord, setRows, setSnackbarOpen, setAlertMessage, setError, selectedRow, role }: any) {
  const [organizationId, setOrganizationId] = useState('');
  const [domainId, setDomainId] = useState('');
  const [domains, setDomains] = useState([]);
  const [organizationUnit, setOrganizationUnit] = useState('');
  const [organizationUnitTh, setOrganizationUnitTh] = useState('');
  const [parentOrganizationId, setParentOrganizationId] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [organizationUnitShortName, setOrganizationUnitShortName] = useState('');

  const [errors, setErrors] = useState({
    organizationId: '',
    domainId: '',
    organizationUnit: '',
    parentOrganizationId: '',
  });

  async function fetchAutoComplete() {
    try {
      const departments = await getAllDepartmentsClientSide();
      const domains = await getAlldomainClientSide();
      setDomains(domains.domains || []);
      setOrganizations(departments.organizations || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setOrganizations([]);
    }
  }

  useEffect(() => {
    fetchAutoComplete();
  }, []);

  useEffect(() => {
    if (selectedRow) {
      setOrganizationId(selectedRow.organizationId || '');
      setDomainId(selectedRow.domainId || '');
      setOrganizationUnit(selectedRow.organizationUnit);
      setParentOrganizationId(selectedRow.parentOrganizationId || '');
      setOrganizationUnitTh(selectedRow.organizationUnitTh || '');
      setOrganizationUnitShortName(selectedRow.organizationUnitShortName || '')
    } else {
      resetState();
    }
  }, [selectedRow]);

  const resetState = () => {
    setOrganizationId('');
    setDomainId('');
    setOrganizationUnit('');
    setOrganizationUnitTh('');
    setParentOrganizationId(null);
    setOrganizationUnitShortName('');
    setErrors({
      organizationId: '',
      domainId: '',
      organizationUnit: '',
      parentOrganizationId: '',
    });
  };

  const validateFields = () => {
    const newErrors = {
      organizationId: '',
      domainId: '',
      organizationUnit: '',
      parentOrganizationId: '',
    };

    let isValid = true;

    if (!domainId) {
      newErrors.domainId = 'Domain ID is required';
      isValid = false;
    }

    if (!organizationUnit) {
      newErrors.organizationUnit = 'Organization Unit is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateFields()) return;
  
    try {
      let data: any = {
        domainId,
        organizationUnit,
        organizationUnitTh,
        organizationUnitShortName,
        parentOrganizationId: String(parentOrganizationId),
      };
  
      if (selectedRow != null) {
        // update ต้องมี organizationId
        data.organizationId = organizationId;
        await updateRecord(data);
        setRows((oldRows: any) =>
          oldRows.map((row: any) =>
            row.organizationId === selectedRow.organizationId ? { ...row, ...data } : row
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
            <Typography variant="body1" className="ml-12 text-black">
              {selectedRow != null && role == "AdminStaffInformation" ? "Edit Organization" : selectedRow == null && role == "AdminStaffInformation" ? "Add Organization" : "Organization Information"}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            {role != "AdminStaffInformation" && (
              <>
                <Button
                  variant="outlined"
                  onClick={() => handleSave()}
                  startIcon={<SaveOutlinedIcon />}
                  sx={{ mr: 1 }} // Add some space between the buttons
                >
                  Save
                </Button>
              </>
            )}
          </Box>
          {role != "AdminStaffInformation" && selectedRow != null && (
            <Box>
              <Button
                color='error'
                variant="outlined"
                onClick={deleteRecord(selectedRow?.organizationId)} // Replace with your delete function
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
            <Autocomplete
              className='my-3'
              id="domain-autocomplete"
              options={domains}
              getOptionLabel={(option: any) => option.domainId}
              value={domains.find((domain: any) => domain.domainId === domainId) || null}
              onChange={(event, newValue) => {
                setDomainId(newValue ? newValue.domainId : null);
              }}
              renderInput={(params) => <TextField {...params} label="Domain" />}
              readOnly={role !== "AdminStaffInformation"}
            />
            <TextField
              label="Short Name"
              variant="standard"
              fullWidth
              className='my-3'
              value={organizationUnitShortName}
              onChange={(e) => setOrganizationUnitShortName(e.target.value)}
              InputProps={{
                readOnly: role != "AdminStaffInformation",
              }}
            />
            <TextField
              label="Organization Unit"
              variant="standard"
              fullWidth
              className='my-3'
              value={organizationUnit}
              onChange={(e) => setOrganizationUnit(e.target.value)}
              error={!!errors.organizationUnit}
              helperText={errors.organizationUnit}
              InputProps={{
                readOnly: role != "AdminStaffInformation",
              }}
            />
            <TextField
              label="Organization Unit (TH)"
              variant="standard"
              fullWidth
              className='my-3'
              value={organizationUnitTh}
              onChange={(e) => setOrganizationUnitTh(e.target.value)}
              InputProps={{
                readOnly: role != "AdminStaffInformation",
              }}
            />
            <Autocomplete
              className='my-3'
              id="organizationID-autocomplete"
              options={organizations.filter((org:any) => org?.organizationId != selectedRow?.organizationId)}
              getOptionLabel={(option: any) => option.organizationId + ": (" + option.domainId + ") " + option.organizationUnit}
              value={organizations.find((org: any) => org.organizationId == parentOrganizationId) || null}
              onChange={(event, newValue) => {
                setParentOrganizationId(newValue ? newValue.organizationId : null);
              }}
              readOnly={role !== "AdminStaffInformation"}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Parent Organization ID"
                  error={!!errors.parentOrganizationId}
                  helperText={errors.parentOrganizationId}
                />
              )}
            />

          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
