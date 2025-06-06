import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Spinner from '@/components/atoms/Spinner'
import CardHeader from '@/components/atoms/CardHeader'
import deliveryService from '@/services/api/deliveryService'
import driverService from '@/services/api/driverService'
import { toast } from 'react-toastify'

const StatCard = ({ title, value, icon, iconColor, bgColor, trend }) => (
  <div className={`rounded-xl p-6 text-white ${bgColor} shadow-lg`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        {trend && (
          <p className="text-xs opacity-75 mt-1">
            <span className={trend > 0 ? 'text-green-200' : 'text-red-200'}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
            </span>
            {' vs last week'}
          </p>
        )}
      </div>
      <ApperIcon name={icon} className={`h-12 w-12 ${iconColor}`} />
    </div>
  </div>
)

const Dashboard = () => {
  const [data, setData] = useState({
    deliveries: [],
    drivers: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
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
      console.error('Error loading dashboard data:', error)
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load dashboard data'
      }))
      toast.error('Failed to load dashboard data')
    }
  }

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="h-12 w-12" />
      </div>
    )
  }

  const stats = {
    totalDeliveries: data.deliveries.length,
    activeDeliveries: data.deliveries.filter(d => 
      ['picked_up', 'in_transit', 'out_for_delivery'].includes(d.status)
    ).length,
    completedToday: data.deliveries.filter(d => 
      d.status === 'delivered' && 
      new Date(d.completedAt || d.createdAt).toDateString() === new Date().toDateString()
    ).length,
    activeDrivers: data.drivers.filter(d => d.status === 'active').length,
    availableDrivers: data.drivers.filter(d => d.status === 'available').length
  }

  const recentDeliveries = data.deliveries
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

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
            Dashboard
          </h1>
          <p className="text-surface-600 dark:text-surface-400 mt-2">
            Welcome back! Here's what's happening with your deliveries today.
          </p>
        </div>
        <Button 
          onClick={loadDashboardData}
          className="bg-primary hover:bg-primary-dark text-white"
        >
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Deliveries"
          value={stats.totalDeliveries}
          icon="Package"
          iconColor="text-blue-200"
          bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
          trend={12}
        />
        <StatCard
          title="Active Deliveries"
          value={stats.activeDeliveries}
          icon="Truck"
          iconColor="text-orange-200"
          bgColor="bg-gradient-to-r from-orange-500 to-orange-600"
          trend={-3}
        />
        <StatCard
          title="Completed Today"
          value={stats.completedToday}
          icon="CheckCircle"
          iconColor="text-green-200"
          bgColor="bg-gradient-to-r from-green-500 to-green-600"
          trend={8}
        />
        <StatCard
          title="Active Drivers"
          value={`${stats.activeDrivers}/${data.drivers.length}`}
          icon="Users"
          iconColor="text-purple-200"
          bgColor="bg-gradient-to-r from-purple-500 to-purple-600"
          trend={5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Deliveries */}
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg p-6">
          <CardHeader title="Recent Deliveries" className="mb-6" />
          <div className="space-y-4">
            {recentDeliveries.length === 0 ? (
              <p className="text-surface-500 text-center py-8">No recent deliveries</p>
            ) : (
              recentDeliveries.map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      delivery.status === 'delivered' ? 'bg-green-500' :
                      delivery.status === 'out_for_delivery' ? 'bg-orange-500' :
                      delivery.status === 'in_transit' ? 'bg-blue-500' : 'bg-gray-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-surface-900 dark:text-white">
                        {delivery.deliveryAddress?.street || 'Unknown Address'}
                      </p>
                      <p className="text-sm text-surface-500">
                        {delivery.deliveryAddress?.city}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-surface-700 dark:text-surface-300 capitalize">
                      {delivery.status.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-surface-500">
                      {new Date(delivery.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Driver Status */}
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg p-6">
          <CardHeader title="Driver Status" className="mb-6" />
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-surface-900 dark:text-white">Active</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{stats.activeDrivers}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-surface-900 dark:text-white">Available</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{stats.availableDrivers}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="font-medium text-surface-900 dark:text-white">Off Duty</span>
              </div>
              <span className="text-2xl font-bold text-gray-600">
                {data.drivers.filter(d => d.status === 'off_duty').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg p-6">
        <CardHeader title="Quick Actions" className="mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button className="bg-primary hover:bg-primary-dark text-white p-4 h-auto">
            <div className="text-center">
              <ApperIcon name="Plus" className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">New Delivery</p>
            </div>
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white p-4 h-auto">
            <div className="text-center">
              <ApperIcon name="MapPin" className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">Track Delivery</p>
            </div>
          </Button>
          <Button className="bg-green-500 hover:bg-green-600 text-white p-4 h-auto">
            <div className="text-center">
              <ApperIcon name="BarChart3" className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">View Analytics</p>
            </div>
          </Button>
          <Button className="bg-purple-500 hover:bg-purple-600 text-white p-4 h-auto">
            <div className="text-center">
              <ApperIcon name="Users" className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">Manage Drivers</p>
            </div>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard