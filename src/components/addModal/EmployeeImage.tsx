import { useEffect, useState } from 'react';
import Image from 'next/image';

export const EmployeeImage = ({ fileName }: { fileName: string }) => {
  const httpsUrl = `${process.env.NEXT_PUBLIC_BASEURL_CLIENT_SIDE}/staff-img/${fileName.split('/').pop()}`;

  const [imgSrc, setImgSrc] = useState(httpsUrl);
  const [unoptimized, setUnoptimized] = useState(true);

  useEffect(() => {
    setImgSrc(httpsUrl);
    setUnoptimized(true);
  }, [fileName]);

  return (
    <div className="relative w-48 h-48">
      <Image
        src={imgSrc}
        alt="Profile"
        onError={() => {
          setImgSrc(`${process.env.NEXT_PUBLIC_BASEURL_CLIENT_SIDE}/staff-img/white.PNG`);
        }}
        fill
        unoptimized={unoptimized}
        className="bg-white rounded-full border-4 border-white shadow-lg object-contain"
      />
    </div>

  );
};
