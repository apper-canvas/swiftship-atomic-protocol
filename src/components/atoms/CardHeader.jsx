import React from 'react'
      import ApperIcon from '@/components/ApperIcon'

      const CardHeader = ({ iconName, iconClass, title, titleClass = 'text-lg font-semibold text-surface-800 dark:text-surface-200', children }) => {
        return (
          <h4 className={`flex items-center ${titleClass}`}>
            {iconName && <ApperIcon name={iconName} className={`mr-2 h-5 w-5 ${iconClass}`} />}
            {title}
            {children}
          </h4>
        )
      }

      export default CardHeader