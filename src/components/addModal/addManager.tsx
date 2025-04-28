import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Divider, Grid, IconButton, Autocomplete } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getAllEmployees, getAllEmployeesClientSide } from '@/app/api/employees';
import { getAllDepartments, getAllDepartmentsClientSide } from '@/app/api/departments';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

export default function ManagerModal({
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
  const [managerId, setManagerId] = useState('');
  const [empId, setEmpId] = useState<string | null>(null);
  const [emp, setEmp] = useState([]);
  const [empName, setName] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  async function fetchAutoComplete() {
    try {
      const res = await getAllEmployeesClientSide();
      const res2 = await getAllDepartmentsClientSide();
      setEmp(res.employees);
      setOrganizations(res2.organizations);
    } catch (error) {
      console.error('Error fetching data:', error);
      setEmp([]);
      setOrganizations([]);
    }
  }

  useEffect(() => {
    fetchAutoComplete();
  }, []);


  useEffect(() => {
    if (selectedRow) {
      setManagerId(selectedRow.managerId || '');
      setEmpId(selectedRow.empId || '');
      setOrganizationId(selectedRow.organizationId);
      setName(selectedRow.empName);
    } else {
      resetState();
    }
  }, [selectedRow]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!empId) {
      newErrors.empId = 'Employee ID must not be empty.';
    }
    if (!organizationId) {
      newErrors.organizationId = 'Organization ID must not be empty.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetState = () => {
    setManagerId('');
    setEmpId(null);
    setOrganizationId(null);
    setName("");
    setErrors({});
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }
  
    try {
      let data: any = {
        empId,
        empName,
        organizationId,
      };
  
      if (selectedRow != null) {
        // Update: ต้องมี managerId ด้วย
        data.managerId = managerId;
        await updateRecord(data);
        setRows((oldRows: any) =>
          oldRows.map((row: any) =>
            row.managerId === selectedRow.managerId ? { ...row, ...data } : row
          )
        );
      } else {
        // Add: ไม่ต้องมี managerId
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
              {selectedRow != null && role == "AdminStaffInformation" ? "Edit Manager" : selectedRow == null && role == "AdminStaffInformation" ? "Add Manager" : "Manager Information"}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            {role === "AdminStaffInformation" && (
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
          {role === "AdminStaffInformation" && selectedRow != null && (
            <Box>
              <Button
                color='error'
                variant="outlined"
                onClick={deleteRecord(selectedRow?.managerId)} // Replace with your delete function
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
              className='mb-4'
              id="employeeID-autocomplete"
              options={emp}
              getOptionLabel={(option: any) => `${option.empId} : (${option.thFirstName} ${option.thLastName} ${option.enFirstName} ${option.enLastName})`}
              value={emp?.find((employee: any) => employee.empId === empId) || null}
              onChange={(event, newValue) => {
                setEmpId(newValue ? newValue?.empId : null);
                setName(`${newValue?.thFirstName} ${newValue?.thLastName} ${newValue?.enFirstName} ${newValue?.enLastName}`)
              }}
              renderInput={(params) => <TextField {...params} label="Staff ID" error={!!errors.empId} helperText={errors.empId} />}
              readOnly={role != "AdminStaffInformation"}
            />
            <Autocomplete
              className='mb-4'
              id="organizationID-autocomplete"
              options={organizations}
              getOptionLabel={(option: any) => option.organizationId + ": (" + option.domainId + ") " + option.organizationUnit}
              value={organizations?.find((org: any) => org.organizationId === organizationId) || null}
              onChange={(event, newValue) => {
                setOrganizationId(newValue ? newValue.organizationId : null);
              }}
              renderInput={(params) => <TextField {...params} label="Head Of Department" error={!!errors.organizationId} helperText={errors.organizationId} />}
              readOnly={role != "AdminStaffInformation"}
            />
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
