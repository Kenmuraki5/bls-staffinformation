import Image from 'next/image';
import Link from 'next/link';

export default function PageNotAvailable() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <Image src="/bls.png" alt="bls logo" width={150} height={150}/>
      <h1 className="mt-3 text-6xl font-bold text-blue-600">404</h1>
      <h2 className="text-2xl mt-4">Page is not available</h2>
      <p className="mt-2 text-gray-600">Sorry, the page you are looking for might have been removed or is temporarily unavailable.</p>
    </div>
  );
}
