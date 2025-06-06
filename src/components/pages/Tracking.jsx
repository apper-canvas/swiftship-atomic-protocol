import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import Spinner from '@/components/atoms/Spinner'
import CardHeader from '@/components/atoms/CardHeader'
import deliveryService from '@/services/api/deliveryService'
import driverService from '@/services/api/driverService'
import { toast } from 'react-toastify'

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pickup_scheduled: { color: 'bg-yellow-100 text-yellow-800', text: 'Pickup Scheduled' },
    picked_up: { color: 'bg-blue-100 text-blue-800', text: 'Picked Up' },
    in_transit: { color: 'bg-purple-100 text-purple-800', text: 'In Transit' },
    out_for_delivery: { color: 'bg-orange-100 text-orange-800', text: 'Out for Delivery' },
    delivered: { color: 'bg-green-100 text-green-800', text: 'Delivered' }
  }

  const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      {config.text}
    </span>
  )
}

const DeliveryTimeline = ({ delivery, driver }) => {
  const timelineEvents = [
    { status: 'pickup_scheduled', icon: 'Calendar', label: 'Pickup Scheduled' },
    { status: 'picked_up', icon: 'Package', label: 'Package Picked Up' },
    { status: 'in_transit', icon: 'Truck', label: 'In Transit' },
    { status: 'out_for_delivery', icon: 'Navigation', label: 'Out for Delivery' },
    { status: 'delivered', icon: 'CheckCircle', label: 'Delivered' }
  ]

  const currentStatusIndex = timelineEvents.findIndex(event => event.status === delivery.status)

  return (
    <div className="space-y-4">
      {timelineEvents.map((event, index) => {
        const isCompleted = index <= currentStatusIndex
        const isCurrent = index === currentStatusIndex

        return (
          <div key={event.status} className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isCompleted 
                ? isCurrent 
                  ? 'bg-primary text-white animate-pulse' 
                  : 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-400'
            }`}>
              <ApperIcon name={event.icon} className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className={`font-medium ${isCompleted ? 'text-surface-900 dark:text-white' : 'text-surface-400'}`}>
                {event.label}
              </p>
              {isCurrent && delivery.eta && (
                <p className="text-sm text-surface-500">
                  ETA: {new Date(delivery.eta).toLocaleString()}
                </p>
              )}
              {isCompleted && event.status === 'delivered' && delivery.signature && (
                <p className="text-sm text-green-600">
                  Signed by: {delivery.signature}
                </p>
              )}
            </div>
            {isCurrent && (
              <div className="text-primary">
                <ApperIcon name="Clock" className="h-5 w-5" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

const Tracking = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDelivery, setSelectedDelivery] = useState(null)
  const [data, setData] = useState({
    deliveries: [],
    drivers: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    loadTrackingData()
  }, [])

  const loadTrackingData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }))
      
      const [deliveries, drivers] = await Promise.all([
        deliveryService.getAll(),
        driverService.getAll()
      ])

      setData({
        deliveries,
        drivers,
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Error loading tracking data:', error)
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load tracking data'
      }))
      toast.error('Failed to load tracking data')
    }
  }

  const filteredDeliveries = data.deliveries.filter(delivery =>
    delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.deliveryAddress?.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.deliveryAddress?.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getDriverForDelivery = (driverId) => {
    return data.drivers.find(driver => driver.id === driverId)
  }

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="h-12 w-12" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
            Package Tracking
          </h1>
          <p className="text-surface-600 dark:text-surface-400 mt-2">
            Track your deliveries in real-time
          </p>
        </div>
        <Button 
          onClick={loadTrackingData}
          className="bg-primary hover:bg-primary-dark text-white"
        >
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg p-6">
        <CardHeader title="Search Deliveries" className="mb-4" />
        <div className="relative">
          <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-400" />
          <Input
            type="text"
            placeholder="Search by delivery ID, address, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Deliveries List */}
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg p-6">
          <CardHeader title="Active Deliveries" className="mb-6" />
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredDeliveries.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Package" className="h-16 w-16 text-surface-400 mx-auto mb-4" />
                <p className="text-surface-500">No deliveries found</p>
              </div>
            ) : (
              filteredDeliveries.map((delivery) => {
                const driver = getDriverForDelivery(delivery.driverId)
                return (
                  <div 
                    key={delivery.id}
                    onClick={() => setSelectedDelivery(delivery)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedDelivery?.id === delivery.id
                        ? 'bg-primary-light/20 border-2 border-primary'
                        : 'bg-surface-50 dark:bg-surface-700 hover:bg-surface-100 dark:hover:bg-surface-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-surface-900 dark:text-white">
                        #{delivery.id}
                      </span>
                      <StatusBadge status={delivery.status} />
                    </div>
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      To: {delivery.deliveryAddress?.street}, {delivery.deliveryAddress?.city}
                    </p>
                    {driver && (
                      <p className="text-xs text-surface-500 mt-1">
                        Driver: {driver.name}
                      </p>
                    )}
                    {delivery.eta && (
                      <p className="text-xs text-primary mt-1">
                        ETA: {new Date(delivery.eta).toLocaleString()}
                      </p>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg p-6">
          {selectedDelivery ? (
            <div>
              <CardHeader 
                title={`Delivery #${selectedDelivery.id}`} 
                className="mb-6" 
              />
              
              {/* Driver Info */}
              {(() => {
                const driver = getDriverForDelivery(selectedDelivery.driverId)
                return driver ? (
                  <div className="mb-6 p-4 bg-surface-50 dark:bg-surface-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <ApperIcon name="User" className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-surface-900 dark:text-white">
                          {driver.name}
                        </p>
                        <p className="text-sm text-surface-500">
                          {driver.vehicle?.type} - {driver.vehicle?.licensePlate}
                        </p>
                        <p className="text-sm text-surface-500">
                          {driver.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null
              })()}

              {/* Address Info */}
              <div className="mb-6 space-y-4">
                <div className="p-4 bg-surface-50 dark:bg-surface-700 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="MapPin" className="h-5 w-5 text-primary" />
                    <span className="font-medium text-surface-900 dark:text-white">
                      Pickup Address
                    </span>
                  </div>
                  <p className="text-surface-600 dark:text-surface-400">
                    {selectedDelivery.pickupAddress?.street}<br />
                    {selectedDelivery.pickupAddress?.city}, {selectedDelivery.pickupAddress?.zipCode}
                  </p>
                </div>
                <div className="p-4 bg-surface-50 dark:bg-surface-700 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="Navigation" className="h-5 w-5 text-accent" />
                    <span className="font-medium text-surface-900 dark:text-white">
                      Delivery Address
                    </span>
                  </div>
                  <p className="text-surface-600 dark:text-surface-400">
                    {selectedDelivery.deliveryAddress?.street}<br />
                    {selectedDelivery.deliveryAddress?.city}, {selectedDelivery.deliveryAddress?.zipCode}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-medium text-surface-900 dark:text-white mb-4">
                  Delivery Timeline
                </h4>
                <DeliveryTimeline 
                  delivery={selectedDelivery} 
                  driver={getDriverForDelivery(selectedDelivery.driverId)} 
                />
              </div>

              {/* Package Details */}
              {selectedDelivery.notes && (
                <div className="mt-6 p-4 bg-surface-50 dark:bg-surface-700 rounded-lg">
                  <h4 className="font-medium text-surface-900 dark:text-white mb-2">
                    Special Instructions
                  </h4>
                  <p className="text-surface-600 dark:text-surface-400">
                    {selectedDelivery.notes}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <ApperIcon name="MousePointer" className="h-16 w-16 text-surface-400 mx-auto mb-4" />
              <p className="text-surface-500">Select a delivery to view details</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Tracking