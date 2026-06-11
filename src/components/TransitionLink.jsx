import React from 'react';
import { useTransition } from '../context/TransitionContext';

const TransitionLink = ({ to, children, className, onClick, ...props }) => {
  const transitionContext = useTransition();
  const startTransition = transitionContext ? transitionContext.startTransition : null;

  const handleClick = (e) => {
    if (startTransition) {
      e.preventDefault();
      if (onClick) onClick(e);
      startTransition(to);
    } else {
      if (onClick) onClick(e);
    }
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
