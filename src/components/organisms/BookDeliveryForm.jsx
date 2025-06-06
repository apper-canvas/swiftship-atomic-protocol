import React from 'react'
      import { motion } from 'framer-motion'
      import FormField from '@/components/molecules/FormField'
      import CardHeader from '@/components/atoms/CardHeader'
      import Button from '@/components/atoms/Button'
      import Spinner from '@/components/atoms/Spinner'
      import ApperIcon from '@/components/ApperIcon'

      const packageTypeOptions = [
        { value: 'document', label: 'Document' },
        { value: 'small_package', label: 'Small Package' },
        { value: 'medium_package', label: 'Medium Package' },
        { value: 'large_package', label: 'Large Package' }
      ]

      const BookDeliveryForm = ({ bookingForm, onFormChange, onSubmit, isLoading }) => {
        const handleAddressChange = (addressType, field) => (e) => {
          onFormChange(prev => ({
            ...prev,
            [addressType]: { ...prev[addressType], [field]: e.target.value }
          }))
        }

        return (
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
            
            <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pickup Address */}
              <div className="space-y-4">
                <CardHeader iconName="MapPin" iconClass="text-primary" title="Pickup Address" />
                <FormField
                  type="text"
                  placeholder="Street Address"
                  value={bookingForm.pickupAddress.street}
                  onChange={handleAddressChange('pickupAddress', 'street')}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    type="text"
                    placeholder="City"
                    value={bookingForm.pickupAddress.city}
                    onChange={handleAddressChange('pickupAddress', 'city')}
                  />
                  <FormField
                    type="text"
                    placeholder="ZIP Code"
                    value={bookingForm.pickupAddress.zipCode}
                    onChange={handleAddressChange('pickupAddress', 'zipCode')}
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-4">
                <CardHeader iconName="Navigation" iconClass="text-accent" title="Delivery Address" />
                <FormField
                  type="text"
                  placeholder="Street Address"
                  value={bookingForm.deliveryAddress.street}
                  onChange={handleAddressChange('deliveryAddress', 'street')}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    type="text"
                    placeholder="City"
                    value={bookingForm.deliveryAddress.city}
                    onChange={handleAddressChange('deliveryAddress', 'city')}
                  />
                  <FormField
                    type="text"
                    placeholder="ZIP Code"
                    value={bookingForm.deliveryAddress.zipCode}
                    onChange={handleAddressChange('deliveryAddress', 'zipCode')}
                  />
                </div>
              </div>

              {/* Package Details */}
              <div className="lg:col-span-2 space-y-4">
                <CardHeader iconName="Package" iconClass="text-green-600" title="Package Details" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    type="select"
                    value={bookingForm.packageType}
                    onChange={(e) => onFormChange(prev => ({ ...prev, packageType: e.target.value }))}
                    options={packageTypeOptions}
                  />
                  <FormField
                    type="text"
                    placeholder="Special Instructions"
                    value={bookingForm.notes}
                    onChange={(e) => onFormChange(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Spinner size="h-5 w-5" color="border-white" className="mr-2" />
                      Booking...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <ApperIcon name="Send" className="mr-2 h-5 w-5" />
                      Book Delivery
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )
      }

      export default BookDeliveryForm