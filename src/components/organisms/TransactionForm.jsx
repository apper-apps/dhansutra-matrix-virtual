import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import Modal from '@/components/molecules/Modal'
import transactionService from '@/services/api/transactionService'

const TransactionForm = ({ isOpen, onClose, transaction, onSuccess }) => {
const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    payment_method: 'Cash',
    date: new Date().toISOString().split('T')[0],
    description: '',
    is_recurring: false
  })
  const [loading, setLoading] = useState(false)

  const expenseCategories = [
    'Groceries', 'Utilities', 'Rent/EMI', 'Education', 'Healthcare',
    'Entertainment', 'Festivals/Cultural Events', 'Donations/Charity',
    'Gold/Jewellery', 'Home Maintenance', 'Domestic Help', 'Transport',
    'Informal Loans/Repayments', 'Clothing', 'Personal Care', 'Other'
  ]

  const incomeCategories = [
    'Salary', 'Business', 'Rent Income', 'Interest', 'Investments',
    'Freelance', 'Gifts', 'Bonus', 'Other'
  ]

  const paymentMethods = [
    'Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet'
  ]

  useEffect(() => {
    if (transaction) {
setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        payment_method: transaction.payment_method,
        date: new Date(transaction.date).toISOString().split('T')[0],
        description: transaction.description || '',
        is_recurring: transaction.is_recurring || false
      })
    } else {
setFormData({
        type: 'expense',
        amount: '',
        category: '',
        payment_method: 'Cash',
        date: new Date().toISOString().split('T')[0],
        description: '',
        is_recurring: false
      })
    }
  }, [transaction, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.amount || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString()
      }

      if (transaction) {
        await transactionService.update(transaction.Id, transactionData)
        toast.success('Transaction updated successfully!')
      } else {
        await transactionService.create(transactionData)
        toast.success('Transaction added successfully!')
      }

      onSuccess()
      onClose()
    } catch (error) {
      toast.error('Failed to save transaction')
    } finally {
      setLoading(false)
    }
  }

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transaction ? 'Edit Transaction' : 'Add Transaction'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>

          <Input
            label="Amount"
            type="number"
            icon="IndianRupee"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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

          <Select
label="Payment Method"
            value={formData.payment_method}
            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
            required
          >
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </Select>
        </div>

        <Input
          label="Date"
          type="date"
          icon="Calendar"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />

        <Input
          label="Description"
          icon="FileText"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Optional description"
        />

        <div className="flex items-center gap-2">
<input
            type="checkbox"
            id="recurring"
            checked={formData.is_recurring}
            onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="recurring" className="text-sm font-medium text-secondary-700">
            This is a recurring transaction
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="flex-1"
          >
            {transaction ? 'Update' : 'Add'} Transaction
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default TransactionForm