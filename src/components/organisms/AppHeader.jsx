import React from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import IconButton from '@/components/atoms/IconButton'

const AppHeader = ({ onLogoClick }) => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: 'Home' },
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/tracking', label: 'Tracking', icon: 'MapPin' },
    { path: '/analytics', label: 'Analytics', icon: 'BarChart3' }
  ]

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-surface-800 shadow-card border-b border-surface-200 dark:border-surface-700 sticky top-0 z-50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div 
            onClick={onLogoClick}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="bg-gradient-to-r from-primary to-primary-light p-2 rounded-xl group-hover:shadow-lg transition-shadow">
              <ApperIcon name="Truck" className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              SwiftShip
            </h1>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                  }`}
                >
                  <ApperIcon name={item.icon} className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
          
          <div className="flex items-center space-x-4">
            <IconButton
              icon="Bell"
              variant="outline"
              className="text-surface-600 dark:text-surface-300"
            />
            <IconButton
              icon="Settings"
              variant="outline"
              className="text-surface-600 dark:text-surface-300"
            />
            <IconButton
              icon="User"
              variant="primary"
              className="bg-primary text-white"
            />
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default AppHeader