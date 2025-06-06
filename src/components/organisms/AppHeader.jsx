import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import IconButton from '@/components/atoms/IconButton'
import Button from '@/components/atoms/Button'

const AppHeader = ({ onLogoClick }) => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const navItems = [
    { path: '/', label: 'Home', icon: 'Home' },
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/tracking', label: 'Tracking', icon: 'MapPin' },
    { path: '/analytics', label: 'Analytics', icon: 'BarChart3' }
  ]

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleAuth = () => {
    setIsAuthenticated(!isAuthenticated)
  }

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-surface-800 shadow-card border-b border-surface-200 dark:border-surface-700 sticky top-0 z-50"
      role="banner"
    >
<div className="container mx-auto container-mobile sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={onLogoClick}
            onKeyDown={(e) => handleKeyDown(e, onLogoClick)}
            className="flex items-center space-x-3 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
            tabIndex={0}
            role="button"
            aria-label="SwiftShip Home"
          >
            <div className="bg-gradient-to-r from-primary to-primary-light p-2 rounded-xl group-hover:shadow-lg group-focus:shadow-lg transition-all duration-200">
              <ApperIcon name="Truck" className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              SwiftShip
            </h1>
          </div>
          
{/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              const isHome = item.path === '/'
              return (
<Link
                  key={item.path}
                  to={item.path}
                  className={`nav-mobile flex items-center space-x-2 px-3 lg:px-5 py-2 lg:py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : isHome 
                        ? 'text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-primary dark:hover:text-primary-light bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-600'
                        : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-primary dark:hover:text-primary-light'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <ApperIcon name={item.icon} className={isHome ? "h-5 w-5" : "h-4 w-4"} />
                  <span className={`font-medium text-sm lg:text-base ${isHome ? 'lg:text-base' : ''}`}>{item.label}</span>
                </Link>
              )
            })}
          </nav>
          
          {/* Desktop Auth & Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <IconButton
              icon="Bell"
              variant="outline"
              className="text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light transition-colors"
              aria-label="Notifications"
            />
            <IconButton
              icon="Settings"
              variant="outline"
              className="text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light transition-colors"
              aria-label="Settings"
            />
            <Button
              onClick={handleAuth}
              variant={isAuthenticated ? "outline" : "primary"}
              className="flex items-center space-x-2"
              aria-label={isAuthenticated ? "Logout" : "Login"}
            >
              <ApperIcon name={isAuthenticated ? "LogOut" : "LogIn"} className="h-4 w-4" />
              <span className="font-medium">{isAuthenticated ? "Logout" : "Login"}</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            onKeyDown={(e) => handleKeyDown(e, toggleMobileMenu)}
            className="md:hidden p-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="h-6 w-6" />
            </motion.div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
              role="navigation"
              aria-label="Mobile navigation"
>
              <div className="pt-4 pb-2 space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path
                  const isHome = item.path === '/'
                  return (
<Link
                      key={item.path}
                      to={item.path}
                      className={`nav-mobile flex items-center space-x-3 px-4 py-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        isActive
                          ? 'bg-primary text-white shadow-md'
                          : isHome
                            ? 'text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-primary dark:hover:text-primary-light bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-600'
                            : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-primary dark:hover:text-primary-light'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <ApperIcon name={item.icon} className={isHome ? "h-6 w-6" : "h-5 w-5"} />
                      <span className={`font-medium ${isHome ? 'text-lg' : 'text-base'}`}>{item.label}</span>
                    </Link>
                  )
                })}
                {/* Mobile Auth & Actions */}
                <div className="pt-3 mt-3 border-t border-surface-200 dark:border-surface-700 space-y-2">
                  <button
                    className="w-full flex items-center space-x-3 px-4 py-3 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-primary dark:hover:text-primary-light rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Notifications"
                  >
                    <ApperIcon name="Bell" className="h-5 w-5" />
                    <span className="font-medium text-base">Notifications</span>
                  </button>
                  <button
                    className="w-full flex items-center space-x-3 px-4 py-3 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-primary dark:hover:text-primary-light rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Settings"
                  >
                    <ApperIcon name="Settings" className="h-5 w-5" />
                    <span className="font-medium text-base">Settings</span>
                  </button>
                  <button
                    onClick={handleAuth}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      isAuthenticated 
                        ? 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-primary dark:hover:text-primary-light'
                        : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
                    aria-label={isAuthenticated ? "Logout" : "Login"}
                  >
                    <ApperIcon name={isAuthenticated ? "LogOut" : "LogIn"} className="h-5 w-5" />
                    <span className="font-medium text-base">{isAuthenticated ? "Logout" : "Login"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default AppHeader