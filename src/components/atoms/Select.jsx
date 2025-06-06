import React from 'react'

      const Select = ({ value, onChange, options, className, ...props }) => {
        return (
          <select
            value={value}
            onChange={onChange}
className={`input-mobile px-3 py-2 text-sm rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary tap-highlight-none ${className}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      }

      export default Select