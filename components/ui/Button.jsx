import Link from 'next/link';
import React from 'react';

const Button = ({ text, onClick, className, children, href }) => {
    if (href) {
    return (
      <Link
        href={href}
        className={`rounded-full inline-flex duration-200 items-center whitespace-nowrap justify-center ${className}`}
      >
        {text}
      </Link>
    );
  }
  return(
    <button
      onClick={onClick}
      className={`rounded-full transition duration-200 whitespace-nowrap font-normal ${className}`}>
      {children}
      {text}
    </button>
  );
};

export default Button;
