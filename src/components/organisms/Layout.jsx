import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddTransaction, setShowAddTransaction] = useState(false)

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  const handleAddTransaction = () => {
    setShowAddTransaction(true)
  }

  return (
    <div className="flex h-screen bg-surface-50">
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onMenuToggle={handleMenuToggle} 
          onAddTransaction={handleAddTransaction}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet context={{ showAddTransaction, setShowAddTransaction }} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout