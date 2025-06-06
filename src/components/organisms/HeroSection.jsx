import React from 'react'
      import { motion } from 'framer-motion'
      import ApperIcon from '@/components/ApperIcon'
      import Button from '@/components/atoms/Button'

      const HeroSection = () => {
        return (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
          >
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-surface-900 dark:text-white mb-6">
                Smart Courier
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Management
                </span>
              </h1>
              <p className="text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto mb-8">
                Streamline your delivery operations with intelligent route optimization,
                real-time tracking, and automated dispatch management.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-primary to-primary-light text-white shadow-lg hover:shadow-xl"
                >
                  <ApperIcon name="Play" className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
                <Button
                  className="inline-flex items-center px-8 py-3 bg-white dark:bg-surface-800 text-surface-900 dark:text-white border border-surface-200 dark:border-surface-700 hover:shadow-lg"
                >
                  <ApperIcon name="MapPin" className="mr-2 h-5 w-5" />
                  Track Package
                </Button>
              </div>
            </div>
          </motion.section>
        )
      }

      export default HeroSection