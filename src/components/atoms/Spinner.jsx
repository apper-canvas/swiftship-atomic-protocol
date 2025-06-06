import React from 'react'

      const Spinner = ({ size = 'h-5 w-5', color = 'border-white', className = '' }) => {
        return (
          <div className={`animate-spin rounded-full ${size} border-b-2 ${color} ${className}`}></div>
        )
      }

      export default Spinner