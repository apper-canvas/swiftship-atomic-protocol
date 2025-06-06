import React from 'react'
      import { motion } from 'framer-motion'
      import ApperIcon from '@/components/ApperIcon'
      import CardHeader from '@/components/atoms/CardHeader'

      const AnalyticsCard = ({ title, value, icon, iconColor, bgColor }) => (
        <div className={`rounded-xl p-6 text-white ${bgColor}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-opacity-90 ${iconColor}`}>{title}</p>
              <p className="text-3xl font-bold">{value}</p>
            </div>
            <ApperIcon name={icon} className={`h-12 w-12 ${iconColor}`} />
          </div>
        </div>
      )

      const DeliveryAnalytics = ({ deliveries }) => {
        const totalDeliveries = deliveries.length
        const completedDeliveries = deliveries.filter(d => d.status === 'delivered').length
        const successRate = totalDeliveries > 0
          ? Math.round((completedDeliveries / totalDeliveries) * 100)
          : 0

        return (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="p-8"
          >
            <h3 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">
              Delivery Analytics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <AnalyticsCard
                title="Total Deliveries"
                value={totalDeliveries}
                icon="Package"
                iconColor="text-blue-200"
                bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
              />
              <AnalyticsCard
                title="Completed"
                value={completedDeliveries}
                icon="CheckCircle"
                iconColor="text-green-200"
                bgColor="bg-gradient-to-r from-green-500 to-green-600"
              />
              <AnalyticsCard
                title="Success Rate"
                value={`${successRate}%`}
                icon="TrendingUp"
                iconColor="text-amber-200"
                bgColor="bg-gradient-to-r from-amber-500 to-amber-600"
              />
            </div>

            <div className="bg-surface-50 dark:bg-surface-700 rounded-xl p-6">
              <CardHeader title="Recent Activity" className="mb-4" />
              <div className="space-y-3">
                {deliveries.slice(0, 5).map((delivery) => (
                  <div key={delivery.id} className="flex items-center justify-between py-2 border-b border-surface-200 dark:border-surface-600 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        delivery.status === 'delivered' ? 'bg-green-500' :
                        delivery.status === 'out_for_delivery' ? 'bg-orange-500' : 'bg-blue-500'
                      }`}></div>
                      <span className="text-surface-700 dark:text-surface-300">
                        Delivery to {delivery.deliveryAddress?.city}
                      </span>
                    </div>
                    <span className="text-sm text-surface-500 dark:text-surface-400">
                      {new Date(delivery.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )
      }

      export default DeliveryAnalytics