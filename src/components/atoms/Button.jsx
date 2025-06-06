import React from 'react'
      import { motion } from 'framer-motion'

      const Button = ({ children, className, onClick, type = 'button', disabled, whileHover = { scale: 1.05 }, whileTap = { scale: 0.95 }, ...props }) => {
        return (
          <motion.button
            whileHover={whileHover}
            whileTap={whileTap}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center justify-center font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          >
            {children}
          </motion.button>
        )
      }

      export default Button