import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import { format, startOfMonth, endOfMonth, subMonths, parseISO } from 'date-fns'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import Loading from '@/components/ui/Loading'
import Empty from '@/components/ui/Empty'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import transactionService from '@/services/api/transactionService'

const Reports = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('6months')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await transactionService.getAll()
      setTransactions(data)
    } catch (err) {
      setError('Failed to load transaction data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading variant="cards" />
  if (error) return <Error message={error} onRetry={loadTransactions} />

  // Filter transactions based on selected period
  const getFilteredTransactions = () => {
    const now = new Date()
    let startDate = new Date()

    switch (selectedPeriod) {
      case '1month':
        startDate = startOfMonth(now)
        break
      case '3months':
        startDate = startOfMonth(subMonths(now, 2))
        break
      case '6months':
        startDate = startOfMonth(subMonths(now, 5))
        break
      case '1year':
        startDate = startOfMonth(subMonths(now, 11))
        break
      default:
        startDate = startOfMonth(subMonths(now, 5))
    }

    return transactions.filter(t => {
      const transactionDate = parseISO(t.date)
      const matchesPeriod = transactionDate >= startDate && transactionDate <= now
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory
      return matchesPeriod && matchesCategory
    })
  }

  const filteredTransactions = getFilteredTransactions()

  // Calculate monthly trends
  const getMonthlyTrends = () => {
    const monthlyData = {}
    
    filteredTransactions.forEach(transaction => {
      const monthKey = format(parseISO(transaction.date), 'MMM yyyy')
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 }
      }
      
      monthlyData[monthKey][transaction.type] += transaction.amount
    })

    const months = Object.keys(monthlyData).sort((a, b) => 
      new Date(a) - new Date(b)
    )

    return {
      categories: months,
      income: months.map(month => monthlyData[month].income),
      expense: months.map(month => monthlyData[month].expense)
    }
  }

  // Calculate category breakdown
  const getCategoryBreakdown = () => {
    const categoryData = {}
    
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        categoryData[transaction.category] = (categoryData[transaction.category] || 0) + transaction.amount
      })

    return {
      categories: Object.keys(categoryData),
      amounts: Object.values(categoryData)
    }
  }

  // Calculate payment method distribution
  const getPaymentMethodDistribution = () => {
    const methodData = {}
    
    filteredTransactions.forEach(transaction => {
      methodData[transaction.paymentMethod] = (methodData[transaction.paymentMethod] || 0) + transaction.amount
    })

    return {
      methods: Object.keys(methodData),
      amounts: Object.values(methodData)
    }
  }

  // Calculate key metrics
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const netSavings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0

  // Get largest expense category
  const categoryBreakdown = getCategoryBreakdown()
  const largestExpenseCategory = categoryBreakdown.categories.length > 0 
    ? categoryBreakdown.categories[categoryBreakdown.amounts.indexOf(Math.max(...categoryBreakdown.amounts))]
    : 'N/A'

  const monthlyTrends = getMonthlyTrends()
  const paymentMethodDistribution = getPaymentMethodDistribution()

  // Chart configurations
  const monthlyTrendsConfig = {
    series: [
      {
        name: 'Income',
        data: monthlyTrends.income,
        color: '#22C55E'
      },
      {
        name: 'Expenses',
        data: monthlyTrends.expense,
        color: '#EF4444'
      }
    ],
    options: {
      chart: {
        type: 'area',
        height: 350,
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif'
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.1
        }
      },
      xaxis: {
        categories: monthlyTrends.categories,
        labels: {
          style: { colors: '#6B7280' }
        }
      },
      yaxis: {
        labels: {
          formatter: (value) => `₹${value.toLocaleString()}`,
          style: { colors: '#6B7280' }
        }
      },
      tooltip: {
        y: {
          formatter: (value) => `₹${value.toLocaleString()}`
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      },
      grid: {
        borderColor: '#F3F4F6'
      }
    }
  }

  const categoryPieConfig = {
    series: categoryBreakdown.amounts,
    options: {
      chart: {
        type: 'donut',
        height: 350,
        fontFamily: 'Inter, sans-serif'
      },
      labels: categoryBreakdown.categories,
      colors: [
        '#FF6B35', '#FFB700', '#22C55E', '#3B82F6', '#8B5CF6',
        '#EF4444', '#F59E0B', '#10B981', '#6366F1', '#EC4899'
      ],
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val.toFixed(1)}%`
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%'
          }
        }
      },
      tooltip: {
        y: {
          formatter: (value) => `₹${value.toLocaleString()}`
        }
      },
      legend: {
        position: 'bottom'
      }
    }
  }

  const paymentMethodConfig = {
    series: [{
      data: paymentMethodDistribution.amounts,
      color: '#FF6B35'
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif'
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 8,
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => `₹${val.toLocaleString()}`,
        offsetX: 10,
        style: {
          colors: ['#374151']
        }
      },
      xaxis: {
        categories: paymentMethodDistribution.methods,
        labels: {
          formatter: (value) => `₹${value.toLocaleString()}`,
          style: { colors: '#6B7280' }
        }
      },
      yaxis: {
        labels: {
          style: { colors: '#6B7280' }
        }
      },
      tooltip: {
        y: {
          formatter: (value) => `₹${value.toLocaleString()}`
        }
      },
      grid: {
        borderColor: '#F3F4F6'
      }
    }
  }

  // Get unique categories for filter
  const allCategories = [...new Set(transactions.map(t => t.category))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-800">Financial Reports</h1>
          <p className="text-secondary-600 mt-1">Analyze your spending patterns and financial trends</p>
        </div>
        
        <div className="flex gap-3">
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="min-w-[140px]"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </Select>
          
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="min-w-[160px]"
          >
            <option value="all">All Categories</option>
            {allCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <Empty
          icon="BarChart3"
          title="No data available"
          description="No transactions found for the selected period and filters."
        />
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <p className="text-sm font-medium text-secondary-600">Net Savings</p>
                  <p className={`text-2xl font-bold ${netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{netSavings.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${netSavings >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  <ApperIcon 
                    name="PiggyBank" 
                    className={`w-6 h-6 ${netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`} 
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">Savings Rate</p>
                  <p className={`text-2xl font-bold ${savingsRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {savingsRate.toFixed(1)}%
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${savingsRate >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  <ApperIcon 
                    name="Percent" 
                    className={`w-6 h-6 ${savingsRate >= 0 ? 'text-green-600' : 'text-red-600'}`} 
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Insights */}
          <Card className="p-6 bg-gradient-to-r from-primary-50 to-accent-50 border-l-4 border-primary-500">
            <div className="flex items-start gap-3">
              <ApperIcon name="Lightbulb" className="w-6 h-6 text-primary-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-primary-800 mb-2">Financial Insights</h3>
                <div className="space-y-2 text-primary-700">
                  <p>• Your largest expense category is <strong>{largestExpenseCategory}</strong></p>
                  <p>• You're saving <strong>{savingsRate.toFixed(1)}%</strong> of your income</p>
                  <p>• Total of <strong>{filteredTransactions.length}</strong> transactions in this period</p>
                  {savingsRate < 20 && (
                    <p>• Consider increasing your savings rate to at least 20% for better financial health</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Income vs Expenses Trend</h3>
              {monthlyTrends.categories.length > 0 ? (
                <Chart
                  options={monthlyTrendsConfig.options}
                  series={monthlyTrendsConfig.series}
                  type="area"
                  height={350}
                />
              ) : (
                <div className="h-80 flex items-center justify-center text-secondary-500">
                  No data available for the selected period
                </div>
              )}
            </Card>

            {/* Category Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">Expense Categories</h3>
              {categoryBreakdown.categories.length > 0 ? (
                <Chart
                  options={categoryPieConfig.options}
                  series={categoryPieConfig.series}
                  type="donut"
                  height={350}
                />
              ) : (
                <div className="h-80 flex items-center justify-center text-secondary-500">
                  No expense data available
                </div>
              )}
            </Card>
          </div>

          {/* Payment Methods */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-secondary-800 mb-4">Payment Method Usage</h3>
            {paymentMethodDistribution.methods.length > 0 ? (
              <Chart
                options={paymentMethodConfig.options}
                series={paymentMethodConfig.series}
                type="bar"
                height={350}
              />
            ) : (
              <div className="h-80 flex items-center justify-center text-secondary-500">
                No payment method data available
              </div>
            )}
          </Card>

          {/* Summary Table */}
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-100">
              <h3 className="text-lg font-semibold text-secondary-800">Category Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Transactions</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Total Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Average</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">% of Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {categoryBreakdown.categories.map((category, index) => {
                    const categoryTransactions = filteredTransactions.filter(t => t.category === category && t.type === 'expense')
                    const categoryAmount = categoryBreakdown.amounts[index]
                    const average = categoryAmount / categoryTransactions.length
                    const percentage = (categoryAmount / totalExpenses) * 100

                    return (
                      <tr key={category} className="hover:bg-surface-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="font-medium text-secondary-800">{category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-secondary-600">
                          {categoryTransactions.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-secondary-800">
                          ₹{categoryAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-secondary-600">
                          ₹{average.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {percentage.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

export default Reports