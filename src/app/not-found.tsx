import { Button } from '@mui/material';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mt-4">Page Not Found</p>
        <p className="text-md text-gray-500 mt-2">
          Sorry, the page you are looking for doesn&apos;t exist.
        </p>

        <Link href="/" passHref>
          <Button variant="contained" color="primary" className="mt-6">
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
