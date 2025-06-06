import React from 'react'
      import { motion } from 'framer-motion'
      import ApperIcon from '@/components/ApperIcon'

const IconButton = ({ iconName, iconClass, onClick, className, whileHover = { scale: 1.05 }, whileTap = { scale: 0.95 }, ...props }) => {
        return (
          <motion.button
            onClick={onClick}
            whileHover={whileHover}
            whileTap={whileTap}
className={`btn-mobile p-2 rounded-lg transition-colors tap-highlight-none ${className}`}
            {...props}
          >
            <ApperIcon name={iconName} className={iconClass} />
          </motion.button>
        )
      }

      export default IconButton