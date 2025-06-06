import React from 'react'
      import { motion } from 'framer-motion'
      import ApperIcon from '@/components/ApperIcon'

      const FeatureCard = ({ icon, title, description, delay, index }) => {
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay + index * 0.1 }}
            className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-2xl p-6 border border-surface-200 dark:border-surface-700 hover:shadow-lg transition-all duration-300"
          >
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <ApperIcon name={icon} className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-surface-600 dark:text-surface-300">
              {description}
            </p>
          </motion.div>
        )
      }

      export default FeatureCard