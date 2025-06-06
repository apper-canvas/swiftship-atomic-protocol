import React from 'react'
      import { motion } from 'framer-motion'

const Button = ({ children, className, onClick, type = 'button', disabled, whileHover = { scale: 1.02 }, whileTap = { scale: 0.98 }, ...props }) => {
        return (
          <motion.button
            whileHover={disabled ? {} : whileHover}
            whileTap={disabled ? {} : whileTap}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn-mobile flex items-center justify-center font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed tap-highlight-none ${className}`}
            {...props}
          >
            {children}
          </motion.button>
        )
      }

      export default Button