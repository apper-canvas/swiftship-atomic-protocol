import React, { useState, useEffect } from 'react'
      import AppHeader from '@/components/organisms/AppHeader'
      import HeroSection from '@/components/organisms/HeroSection'
      import FeaturesGrid from '@/components/organisms/FeaturesGrid'
      import MainTemplate from '@/components/templates/MainTemplate'

      const HomePage = () => {
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
            <AppHeader darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <HeroSection />
            <MainTemplate />
            <FeaturesGrid />
          </div>
        )
      }

      export default HomePage