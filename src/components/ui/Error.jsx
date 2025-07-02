import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ 
  message = "Something went wrong while loading your data.", 
  onRetry,
  variant = 'default'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-secondary-800 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-secondary-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary inline-flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  )
}

export default Error