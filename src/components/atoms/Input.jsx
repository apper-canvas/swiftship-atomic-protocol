import React from 'react'

      const Input = ({ type = 'text', placeholder, value, onChange, className, required, ...props }) => {
        return (
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
className={`input-mobile w-full px-3 py-2 text-sm rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary tap-highlight-none ${className}`}
            required={required}
            {...props}
          />
        )
      }

      export default Input