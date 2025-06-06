import React from 'react'
      import { motion } from 'framer-motion'
      import FormField from '@/components/molecules/FormField'
      import Button from '@/components/atoms/Button'
      import Spinner from '@/components/atoms/Spinner'
      import ApperIcon from '@/components/ApperIcon'

      const PaymentForm = ({ paymentForm, onFormChange, onSubmit, isLoading, canProcess }) => {
        const handlePaymentChange = (e) => {
          onFormChange(prev => ({ ...prev, [e.target.name]: e.target.value }))
        }

        return (
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
                <FormField
                  label="Card Number"
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentForm.cardNumber}
                  onChange={handlePaymentChange}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Expiry Date"
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={paymentForm.expiryDate}
                    onChange={handlePaymentChange}
                  />
                  <FormField
                    label="CVV"
                    type="text"
                    name="cvv"
                    placeholder="123"
                    value={paymentForm.cvv}
                    onChange={handlePaymentChange}
                  />
                </div>

                <FormField
                  label="Cardholder Name"
                  type="text"
                  name="cardholderName"
                  placeholder="John Doe"
                  value={paymentForm.cardholderName}
                  onChange={handlePaymentChange}
                />

                <Button
                  type="button"
                  onClick={onSubmit}
                  disabled={isLoading || !canProcess}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Spinner size="h-5 w-5" color="border-white" className="mr-2" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <ApperIcon name="Lock" className="mr-2 h-5 w-5" />
                      Process Payment
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        )
      }

      export default PaymentForm