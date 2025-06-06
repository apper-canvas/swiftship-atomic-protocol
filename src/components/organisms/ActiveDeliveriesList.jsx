import React from 'react'
      import { motion } from 'framer-motion'
      import ApperIcon from '@/components/ApperIcon'
      import DeliveryCard from '@/components/molecules/DeliveryCard'

      const ActiveDeliveriesList = ({ deliveries, onUpdateStatus, onCaptureSignature }) => {
        return (
          <motion.div
            key="track"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="p-8"
          >
            <h3 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">
              Active Deliveries
            </h3>
            
            {deliveries.length === 0 ? (
              <div className="text-center py-12">
                <ApperIcon name="Package" className="h-16 w-16 text-surface-400 mx-auto mb-4" />
                <p className="text-surface-600 dark:text-surface-400">No deliveries found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {deliveries.map((delivery) => (
                  <DeliveryCard
                    key={delivery.id}
                    delivery={delivery}
                    onUpdateStatus={onUpdateStatus}
                    onCaptureSignature={onCaptureSignature}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )
      }

      export default ActiveDeliveriesList