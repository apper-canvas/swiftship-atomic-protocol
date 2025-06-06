import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import deliveryService from '../services/api/deliveryService'
import driverService from '../services/api/driverService'
import paymentService from '../services/api/paymentService'

function MainFeature() {
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

  const processPayment = async (deliveryId) => {
    if (!paymentForm.cardNumber || !paymentForm.expiryDate || !paymentForm.cvv) {
      toast.error('Please fill in all payment details')
      return
    }

    setLoading(true)
    try {
      const payment = await paymentService.create({
        deliveryId: deliveryId,
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

  const getStatusColor = (status) => {
    const colors = {
      'pickup_scheduled': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'picked_up': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'in_transit': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'out_for_delivery': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'delivered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  if (loading && deliveries.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-2xl p-2 border border-surface-200 dark:border-surface-700">
          {[
            { id: 'book', label: 'Book Delivery', icon: 'Plus' },
            { id: 'track', label: 'Track Packages', icon: 'MapPin' },
            { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
            { id: 'payment', label: 'Payment', icon: 'CreditCard' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg'
                  : 'text-surface-600 dark:text-surface-300 hover:text-primary'
              }`}
            >
              <ApperIcon name={tab.icon} className="mr-2 h-5 w-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-md rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'book' && (
              <motion.div
                key="book"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <h3 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">
                  Book New Delivery
                </h3>
                
                <form onSubmit={handleBookDelivery} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Pickup Address */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-surface-800 dark:text-surface-200 flex items-center">
                      <ApperIcon name="MapPin" className="mr-2 h-5 w-5 text-primary" />
                      Pickup Address
                    </h4>
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={bookingForm.pickupAddress.street}
                      onChange={(e) => setBookingForm(prev => ({
                        ...prev,
                        pickupAddress: { ...prev.pickupAddress, street: e.target.value }
                      }))}
                      className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={bookingForm.pickupAddress.city}
                        onChange={(e) => setBookingForm(prev => ({
                          ...prev,
                          pickupAddress: { ...prev.pickupAddress, city: e.target.value }
                        }))}
                        className="px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={bookingForm.pickupAddress.zipCode}
                        onChange={(e) => setBookingForm(prev => ({
                          ...prev,
                          pickupAddress: { ...prev.pickupAddress, zipCode: e.target.value }
                        }))}
                        className="px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-surface-800 dark:text-surface-200 flex items-center">
                      <ApperIcon name="Navigation" className="mr-2 h-5 w-5 text-accent" />
                      Delivery Address
                    </h4>
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={bookingForm.deliveryAddress.street}
                      onChange={(e) => setBookingForm(prev => ({
                        ...prev,
                        deliveryAddress: { ...prev.deliveryAddress, street: e.target.value }
                      }))}
                      className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={bookingForm.deliveryAddress.city}
                        onChange={(e) => setBookingForm(prev => ({
                          ...prev,
                          deliveryAddress: { ...prev.deliveryAddress, city: e.target.value }
                        }))}
                        className="px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={bookingForm.deliveryAddress.zipCode}
                        onChange={(e) => setBookingForm(prev => ({
                          ...prev,
                          deliveryAddress: { ...prev.deliveryAddress, zipCode: e.target.value }
                        }))}
                        className="px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Package Details */}
                  <div className="lg:col-span-2 space-y-4">
                    <h4 className="text-lg font-semibold text-surface-800 dark:text-surface-200 flex items-center">
                      <ApperIcon name="Package" className="mr-2 h-5 w-5 text-green-600" />
                      Package Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                        value={bookingForm.packageType}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, packageType: e.target.value }))}
                        className="px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="document">Document</option>
                        <option value="small_package">Small Package</option>
                        <option value="medium_package">Medium Package</option>
                        <option value="large_package">Large Package</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Special Instructions"
                        value={bookingForm.notes}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                        className="px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Booking...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <ApperIcon name="Send" className="mr-2 h-5 w-5" />
                          Book Delivery
                        </div>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'track' && (
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
                      <motion.div
                        key={delivery.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-surface-50 dark:bg-surface-700 rounded-xl p-6 border border-surface-200 dark:border-surface-600"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
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
                          
                          <div className="flex gap-2">
                            {delivery.status === 'out_for_delivery' && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setSelectedDelivery(delivery)
                                  setSignatureModal(true)
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <ApperIcon name="PenTool" className="h-4 w-4" />
                              </motion.button>
                            )}
                            
                            {delivery.status !== 'delivered' && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  const nextStatus = {
                                    'pickup_scheduled': 'picked_up',
                                    'picked_up': 'in_transit',
                                    'in_transit': 'out_for_delivery'
                                  }[delivery.status]
                                  if (nextStatus) {
                                    updateDeliveryStatus(delivery.id, nextStatus)
                                  }
                                }}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                              >
                                <ApperIcon name="ArrowRight" className="h-4 w-4" />
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'analytics' && (
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
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total Deliveries</p>
                        <p className="text-3xl font-bold">{deliveries.length}</p>
                      </div>
                      <ApperIcon name="Package" className="h-12 w-12 text-blue-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Completed</p>
                        <p className="text-3xl font-bold">
                          {deliveries.filter(d => d.status === 'delivered').length}
                        </p>
                      </div>
                      <ApperIcon name="CheckCircle" className="h-12 w-12 text-green-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-100">Success Rate</p>
                        <p className="text-3xl font-bold">
                          {deliveries.length > 0 
                            ? Math.round((deliveries.filter(d => d.status === 'delivered').length / deliveries.length) * 100)
                            : 0}%
                        </p>
                      </div>
                      <ApperIcon name="TrendingUp" className="h-12 w-12 text-amber-200" />
                    </div>
                  </div>
                </div>

                <div className="bg-surface-50 dark:bg-surface-700 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
                    Recent Activity
                  </h4>
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
            )}

            {activeTab === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <h3 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">
                  Payment Processing
                </h3>
                
                <div className="max-w-md mx-auto">
                  <div className="bg-gradient-to-r from-primary to-primary-light rounded-xl p-6 text-white mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm opacity-90">Delivery Fee</span>
                      <ApperIcon name="CreditCard" className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold">$25.99</div>
                    <div className="text-sm opacity-90 mt-2">Standard delivery rate</div>
                  </div>

                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={paymentForm.cardNumber}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={paymentForm.expiryDate}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          value={paymentForm.cvv}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, cvv: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={paymentForm.cardholderName}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, cardholderName: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => processPayment(deliveries[0]?.id)}
                      disabled={loading || deliveries.length === 0}
                      className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <ApperIcon name="Lock" className="mr-2 h-5 w-5" />
                          Process Payment
                        </div>
                      )}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Signature Modal */}
      <AnimatePresence>
        {signatureModal && (
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
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Customer Signature
                </label>
                <textarea
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Enter signature or confirmation..."
                  className="w-full h-24 px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSignatureModal(false)
                    setSignature('')
                  }}
                  className="flex-1 px-4 py-3 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignature}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Complete Delivery'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

export default MainFeature