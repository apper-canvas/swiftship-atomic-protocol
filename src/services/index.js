import deliveryServiceDefault from './api/deliveryService'
import driverServiceDefault from './api/driverService'
import paymentServiceDefault from './api/paymentService'

export { default as deliveryService } from './api/deliveryService'
export { default as driverService } from './api/driverService'
export { default as paymentService } from './api/paymentService'

// Re-export all services for easy importing
export default {
  deliveryService: deliveryServiceDefault,
  driverService: driverServiceDefault,
  paymentService: paymentServiceDefault
}