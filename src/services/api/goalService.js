// Goal Service using Apper Backend
const { ApperClient } = window.ApperSDK

const goalService = {
  async getAll() {
    try {
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        "fields": [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "target_amount" } },
          { "field": { "Name": "current_amount" } },
          { "field": { "Name": "target_date" } },
          { "field": { "Name": "category" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('goal', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching goals:", error)
      throw error
    }
  },

  async getById(id) {
    try {
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        "fields": [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "target_amount" } },
          { "field": { "Name": "current_amount" } },
          { "field": { "Name": "target_date" } },
          { "field": { "Name": "category" } }
        ]
      }
      
      const response = await apperClient.getRecordById('goal', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching goal with ID ${id}:`, error)
      throw error
    }
  },

  async create(goalData) {
    try {
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Format data for Apper backend with proper field types
      const formattedData = {
        Name: goalData.name,
        target_amount: parseFloat(goalData.targetAmount),
        current_amount: parseFloat(goalData.currentAmount) || 0,
        target_date: new Date(goalData.targetDate).toISOString(),
        category: goalData.category
      }
      
      const params = {
        records: [formattedData]
      }
      
      const response = await apperClient.createRecord('goal', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error('Failed to create goal')
        }
        
        const successfulRecords = response.results.filter(result => result.success)
        return successfulRecords[0]?.data
      }
    } catch (error) {
      console.error("Error creating goal:", error)
      throw error
    }
  },

  async update(id, goalData) {
    try {
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Format data for Apper backend with proper field types
      const formattedData = {
        Id: parseInt(id),
        Name: goalData.name,
        target_amount: parseFloat(goalData.targetAmount),
        current_amount: parseFloat(goalData.currentAmount) || 0,
        target_date: new Date(goalData.targetDate).toISOString(),
        category: goalData.category
      }
      
      const params = {
        records: [formattedData]
      }
      
      const response = await apperClient.updateRecord('goal', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error('Failed to update goal')
        }
        
        const successfulRecords = response.results.filter(result => result.success)
        return successfulRecords[0]?.data
      }
    } catch (error) {
      console.error("Error updating goal:", error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('goal', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          throw new Error('Failed to delete goal')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting goal:", error)
      throw error
    }
  }
}

export default goalService