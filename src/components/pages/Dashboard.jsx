import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import StatCard from '@/components/molecules/StatCard'
import ProgressCard from '@/components/molecules/ProgressCard'
import TransactionItem from '@/components/molecules/TransactionItem'
import TransactionForm from '@/components/organisms/TransactionForm'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Empty from '@/components/ui/Empty'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import transactionService from '@/services/api/transactionService'
import budgetService from '@/services/api/budgetService'
import goalService from '@/services/api/goalService'

const Dashboard = () => {
  const { showAddTransaction, setShowAddTransaction } = useOutletContext()
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingTransaction, setEditingTransaction] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [transactionsData, budgetsData, goalsData] = await Promise.all([
        transactionService.getAll(),
        budgetService.getAll(),
        goalService.getAll()
      ])
      setTransactions(transactionsData)
      setBudgets(budgetsData)
      setGoals(goalsData)
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleTransactionSuccess = () => {
    loadData()
  }

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction)
  }

  const handleDeleteTransaction = async (id) => {
    try {
      await transactionService.delete(id)
      loadData()
    } catch (err) {
      console.error('Failed to delete transaction')
    }
  }

  if (loading) return <Loading variant="cards" />
  if (error) return <Error message={error} onRetry={loadData} />

  // Calculate statistics
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const monthlyTransactions = transactions.filter(t => {
    const date = new Date(t.date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const netSavings = monthlyIncome - monthlyExpenses
  const recentTransactions = transactions.slice(0, 5)

  // Calculate budget adherence
  const budgetData = budgets.map(budget => {
    const categoryExpenses = monthlyTransactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0)
    
    return {
      ...budget,
      spent: categoryExpenses,
      percentage: budget.amount > 0 ? (categoryExpenses / budget.amount) * 100 : 0
    }
  })

  const overBudgetCategories = budgetData.filter(b => b.percentage > 100)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-800">Dashboard</h1>
          <p className="text-secondary-600 mt-1">Your financial overview at a glance</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowAddTransaction(true)}
          className="sm:hidden"
        >
          Add
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Monthly Income"
          value={`₹${monthlyIncome.toLocaleString()}`}
          icon="TrendingUp"
          color="success"
          trend="up"
          trendValue="12%"
        />
        <StatCard
          title="Monthly Expenses"
          value={`₹${monthlyExpenses.toLocaleString()}`}
          icon="TrendingDown"
          color="danger"
          trend="down"
          trendValue="5%"
        />
        <StatCard
          title="Net Savings"
          value={`₹${netSavings.toLocaleString()}`}
          icon="PiggyBank"
          color={netSavings >= 0 ? 'success' : 'danger'}
          trend={netSavings >= 0 ? 'up' : 'down'}
          trendValue={`${Math.abs((netSavings / monthlyIncome * 100) || 0).toFixed(1)}%`}
        />
        <StatCard
          title="Active Goals"
          value={goals.length.toString()}
          icon="Target"
          color="accent"
        />
      </div>

      {/* Alerts */}
      {overBudgetCategories.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500">
          <div className="flex items-start gap-3">
            <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Budget Alerts</h3>
              <p className="text-red-700 mb-3">
                You have exceeded your budget in {overBudgetCategories.length} categories:
              </p>
              <div className="flex flex-wrap gap-2">
                {overBudgetCategories.map(budget => (
                  <span key={budget.Id} className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                    {budget.category} ({budget.percentage.toFixed(0)}%)
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Budget Progress */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-secondary-800">Budget Overview</h2>
            <Button variant="ghost" size="sm" icon="Eye">
              View All
            </Button>
          </div>
          
          {budgetData.length === 0 ? (
            <Empty
              icon="PieChart"
              title="No budgets set"
              description="Create your first budget to track spending."
              actionLabel="Create Budget"
            />
          ) : (
            <div className="space-y-4">
              {budgetData.slice(0, 4).map(budget => (
                <ProgressCard
                  key={budget.Id}
                  title={budget.category}
                  current={budget.spent}
                  target={budget.amount}
                  icon="PieChart"
                  color={budget.percentage > 100 ? 'danger' : budget.percentage > 80 ? 'accent' : 'success'}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-secondary-800">Recent Transactions</h2>
            <Button variant="ghost" size="sm" icon="ArrowRight">
              View All
            </Button>
          </div>
          
          <Card className="divide-y divide-surface-100">
            {recentTransactions.length === 0 ? (
              <Empty
                icon="Receipt"
                title="No transactions yet"
                description="Start tracking by adding your first transaction."
                actionLabel="Add Transaction"
                onAction={() => setShowAddTransaction(true)}
              />
            ) : (
              recentTransactions.map(transaction => (
                <TransactionItem
                  key={transaction.Id}
                  transaction={transaction}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                />
              ))
            )}
          </Card>
        </div>
      </div>

      {/* Goal Progress */}
      {goals.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-secondary-800">Goal Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.slice(0, 3).map(goal => (
              <ProgressCard
                key={goal.Id}
                title={goal.name}
                current={goal.currentAmount}
                target={goal.targetAmount}
                icon="Target"
                color="accent"
              />
            ))}
          </div>
        </div>
      )}

      {/* Transaction Form */}
      <TransactionForm
        isOpen={showAddTransaction || !!editingTransaction}
        onClose={() => {
          setShowAddTransaction(false)
          setEditingTransaction(null)
        }}
        transaction={editingTransaction}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  )
}

export default Dashboard