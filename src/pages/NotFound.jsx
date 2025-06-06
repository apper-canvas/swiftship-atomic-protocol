import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-primary to-accent w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="PackageX" className="h-12 w-12 text-white" />
          </div>
        </motion.div>
        
<motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-surface-900 dark:text-white mb-4"
        >
          404
        </motion.h1>
        
<motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-lg sm:text-xl md:text-2xl font-semibold text-surface-700 dark:text-surface-300 mb-4"
        >
          Package Not Found
        </motion.h2>
        
<motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-sm sm:text-base text-surface-600 dark:text-surface-400 mb-8"
        >
          Looks like this delivery got lost in transit. Let's get you back on the right route.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <ApperIcon name="Home" className="mr-2 h-5 w-5" />
            Back to Dashboard
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound