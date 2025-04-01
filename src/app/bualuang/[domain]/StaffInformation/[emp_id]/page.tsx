import { getEmployee } from '@/app/api/employees';
import PageNotAvailable from '@/components/notavailable';
import dynamic from 'next/dynamic';

const StaffInformation = dynamic(() => import('@/components/staffinformation'));

export default async function page({
    params,
    searchParams,
}: {
    params: { domain: string, emp_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const employees: any = await getEmployee(params.domain, params.emp_id);
    return (
        <div className="flex flex-col">
            {employees.length != 0 ? (
            <><div className="flex-1 bg-white">
                    <section id='Heirachy'>
                        <StaffInformation staffData={employees.employee} />
                    </section>
                </div><footer className='bg-pink-950 w-full p-2 text-white text-center'>
                        Copyright
                    </footer></>
            ) : (<PageNotAvailable />)}
        </div>
    );
}
