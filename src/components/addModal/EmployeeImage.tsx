import { useEffect, useState } from 'react';
import Image from 'next/image';

export const EmployeeImage = ({ fileName }: { fileName: string }) => {
  const httpsUrl = `https://${process.env.NEXT_PUBLIC_BASEURL_ClIENT_SIDE}/staff-img/${fileName.split('/').pop()}`;

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
          if (imgSrc !== httpsUrl) {
            setImgSrc(`https://${process.env.NEXT_PUBLIC_BASEURL_ClIENT_SIDE}/staff-img/white.PNG`);
            setUnoptimized(false)
          }
        }}
        fill
        unoptimized={unoptimized}
        className="bg-white rounded-full border-4 border-white shadow-lg object-contain"
      />
    </div>

  );
};
