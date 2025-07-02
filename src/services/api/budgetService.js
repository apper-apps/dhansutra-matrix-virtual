// Budget Service using Apper Backend
const { ApperClient } = window.ApperSDK

const budgetService = {
  async getAll() {
    try {
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        "fields": [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "category" } },
          { "field": { "Name": "amount" } },
          { "field": { "Name": "period" } },
          { "field": { "Name": "start_date" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('budget', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching budgets:", error)
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
          { "field": { "Name": "category" } },
          { "field": { "Name": "amount" } },
          { "field": { "Name": "period" } },
          { "field": { "Name": "start_date" } }
        ]
      }
      
      const response = await apperClient.getRecordById('budget', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching budget with ID ${id}:`, error)
      throw error
    }
  },

  async create(budgetData) {
    try {
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Format data for Apper backend with proper field types
      const formattedData = {
        Name: `${budgetData.category} Budget`,
        category: budgetData.category,
        amount: parseFloat(budgetData.amount),
        period: budgetData.period,
        start_date: new Date(budgetData.startDate || new Date()).toISOString()
      }
      
      const params = {
        records: [formattedData]
      }
      
      const response = await apperClient.createRecord('budget', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error('Failed to create budget')
        }
        
        const successfulRecords = response.results.filter(result => result.success)
        return successfulRecords[0]?.data
      }
    } catch (error) {
      console.error("Error creating budget:", error)
      throw error
    }
  },

  async update(id, budgetData) {
    try {
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Format data for Apper backend with proper field types
      const formattedData = {
        Id: parseInt(id),
        Name: `${budgetData.category} Budget`,
        category: budgetData.category,
        amount: parseFloat(budgetData.amount),
        period: budgetData.period,
        start_date: new Date(budgetData.startDate || new Date()).toISOString()
      }
      
      const params = {
        records: [formattedData]
      }
      
      const response = await apperClient.updateRecord('budget', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error('Failed to update budget')
        }
        
        const successfulRecords = response.results.filter(result => result.success)
        return successfulRecords[0]?.data
      }
    } catch (error) {
      console.error("Error updating budget:", error)
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
      
      const response = await apperClient.deleteRecord('budget', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          throw new Error('Failed to delete budget')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting budget:", error)
      throw error
    }
  }
}

export default budgetService