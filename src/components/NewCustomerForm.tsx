import React, { useState } from 'react';
import { NewCustomer } from '../types';

interface NewCustomerFormProps {
  onSubmit: (customer: NewCustomer) => Promise<void>;
  onCancel: () => void;
}

export function NewCustomerForm({ onSubmit, onCancel }: NewCustomerFormProps) {
  const [newCustomer, setNewCustomer] = useState<NewCustomer>({ name: '', organization: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(newCustomer);
    setNewCustomer({ name: '', organization: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Adicionar Novo Cliente</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              required
              value={newCustomer.name}
              onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Organização</label>
            <input
              type="text"
              required
              value={newCustomer.organization}
              onChange={(e) => setNewCustomer(prev => ({ ...prev, organization: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}