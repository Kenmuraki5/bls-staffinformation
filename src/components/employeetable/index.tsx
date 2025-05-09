'use client'
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Breadcrumbs, Link, styled, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import FilterListIcon from '@mui/icons-material/FilterList';
import ListIcon from '@mui/icons-material/List';
import Image from 'next/image';

type PropsType = {
  dataEmployees: any;
  breadcrumbPath: {
    path: string[];
    ids: string[];
  };
};

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .no-rows-primary': {
    fill: theme.palette.mode === 'light' ? '#AEB8C2' : '#3D4751',
  },
  '& .no-rows-secondary': {
    fill: theme.palette.mode === 'light' ? '#E8EAED' : '#1D2126',
  },
}));

function CustomNoRowsOverlay() {
  const params: any = useParams();
  return (
    <StyledGridOverlay>
      {["BLS", "BCAP"].includes(params?.domain) && (
        <Image
          src={`/${params?.domain?.toLowerCase()}.png`}
          alt={`${params?.domain} LOGO`}
          priority
          width={100}
          height={100}
          style={{ filter: 'grayscale(100%)' }} // .................
        />
      )}
      <Box sx={{ mt: 2 }}>No data Found</Box>
    </StyledGridOverlay>

  );
}

const EmployeeTable: React.FC<PropsType> = ({ dataEmployees, breadcrumbPath }: any) => {
  const [alignment, setAlignment] = React.useState('managers');
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const search = searchParams.get('organizationId');
  const searchInput = searchParams.get('searchInput');
  const searchBy = searchParams.get('searchBy');

  React.useEffect(() => {
    if (searchBy) {
      setAlignment("managers");
    }
  }, [searchBy])

  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'empId',
      headerName: 'Staff ID',
      minWidth: 70,
      maxWidth: 95,
      flex: 1,
      renderCell: (data) => {
        const formattedEmpId = data.value.toString().padStart(4, '0');
    
        const handleClick = () => {
          router.push(`/bualuang/${params.domain}?empId=${data?.row?.empId}`);
        };
    
        return (
          <span
            onClick={handleClick}
            style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {formattedEmpId}
          </span>
        );
      },
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align: 'center'
    },
    { field: 'thFirstName', headerName: 'Thai Name', minWidth: 100, flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    { field: 'enFirstName', headerName: 'English Name', minWidth: 100, flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    {
      field: 'organizationUnit',
      headerName: 'Department',
      minWidth: 100,
      maxWidth: 450,
      flex: 1,
      renderCell: (params) => {
        const org_units = params.value?.split(', ').map((org_unit: any) => {
          const [id, name] = org_unit?.split(':');
          return { id, name };
        });
      
        return (
          <div>
            {org_units?.map((org_unit: any) => {
              const isSelected = search != org_unit?.id && searchInput != org_unit?.id;
              return (
                <div
                  key={org_unit.id}
                  style={{
                    padding: '5px',
                    marginBottom: '5px',
                  }}
                >
                  {isSelected ? (
                    <a
                      href={`?organizationId=${org_unit?.id}`}
                      style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(`?organizationId=${org_unit?.id}`);
                      }}
                    >
                      {org_unit?.name}
                    </a>
                  ) : (
                    <span style={{ color: 'black' }}>{org_unit?.name}</span>
                  )}
                  <hr />
                </div>
              );
            })}
          </div>
        );
      },
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
    },
    {
      field: 'corporationTitle', headerName: 'Corporate Title', minWidth: 90, maxWidth: 90, flex: 1,
      renderCell: (params) => params.row.corporationTitle !== "" ? <div>{abbreviateTitle(params.row.corporationTitle)}</div> : "",
      headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center',
      renderHeader: () => (
        <div style={{ textAlign: 'center', fontWeight:'bold' }}>
          Corporate <br /> Title
        </div>
      ),
    },
    { field: 'branchId', headerName: 'Branch', minWidth: 70, maxWidth: 70, flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center' },
    {
      field: 'extensionCode',
      headerName: 'Ext no.',
      minWidth: 90,
      maxWidth: 90,
      flex: 1,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const codes = params.value.split(',');
        return (
          <div>
            {codes.map((code: any, index: any) => (
              <div key={index}>{code}</div>
            ))}
          </div>
        );
      },
    },
  ];


  function abbreviateTitle(title: string) {
    const primaryTitle = title.split(" / ")[0];
    const words = primaryTitle.split(" ");
    if (words.length === 1) {
      return primaryTitle;
    }
    const abbreviation = words.map(word => word[0]).join("");
    return abbreviation;
  }
  const breadcrumbClickHandler = (id: string) => {
    router.push(`?organizationId=${id}`);
  };

  const filteredEmployees = alignment === 'all' ? dataEmployees :
    dataEmployees.filter((employee: any) => {
      switch (searchBy) {
        case 'employeeId':
          return employee?.empId == searchInput;

        case 'employeeName':
          return employee?.enFirstName?.toLowerCase().includes(searchInput?.toLowerCase()) ||
            employee?.thFirstName?.toLowerCase().includes(searchInput?.toLowerCase());

        case 'employeenickName':
          return employee?.nickname?.toLowerCase().includes(searchInput?.toLowerCase());

        default:
          return employee?.managerId !== "" ||
            employee?.organizationId === search ||
            employee?.organizationId === searchInput
      }
    });

  return (
    <div style={{ width: '100%' }}>
      <div className='bg-rose-700 rounded mt-3 flex items-center'>
        <p className='text-white font-bold rounded px-5'>STAFF INFORMATION</p>
        <ToggleButtonGroup
          color="info"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="View Filter"
          className='ml-auto'
          sx={{ height: '40px' }}
        >
          <ToggleButton value="managers" aria-label="Filter" className='text-white'>
            <FilterListIcon />
          </ToggleButton>
          <ToggleButton value="all" aria-label="List" className='text-white'>
            <ListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <Breadcrumbs separator=">" aria-label="breadcrumb" maxItems={4} className='my-2'>
        {breadcrumbPath?.path.length && params.domain == "BLS" && <Image src={`/bls.png`} alt="" width={50} height={50} style={{ width: '50px', height: 'auto' }} priority />}
        {breadcrumbPath?.path.length && params.domain == "BCAP" && <Image src={`/bcap.png`} alt="" width={50} height={50} style={{ width: '50px', height: 'auto' }} priority />}
        {breadcrumbPath.path.map((label: any, index: any) => (
          <Link
            className="hover:text-blue-700"
            style={{ cursor: 'pointer' }}
            key={breadcrumbPath.ids[index]}
            color="inherit"
            onClick={() => breadcrumbClickHandler(breadcrumbPath.ids[index])}
          >
            {label}
          </Link>
        ))}
      </Breadcrumbs>

      <DataGrid
        sx={{
          '.MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold !important',
          },
          height: '60vh',
          '.MuiDataGrid-row:nth-of-type(odd)': {
            backgroundColor: '#f9f9f9', // Color for odd rows
          },
          '.MuiDataGrid-row:nth-of-type(even)': {
            backgroundColor: '#ffffff', // Color for even rows
          },
        }}
        getRowHeight={() => 'auto'}
        getRowId={(row) => row.empId}
        rows={filteredEmployees || []}
        columns={columns}
        showCellVerticalBorder
        showColumnVerticalBorder
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
        }}
      />

    </div>
  );
};

export default EmployeeTable;

