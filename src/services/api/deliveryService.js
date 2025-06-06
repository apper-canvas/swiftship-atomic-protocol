import deliveriesData from '../mockData/deliveries.json'

class DeliveryService {
  constructor() {
    this.deliveries = [...deliveriesData]
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.deliveries]
  }

  async getById(id) {
    await this.delay()
    const delivery = this.deliveries.find(d => d.id === id)
    return delivery ? { ...delivery } : null
  }

  async create(deliveryData) {
    await this.delay()
    const newDelivery = {
      ...deliveryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    this.deliveries.unshift(newDelivery)
    return { ...newDelivery }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.deliveries.findIndex(d => d.id === id)
    if (index === -1) {
      throw new Error('Delivery not found')
    }
    
    this.deliveries[index] = { ...this.deliveries[index], ...updateData }
    return { ...this.deliveries[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.deliveries.findIndex(d => d.id === id)
    if (index === -1) {
      throw new Error('Delivery not found')
    }
    
    const deleted = this.deliveries.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default new DeliveryService()