import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TransactionItem from '@/components/molecules/TransactionItem'
import TransactionForm from '@/components/organisms/TransactionForm'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Loading from '@/components/ui/Loading'
import Empty from '@/components/ui/Empty'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import transactionService from '@/services/api/transactionService'

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    paymentMethod: 'all',
    dateFrom: '',
    dateTo: ''
  })

  useEffect(() => {
    loadTransactions()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [transactions, filters])

  const loadTransactions = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await transactionService.getAll()
      setTransactions(data)
    } catch (err) {
      setError('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...transactions]

    if (filters.search) {
      filtered = filtered.filter(t =>
        t.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.category.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type)
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t.category === filters.category)
    }

    if (filters.paymentMethod !== 'all') {
      filtered = filtered.filter(t => t.paymentMethod === filters.paymentMethod)
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.dateFrom))
    }

    if (filters.dateTo) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.dateTo))
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date))

    setFilteredTransactions(filtered)
  }

  const handleTransactionSuccess = () => {
    loadTransactions()
  }

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction)
  }

  const handleDeleteTransaction = async (id) => {
    try {
      await transactionService.delete(id)
      loadTransactions()
    } catch (err) {
      console.error('Failed to delete transaction')
    }
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      category: 'all',
      paymentMethod: 'all',
      dateFrom: '',
      dateTo: ''
    })
  }

  // Get unique categories and payment methods for filter options
  const categories = [...new Set(transactions.map(t => t.category))]
  const paymentMethods = [...new Set(transactions.map(t => t.paymentMethod))]

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  if (loading) return <Loading variant="table" />
  if (error) return <Error message={error} onRetry={loadTransactions} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-800">Transactions</h1>
          <p className="text-secondary-600 mt-1">Track and manage all your financial transactions</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowForm(true)}
        >
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <ApperIcon name="TrendingDown" className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Net Amount</p>
              <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{(totalIncome - totalExpenses).toLocaleString()}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${totalIncome - totalExpenses >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <ApperIcon 
                name="DollarSign" 
                className={`w-6 h-6 ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`} 
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-800">Filter Transactions</h3>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Input
            placeholder="Search transactions..."
            icon="Search"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          <Select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>

          <Select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>

          <Select
            value={filters.paymentMethod}
            onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
          >
            <option value="all">All Payment Methods</option>
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </Select>

          <Input
            type="date"
            placeholder="From date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
          />

          <Input
            type="date"
            placeholder="To date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
          />
        </div>
      </Card>

      {/* Transactions List */}
      <Card>
        <div className="p-6 border-b border-surface-100">
          <h3 className="text-lg font-semibold text-secondary-800">
            All Transactions ({filteredTransactions.length})
          </h3>
        </div>

        <div className="divide-y divide-surface-100">
          <AnimatePresence>
            {filteredTransactions.length === 0 ? (
              <Empty
                icon="Receipt"
                title="No transactions found"
                description="Try adjusting your filters or add your first transaction."
                actionLabel="Add Transaction"
                onAction={() => setShowForm(true)}
              />
            ) : (
              filteredTransactions.map(transaction => (
                <TransactionItem
                  key={transaction.Id}
                  transaction={transaction}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Transaction Form */}
      <TransactionForm
        isOpen={showForm || !!editingTransaction}
        onClose={() => {
          setShowForm(false)
          setEditingTransaction(null)
        }}
        transaction={editingTransaction}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  )
}

export default Transactions