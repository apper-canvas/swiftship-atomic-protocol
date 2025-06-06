import React from 'react'
      import { motion } from 'framer-motion'
      import FeatureCard from '@/components/molecules/FeatureCard'

      const featuresData = [
        {
          icon: "Route",
          title: "Smart Routing",
          description: "AI-powered route optimization for maximum efficiency"
        },
        {
          icon: "Eye",
          title: "Real-time Tracking",
          description: "Live GPS tracking with ETA updates and notifications"
        },
        {
          icon: "PenTool",
          title: "Digital Signatures",
          description: "Secure proof of delivery with e-signature capture"
        },
        {
          icon: "CreditCard",
          title: "Cashless Payments",
          description: "Integrated payment processing with multiple options"
        },
        {
          icon: "BarChart3",
          title: "Analytics Dashboard",
          description: "Comprehensive insights into delivery performance"
        },
        {
          icon: "Smartphone",
          title: "Mobile Optimized",
          description: "Full functionality on all devices and platforms"
        }
      ]

      const FeaturesGrid = () => {
        return (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="px-4 sm:px-6 lg:px-8 py-16"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-surface-900 dark:text-white mb-4">
                  Complete Delivery Solution
                </h2>
                <p className="text-lg text-surface-600 dark:text-surface-300">
                  Everything you need to manage courier operations efficiently
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuresData.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    delay={0.8}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </motion.section>
        )
      }

      export default FeaturesGrid