import React from 'react'
      import ApperIcon from '@/components/ApperIcon'

      const TabButton = ({ id, label, icon, isActive, onClick }) => {
        return (
          <button
            key={id}
            onClick={() => onClick(id)}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg'
                : 'text-surface-600 dark:text-surface-300 hover:text-primary'
            }`}
          >
<ApperIcon name={icon} className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline text-sm">{label}</span>
          </button>
        )
      }

      export default TabButton