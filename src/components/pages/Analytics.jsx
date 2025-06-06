import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Spinner from '@/components/atoms/Spinner'
import CardHeader from '@/components/atoms/CardHeader'
import Select from '@/components/atoms/Select'
import deliveryService from '@/services/api/deliveryService'
import driverService from '@/services/api/driverService'
import { toast } from 'react-toastify'

const MetricCard = ({ title, value, change, icon, iconColor, bgColor }) => (
  <div className={`rounded-xl p-6 text-white ${bgColor} shadow-lg`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        {change && (
          <p className="text-xs opacity-75 mt-1">
            <span className={change > 0 ? 'text-green-200' : 'text-red-200'}>
              {change > 0 ? '↗' : '↘'} {Math.abs(change)}%
            </span>
            {' vs last period'}
          </p>
        )}
      </div>
      <ApperIcon name={icon} className={`h-12 w-12 ${iconColor}`} />
    </div>
  </div>
)

const PerformanceChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg p-6">
      <CardHeader title={title} className="mb-6" />
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-24 text-sm text-surface-600 dark:text-surface-400">
              {item.label}
            </div>
            <div className="flex-1 bg-surface-100 dark:bg-surface-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary to-primary-light h-3 rounded-full transition-all duration-300"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
            <div className="w-16 text-right text-sm font-medium text-surface-900 dark:text-white">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week')
  const [data, setData] = useState({
    deliveries: [],
    drivers: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange])

  const loadAnalyticsData = async () => {
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
      console.error('Error loading analytics data:', error)
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load analytics data'
      }))
      toast.error('Failed to load analytics data')
    }
  }

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="h-12 w-12" />
      </div>
    )
  }

  // Calculate analytics metrics
  const metrics = {
    totalDeliveries: data.deliveries.length,
    completedDeliveries: data.deliveries.filter(d => d.status === 'delivered').length,
    averageDeliveryTime: 2.4, // hours - calculated from sample data
    customerSatisfaction: 4.8,
    onTimeDelivery: Math.round((data.deliveries.filter(d => d.status === 'delivered').length / data.deliveries.length) * 100) || 0
  }

  // Delivery status breakdown
  const statusBreakdown = [
    { 
      label: 'Delivered', 
      value: data.deliveries.filter(d => d.status === 'delivered').length,
      color: 'bg-green-500'
    },
    { 
      label: 'In Transit', 
      value: data.deliveries.filter(d => d.status === 'in_transit').length,
      color: 'bg-blue-500'
    },
    { 
      label: 'Out for Delivery', 
      value: data.deliveries.filter(d => d.status === 'out_for_delivery').length,
      color: 'bg-orange-500'
    },
    { 
      label: 'Picked Up', 
      value: data.deliveries.filter(d => d.status === 'picked_up').length,
      color: 'bg-purple-500'
    },
    { 
      label: 'Scheduled', 
      value: data.deliveries.filter(d => d.status === 'pickup_scheduled').length,
      color: 'bg-yellow-500'
    }
  ]

  // Driver performance data
  const driverPerformance = data.drivers.map(driver => ({
    label: driver.name,
    value: driver.totalDeliveries || 0,
    rating: driver.rating || 0
  })).sort((a, b) => b.value - a.value).slice(0, 8)

  // Package type distribution
  const packageTypes = [
    { 
      label: 'Documents', 
      value: data.deliveries.filter(d => d.packageType === 'document').length
    },
    { 
      label: 'Small Packages', 
      value: data.deliveries.filter(d => d.packageType === 'small_package').length
    },
    { 
      label: 'Medium Packages', 
      value: data.deliveries.filter(d => d.packageType === 'medium_package').length
    },
    { 
      label: 'Large Packages', 
      value: data.deliveries.filter(d => d.packageType === 'large_package').length
    }
  ]

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
            Analytics Dashboard
          </h1>
          <p className="text-surface-600 dark:text-surface-400 mt-2">
            Comprehensive insights into your delivery operations
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={[
              { value: 'day', label: 'Today' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'year', label: 'This Year' }
            ]}
            className="w-40"
          />
          <Button 
            onClick={loadAnalyticsData}
            className="bg-primary hover:bg-primary-dark text-white"
          >
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total Deliveries"
          value={metrics.totalDeliveries}
          change={15}
          icon="Package"
          iconColor="text-blue-200"
          bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <MetricCard
          title="Completed"
          value={metrics.completedDeliveries}
          change={8}
          icon="CheckCircle"
          iconColor="text-green-200"
          bgColor="bg-gradient-to-r from-green-500 to-green-600"
        />
        <MetricCard
          title="Avg. Delivery Time"
          value={`${metrics.averageDeliveryTime}h`}
          change={-12}
          icon="Clock"
          iconColor="text-orange-200"
          bgColor="bg-gradient-to-r from-orange-500 to-orange-600"
        />
        <MetricCard
          title="Customer Rating"
          value={metrics.customerSatisfaction}
          change={5}
          icon="Star"
          iconColor="text-yellow-200"
          bgColor="bg-gradient-to-r from-yellow-500 to-yellow-600"
        />
        <MetricCard
          title="On-Time Rate"
          value={`${metrics.onTimeDelivery}%`}
          change={3}
          icon="Target"
          iconColor="text-purple-200"
          bgColor="bg-gradient-to-r from-purple-500 to-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Delivery Status Breakdown */}
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg p-6">
          <CardHeader title="Delivery Status Breakdown" className="mb-6" />
          <div className="space-y-4">
            {statusBreakdown.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${status.color}`}></div>
                  <span className="text-surface-700 dark:text-surface-300">
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-surface-900 dark:text-white">
                    {status.value}
                  </span>
                  <span className="text-sm text-surface-500">
                    ({data.deliveries.length > 0 ? Math.round((status.value / data.deliveries.length) * 100) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Package Type Distribution */}
        <PerformanceChart
          data={packageTypes}
          title="Package Type Distribution"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Driver Performance */}
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg p-6">
          <CardHeader title="Top Performing Drivers" className="mb-6" />
          <div className="space-y-4">
            {driverPerformance.map((driver, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-surface-900 dark:text-white">
                      {driver.label}
                    </p>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Star" className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-surface-500">
                        {driver.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-surface-900 dark:text-white">
                    {driver.value}
                  </p>
                  <p className="text-sm text-surface-500">deliveries</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trends */}
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg p-6">
          <CardHeader title="Performance Insights" className="mb-6" />
          <div className="space-y-6">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <ApperIcon name="TrendingUp" className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    Delivery Volume Up 15%
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    Compared to last {timeRange}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Users" className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-200">
                    Driver Efficiency Improved
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    Average deliveries per driver increased by 8%
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Clock" className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800 dark:text-orange-200">
                    Faster Delivery Times
                  </p>
                  <p className="text-sm text-orange-600 dark:text-orange-300">
                    Average delivery time reduced by 12%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Analytics