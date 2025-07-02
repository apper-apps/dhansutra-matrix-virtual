import React from 'react'

const Loading = ({ variant = 'default' }) => {
  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-surface-200 rounded-lg"></div>
              <div className="w-16 h-4 bg-surface-200 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="w-24 h-6 bg-surface-200 rounded"></div>
              <div className="w-full h-2 bg-surface-200 rounded-full">
                <div className="w-2/3 h-2 bg-gradient-to-r from-surface-300 to-surface-200 rounded-full animate-shimmer"></div>
              </div>
              <div className="w-32 h-4 bg-surface-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className="card">
        <div className="p-6 border-b border-surface-100">
          <div className="w-48 h-6 bg-surface-200 rounded animate-pulse"></div>
        </div>
        <div className="divide-y divide-surface-100">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-surface-200 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="w-32 h-4 bg-surface-200 rounded"></div>
                    <div className="w-24 h-3 bg-surface-200 rounded"></div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="w-20 h-4 bg-surface-200 rounded ml-auto"></div>
                  <div className="w-16 h-3 bg-surface-200 rounded ml-auto"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-surface-200 border-t-primary-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-accent-400 rounded-full animate-spin animation-delay-150"></div>
      </div>
    </div>
  )
}

export default Loading