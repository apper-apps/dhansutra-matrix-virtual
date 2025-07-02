import mockTransactions from '@/services/mockData/transactions.json'

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for runtime modifications
let transactions = [...mockTransactions]

const transactionService = {
  async getAll() {
    await delay(300)
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date))
  },

  async getById(id) {
    await delay(200)
    const transaction = transactions.find(t => t.Id === parseInt(id))
    if (!transaction) {
      throw new Error('Transaction not found')
    }
    return { ...transaction }
  },

  async create(transactionData) {
    await delay(400)
    const newTransaction = {
      ...transactionData,
      Id: Math.max(...transactions.map(t => t.Id), 0) + 1,
      date: transactionData.date || new Date().toISOString()
    }
    transactions.push(newTransaction)
    return { ...newTransaction }
  },

  async update(id, transactionData) {
    await delay(400)
    const index = transactions.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Transaction not found')
    }
    
    transactions[index] = {
      ...transactions[index],
      ...transactionData,
      Id: parseInt(id)
    }
    return { ...transactions[index] }
  },

  async delete(id) {
    await delay(300)
    const index = transactions.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Transaction not found')
    }
    
    const deletedTransaction = transactions[index]
    transactions.splice(index, 1)
    return { ...deletedTransaction }
  }
}

export default transactionService