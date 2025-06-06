import React from 'react'
      import { motion } from 'framer-motion'
      import ApperIcon from '@/components/ApperIcon'
      import IconButton from '@/components/atoms/IconButton'

      const AppHeader = ({ darkMode, toggleDarkMode }) => {
        return (
          <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-20 bg-white/80 dark:bg-surface-800/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-primary to-primary-light p-2 rounded-xl">
                    <ApperIcon name="Truck" className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-surface-900 dark:text-white">SwiftShip</span>
                </div>

                <div className="flex items-center space-x-4">
                  <nav className="hidden md:flex space-x-6">
                    <a href="#" className="text-surface-600 dark:text-surface-300 hover:text-primary transition-colors">Dashboard</a>
                    <a href="#" className="text-surface-600 dark:text-surface-300 hover:text-primary transition-colors">Tracking</a>
                    <a href="#" className="text-surface-600 dark:text-surface-300 hover:text-primary transition-colors">Analytics</a>
                  </nav>

                  <IconButton
                    onClick={toggleDarkMode}
                    iconName={darkMode ? "Sun" : "Moon"}
                    iconClass="h-5 w-5 text-surface-600 dark:text-surface-300"
                    className="bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600"
                  />
                </div>
              </div>
            </div>
          </motion.header>
        )
      }

      export default AppHeader