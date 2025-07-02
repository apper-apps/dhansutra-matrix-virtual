import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { differenceInDays, format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Modal from "@/components/molecules/Modal";
import ProgressCard from "@/components/molecules/ProgressCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import goalService from "@/services/api/goalService";

const Goals = () => {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showContributeModal, setShowContributeModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    category: '',
    currentAmount: ''
  })
  const [contributionAmount, setContributionAmount] = useState('')

  const categories = [
    'Emergency Fund', 'Child Education', 'Wedding', 'Home Purchase',
    'Retirement', 'Vacation', 'Vehicle', 'Business', 'Investment', 'Other'
  ]

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await goalService.getAll()
      setGoals(data)
    } catch (err) {
      setError('Failed to load goals')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.targetAmount || !formData.targetDate || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        targetDate: new Date(formData.targetDate).toISOString()
      }

      if (editingGoal) {
        await goalService.update(editingGoal.Id, goalData)
        toast.success('Goal updated successfully!')
      } else {
        await goalService.create(goalData)
        toast.success('Goal created successfully!')
      }

      resetForm()
      loadGoals()
    } catch (err) {
      toast.error('Failed to save goal')
    }
  }

  const handleContribution = async (e) => {
    e.preventDefault()
    if (!contributionAmount || !selectedGoal) return

    try {
      const updatedGoal = {
        ...selectedGoal,
        currentAmount: selectedGoal.currentAmount + parseFloat(contributionAmount)
      }

      await goalService.update(selectedGoal.Id, updatedGoal)
      toast.success('Contribution added successfully!')
      setShowContributeModal(false)
      setContributionAmount('')
      setSelectedGoal(null)
      loadGoals()
    } catch (err) {
      toast.error('Failed to add contribution')
    }
  }

  const handleEdit = (goal) => {
    setEditingGoal(goal)
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      targetDate: new Date(goal.targetDate).toISOString().split('T')[0],
      category: goal.category,
      currentAmount: goal.currentAmount.toString()
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    try {
      await goalService.delete(id)
      toast.success('Goal deleted successfully!')
      loadGoals()
    } catch (err) {
      toast.error('Failed to delete goal')
    }
  }

  const handleContribute = (goal) => {
    setSelectedGoal(goal)
    setShowContributeModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      targetAmount: '',
      targetDate: '',
      category: '',
      currentAmount: ''
    })
    setEditingGoal(null)
    setShowForm(false)
  }

  const getGoalStatus = (goal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100
    const daysRemaining = differenceInDays(new Date(goal.targetDate), new Date())
    
    if (progress >= 100) return { status: 'completed', color: 'success' }
    if (daysRemaining < 0) return { status: 'overdue', color: 'danger' }
    if (daysRemaining <= 30) return { status: 'urgent', color: 'accent' }
    return { status: 'on-track', color: 'primary' }
  }

  if (loading) return <Loading variant="cards" />
  if (error) return <Error message={error} onRetry={loadGoals} />

// Calculate statistics
  const totalGoalAmount = goals.reduce((sum, goal) => sum + (goal.targetAmount || 0), 0)
  const totalSavedAmount = goals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0)
  const completedGoals = goals.filter(goal => (goal.currentAmount || 0) >= (goal.targetAmount || 0)).length
  const overallProgress = totalGoalAmount > 0 ? (totalSavedAmount / totalGoalAmount) * 100 : 0
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-800">Financial Goals</h1>
          <p className="text-secondary-600 mt-1">Track and achieve your financial aspirations</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowForm(true)}
        >
          Create Goal
        </Button>
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Goals</p>
              <p className="text-2xl font-bold text-primary-600">{goals.length}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-xl">
              <ApperIcon name="Target" className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedGoals}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

<Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Target</p>
              <p className="text-2xl font-bold text-accent-600">₹{(totalGoalAmount || 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-accent-100 rounded-xl">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-accent-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Saved</p>
              <p className="text-2xl font-bold text-green-600">₹{(totalSavedAmount || 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <ApperIcon name="PiggyBank" className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Overall Progress */}
      {goals.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-800">Overall Progress</h3>
            <span className="text-lg font-bold text-primary-600">{overallProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-surface-200 rounded-full h-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(overallProgress, 100)}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-4 bg-gradient-to-r from-primary-400 to-accent-500 rounded-full relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
            </motion.div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-secondary-600">
            <span>₹{totalSavedAmount.toLocaleString()} saved</span>
            <span>₹{totalGoalAmount.toLocaleString()} target</span>
          </div>
        </Card>
      )}

      {/* Goals List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-secondary-800">Your Goals</h2>
        
        {goals.length === 0 ? (
          <Empty
            icon="Target"
            title="No goals created yet"
            description="Start planning your financial future by creating your first goal."
            actionLabel="Create Goal"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{goals.map(goal => {
              const { status, color } = getGoalStatus(goal)
              const progress = ((goal.currentAmount || 0) / (goal.targetAmount || 1)) * 100
              const daysRemaining = differenceInDays(new Date(goal.targetDate), new Date())
              return (
                <motion.div
                  key={goal.Id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-6 relative group">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(goal)}
                          className="p-1.5 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors duration-200"
                        >
                          <ApperIcon name="Edit2" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(goal.Id)}
                          className="p-1.5 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-secondary-800">{goal.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          status === 'completed' ? 'bg-green-100 text-green-800' :
                          status === 'overdue' ? 'bg-red-100 text-red-800' :
                          status === 'urgent' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {status === 'completed' ? 'Completed' :
                           status === 'overdue' ? 'Overdue' :
                           status === 'urgent' ? 'Urgent' : 'On Track'}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-600">{goal.category}</p>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-secondary-600">Progress</span>
                        <span className="text-sm font-medium text-secondary-800">
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-surface-200 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(progress, 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-3 rounded-full relative overflow-hidden ${
                            status === 'completed' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                            status === 'overdue' ? 'bg-gradient-to-r from-red-400 to-red-500' :
                            status === 'urgent' ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                            'bg-gradient-to-r from-primary-400 to-primary-500'
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                        </motion.div>
                      </div>
                    </div>

<div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-secondary-600">Saved</span>
                        <span className="font-medium text-secondary-800">₹{(goal.currentAmount || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-secondary-600">Target</span>
                        <span className="font-medium text-secondary-800">₹{(goal.targetAmount || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-secondary-600">Target Date</span>
                        <span className="font-medium text-secondary-800">
                          {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-surface-100">
                        <span className="text-sm text-secondary-600">
                          {daysRemaining >= 0 ? `${daysRemaining} days left` : `${Math.abs(daysRemaining)} days overdue`}
                        </span>
                        <span className="font-semibold text-primary-600">
                          ₹{((goal.targetAmount || 0) - (goal.currentAmount || 0)).toLocaleString()} to go
                        </span>
                      </div>
                    </div>

                    {status !== 'completed' && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon="Plus"
                        onClick={() => handleContribute(goal)}
                        className="w-full"
                      >
                        Add Contribution
                      </Button>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Goal Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editingGoal ? 'Edit Goal' : 'Create Goal'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Goal Name"
            icon="Target"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Emergency Fund, Vacation"
            required
          />

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

            <Input
              label="Target Date"
              type="date"
              icon="Calendar"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Target Amount"
              type="number"
              icon="IndianRupee"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />

            <Input
              label="Current Amount"
              type="number"
              icon="Wallet"
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

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
              {editingGoal ? 'Update' : 'Create'} Goal
            </Button>
          </div>
        </form>
      </Modal>

      {/* Contribution Modal */}
      <Modal
        isOpen={showContributeModal}
        onClose={() => {
          setShowContributeModal(false)
          setSelectedGoal(null)
          setContributionAmount('')
        }}
        title="Add Contribution"
        size="sm"
      >
        {selectedGoal && (
<form onSubmit={handleContribution} className="space-y-6">
            <div className="text-center">
              <h4 className="font-semibold text-secondary-800 mb-2">{selectedGoal.name}</h4>
              <p className="text-sm text-secondary-600">
                Current: ₹{(selectedGoal.currentAmount || 0).toLocaleString()} / ₹{(selectedGoal.targetAmount || 0).toLocaleString()}
              </p>
            </div>

            <Input
              label="Contribution Amount"
              type="number"
              icon="IndianRupee"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              autoFocus
            />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowContributeModal(false)
                  setSelectedGoal(null)
                  setContributionAmount('')
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
              >
                Add Contribution
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}

export default Goals