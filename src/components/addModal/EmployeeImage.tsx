import { useState } from 'react';
import Image from 'next/image';

export const EmployeeImage = ({ fileName }: { fileName: string }) => {
  const httpsUrl = `https://bualuangstaffinfo.sawasdee.brk1/staff-img/${fileName.split('/').pop()}`;
  const httpUrl = `http://bualuangintranet.sawasdee.brk1/employee/${fileName.replace(/^(\.\/|\.\.\/)+/, '')}`;

  const [imgSrc, setImgSrc] = useState(httpsUrl);
  const [unoptimized, setUnoptimized] = useState(true);

  return (
    <Image
      src={imgSrc}
      alt="Profile"
      width={150}
      height={150}
      onError={() => {
        if (imgSrc !== httpUrl) {
          setImgSrc(httpUrl);
          setUnoptimized(false)
        }
      }}
      unoptimized={unoptimized}
      className="rounded-full object-cover"
    />
  );
};
