import mockGoals from '@/services/mockData/goals.json'

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for runtime modifications
let goals = [...mockGoals]

const goalService = {
  async getAll() {
    await delay(280)
    return [...goals]
  },

  async getById(id) {
    await delay(200)
    const goal = goals.find(g => g.Id === parseInt(id))
    if (!goal) {
      throw new Error('Goal not found')
    }
    return { ...goal }
  },

  async create(goalData) {
    await delay(400)
    const newGoal = {
      ...goalData,
      Id: Math.max(...goals.map(g => g.Id), 0) + 1,
      currentAmount: goalData.currentAmount || 0
    }
    goals.push(newGoal)
    return { ...newGoal }
  },

  async update(id, goalData) {
    await delay(400)
    const index = goals.findIndex(g => g.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Goal not found')
    }
    
    goals[index] = {
      ...goals[index],
      ...goalData,
      Id: parseInt(id)
    }
    return { ...goals[index] }
  },

  async delete(id) {
    await delay(300)
    const index = goals.findIndex(g => g.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Goal not found')
    }
    
    const deletedGoal = goals[index]
    goals.splice(index, 1)
    return { ...deletedGoal }
  }
}

export default goalService