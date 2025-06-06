import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Webcam from 'react-webcam'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { toast } from 'react-toastify'

const PhotoCaptureModal = ({ isOpen, onClose, onComplete, deliveryId }) => {
  const webcamRef = useRef(null)
  const [currentStep, setCurrentStep] = useState('package') // 'package' | 'location' | 'review'
  const [photos, setPhotos] = useState({ package: null, location: null })
  const [isCapturing, setIsCapturing] = useState(false)
  const [flashActive, setFlashActive] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: { ideal: 'environment' }
  }

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep('package')
      setPhotos({ package: null, location: null })
      setCameraError(null)
      setIsSubmitting(false)
    }
  }, [isOpen])

  const handleCameraError = useCallback((error) => {
    console.error('Camera error:', error)
    setCameraError('Unable to access camera. Please check permissions.')
    toast.error('Camera access denied. Please enable camera permissions.')
  }, [])

  const capturePhoto = useCallback(() => {
    if (!webcamRef.current) return

    setIsCapturing(true)
    setFlashActive(true)

    // Flash effect
    setTimeout(() => {
      const imageSrc = webcamRef.current.getScreenshot({
        width: 1280,
        height: 720,
        screenshotFormat: 'image/jpeg',
        screenshotQuality: 0.8
      })

      if (imageSrc) {
        const newPhotos = {
          ...photos,
          [currentStep]: {
            dataUrl: imageSrc,
            type: currentStep,
            capturedAt: new Date().toISOString(),
            size: Math.round(imageSrc.length * 0.75) // Approximate file size
          }
        }
        setPhotos(newPhotos)
        toast.success(`${currentStep === 'package' ? 'Package' : 'Location'} photo captured!`)
      }

      setFlashActive(false)
      setIsCapturing(false)
    }, 100)
  }, [currentStep, photos])

  const retakePhoto = () => {
    setPhotos({
      ...photos,
      [currentStep]: null
    })
    toast.info('Ready to retake photo')
  }

  const nextStep = () => {
    if (currentStep === 'package' && photos.package) {
      setCurrentStep('location')
    } else if (currentStep === 'location' && photos.location) {
      setCurrentStep('review')
    }
  }

  const previousStep = () => {
    if (currentStep === 'location') {
      setCurrentStep('package')
    } else if (currentStep === 'review') {
      setCurrentStep('location')
    }
  }

  const handleComplete = async () => {
    if (!photos.package || !photos.location) {
      toast.error('Please capture both package and location photos')
      return
    }

    setIsSubmitting(true)
    try {
      const photoArray = [photos.package, photos.location]
      await onComplete(photoArray)
      toast.success('Photos saved successfully!')
      onClose()
    } catch (error) {
      console.error('Error saving photos:', error)
      toast.error('Failed to save photos. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 'package': return 'Capture Package Photo'
      case 'location': return 'Capture Delivery Location'
      case 'review': return 'Review Photos'
      default: return 'Capture Photos'
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 'package': return 'Take a clear photo of the package to be delivered'
      case 'location': return 'Capture the delivery location for proof of delivery'
      case 'review': return 'Review and confirm both photos before submitting'
      default: return ''
    }
  }

  if (cameraError) {
    return (
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
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 max-w-md w-full text-center"
            >
              <ApperIcon name="AlertCircle" className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
                Camera Access Required
              </h3>
              <p className="text-surface-600 dark:text-surface-400 mb-6">
                {cameraError}
              </p>
              <Button
                onClick={onClose}
                className="w-full px-4 py-3 bg-primary hover:bg-primary-dark text-white"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex flex-col"
        >
          {/* Flash overlay */}
          {flashActive && (
            <div className="absolute inset-0 bg-white z-10 camera-flash" />
          )}

          {/* Header */}
          <div className="relative z-20 p-4 bg-surface-900/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  onClick={onClose}
                  className="p-2 bg-surface-800 hover:bg-surface-700 text-white rounded-full"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </Button>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {getStepTitle()}
                  </h3>
                  <p className="text-sm text-surface-300">
                    {getStepDescription()}
                  </p>
                </div>
              </div>
              <div className="text-sm text-surface-300">
                Step {currentStep === 'package' ? '1' : currentStep === 'location' ? '2' : '3'} of 3
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative z-20 px-4 pb-2">
            <div className="w-full bg-surface-800 rounded-full h-1">
              <div 
                className="bg-primary h-1 rounded-full transition-all duration-300"
                style={{ 
                  width: currentStep === 'package' ? '33%' : 
                         currentStep === 'location' ? '66%' : '100%' 
                }}
              />
            </div>
          </div>

          {/* Camera/Review Content */}
          <div className="flex-1 relative">
            {currentStep !== 'review' ? (
              <>
                {/* Camera view */}
                <div className="absolute inset-0">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    onUserMediaError={handleCameraError}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 camera-overlay" />
                </div>

                {/* Photo preview overlay */}
                {photos[currentStep] && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-surface-900/80 rounded-lg p-2">
                      <img
                        src={photos[currentStep].dataUrl}
                        alt={`${currentStep} preview`}
                        className="w-20 h-16 object-cover rounded"
                      />
                      <div className="text-xs text-white text-center mt-1">
                        ✓ Captured
                      </div>
                    </div>
                  </div>
                )}

                {/* Camera controls */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-center gap-6">
                    {currentStep !== 'package' && (
                      <Button
                        onClick={previousStep}
                        className="p-3 bg-surface-800 hover:bg-surface-700 text-white rounded-full"
                      >
                        <ApperIcon name="ChevronLeft" className="h-6 w-6" />
                      </Button>
                    )}

                    {!photos[currentStep] ? (
                      <Button
                        onClick={capturePhoto}
                        disabled={isCapturing}
                        className="w-20 h-20 bg-white hover:bg-surface-100 text-surface-900 rounded-full flex items-center justify-center shadow-lg border-4 border-surface-300"
                      >
                        <ApperIcon name="Camera" className="h-8 w-8" />
                      </Button>
                    ) : (
                      <div className="flex gap-4">
                        <Button
                          onClick={retakePhoto}
                          className="px-6 py-3 bg-surface-800 hover:bg-surface-700 text-white rounded-full"
                        >
                          <ApperIcon name="RotateCcw" className="h-5 w-5 mr-2" />
                          Retake
                        </Button>
                        <Button
                          onClick={nextStep}
                          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full"
                        >
                          {currentStep === 'location' ? 'Review' : 'Next'}
                          <ApperIcon name="ChevronRight" className="h-5 w-5 ml-2" />
                        </Button>
                      </div>
                    )}

                    {currentStep === 'location' && photos.package && (
                      <Button
                        onClick={() => setCurrentStep('review')}
                        className="p-3 bg-surface-800 hover:bg-surface-700 text-white rounded-full"
                      >
                        <ApperIcon name="ChevronRight" className="h-6 w-6" />
                      </Button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* Review step */
              <div className="p-6 bg-surface-900 h-full overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                  <h4 className="text-xl font-bold text-white mb-6 text-center">
                    Review Captured Photos
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Package photo */}
                    <div className="bg-surface-800 rounded-lg p-4">
                      <h5 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <ApperIcon name="Package" className="h-5 w-5" />
                        Package Photo
                      </h5>
                      {photos.package && (
                        <div className="space-y-3">
                          <img
                            src={photos.package.dataUrl}
                            alt="Package"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="text-sm text-surface-300">
                            Captured: {new Date(photos.package.capturedAt).toLocaleTimeString()}
                          </div>
                          <Button
                            onClick={() => setCurrentStep('package')}
                            className="w-full px-4 py-2 bg-surface-700 hover:bg-surface-600 text-white rounded-lg"
                          >
                            Retake Package Photo
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Location photo */}
                    <div className="bg-surface-800 rounded-lg p-4">
                      <h5 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <ApperIcon name="MapPin" className="h-5 w-5" />
                        Location Photo
                      </h5>
                      {photos.location && (
                        <div className="space-y-3">
                          <img
                            src={photos.location.dataUrl}
                            alt="Delivery location"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="text-sm text-surface-300">
                            Captured: {new Date(photos.location.capturedAt).toLocaleTimeString()}
                          </div>
                          <Button
                            onClick={() => setCurrentStep('location')}
                            className="w-full px-4 py-2 bg-surface-700 hover:bg-surface-600 text-white rounded-lg"
                          >
                            Retake Location Photo
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={previousStep}
                      className="flex-1 px-6 py-4 bg-surface-700 hover:bg-surface-600 text-white rounded-lg"
                    >
                      <ApperIcon name="ChevronLeft" className="h-5 w-5 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleComplete}
                      disabled={isSubmitting || !photos.package || !photos.location}
                      className="flex-1 px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-surface-600 text-white rounded-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <ApperIcon name="Loader2" className="h-5 w-5 mr-2 animate-spin" />
                          Saving Photos...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Check" className="h-5 w-5 mr-2" />
                          Complete Delivery
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PhotoCaptureModal