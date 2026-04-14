import Image from 'next/image';
import React from 'react';

interface IconButtonProps {
  className: string;
  src: string;
  alt: string;
  handleClick?: () => void;
}

/**
 * Create an IconButton
 * @param className
 * @param src
 * @param alt
 * @param handleClick
 * @constructor
 */
export const IconButton: React.FC<IconButtonProps> = ({
  className,
  src,
  alt,
  handleClick,
}) => (
  <span className={className} onClick={handleClick} onKeyDown={handleClick}>
    <Image src={src} alt={alt} width={20} height={20} />
  </span>
);
