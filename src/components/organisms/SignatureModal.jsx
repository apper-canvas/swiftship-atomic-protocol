import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Textarea from '@/components/atoms/Textarea'
import Button from '@/components/atoms/Button'
import Label from '@/components/atoms/Label'
import PhotoCaptureModal from './PhotoCaptureModal'
import deliveryService from '@/services/api/deliveryService'
import { toast } from 'react-toastify'

const SignatureModal = ({ 
  isOpen, 
  signature, 
  onSignatureChange, 
  onSave, 
  onCancel, 
  isLoading,
  deliveryId 
}) => {
  const [showPhotoCapture, setShowPhotoCapture] = useState(false)
  const [isCompletingDelivery, setIsCompletingDelivery] = useState(false)

  const handleSignatureSave = () => {
    // Show photo capture modal after signature
    setShowPhotoCapture(true)
  }

  const handlePhotosComplete = async (photos) => {
    setIsCompletingDelivery(true)
    try {
      // Save photos and complete delivery
      await deliveryService.completeDelivery(deliveryId, signature, photos)
      
      toast.success('Delivery completed with photos and signature!')
      setShowPhotoCapture(false)
      onSave() // Call the original onSave to update the parent component
    } catch (error) {
      console.error('Error completing delivery:', error)
      toast.error('Failed to complete delivery. Please try again.')
    } finally {
      setIsCompletingDelivery(false)
    }
  }

const handlePhotoCaptureClosed = () => {
    setShowPhotoCapture(false)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 max-w-md w-full"
            >
              <h4 className="text-xl font-bold text-surface-900 dark:text-white mb-4">
                Capture Signature
              </h4>
              
              <div className="mb-4">
                <Label htmlFor="customerSignature">
                  Customer Signature
                </Label>
                <Textarea
                  id="customerSignature"
                  value={signature}
                  onChange={onSignatureChange}
                  placeholder="Enter signature or confirmation..."
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={onCancel}
                  className="flex-1 px-4 py-3 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSignatureSave}
                  disabled={isLoading || isCompletingDelivery || !signature.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg disabled:opacity-50"
                >
                  {isLoading || isCompletingDelivery ? 'Processing...' : 'Next: Capture Photos'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Capture Modal */}
      <PhotoCaptureModal
        isOpen={showPhotoCapture}
        onClose={handlePhotoCaptureClosed}
        onComplete={handlePhotosComplete}
        deliveryId={deliveryId}
      />
    </>
  )
}

export default SignatureModal