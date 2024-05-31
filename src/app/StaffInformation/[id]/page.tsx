import { CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';

const StaffInformation = dynamic(() => import('@/components/staffinformation'), {
    ssr: false,
    loading: () => <div><CircularProgress/></div>
  });
const PersistentDrawerLeft = dynamic(() => import('@/components/drawer'));
const Search = dynamic(() => import('@/components/search'));

export default function page() {
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
                                <StaffInformation/>
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
