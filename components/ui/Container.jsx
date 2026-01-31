import React from 'react';

const Container = ({ children, className = "" }) => {
    return (
        <div className={`max-w-full mx-auto px-2 sm:px-4 lg:px-10 w-full ${className}`}>
            {children}
        </div>
    );
};

export default Container;
