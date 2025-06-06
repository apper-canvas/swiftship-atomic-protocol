import paymentsData from '../mockData/payments.json'

class PaymentService {
  constructor() {
    this.payments = [...paymentsData]
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.payments]
  }

  async getById(id) {
    await this.delay()
    const payment = this.payments.find(p => p.id === id)
    return payment ? { ...payment } : null
  }

  async create(paymentData) {
    await this.delay()
    const newPayment = {
      ...paymentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    this.payments.unshift(newPayment)
    return { ...newPayment }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.payments.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Payment not found')
    }
    
    this.payments[index] = { ...this.payments[index], ...updateData }
    return { ...this.payments[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.payments.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Payment not found')
    }
    
    const deleted = this.payments.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default new PaymentService()