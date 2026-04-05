"use client";

import React, { useEffect, useState } from 'react';

interface HelperComponentProps {
  children?: React.ReactElement | React.ReactElement[];
}

const HelperComponent: React.FC<HelperComponentProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("whatsappClone");
    setToken(storedToken);
  }, []);

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, { token });
    }
    return child;
  });

  return <>{childrenWithProps}</>;
};

export default HelperComponent;
