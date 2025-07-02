import mockBudgets from '@/services/mockData/budgets.json'

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for runtime modifications
let budgets = [...mockBudgets]

const budgetService = {
  async getAll() {
    await delay(250)
    return [...budgets]
  },

  async getById(id) {
    await delay(200)
    const budget = budgets.find(b => b.Id === parseInt(id))
    if (!budget) {
      throw new Error('Budget not found')
    }
    return { ...budget }
  },

  async create(budgetData) {
    await delay(350)
    const newBudget = {
      ...budgetData,
      Id: Math.max(...budgets.map(b => b.Id), 0) + 1,
      startDate: budgetData.startDate || new Date().toISOString()
    }
    budgets.push(newBudget)
    return { ...newBudget }
  },

  async update(id, budgetData) {
    await delay(350)
    const index = budgets.findIndex(b => b.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Budget not found')
    }
    
    budgets[index] = {
      ...budgets[index],
      ...budgetData,
      Id: parseInt(id)
    }
    return { ...budgets[index] }
  },

  async delete(id) {
    await delay(300)
    const index = budgets.findIndex(b => b.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Budget not found')
    }
    
    const deletedBudget = budgets[index]
    budgets.splice(index, 1)
    return { ...deletedBudget }
  }
}

export default budgetService