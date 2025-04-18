'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import Papa from 'papaparse';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableInstance,
} from 'material-react-table';

// All fields from your employees table
const defaultEmployee: Record<string, any> = {
  emp_id: '',
  organization_id: '',
  branch_id: '',
  job_id: '',
  en_title: '',
  en_first_name: '',
  en_last_name: '',
  th_title: '',
  th_first_name: '',
  th_last_name: '',
  short_name: '',
  division: '',
  department: '',
  start_working_date: '',
  last_working_date: '',
  effective_date: '',
  work_status: '',
  picture_path: '',
  th_middle_name: '',
  eng_middle_name: '',
  nickname: '',
  extension_code: '',
  direct_line: '',
  corporation_title: '',
  position: '',
  proximity: '',
  derivative_trader: '',
  derivative_license: '',
  single_trader: '',
  single_license: '',
  div_id: '',
  dep_id: '',
  logon_id: '',
  email: '',
  other_license: '',
};

const UploadEditEmployees = () => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');
  const [open, setOpen] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    Papa.parse<Record<string, any>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: Papa.ParseResult<Record<string, any>>) => {
        if (result.data.length > 50) {
          setLoading(false);
          setMessage('ไม่สามารถอัปโหลดได้เกิน 50 แถว');
          setSeverity('error');
          setOpen(true);
          return;
        }
        setData(result.data);
        setLoading(false);
        setMessage('โหลดข้อมูลสำเร็จ');
        setSeverity('success');
        setOpen(true);
      },
      error: () => {
        setMessage('ไม่สามารถอ่านไฟล์ได้');
        setSeverity('error');
        setOpen(true);
        setLoading(false);
      },
    });
  };

  const columns: MRT_ColumnDef<Record<string, any>>[] = Object.keys(defaultEmployee).map(
    (key) => ({
      accessorKey: key,
      header: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    })
  );

  const handleSubmitAll = async () => {
    try {
      const res = await fetch('/api/employees/update-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setMessage(result.message || 'อัปเดตข้อมูลสำเร็จ');
      setSeverity('success');
      setOpen(true);
    } catch (error) {
      setMessage('ส่งข้อมูลล้มเหลว');
      setSeverity('error');
      setOpen(true);
    }
  };

  return (
    <Box mt={6} display="flex" flexDirection="column" alignItems="center">
      <Card sx={{ width: 700, p: 3, mb: 4, boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            อัปโหลดไฟล์พนักงาน
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            รองรับ .csv โดยต้องมีหัวตารางตรงกับโครงสร้างฐานข้อมูล (ไม่เกิน 50 แถว)
          </Typography>
          <Box mt={2}>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ marginBottom: '1rem' }}
            />
          </Box>
        </CardContent>
      </Card>

      {data.length > 0 && (
        <Box width="95%">
          <MaterialReactTable
            columns={columns}
            data={data}
            enableEditing
            editDisplayMode="modal"
            onEditingRowSave={({ values, row }: {
              values: Record<string, any>;
              row: MRT_Row<Record<string, any>>;
              exitEditingMode: () => void;
              table: MRT_TableInstance<Record<string, any>>;
            }) => {
              const updated = [...data];
              updated[row.index] = values;
              setData(updated);
            }}
          />
          <Box mt={2} textAlign="right">
            <Button variant="contained" onClick={handleSubmitAll}>
              บันทึกการเปลี่ยนแปลงทั้งหมด
            </Button>
          </Box>
        </Box>
      )}

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={severity} variant="filled" onClose={() => setOpen(false)}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UploadEditEmployees;
