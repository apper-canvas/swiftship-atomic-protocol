import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

function Home() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      {/* Header */}
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
              
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="h-5 w-5 text-surface-600 dark:text-surface-300" 
                />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
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
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ApperIcon name="Play" className="mr-2 h-5 w-5" />
              Get Started
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-3 bg-white dark:bg-surface-800 text-surface-900 dark:text-white font-semibold rounded-xl border border-surface-200 dark:border-surface-700 hover:shadow-lg transition-all duration-300"
            >
              <ApperIcon name="MapPin" className="mr-2 h-5 w-5" />
              Track Package
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Main Feature Section */}
      <MainFeature />

      {/* Features Grid */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-surface-900 dark:text-white mb-4">
              Complete Delivery Solution
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-300">
              Everything you need to manage courier operations efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "Route",
                title: "Smart Routing",
                description: "AI-powered route optimization for maximum efficiency"
              },
              {
                icon: "Eye",
                title: "Real-time Tracking",
                description: "Live GPS tracking with ETA updates and notifications"
              },
              {
                icon: "PenTool",
                title: "Digital Signatures",
                description: "Secure proof of delivery with e-signature capture"
              },
              {
                icon: "CreditCard",
                title: "Cashless Payments",
                description: "Integrated payment processing with multiple options"
              },
              {
                icon: "BarChart3",
                title: "Analytics Dashboard",
                description: "Comprehensive insights into delivery performance"
              },
              {
                icon: "Smartphone",
                title: "Mobile Optimized",
                description: "Full functionality on all devices and platforms"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-2xl p-6 border border-surface-200 dark:border-surface-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <ApperIcon name={feature.icon} className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-surface-600 dark:text-surface-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home