import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { AuthContext } from '@/App'

const Header = ({ onMenuToggle, onAddTransaction }) => {
  const { logout } = useContext(AuthContext)
  const { user } = useSelector((state) => state.user)
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
          
<button className="p-2 text-secondary-600 hover:text-secondary-800 hover:bg-surface-100 rounded-lg transition-colors duration-200 relative">
            <ApperIcon name="Bell" className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          
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