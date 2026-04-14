import React, { useState, useEffect } from 'react';

type TooltipProps = {
  text: string;
  position?: string;
  children: React.ReactElement;
};

const Tooltip: React.FC<TooltipProps> = ({ text, position, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();

    const handleResize = () => {
      checkIsMobile();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setShowTooltip(false);
    }
  };

  const handleClick = () => {
    if (isMobile) {
      setShowTooltip(!showTooltip);
    }
  };

  const tooltipStyle: any = {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: '#f5f5f5',
    border: '1px solid gray',
    color: 'black',
    minWidth: isMobile ? '150px' : '250px',
    padding: '0.2rem',
    borderRadius: '0.25rem',
    fontSize: '16px',
    textAlign: 'left',
  };

  switch (position) {
    case 'left':
      tooltipStyle['right'] = isMobile ? '50%' : '110%';
      tooltipStyle['top'] = isMobile ? '110%' : '50%';
      tooltipStyle['transform'] = isMobile
        ? 'translateX(50%)'
        : 'translateY(-50%)';
      break;
    case 'right':
      tooltipStyle['left'] = isMobile ? '10%' : '110%';
      tooltipStyle['top'] = isMobile ? '110%' : '50%';
      tooltipStyle['transform'] = isMobile
        ? 'translateX(-80%)'
        : 'translateY(-50%)';
      break;
    case 'bottom':
      tooltipStyle['top'] = isMobile ? '110%' : 'auto';
      tooltipStyle['left'] = isMobile ? '-100%' : 'auto';
      tooltipStyle['transform'] = isMobile
        ? 'translateX(-50%)'
        : 'translateX(-50%)';
      break;
    case 'top':
      tooltipStyle['bottom'] = isMobile ? '110%' : 'auto';
      tooltipStyle['left'] = '50%';
      tooltipStyle['transform'] = isMobile
        ? 'translateX(-50%)'
        : 'translateX(-50%)';
      break;
    default:
      break;
  }

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="relative cursor-help mt-1"
      >
        {children} {showTooltip && <div style={tooltipStyle}>{text}</div>}
      </div>
    </>
  );
};

export default Tooltip;
