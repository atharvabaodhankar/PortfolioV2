import React from 'react';
import { useTransition } from '../context/TransitionContext';

const TransitionLink = ({ to, children, className, onClick, ...props }) => {
  const { startTransition } = useTransition();

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick(e);
    startTransition(to);
  };

  return (
    <a 
      href={to} 
      onClick={handleClick} 
      className={className} 
      {...props}
    >
      {children}
    </a>
  );
};

export default TransitionLink;
