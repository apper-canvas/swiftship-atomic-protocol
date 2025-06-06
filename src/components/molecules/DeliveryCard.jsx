import React from 'react'
      import { motion } from 'framer-motion'
      import ApperIcon from '@/components/ApperIcon'
      import Button from '@/components/atoms/Button'

      const DeliveryCard = ({ delivery, getStatusColor, onUpdateStatus, onCaptureSignature }) => {
        const statusColors = {
          'pickup_scheduled': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
          'picked_up': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          'in_transit': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
          'out_for_delivery': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
          'delivered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        }
        const statusClass = statusColors[delivery.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'

        const nextStatusMap = {
          'pickup_scheduled': 'picked_up',
          'picked_up': 'in_transit',
          'in_transit': 'out_for_delivery'
        }
        const nextStatus = nextStatusMap[delivery.status]

return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-50 dark:bg-surface-700 rounded-xl p-4 sm:p-6 border border-surface-200 dark:border-surface-600 card-mobile"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}>
                    {delivery.status?.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-sm text-surface-500 dark:text-surface-400">
                    ID: {delivery.id}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-surface-700 dark:text-surface-300">From:</span>
                    <p className="text-surface-600 dark:text-surface-400">
                      {delivery.pickupAddress?.street}, {delivery.pickupAddress?.city}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-surface-700 dark:text-surface-300">To:</span>
                    <p className="text-surface-600 dark:text-surface-400">
                      {delivery.deliveryAddress?.street}, {delivery.deliveryAddress?.city}
                    </p>
                  </div>
                </div>
              </div>
<div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {delivery.status === 'out_for_delivery' && (
                  <Button
                    onClick={() => onCaptureSignature(delivery)}
                    className="btn-mobile flex-1 sm:flex-none px-4 py-3 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base"
                  >
                    <ApperIcon name="PenTool" className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Sign</span>
                  </Button>
                )}
                
                {delivery.status !== 'delivered' && (
                  <Button
                    onClick={() => nextStatus && onUpdateStatus(delivery.id, nextStatus)}
                    className="btn-mobile flex-1 sm:flex-none px-4 py-3 sm:py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm sm:text-base"
                  >
                    <ApperIcon name="ArrowRight" className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Next</span>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )
      }

      export default DeliveryCard