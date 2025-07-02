import React, { useContext, useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { AuthContext } from '@/App'
const Header = ({ onMenuToggle, onAddTransaction }) => {
  const { logout } = useContext(AuthContext)
  const { user } = useSelector((state) => state.user)
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef(null)

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "Budget Alert",
      message: "You've spent 80% of your monthly grocery budget",
      time: "2 minutes ago",
      unread: true,
      type: "warning"
    },
    {
      id: 2,
      title: "Transaction Added",
      message: "₹500 expense added for Restaurant",
      time: "1 hour ago",
      unread: true,
      type: "info"
    },
    {
      id: 3,
      title: "Goal Progress",
      message: "You're 25% closer to your Emergency Fund goal!",
      time: "3 hours ago",
      unread: false,
      type: "success"
    },
    {
      id: 4,
      title: "Payment Reminder",
      message: "Electricity bill due in 2 days",
      time: "1 day ago",
      unread: false,
      type: "info"
    }
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
  }

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-white border-b border-surface-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 text-secondary-600 hover:text-secondary-800 hover:bg-surface-100 rounded-lg transition-colors duration-200 lg:hidden"
          >
            <ApperIcon name="Menu" className="w-6 h-6" />
          </button>
          
          <div>
            <h2 className="text-xl font-semibold text-secondary-800">
              Welcome back!
            </h2>
            <p className="text-sm text-secondary-600">
              Here's your financial overview for today
            </p>
          </div>
        </div>
<div className="flex items-center gap-4">
          <Button
            variant="primary"
            size="sm"
            icon="Plus"
            onClick={onAddTransaction}
            className="hidden sm:flex"
          >
            Add Transaction
          </Button>
          
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={handleNotificationClick}
              className="p-2 text-secondary-600 hover:text-secondary-800 hover:bg-surface-100 rounded-lg transition-colors duration-200 relative"
            >
              <ApperIcon name="Bell" className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-surface-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-surface-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-secondary-800">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-surface-50 hover:bg-surface-50 transition-colors cursor-pointer ${
                        notification.unread ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          notification.type === 'warning' ? 'bg-yellow-500' :
                          notification.type === 'success' ? 'bg-green-500' :
                          'bg-blue-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-secondary-800 truncate">
                              {notification.title}
                            </h4>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-secondary-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-secondary-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 border-t border-surface-100">
                  <button className="w-full text-center text-sm text-primary hover:text-primary-dark font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            icon="LogOut"
            onClick={logout}
            className="text-secondary-600 hover:text-red-600"
            title={`Logout ${user?.firstName || 'User'}`}
          >
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header