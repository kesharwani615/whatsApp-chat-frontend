"use client";

import React from 'react'

interface ErrorProps {
  error: { message: string };
}

const Error: React.FC<ErrorProps> = ({ error }) => {

  console.log("Error component rendered with error:", error);
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{error.message}</p> 
    </div>
  )
}

export default Error;