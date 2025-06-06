import React from 'react'
      import { motion } from 'framer-motion'
      import ApperIcon from '@/components/ApperIcon'

      const IconButton = ({ iconName, iconClass, onClick, className, whileHover, whileTap, ...props }) => {
        return (
          <motion.button
            onClick={onClick}
            whileHover={whileHover}
            whileTap={whileTap}
            className={`p-2 rounded-lg transition-colors ${className}`}
            {...props}
          >
            <ApperIcon name={iconName} className={iconClass} />
          </motion.button>
        )
      }

      export default IconButton