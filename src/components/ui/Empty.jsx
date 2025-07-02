import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  icon = "FileText",
  title = "No data available",
  description = "Get started by adding your first entry.",
  actionLabel = "Add Entry",
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-primary-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-secondary-800 mb-3">
        {title}
      </h3>
      
      <p className="text-secondary-600 mb-8 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="btn-primary inline-flex items-center gap-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default Empty