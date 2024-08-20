import fetchWithAuth from '@/app/utils/fetchWithAuth';
import dynamic from 'next/dynamic';

const StaffInformation = dynamic(() => import('@/components/staffinformation'));
const PersistentDrawerLeft = dynamic(() => import('@/components/drawer'));

async function getEmployee(domainId: string, empId: string) {
    try {
        const url = `${process.env.NEXT_PUBLIC_BASEURL}/staffinformation/employee/${domainId}/${empId}`;
        const response = await fetchWithAuth(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch employees');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching employees:', error);
        return [];
    }
}

export default async function page({
    params,
    searchParams,
}: {
    params: { domain: string, emp_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const employees: any = await getEmployee(params.domain, params.emp_id);
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 bg-white">
                <PersistentDrawerLeft />
                <hr />
                <section id='Heirachy'>
                    <div className='flex w-screen overflow-auto'>
                        <div className='w-full'>
                            <div className='m-3'>
                                <StaffInformation employees={employees.employee} />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <footer className='bg-pink-950 w-full p-2 text-white text-center'>
                Copyright
            </footer>
        </div>
    );
}
