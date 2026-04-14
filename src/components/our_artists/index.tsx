import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const OurArtists = () => {
  return (
    <div className="mt-6">
      <div className="text-lg font-bold mb-2">Our Artist</div>
      <Link href="https://www.instagram.com/vaskange/?hl=en">
        <Image
          src="/assets/signature.webp"
          alt="Hero Image"
          width={250}
          height={100}
          className="-ml-8 mt-2"
          loading="eager"
        />
      </Link>
    </div>
  );
};

export default OurArtists;
