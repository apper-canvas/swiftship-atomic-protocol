import React from 'react'
      import TabButton from '@/components/molecules/TabButton'

      const tabs = [
        { id: 'book', label: 'Book Delivery', icon: 'Plus' },
        { id: 'track', label: 'Track Packages', icon: 'MapPin' },
        { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
        { id: 'payment', label: 'Payment', icon: 'CreditCard' }
      ]

      const TabNavigation = ({ activeTab, onTabChange }) => {
        return (
          <div className="flex flex-wrap justify-center mb-8 bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-2xl p-2 border border-surface-200 dark:border-surface-700">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                isActive={activeTab === tab.id}
                onClick={onTabChange}
              />
            ))}
          </div>
        )
      }

      export default TabNavigation