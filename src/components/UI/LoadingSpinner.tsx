import React from 'react'
import "./LoadingSpinner.css"

const LoadingSpinner = () => {
  return (
    <div className='h-full'>
      <svg height={"100%"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='w-full'>
        <rect className="spinner_GmWz" x={1} y={4} width={6} height={"60%"}  />
        <rect className="spinner_GmWz spinner_NuDr" x={9} y={4} width={6} height={"60%"}  />
        <rect className="spinner_GmWz spinner_OlQ0" x={17} y={4} width={6} height={"60%"}  /></svg>
    </div>
  )
}

export default LoadingSpinner