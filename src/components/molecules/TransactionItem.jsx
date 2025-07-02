import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      'Groceries': 'ShoppingCart',
      'Utilities': 'Zap',
      'Rent/EMI': 'Home',
      'Education': 'GraduationCap',
      'Healthcare': 'Heart',
      'Entertainment': 'Film',
      'Festivals': 'Star',
      'Donations': 'Heart',
      'Gold/Jewellery': 'Gem',
      'Transport': 'Car',
      'Salary': 'Briefcase',
      'Business': 'Building',
      'Investment': 'TrendingUp'
    }
    return icons[category] || 'FileText'
  }

  const getPaymentMethodIcon = (method) => {
    const icons = {
      'Cash': 'Banknote',
      'UPI': 'Smartphone',
      'Card': 'CreditCard',
      'Bank Transfer': 'Building2',
      'Digital Wallet': 'Wallet'
    }
    return icons[method] || 'Wallet'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center justify-between p-4 hover:bg-surface-50 rounded-lg transition-colors duration-200 group"
    >
      <div className="flex items-center gap-4 flex-1">
        <div className={`p-3 rounded-xl ${
          transaction.type === 'income' 
            ? 'bg-gradient-to-br from-green-100 to-green-200' 
            : 'bg-gradient-to-br from-red-100 to-red-200'
        }`}>
          <ApperIcon 
            name={getCategoryIcon(transaction.category)} 
            className={`w-5 h-5 ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`} 
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-secondary-800 truncate">
              {transaction.description || transaction.category}
            </h4>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              transaction.type === 'income' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {transaction.category}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-secondary-600">
            <div className="flex items-center gap-1">
              <ApperIcon name={getPaymentMethodIcon(transaction.paymentMethod)} className="w-4 h-4" />
              <span>{transaction.paymentMethod}</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Calendar" className="w-4 h-4" />
              <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
            </div>
            {transaction.isRecurring && (
              <div className="flex items-center gap-1">
                <ApperIcon name="Repeat" className="w-4 h-4" />
                <span>Recurring</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className={`text-lg font-bold ${
            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
          }`}>
            {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
          </p>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(transaction)}
            className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(transaction.Id)}
            className="p-2 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default TransactionItem