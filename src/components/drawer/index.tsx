'use client'
import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
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
import { getRole, logout } from '@/app/lib/action';

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
    backgroundColor: 'white',
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const domains = [
    { id: "BLS", img: "/bls.png" },
    { id: "BCAP", img: "/bcap.png" }
]

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    marginTop: 30,
}));

export default function PersistentDrawerLeft() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [role, setRole] = useState(null);

    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        async function fetchRole() {
            try {
                const roleData = await getRole(); 
                setRole(roleData.role);
            } catch (error) {
                console.error('Error fetching role:', error);
            }
        }

        fetchRole();
    }, []);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const signout = async () => {
        // Implement your signout logic
        await logout();
        router.push("/authentication");
    }

    const navigate = async (manage: string) => {
        router.push(`/${params.domain}/${manage}/Management`);
    }

    const createAccount = () => {
        router.push(`/${params.domain}/createAccount`);
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar className='border-b-4 border-rose-700'>
                    <IconButton
                        color="default"
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
                                <div>
                                    {!open && <Image src="/bls-header-logo.png" alt="" width={250} height={250} style={{ width: '100%', height: 'auto' }} priority />}
                                </div>
                                <div>
                                    <p className="p-5 font-bold xl:text-xl md:text-xl text-rose-600">STAFFINFORMATION</p>
                                </div>
                            </div>
                        </section>
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider textAlign='left' className='mt-3'>Domains</Divider>
                <List>
                    {domains.map((text, index) => (
                        <ListItem key={text.id} disablePadding>
                            <ListItemButton onClick={() => router.replace(`/bualuang/${text.id}`)}>
                                <Image src={text.img} alt={text.id} width={40} height={40} style={{ width: '18%', height: 'auto' }} />
                                <ListItemText primary={text.id} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider textAlign='left'>{role == "admin" ? "Management" : "Data Dictionary"}</Divider>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton className='text-black-600 font-bold' onClick={() => navigate("employee")}>
                            <svg className="w-6 h-6 text-black-600 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 5.548-5.334A5.503 5.503 0 0 1 7.1 12Z" clipRule="evenodd" />
                            </svg>
                            Employees
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton className='text-black-600 font-bold' onClick={() => navigate("job")}>
                            <WorkIcon className="w-6 h-6 text-black-600 mr-3" />
                            Jobs
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton className='text-black-600 font-bold' onClick={() => navigate("organization")} >
                            <CorporateFareIcon className="w-6 h-6 text-black-600 mr-3" />
                            Organizations
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton className='text-black-600 font-bold' onClick={() => navigate("manager")} >
                            <ManageAccountsIcon className="w-6 h-6 text-black-600 mr-3" />
                            Managers
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton className='text-black-600 font-bold' onClick={() => navigate("domain")}>
                            <DomainIcon className="w-6 h-6 text-black-600 mr-3" />
                            Domains
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton className='text-black-600 font-bold' onClick={() => navigate("branch")}>
                            <FmdGoodIcon className="w-6 h-6 text-black-600 mr-3" />
                            Branch
                        </ListItemButton>
                    </ListItem>
                    {role == "admin" && (<ListItem disablePadding>
                        <ListItemButton className='text-black-600 font-bold' onClick={() => createAccount()}>
                            <GroupAddIcon className="w-6 h-6 text-black-600 mr-3" />
                            Create Account
                        </ListItemButton>
                    </ListItem>)}
                    <ListItem disablePadding>
                        <ListItemButton className='text-red-600 font-bold' onClick={() => signout()}>
                            <LogoutIcon className="w-6 h-6 text-black-600 mr-3" />
                            logout
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
                {/* Main content goes here */}
            </Main>
        </Box>
    );
}
