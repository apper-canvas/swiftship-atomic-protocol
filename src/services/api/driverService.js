import driversData from '../mockData/drivers.json'

class DriverService {
  constructor() {
    this.drivers = [...driversData]
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.drivers]
  }

  async getById(id) {
    await this.delay()
    const driver = this.drivers.find(d => d.id === id)
    return driver ? { ...driver } : null
  }

  async create(driverData) {
    await this.delay()
    const newDriver = {
      ...driverData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    this.drivers.unshift(newDriver)
    return { ...newDriver }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.drivers.findIndex(d => d.id === id)
    if (index === -1) {
      throw new Error('Driver not found')
    }
    
    this.drivers[index] = { ...this.drivers[index], ...updateData }
    return { ...this.drivers[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.drivers.findIndex(d => d.id === id)
    if (index === -1) {
      throw new Error('Driver not found')
    }
    
    const deleted = this.drivers.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default new DriverService()