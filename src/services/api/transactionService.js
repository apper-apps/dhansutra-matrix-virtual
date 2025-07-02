// Transaction Service using Apper Backend
const { ApperClient } = window.ApperSDK

const transactionService = {
  async getAll() {
    try {
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        "fields": [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "type" } },
          { "field": { "Name": "amount" } },
          { "field": { "Name": "category" } },
          { "field": { "Name": "payment_method" } },
          { "field": { "Name": "date" } },
          { "field": { "Name": "description" } },
          { "field": { "Name": "is_recurring" } }
        ],
        "orderBy": [
          {
            "fieldName": "date",
            "sorttype": "DESC"
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('transaction', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching transactions:", error)
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
          { "field": { "Name": "type" } },
          { "field": { "Name": "amount" } },
          { "field": { "Name": "category" } },
          { "field": { "Name": "payment_method" } },
          { "field": { "Name": "date" } },
          { "field": { "Name": "description" } },
          { "field": { "Name": "is_recurring" } }
        ]
      }
      
      const response = await apperClient.getRecordById('transaction', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching transaction with ID ${id}:`, error)
      throw error
    }
  },

  async create(transactionData) {
    try {
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Format data for Apper backend with proper field types
      const formattedData = {
        Name: transactionData.description || `${transactionData.type} - ${transactionData.category}`,
        type: transactionData.type,
        amount: parseFloat(transactionData.amount),
        category: transactionData.category,
        payment_method: transactionData.paymentMethod,
        date: new Date(transactionData.date).toISOString(),
        description: transactionData.description || '',
        is_recurring: transactionData.isRecurring || false
      }
      
      const params = {
        records: [formattedData]
      }
      
      const response = await apperClient.createRecord('transaction', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error('Failed to create transaction')
        }
        
        const successfulRecords = response.results.filter(result => result.success)
        return successfulRecords[0]?.data
      }
    } catch (error) {
      console.error("Error creating transaction:", error)
      throw error
    }
  },

  async update(id, transactionData) {
    try {
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Format data for Apper backend with proper field types
      const formattedData = {
        Id: parseInt(id),
        Name: transactionData.description || `${transactionData.type} - ${transactionData.category}`,
        type: transactionData.type,
        amount: parseFloat(transactionData.amount),
        category: transactionData.category,
        payment_method: transactionData.paymentMethod,
        date: new Date(transactionData.date).toISOString(),
        description: transactionData.description || '',
        is_recurring: transactionData.isRecurring || false
      }
      
      const params = {
        records: [formattedData]
      }
      
      const response = await apperClient.updateRecord('transaction', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error('Failed to update transaction')
        }
        
        const successfulRecords = response.results.filter(result => result.success)
        return successfulRecords[0]?.data
      }
    } catch (error) {
      console.error("Error updating transaction:", error)
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
      
      const response = await apperClient.deleteRecord('transaction', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          throw new Error('Failed to delete transaction')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting transaction:", error)
      throw error
    }
  }
}

export default transactionService