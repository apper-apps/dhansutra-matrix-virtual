import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
    { name: 'Transactions', href: '/transactions', icon: 'Receipt' },
    { name: 'Budget', href: '/budget', icon: 'PieChart' },
    { name: 'Goals', href: '/goals', icon: 'Target' },
    { name: 'Reports', href: '/reports', icon: 'BarChart3' },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
<motion.div
        initial={false}
        animate={{ 
          x: typeof window !== 'undefined' && window.innerWidth >= 1024 ? 0 : (isOpen ? 0 : -280),
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 z-50 w-72 h-full bg-white shadow-2xl lg:shadow-lg border-r border-surface-100 lg:static lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-surface-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <ApperIcon name="Coins" className="w-6 h-6 text-white" />
              </div>
<div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  My Home Finance
                </h1>
                <p className="text-xs text-secondary-600">Finance Management</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/' && location.pathname.startsWith(item.href))
              
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              )
            })}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-surface-100">
            <div className="p-4 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <ApperIcon name="Lightbulb" className="w-5 h-5 text-primary-600" />
                <span className="font-medium text-secondary-800">Tip</span>
              </div>
              <p className="text-sm text-secondary-600">
                Track your cash expenses daily for better insights into your spending patterns.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar