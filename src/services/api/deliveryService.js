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
  async completeDelivery(id, signatureData, photos = []) {
    await this.delay()
    const index = this.deliveries.findIndex(d => d.id === id)
    if (index === -1) {
      throw new Error('Delivery not found')
    }

    const completionData = {
      status: 'delivered',
      completedAt: new Date().toISOString(),
      signature: signatureData,
      photos: photos.map((photo, index) => ({
        id: `photo_${Date.now()}_${index}`,
        type: photo.type,
        url: photo.url,
        capturedAt: new Date().toISOString()
      })),
      proofOfDelivery: {
        signatureCaptured: !!signatureData,
        photosCaptured: photos.length,
        completionMethod: 'mobile_app'
      }
    }

    this.deliveries[index] = { ...this.deliveries[index], ...completionData }
    return { ...this.deliveries[index] }
  }

  async savePhotos(deliveryId, photos) {
    await this.delay()
    // Simulate photo storage - in real app this would upload to cloud storage
    const savedPhotos = photos.map((photo, index) => ({
      id: `photo_${Date.now()}_${index}`,
      deliveryId,
      type: photo.type,
      url: photo.dataUrl,
      size: photo.size || 0,
      capturedAt: new Date().toISOString()
    }))
    
    return savedPhotos
  }
}