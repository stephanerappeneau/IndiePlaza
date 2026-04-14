import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import OurArtists from '@/components/our_artists';
import Image from 'next/image';
import data from '@/data/data';

const KNOWN_PATHS = [
  '/',
  '/about',
  '/privacy',
  '/tools/revenues-planner',
  '/tools/publisher-quest',
];

const Footer = () => {
  const { pathname } = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!KNOWN_PATHS.includes(pathname)) return null;

  return (
    <footer id="footer" className="relative z-10 bg-white text-black md:p-20">
      <div className="border-t border-b border-gray-300 py-10">
        <div className="mx-auto container px-4 xl:px-12 2xl:px-4">
          <div className="grid grid-cols-3 gap-6">
            {/* Logo + tagline */}
            <div className="col-span-3 md:col-span-1">
              <Image
                src="/assets/Logo.png"
                alt="Logo indie plaza"
                width={200}
                height={100}
              />
              <div className="text-base mt-1">
                Easy Mode Games Studio Funding
              </div>
            </div>

            {/* Website links */}
            <div className="col-span-3 md:col-span-1">
              <ul className="list-none">
                <li className="mb-3">
                  <div className="text-lg font-bold">Website</div>
                </li>
                {data.footer.footerList.website.map((item, index) => (
                  <li key={index} className="mb-2">
                    {item.src.startsWith('http') ? (
                      <a
                        href={item.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base underline cursor-pointer hover:text-gray-500"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <Link
                        href={item.src}
                        className="text-base underline cursor-pointer hover:text-gray-500"
                      >
                        {item.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact + Our Artist */}
            <div className="col-span-3 md:col-span-1">
              <ul className="list-none">
                <li className="mb-3">
                  <div className="text-lg font-bold">Contact</div>
                </li>
                <li className="mb-2">
                  <a
                    href={'mailto:stephane.rappeneau@gmail.com'}
                    className="text-base hover:underline cursor-pointer hover:text-gray-500"
                  >
                    stephane.rappeneau@gmail.com
                  </a>
                </li>
              </ul>
              <OurArtists />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
