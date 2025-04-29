'use client'
import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, Divider, Grid, Avatar, Slide, Autocomplete, FormHelperText, InputLabel, Select, MenuItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { getAllDepartmentsClientSide } from '@/app/api/departments';
import { getAllJobClientSide } from '@/app/api/job';
import { getAlldomainClientSide } from '@/app/api/domain';
import { getAllBranchClientSide } from '@/app/api/branch';
import { getAllCorporationsClientSide } from '@/app/api/corporations';
import Image from 'next/image';

const EmployeeModal = ({ open, handleClose, addRecord, updateRecord, deleteRecord, setRows, setSnackbarOpen, setAlertMessage, setError, selectedRow, role }: any) => {
  const [organizations, setOrganizations] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [domains, setDomains] = useState([]);
  const [branchs, setBranch] = useState([]);
  const [corporations, setCorporations] = useState([]);

  const [empId, setStaffId] = useState('');
  const [startWorkingDate, setHireDate] = useState('');
  const [lastWorkingDate, setLastWorkingDate] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [title, setTitle] = useState('');
  const [thFirstName, setThFirstName] = useState('');
  const [thLastName, setThLastName] = useState('');
  const [enFirstName, setEnFirstName] = useState('');
  const [enLastName, setEnLastName] = useState('');
  const [nickname, setNickName] = useState('');
  const [extension, setExtension] = useState('');
  const [directLine, setDirectLine] = useState('');
  const [corporationTitle, setCorporationTitle] = useState('');
  const [email, setEmail] = useState('');
  const [logonId, setLogonId] = useState('');
  const [shortName, setShortName] = useState('');
  const [organizationId, setOrganizationId] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [derivativeTrader, setDerivativeTrader] = useState('');
  const [derivativeLicense, setDerivativeLicense] = useState('');
  const [singleTrader, setSingleTrader] = useState('');
  const [singleLicense, setSingleLicense] = useState('');
  const [branchId, setBranchId] = useState('');
  const [domainId, setDomainId] = useState(null);
  const [otherLicenses, setOtherLicenses] = useState<string[]>([]);


  const [avatarImage, setAvatarImage] = useState<string | null>(null);

  const [errors, setErrors] = useState<any>({
    empId: '',
    startWorkingDate: '',
    thFirstName: '',
    thLastName: '',
    enFirstName: '',
    enLastName: '',
    email: '',
    extension: '',
  });

  async function fetchData() {
    try {
      const departments = await getAllDepartmentsClientSide();
      const jobs = await getAllJobClientSide();
      const domains = await getAlldomainClientSide();
      const branchs = await getAllBranchClientSide();
      const corporations = await getAllCorporationsClientSide();
      setOrganizations(departments?.organizations || []);
      setJobs(jobs?.jobs || []);
      setDomains(domains?.domains || []);
      setBranch(branchs?.branchs || []);
      setCorporations(corporations?.corporationTitles || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setOrganizations([]);
      setJobs([]);
      setDomains([]);
    }
  }




  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRow) {
      setStaffId(selectedRow.empId || '');
      setHireDate(selectedRow.startWorkingDate || '');
      setTitle(selectedRow.thTitle + '/' + selectedRow.enTitle || '');
      setThFirstName(selectedRow.thFirstName || '');
      setThLastName(selectedRow.thLastName || '');
      setEnFirstName(selectedRow.enFirstName || '');
      setEnLastName(selectedRow.enLastName || '');
      setNickName(selectedRow.nickname || '');
      setExtension(selectedRow.extensionCode || '');
      setDirectLine(selectedRow.directLine || '');
      setCorporationTitle(selectedRow.corporationTitle || '');
      setEmail(selectedRow.email || '');
      setLogonId(selectedRow.logonId || '');
      setShortName(selectedRow.shortName || '');
      setOrganizationId(selectedRow.organizationId || null);
      setJobId(selectedRow.jobId || null);
      setDomainId(selectedRow.domainId);
      setDerivativeTrader(selectedRow.derivativeTrader || '');
      setDerivativeLicense(selectedRow.derivativeLicense || '');
      setSingleTrader(selectedRow.singleTrader || '');
      setSingleLicense(selectedRow.singleLicense || '');
      if (selectedRow.otherLicense) {
        const licenses = extractLicensesFromXml(selectedRow.otherLicense);
        setOtherLicenses(licenses);
      }
      setBranchId(selectedRow.branchId || null);
      setDomainId(selectedRow.domainId || null);
      setAvatarImage(selectedRow?.picturePath?.replace(/^(\.\/|\.\.\/)+/, '') || null);
      setHireDate(formatDate(selectedRow.startWorkingDate));
      setLastWorkingDate(formatDate(selectedRow.lastWorkingDate));
      setEffectiveDate(formatDate(selectedRow.effectiveDate));
      setErrors({});
    } else {
      resetState();
      setErrors({});
    }
  }, [selectedRow]);

  const extractLicensesFromXml = (xml: string): string[] => {
    const matches = xml.match(/<Name>(.*?)<\/Name>/g) || [];
    return matches.map((match) => match.replace(/<\/?Name>/g, ""));
  };


  const resetState = () => {
    setStaffId('');
    setHireDate('');
    setLastWorkingDate('');
    setEffectiveDate('');
    setTitle('');
    setThFirstName('');
    setThLastName('');
    setEnFirstName('');
    setEnLastName('');
    setNickName('');
    setExtension('');
    setCorporationTitle('');
    setEmail('');
    setOrganizationId(null);
    setJobId(null);
    setDerivativeTrader('');
    setDerivativeLicense('');
    setSingleTrader('');
    setSingleLicense('');
    setOtherLicenses([]);
    setBranchId('');
    setDomainId(null);
    setAvatarImage(null);
    setDirectLine('');
    setShortName('');
    setLogonId('');
  };

  const formatDateToISO = (dateString: string) => {
    const date = new Date(dateString);

    // ตรวจสอบว่าเป็นวันที่ที่ถูกต้องหรือไม่
    if (isNaN(date.getTime())) {
      return ''; // คืนค่าว่างหากไม่สามารถแปลงเป็นวันที่ได้
    }

    // รับปี, เดือน, วัน, ชั่วโมง, นาที, วินาทีจาก Date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // สร้างวันที่ในรูปแบบ ISO 8601
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  };


  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // แปลงเป็นรูปแบบ yyyy-mm-dd
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // เติมศูนย์หน้าเดือน
    const day = date.getDate().toString().padStart(2, "0"); // เติมศูนย์หน้าวัน
    return `${year}-${month}-${day}`;
  };

  const generateOtherLicenseXml = () => {
    if (otherLicenses.length === 0) return "";
    return `<Licenses>${otherLicenses.map(name => `<License><Name>${name}</Name><Key/></License>`)}</Licenses>`;
  };


  const handleSave = async () => {
    try {
      const formattedStartDate = formatDateToISO(startWorkingDate);
      const formattedLastDate = formatDateToISO(lastWorkingDate);
      const formattedEffectiveDate = formatDateToISO(effectiveDate);
  
      const data: any = {
        organizationId: String(organizationId),
        branchId,
        directLine,
        jobId: String(jobId),
        enTitle: title.split("/")[1],
        enFirstName,
        enLastName,
        nickname,
        thTitle: title.split("/")[0],
        thFirstName,
        thLastName,
        email,
        derivativeTrader,
        derivativeLicense,
        singleTrader,
        singleLicense,
        otherLicense: generateOtherLicenseXml(),
        startWorkingDate: formattedStartDate,
        lastWorkingDate: formattedLastDate,
        effectiveDate: formattedEffectiveDate,
        corporationTitle,
        extensionCode: extension,
        logonId,
        shortName,
      };
  
      // เงื่อนไข: ถ้ามี empId → ค่อยใส่เข้าไป
      if (empId) {
        data.empId = empId;
      }
  
      if (selectedRow != null) {
        await updateRecord(data);
        setRows((oldRows: any) =>
          oldRows.map((row: any) =>
            row.empId === selectedRow.empId ? { ...row, ...data } : row
          )
        );
      } else {
        await addRecord(data);
      }
  
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
  
  const handleOtherLicenseChange = (index: number, value: string) => {
    const updated = [...otherLicenses];
    updated[index] = value;
    setOtherLicenses(updated);
  };

  const addOtherLicense = () => {
    setOtherLicenses([...otherLicenses, ""]);
  };

  const removeOtherLicense = (index: number) => {
    setOtherLicenses(otherLicenses.filter((_, i) => i !== index));
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
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', zIndex: 1200 }}
    >
      <Box
        className="bg-white p-6 shadow-lg"
        sx={{
          width: '100%',
          maxWidth: '960px',
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
          position: 'fixed',
          top: 64,
          right: 0,
          zIndex: 1200,
        }}
      >
        <Box className="flex items-center justify-between">
          <IconButton onClick={handleClose} className='hover:text-blue-500'>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="body1" className="ml-12 text-black">
            {selectedRow && Object.keys(selectedRow).length > 0 && role == "AdminStaffInformation"
              ? "Edit Staff Information" : selectedRow == null && role == "AdminStaffInformation" ? "Add Employee" : "Staff Information"}
          </Typography>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            {role === "AdminStaffInformation" && (
              <>
                <Button
                  variant="outlined"
                  onClick={handleSave}
                  startIcon={<SaveOutlinedIcon />}
                  sx={{ mr: 1 }}
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
                onClick={deleteRecord(selectedRow?.empId)}
                startIcon={<DeleteOutlineOutlinedIcon />}
              >
                Delete
              </Button>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {avatarImage && (
              <Image
                src={`http://bualuangintranet.sawasdee.brk1/employee/${avatarImage}`}
                alt="Profile"
                width={150}
                height={150}
                className="bg-white rounded-full border-4 border-white shadow-lg object-cover object-top"
              />)}
              <TextField
                fullWidth
                label="Employee ID"
                variant="outlined"
                value={empId}
                onChange={(e) => setStaffId(e.target.value)}
                error={!!errors.empId}
                helperText={errors.empId}
                sx={{ mt: 2 }}
                InputProps={{
                  readOnly: !!selectedRow?.empId,
                }}
              />
            <TextField
              fullWidth
              required
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mt: 2 }}
              InputProps={{
                readOnly: role != "AdminStaffInformation",
              }}
            />
            <TextField
              fullWidth
              required
              label="logon ID"
              variant="outlined"
              value={logonId}
              onChange={(e) => setLogonId(e.target.value)}
              sx={{ mt: 2 }}
              InputProps={{
                readOnly: role != "AdminStaffInformation",
              }}
            />
            <TextField
              fullWidth
              label="Extension"
              variant="outlined"
              value={extension}
              onChange={(e) => setExtension(e.target.value)}
              sx={{ mt: 2 }}
              InputProps={{
                readOnly: role != "AdminStaffInformation",
              }}
            />
            <TextField
              fullWidth
              label="DirectLine"
              variant="outlined"
              value={directLine}
              onChange={(e) => setDirectLine(e.target.value)}
              sx={{ mt: 2 }}
              InputProps={{
                readOnly: role != "AdminStaffInformation",
              }}
            />
          </Grid>

          {/* Vertical Divider */}
          <Grid>
            <Divider orientation="vertical" flexItem sx={{ borderRightWidth: 1, height: '100%', mx: 2 }} />
          </Grid>

          {/* Right Column */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Grid container spacing={2}>
              {/* First Row */}
              <Grid size={{ xs: 12, md: 6 }}>
                <InputLabel>Title*</InputLabel>
                <Select
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  label="Title"
                  readOnly={role != "AdminStaffInformation"}
                  error={!!errors.title}
                >
                  <MenuItem value="นาย/Mr.">นาย / Mr.</MenuItem>
                  <MenuItem value="นาง/Mrs.">นาง / Mrs.</MenuItem>
                  <MenuItem value="น.ส./Ms.">น.ส. / Ms.</MenuItem>
                </Select>
                {errors.title && <FormHelperText>{errors.title}</FormHelperText>}
              </Grid>
              <Grid mt={3} size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Nick Name*"
                  variant="outlined"
                  value={nickname}
                  onChange={(e) => setNickName(e.target.value)}
                  error={!!errors.thNickName}
                  helperText={errors.thNickName}
                  InputProps={{
                    readOnly: role != "AdminStaffInformation",
                  }}
                />
              </Grid>

              {/* Second Row */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Thai First Name*"
                  variant="outlined"
                  value={thFirstName}
                  onChange={(e) => setThFirstName(e.target.value)}
                  error={!!errors.thFirstName}
                  helperText={errors.thFirstName}
                  InputProps={{
                    readOnly: role != "AdminStaffInformation",
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Thai Last Name*"
                  variant="outlined"
                  value={thLastName}
                  onChange={(e) => setThLastName(e.target.value)}
                  error={!!errors.thLastName}
                  helperText={errors.thLastName}
                  InputProps={{
                    readOnly: role != "AdminStaffInformation",
                  }}
                />
              </Grid>

              {/* Third Row */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="English First Name*"
                  variant="outlined"
                  value={enFirstName}
                  onChange={(e) => {
                    const newFirstName = e.target.value;
                    setEnFirstName(newFirstName);
                    setShortName(`${newFirstName} ${enLastName?.charAt(0) || ''}.`);
                  }}
                  error={!!errors.enFirstName}
                  helperText={errors.enFirstName}
                  InputProps={{
                    readOnly: role != "AdminStaffInformation",
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="English Last Name*"
                  variant="outlined"
                  value={enLastName}
                  onChange={(e) => {
                    const newLastName = e.target.value;
                    setEnLastName(newLastName);
                    setShortName(`${enFirstName} ${newLastName?.charAt(0) || ''}.`);
                  }}
                  error={!!errors.enLastName}
                  helperText={errors.enLastName}
                  InputProps={{
                    readOnly: role != "AdminStaffInformation",
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Short Name*"
                  variant="outlined"
                  value={shortName}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {/* Fourth Row */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  id="corporation-autocomplete"
                  options={corporations}
                  getOptionLabel={(option: any) =>
                    `${option.titleShortName} : ${option.titleEngName} / ${option.titleThName}`
                  }
                  value={corporations.find((cor: any) => cor.titleShortName === corporationTitle) || null}
                  onChange={(event: any, newValue: any) => {
                    setCorporationTitle(newValue ? newValue.titleShortName : null);
                  }}
                  renderInput={(params) => <TextField {...params} required label="Corporations" />}
                  filterOptions={(options, state) => {
                    const query = state.inputValue.toLowerCase();
                    return options.filter((option) =>
                      `${option.titleShortName} ${option.titleEngName} ${option.titleThName}`
                        .toLowerCase()
                        .includes(query)
                    );
                  }}
                  readOnly={role !== "AdminStaffInformation"}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
              </Grid>

              {/* Fifth Row */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  id="domain-autocomplete"
                  options={domains}
                  getOptionLabel={(option: any) => option.domainId}
                  value={domains.find((domain: any) => domain.domainId === domainId) || null}
                  onChange={(event, newValue) => {
                    setDomainId(newValue ? newValue.domainId : null);
                    setOrganizationId(null);
                  }}
                  renderInput={(params) => <TextField {...params} required label="Domain" error={!!errors.domainId}
                    helperText={errors.domainId} />}
                  readOnly={role !== "AdminStaffInformation"}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  id="organization-autocomplete"
                  options={organizations?.filter((org: any) => domainId === org.domainId)}
                  getOptionLabel={(option: any) => option.organizationId + ": (" + option.domainId + ") " + option.organizationUnit}
                  value={organizations?.find((org: any) => String(org.organizationId) == String(organizationId)) || null}
                  onChange={(event, newValue) => {
                    setOrganizationId(newValue ? newValue.organizationId : null);
                  }}
                  renderInput={(params) => <TextField {...params} required label="Organization Unit" error={!!errors.organizationUnit}
                    helperText={errors.organizationUnit} />}
                  readOnly={role != "AdminStaffInformation"}
                />
              </Grid>

              {/* Sixth Row */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  id="jobs-autocomplete"
                  options={jobs}
                  getOptionLabel={(option: any) => option.jobTitle}
                  value={jobs?.find((job: any) => String(job.jobId) == String(jobId)) || null}
                  onChange={(event, newValue) => {
                    setJobId(newValue ? newValue.jobId : null);
                  }}
                  renderInput={(params) => <TextField {...params} label="Jobs" />}
                  readOnly={role != "AdminStaffInformation"}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  id="branchs-autocomplete"
                  options={branchs}
                  getOptionLabel={(option: any) => option.branchId + ": " + option.branchEngName}
                  value={branchs?.find((branch: any) => branch.branchId === branchId) || null}
                  onChange={(event, newValue) => {
                    setBranchId(newValue ? newValue.branchId : null);
                  }}
                  renderInput={(params) => <TextField {...params} required label="Branch" error={!!errors.branch}
                    helperText={errors.branch} />}
                  readOnly={role != "AdminStaffInformation"}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {/* Last Row */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Start Working Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  value={startWorkingDate}
                  onChange={(e) => setHireDate(e.target.value)}
                  error={!!errors.startWorkingDate}
                  helperText={errors.startWorkingDate}
                  InputProps={{
                    readOnly: role != "AdminStaffInformation",
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Last Working Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  value={lastWorkingDate}
                  onChange={(e) => setLastWorkingDate(e.target.value)}
                  error={!!errors.lastWorkingDate}
                  helperText={errors.lastWorkingDate}
                  InputProps={{
                    readOnly: role != "AdminStaffInformation",
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Effective Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  error={!!errors.effectiveDate}
                  helperText={errors.effectiveDate}
                  InputProps={{
                    readOnly: role != "AdminStaffInformation",
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Derivative Trader"
                  variant="outlined"
                  value={derivativeTrader}
                  onChange={(e) => setDerivativeTrader(e.target.value)}
                  InputProps={{
                    readOnly: role != "AdminStaffInformation",
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Derivative License"
                  variant="outlined"
                  value={derivativeLicense}
                  onChange={(e) => setDerivativeLicense(e.target.value)}
                  InputProps={{
                    readOnly: role != "AdminStaffInformation",
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Single (Equity) Trader"
                  variant="outlined"
                  value={singleTrader}
                  onChange={(e) => setSingleTrader(e.target.value)}
                  InputProps={{
                    readOnly: role != "AdminStaffInformation",
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Single (Equity) License"
                  variant="outlined"
                  value={singleLicense}
                  onChange={(e) => setSingleLicense(e.target.value)}
                  InputProps={{
                    readOnly: role != "AdminStaffInformation",
                  }}
                />
              </Grid>
              {/* <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Other License(s)"
                  variant="outlined"
                  value={otherLicense}
                  onChange={(e) => setOtherLicense(e.target.value)}
                  InputProps={{
                    readOnly: role != "AdminStaffInformation",
                  }}
                />
              </Grid> */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="h6" gutterBottom>Other Licenses</Typography>

                {otherLicenses.map((license, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={1}>
                    <TextField
                      fullWidth
                      value={license}
                      onChange={(e) => handleOtherLicenseChange(index, e.target.value)}
                      InputProps={{
                        readOnly: role !== "AdminStaffInformation",
                      }}
                    />
                    {role === "AdminStaffInformation" && (
                      <IconButton onClick={() => removeOtherLicense(index)}>
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}

                {role === "AdminStaffInformation" && (
                  <IconButton
                    onClick={addOtherLicense}
                    color="primary"
                    style={{ marginTop: 8 }}
                  >
                    <AddCircleOutlineIcon fontSize="large" />
                  </IconButton>

                )}
              </Grid>

            </Grid>
          </Grid>
        </Grid>
      </Box>



    </Modal>


  );
};

export default EmployeeModal;
