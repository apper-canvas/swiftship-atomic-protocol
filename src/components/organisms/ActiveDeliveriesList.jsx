import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import DeliveryCard from '@/components/molecules/DeliveryCard'
import SignatureModal from './SignatureModal'
import deliveryService from '@/services/api/deliveryService'
import { toast } from 'react-toastify'

const ActiveDeliveriesList = ({ deliveries, onUpdateStatus, onCaptureSignature }) => {
  const [signatureModal, setSignatureModal] = useState({
    isOpen: false,
    deliveryId: null,
    signature: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleCaptureSignature = (deliveryId) => {
    setSignatureModal({
      isOpen: true,
      deliveryId,
      signature: ''
    })
  }

  const handleSignatureChange = (e) => {
    setSignatureModal(prev => ({
      ...prev,
      signature: e.target.value
    }))
  }

  const handleSignatureSave = async () => {
    setIsLoading(true)
    try {
      // Update delivery status to indicate signature captured
      await deliveryService.update(signatureModal.deliveryId, {
        status: 'out_for_delivery',
        signatureInProgress: true
      })
      
      // Trigger parent component update
      if (onCaptureSignature) {
        onCaptureSignature(signatureModal.deliveryId, signatureModal.signature)
      }
      
      // Close modal after photos are captured
      setSignatureModal({
        isOpen: false,
        deliveryId: null,
        signature: ''
      })
    } catch (error) {
      console.error('Error processing delivery completion:', error)
      toast.error('Failed to complete delivery')
    } finally {
      setIsLoading(false)
    }
  }

const handleSignatureCancel = () => {
    setSignatureModal({
      isOpen: false,
      deliveryId: null,
      signature: ''
    });
  };

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
            onCaptureSignature={handleCaptureSignature}
          />
        ))}
      </div>
    )}

    {/* Signature and Photo Capture Modal */}
    <SignatureModal
      isOpen={signatureModal.isOpen}
      signature={signatureModal.signature}
      onSignatureChange={handleSignatureChange}
      onSave={handleSignatureSave}
      onCancel={handleSignatureCancel}
      isLoading={isLoading}
      deliveryId={signatureModal.deliveryId}
    />
  </motion.div>
)
}

export default ActiveDeliveriesList