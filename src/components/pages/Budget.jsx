import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ProgressCard from '@/components/molecules/ProgressCard'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Modal from '@/components/molecules/Modal'
import Loading from '@/components/ui/Loading'
import Empty from '@/components/ui/Empty'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import budgetService from '@/services/api/budgetService'
import transactionService from '@/services/api/transactionService'

const Budget = () => {
  const [budgets, setBudgets] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly'
  })

  const categories = [
    'Groceries', 'Utilities', 'Rent/EMI', 'Education', 'Healthcare',
    'Entertainment', 'Festivals/Cultural Events', 'Donations/Charity',
    'Gold/Jewellery', 'Home Maintenance', 'Domestic Help', 'Transport',
    'Informal Loans/Repayments', 'Clothing', 'Personal Care', 'Other'
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [budgetsData, transactionsData] = await Promise.all([
        budgetService.getAll(),
        transactionService.getAll()
      ])
      setBudgets(budgetsData)
      setTransactions(transactionsData)
    } catch (err) {
      setError('Failed to load budget data')
    } finally {
      setLoading(false)
    }
  }

  const calculateBudgetProgress = (budget) => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const relevantTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      const isCurrentPeriod = budget.period === 'monthly' 
        ? transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
        : transactionDate.getFullYear() === currentYear
      
      return t.type === 'expense' && 
             t.category === budget.category && 
             isCurrentPeriod
    })

    const spent = relevantTransactions.reduce((sum, t) => sum + t.amount, 0)
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0

    return { spent, percentage }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.category || !formData.amount) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const budgetData = {
        ...formData,
        amount: parseFloat(formData.amount),
        startDate: new Date().toISOString()
      }

      if (editingBudget) {
        await budgetService.update(editingBudget.Id, budgetData)
        toast.success('Budget updated successfully!')
      } else {
        await budgetService.create(budgetData)
        toast.success('Budget created successfully!')
      }

      setShowForm(false)
      setEditingBudget(null)
      setFormData({ category: '', amount: '', period: 'monthly' })
      loadData()
    } catch (err) {
      toast.error('Failed to save budget')
    }
  }

  const handleEdit = (budget) => {
    setEditingBudget(budget)
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    try {
      await budgetService.delete(id)
      toast.success('Budget deleted successfully!')
      loadData()
    } catch (err) {
      toast.error('Failed to delete budget')
    }
  }

  const resetForm = () => {
    setFormData({ category: '', amount: '', period: 'monthly' })
    setEditingBudget(null)
    setShowForm(false)
  }

  if (loading) return <Loading variant="cards" />
  if (error) return <Error message={error} onRetry={loadData} />

  // Calculate total budget and spending
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0)
  const totalSpent = budgets.reduce((sum, budget) => {
    const { spent } = calculateBudgetProgress(budget)
    return sum + spent
  }, 0)
  const remainingBudget = totalBudget - totalSpent

  // Get budgets with progress data
  const budgetsWithProgress = budgets.map(budget => ({
    ...budget,
    ...calculateBudgetProgress(budget)
  }))

  // Categories that need budget alerts
  const alertBudgets = budgetsWithProgress.filter(b => b.percentage > 80)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-800">Budget Management</h1>
          <p className="text-secondary-600 mt-1">Set and track your spending limits by category</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowForm(true)}
        >
          Create Budget
        </Button>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Budget</p>
              <p className="text-2xl font-bold text-primary-600">₹{totalBudget.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-xl">
              <ApperIcon name="Target" className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Spent</p>
              <p className="text-2xl font-bold text-red-600">₹{totalSpent.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <ApperIcon name="TrendingDown" className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Remaining</p>
              <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{remainingBudget.toLocaleString()}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${remainingBudget >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <ApperIcon 
                name="PiggyBank" 
                className={`w-6 h-6 ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`} 
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Budget Alerts */}
      {alertBudgets.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500">
          <div className="flex items-start gap-3">
            <ApperIcon name="AlertTriangle" className="w-6 h-6 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-800 mb-2">Budget Alerts</h3>
              <p className="text-orange-700 mb-3">
                The following budgets need your attention:
              </p>
              <div className="space-y-2">
                {alertBudgets.map(budget => (
                  <div key={budget.Id} className="flex items-center justify-between bg-white bg-opacity-50 p-3 rounded-lg">
                    <span className="font-medium text-orange-800">{budget.category}</span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      budget.percentage > 100 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {budget.percentage.toFixed(0)}% used
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Budget Categories */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-secondary-800">Budget Categories</h2>
        
        {budgets.length === 0 ? (
          <Empty
            icon="PieChart"
            title="No budgets created yet"
            description="Start managing your finances by creating your first budget category."
            actionLabel="Create Budget"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgetsWithProgress.map(budget => (
              <motion.div
                key={budget.Id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6 relative group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="p-1.5 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors duration-200"
                      >
                        <ApperIcon name="Edit2" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(budget.Id)}
                        className="p-1.5 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold text-secondary-800 mb-1">{budget.category}</h3>
                    <p className="text-sm text-secondary-600 capitalize">{budget.period} budget</p>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-secondary-600">Progress</span>
                      <span className="text-sm font-medium text-secondary-800">
                        {budget.percentage.toFixed(0)}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-surface-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(budget.percentage, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-3 rounded-full relative overflow-hidden ${
                          budget.percentage > 100 
                            ? 'bg-gradient-to-r from-red-400 to-red-500' 
                            : budget.percentage > 80 
                              ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                              : 'bg-gradient-to-r from-green-400 to-green-500'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                      </motion.div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-600">Spent</span>
                      <span className="font-medium text-secondary-800">₹{budget.spent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-600">Budget</span>
                      <span className="font-medium text-secondary-800">₹{budget.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-surface-100">
                      <span className="text-sm text-secondary-600">Remaining</span>
                      <span className={`font-semibold ${
                        budget.amount - budget.spent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ₹{(budget.amount - budget.spent).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Budget Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editingBudget ? 'Edit Budget' : 'Create Budget'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>

          <Input
            label="Budget Amount"
            type="number"
            icon="IndianRupee"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />

          <Select
            label="Budget Period"
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            required
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
          </Select>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={resetForm}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              {editingBudget ? 'Update' : 'Create'} Budget
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Budget