'use client'
import React, { useState, useEffect, useRef } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import DomainIcon from '@mui/icons-material/Domain';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import WorkIcon from '@mui/icons-material/Work';
import { getRole } from '@/app/utils/auth';
import Link from 'next/link';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    background: 'linear-gradient(to right, #172554, #1e3a8a)',
    borderBottom: '4px solid',
    position: 'fixed',
    '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: '4px',
        width: '60px',
        backgroundColor: 'red',
    },
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    justifyContent: 'space-between',
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        backgroundColor: '#f4f4f4',
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

const ListItemButtonStyled = styled(ListItemButton)({
    paddingLeft: '1rem',
    paddingRight: '1rem',
    '&:hover': {
        backgroundColor: '#e0e0e0',
    },
});

const IconStyled = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: '50%',
    marginRight: '1rem',
});

const domains = [
    { id: "BLS", img: "/bls.png" },
    { id: "BCAP", img: "/bcap.png" }
];

export default function PersistentDrawerLeft() {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const router = useRouter();
    const params = useParams();
    const drawerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchRole() {
            try {
                const roleData = await getRole();
                setRole(roleData ?? '');
            } catch (error) {
                console.error('Error fetching role:', error);
            }
        }

        fetchRole();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const signout = async () => {
        router.push(`${process.env.NEXT_PUBLIC_AUTH_URL}/logout`);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        <section id="logo">
                            <div className="flex items-center pt-2">
                                <div className='pr-3'>
                                    {params.domain == "BLS" && <Image src={`/bls-header-logo.png`} alt="" width={250} height={250} style={{ width: '200px', height: 'auto' }} priority />}
                                    {params.domain == "BCAP" && <Image src={`/bcap-header-logo.png`} alt="" width={250} height={250} style={{ width: '150px', height: 'auto' }} priority />}
                                </div>
                                <div className='flex justify-between items-center w-full'>
                                    <p className="font-bold text-white text-base sm:text-base md:text-xl">
                                        STAFF INFORMATION
                                    </p>
                                </div>
                            </div>
                        </section>
                    </Typography>
                </Toolbar>
            </AppBar>
            <StyledDrawer
                variant="persistent"
                anchor="left"
                open={open}
                ref={drawerRef}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider textAlign='left' className='mt-3' sx={{ fontWeight: 'bold', color: '#1e3a8a' }}>Domains</Divider>
                <List>
                    {domains.map((text) => (
                        <Link key={text.id} href={`/bualuang/${text.id}`}>
                            <ListItem disablePadding>
                                <ListItemButtonStyled>
                                    <IconStyled>
                                        <Image src={text.img} alt={text.id} width={30} height={30} style={{ width: '100%', height: 'auto', backgroundColor: 'white' }} />
                                    </IconStyled>
                                    <ListItemText primary={text.id} />
                                </ListItemButtonStyled>
                            </ListItem>
                        </Link>
                    ))}
                </List>
                <Divider textAlign='left' sx={{ fontWeight: 'bold', color: '#1e3a8a' }}>
                    {role === "AdminStaffInformation" ? "Management Information" : "Data Categories"}
                </Divider>
                <List>
                    <Link href="/employee/Management" key="employees">
                        <ListItem disablePadding>
                            <ListItemButtonStyled>
                                <AccountBoxIcon className="w-6 h-6 text-black-600 mr-3" />
                                Employees
                            </ListItemButtonStyled>
                        </ListItem>
                    </Link>
                    <Link href="/manager/Management" key="managers">
                        <ListItem disablePadding>
                            <ListItemButtonStyled>
                                <ManageAccountsIcon className="w-6 h-6 text-black-600 mr-3" />
                                Managers
                            </ListItemButtonStyled>
                        </ListItem>
                    </Link>
                    <Link href="/job/Management" key="jobs">
                        <ListItem disablePadding>
                            <ListItemButtonStyled>
                                <WorkIcon className="w-6 h-6 text-black-600 mr-3" />
                                Jobs
                            </ListItemButtonStyled>
                        </ListItem>
                    </Link>
                    <Link href="/organization/Management" key="organizations">
                        <ListItem disablePadding>
                            <ListItemButtonStyled>
                                <CorporateFareIcon className="w-6 h-6 text-black-600 mr-3" />
                                Organizations
                            </ListItemButtonStyled>
                        </ListItem>
                    </Link>
                    <Link href="/domain/Management" key="domains">
                        <ListItem disablePadding>
                            <ListItemButtonStyled>
                                <DomainIcon className="w-6 h-6 text-black-600 mr-3" />
                                Domains
                            </ListItemButtonStyled>
                        </ListItem>
                    </Link>
                    <Link href="/branch/Management" key="locations">
                        <ListItem disablePadding>
                            <ListItemButtonStyled>
                                <FmdGoodIcon className="w-6 h-6 text-black-600 mr-3" />
                                Branch
                            </ListItemButtonStyled>
                        </ListItem>
                    </Link>
                </List>
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton className='text-red-600 font-bold' onClick={() => signout()}>
                            <LogoutIcon className="w-6 h-6 text-black-600 mr-3" />
                            Logout
                        </ListItemButton>
                    </ListItem>
                </List>
            </StyledDrawer>
            <Main open={open}>
                <DrawerHeader />
            </Main>
        </Box>
    );
}
