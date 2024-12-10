import React, { useState } from 'react';
import { Plus, Download, Loader2 } from 'lucide-react';
import { useDatabase } from './hooks/useDatabase';
import { CustomerList } from './components/CustomerList';
import { SearchBar } from './components/SearchBar';
import { NewCustomerForm } from './components/NewCustomerForm';
import { generateFullReport } from './utils/pdfGenerator';
import type { NewCustomer } from './types';

function App() {
  const { 
    customers, 
    isLoading, 
    error, 
    addCustomer, 
    updateCustomer,
    addOrder, 
    deleteCustomer,
    deleteOrder,
    deleteAllOrders
  } = useDatabase();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddCustomer = async (customer: NewCustomer) => {
    try {
      await addCustomer(customer);
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add customer:', err);
    }
  };

  const handleAddOrder = async (customerId: string, price: number) => {
    try {
      await addOrder(customerId, {
        items: [{
          id: crypto.randomUUID(),
          name: 'Item',
          quantity: 1,
          price
        }],
        total: price
      });
    } catch (err) {
      console.error('Failed to add order:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Erro: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Cantina</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} /> Adicionar Cliente
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <button
            onClick={() => generateFullReport(customers)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Download size={20} /> Gerar Relatório
          </button>
        </div>

        {showAddForm && (
          <NewCustomerForm
            onSubmit={handleAddCustomer}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        <CustomerList
          customers={customers}
          searchTerm={searchTerm}
          onAddOrder={handleAddOrder}
          onUpdateCustomer={updateCustomer}
          onDeleteCustomer={deleteCustomer}
          onDeleteOrder={deleteOrder}
          onDeleteAllOrders={deleteAllOrders}
        />
      </div>
    </div>
  );
}

export default App;