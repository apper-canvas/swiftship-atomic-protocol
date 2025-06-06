import React from 'react'

      const Textarea = ({ value, onChange, placeholder, className, ...props }) => {
        return (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
className={`input-mobile w-full h-24 px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none tap-highlight-none ${className}`}
            {...props}
          />
        )
      }

      export default Textarea