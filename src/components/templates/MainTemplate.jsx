import React from 'react'
      import { useState, useEffect } from 'react'
      import { motion } from 'framer-motion'
      import { toast } from 'react-toastify'
      import deliveryService from '@/services/api/deliveryService'
      import driverService from '@/services/api/driverService'
      import paymentService from '@/services/api/paymentService'

      import TabNavigation from '@/components/organisms/TabNavigation'
      import BookDeliveryForm from '@/components/organisms/BookDeliveryForm'
      import ActiveDeliveriesList from '@/components/organisms/ActiveDeliveriesList'
      import DeliveryAnalytics from '@/components/organisms/DeliveryAnalytics'
      import PaymentForm from '@/components/organisms/PaymentForm'
      import SignatureModal from '@/components/organisms/SignatureModal'
      import Spinner from '@/components/atoms/Spinner'
      import { AnimatePresence } from 'framer-motion'

      const MainTemplate = () => {
        const [activeTab, setActiveTab] = useState('book')
        const [deliveries, setDeliveries] = useState([])
        const [drivers, setDrivers] = useState([])
        const [loading, setLoading] = useState(false)
        const [error, setError] = useState(null)
        const [bookingForm, setBookingForm] = useState({
          pickupAddress: { street: '', city: '', zipCode: '' },
          deliveryAddress: { street: '', city: '', zipCode: '' },
          packageType: 'document',
          notes: ''
        })
        const [selectedDelivery, setSelectedDelivery] = useState(null)
        const [signatureModal, setSignatureModal] = useState(false)
        const [signature, setSignature] = useState('')
        const [paymentForm, setPaymentForm] = useState({
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          cardholderName: ''
        })

        useEffect(() => {
          loadData()
        }, [])

        const loadData = async () => {
          setLoading(true)
          try {
            const [deliveriesData, driversData] = await Promise.all([
              deliveryService.getAll(),
              driverService.getAll()
            ])
            setDeliveries(deliveriesData || [])
            setDrivers(driversData || [])
          } catch (err) {
            setError(err.message)
            toast.error('Failed to load data')
          } finally {
            setLoading(false)
          }
        }

        const handleBookDelivery = async (e) => {
          e.preventDefault()
          if (!bookingForm.pickupAddress.street || !bookingForm.deliveryAddress.street) {
            toast.error('Please fill in all required address fields')
            return
          }

          setLoading(true)
          try {
            // Find available driver
            const availableDriver = drivers.find(d => d.activeDeliveries?.length < 3) || drivers[0]
            
            const newDelivery = {
              pickupAddress: bookingForm.pickupAddress,
              deliveryAddress: bookingForm.deliveryAddress,
              packageType: bookingForm.packageType,
              notes: bookingForm.notes,
              status: 'pickup_scheduled',
              driverId: availableDriver?.id,
              eta: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
              signature: null
            }

            const createdDelivery = await deliveryService.create(newDelivery)
            setDeliveries(prev => [createdDelivery, ...prev])
            
            // Reset form
            setBookingForm({
              pickupAddress: { street: '', city: '', zipCode: '' },
              deliveryAddress: { street: '', city: '', zipCode: '' },
              packageType: 'document',
              notes: ''
            })
            
            toast.success('Delivery booked successfully!')
            setActiveTab('track')
          } catch (err) {
            setError(err.message)
            toast.error('Failed to book delivery')
          } finally {
            setLoading(false)
          }
        }

        const updateDeliveryStatus = async (deliveryId, newStatus) => {
          setLoading(true)
          try {
            const updatedDelivery = await deliveryService.update(deliveryId, { status: newStatus })
            setDeliveries(prev => prev.map(d => d.id === deliveryId ? updatedDelivery : d))
            toast.success(`Delivery status updated to ${newStatus.replace('_', ' ')}`)
          } catch (err) {
            toast.error('Failed to update delivery status')
          } finally {
            setLoading(false)
          }
        }

        const handleSignature = async () => {
          if (!signature.trim()) {
            toast.error('Please provide a signature')
            return
          }

          setLoading(true)
          try {
            const updatedDelivery = await deliveryService.update(selectedDelivery.id, {
              signature: signature,
              status: 'delivered'
            })
            setDeliveries(prev => prev.map(d => d.id === selectedDelivery.id ? updatedDelivery : d))
            setSignatureModal(false)
            setSignature('')
            setSelectedDelivery(null)
            toast.success('Delivery completed with signature!')
          } catch (err) {
            toast.error('Failed to save signature')
          } finally {
            setLoading(false)
          }
        }

        const processPayment = async () => {
          if (!paymentForm.cardNumber || !paymentForm.expiryDate || !paymentForm.cvv) {
            toast.error('Please fill in all payment details')
            return
          }

          setLoading(true)
          try {
            // Assuming we're processing payment for the first delivery in the list as per original logic
            const targetDeliveryId = deliveries[0]?.id
            if (!targetDeliveryId) {
              toast.error('No delivery to process payment for.')
              setLoading(false)
              return
            }

            const payment = await paymentService.create({
              deliveryId: targetDeliveryId,
              amount: 25.99, // Base delivery fee
              method: 'card',
              status: 'completed'
            })
            
            toast.success('Payment processed successfully!')
            setPaymentForm({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' })
          } catch (err) {
            toast.error('Payment processing failed')
          } finally {
            setLoading(false)
          }
        }

        if (loading && deliveries.length === 0) {
          return (
            <div className="flex items-center justify-center py-20">
              <Spinner size="h-12 w-12" color="border-primary" />
            </div>
          )
        }

return (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="container-mobile sm:px-6 lg:px-8 py-6 sm:py-12"
          >
            <div className="max-w-7xl mx-auto">
              <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

              <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-md rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                <AnimatePresence mode="wait">
                  {activeTab === 'book' && (
                    <BookDeliveryForm
                      bookingForm={bookingForm}
                      onFormChange={setBookingForm}
                      onSubmit={handleBookDelivery}
                      isLoading={loading}
                    />
                  )}

                  {activeTab === 'track' && (
                    <ActiveDeliveriesList
                      deliveries={deliveries}
                      onUpdateStatus={updateDeliveryStatus}
                      onCaptureSignature={(delivery) => {
                        setSelectedDelivery(delivery)
                        setSignatureModal(true)
                      }}
                    />
                  )}

                  {activeTab === 'analytics' && (
                    <DeliveryAnalytics deliveries={deliveries} />
                  )}

                  {activeTab === 'payment' && (
                    <PaymentForm
                      paymentForm={paymentForm}
                      onFormChange={setPaymentForm}
                      onSubmit={processPayment}
                      isLoading={loading}
                      canProcess={deliveries.length > 0}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>

            <SignatureModal
              isOpen={signatureModal}
              signature={signature}
              onSignatureChange={(e) => setSignature(e.target.value)}
              onSave={handleSignature}
              onCancel={() => {
                setSignatureModal(false)
                setSignature('')
              }}
              isLoading={loading}
            />
          </motion.section>
        )
      }

      export default MainTemplate