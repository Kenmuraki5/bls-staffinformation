import { getToken } from '@/app/lib/action';
import { Box, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';

const StaffInformation = dynamic(() => import('@/components/staffinformation'), {
    ssr: false,
    loading: () =>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
        </Box>
});
const PersistentDrawerLeft = dynamic(() => import('@/components/drawer'));
const Search = dynamic(() => import('@/components/search'));

async function getEmployee(empId: string) {
    try {
        const token = await getToken("session")
        const res = await fetch(`http://localhost:8080/staffinformation/employee/${empId}`, {
            headers: { 'authorization': token }
        });
        if (!res.ok) {
            throw new Error('Failed to fetch employees');
        }
        return await res.json();
    } catch (error) {
        console.error('Error fetching employees:', error);
        return [];
    }
}

// async function search(searchby: string ,empId: string, employee: any) {
//     if (searchby == "name"){
//         console.log
//     }
// }

export default async function page({
    params,
    searchParams,
}: {
    params: { emp_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const employees: any = await getEmployee(params.emp_id);
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 bg-white">
                <PersistentDrawerLeft />
                <hr />
                <section id='Heirachy'>
                    <div className='flex w-screen overflow-auto'>
                        <div className='w-full m-5 border-2 border rounded'>
                            <Search />
                            <div className='m-3'>
                                <StaffInformation employees={employees.employee} />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className='bg-pink-950 w-full p-2 text-white text-center'>
                Copyright
            </footer>
        </div>
    );
}