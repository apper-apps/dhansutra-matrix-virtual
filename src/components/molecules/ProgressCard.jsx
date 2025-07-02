import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const ProgressCard = ({ 
  title, 
  current, 
  target, 
  icon, 
  color = 'primary',
  className = ''
}) => {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0
  
  const colors = {
    primary: {
      bg: 'from-primary-500 to-primary-600',
      progress: 'from-primary-400 to-primary-500',
      light: 'bg-primary-50'
    },
    accent: {
      bg: 'from-accent-500 to-accent-600',
      progress: 'from-accent-400 to-accent-500',
      light: 'bg-accent-50'
    },
    success: {
      bg: 'from-green-500 to-green-600',
      progress: 'from-green-400 to-green-500',
      light: 'bg-green-50'
    },
    danger: {
      bg: 'from-red-500 to-red-600',
      progress: 'from-red-400 to-red-500',
      light: 'bg-red-50'
    }
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colors[color].light}`}>
            <ApperIcon name={icon} className={`w-5 h-5 text-${color}-600`} />
          </div>
          <div>
            <h3 className="font-semibold text-secondary-800">{title}</h3>
            <p className="text-sm text-secondary-600">
              ₹{current.toLocaleString()} / ₹{target.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-secondary-700">{percentage.toFixed(0)}%</p>
        </div>
      </div>
      
      <div className="relative">
        <div className="w-full bg-surface-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-3 bg-gradient-to-r ${colors[color].progress} rounded-full relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
          </motion.div>
        </div>
      </div>
    </Card>
  )
}

export default ProgressCard