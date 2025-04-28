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
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import Papa from 'papaparse';

const UploadPreviewEmployees = () => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<MRT_ColumnDef<Record<string, any>>[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');
  const [open, setOpen] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setLoading(true);

    Papa.parse<Record<string, any>>(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.data.length > 50) {
          setLoading(false);
          setMessage('ไม่สามารถอัปโหลดได้เกิน 50 แถว');
          setSeverity('error');
          setOpen(true);
          return;
        }

        setData(result.data);

        if (result.meta.fields) {
          const dynamicColumns = result.meta.fields.map((field) => ({
            accessorKey: field,
            header: field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          }));
          setColumns(dynamicColumns);
        }

        setLoading(false);
        setMessage('โหลดข้อมูลสำเร็จ');
        setSeverity('success');
        setOpen(true);
      },
      error: () => {
        setLoading(false);
        setMessage('ไม่สามารถอ่านไฟล์ได้');
        setSeverity('error');
        setOpen(true);
      },
    });
  };

  const handleSubmitFile = async () => {
    if (!file) {
      setMessage('กรุณาเลือกไฟล์ก่อน');
      setSeverity('error');
      setOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const res = await fetch('http://10.100.30.61:8080/upload-employee-file', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Upload failed');
      }

      setMessage('อัปโหลดไฟล์และบันทึกสำเร็จ');
      setSeverity('success');
    } catch (error: any) {
      setMessage(error.message || 'อัปโหลดล้มเหลว');
      setSeverity('error');
    } finally {
      setOpen(true);
      setLoading(false);
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
            รองรับเฉพาะ .csv โดยต้องมีหัวตารางที่ตรงกับโครงสร้างระบบ (ไม่เกิน 50 แถว)
          </Typography>

          <Box mt={2}>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ marginBottom: '1rem' }}
            />
          </Box>

          {file && (
            <Box mt={2} textAlign="center">
              <Button variant="contained" onClick={handleSubmitFile} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'บันทึกข้อมูล'}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {data.length > 0 && (
        <Box width="95%">
          <MaterialReactTable
            columns={columns}
            data={data}
            enableEditing={false} // ❗ ปิดโหมดแก้ไข
          />
        </Box>
      )}

      <Snackbar
        open={open}
        autoHideDuration={4000}
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

export default UploadPreviewEmployees;
