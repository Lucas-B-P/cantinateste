import React, { useState } from 'react';
import { FileText, Trash2, Edit2, Save, X } from 'lucide-react';
import { Customer } from '../types';
import { OrderList } from './OrderList';
import { NewOrderForm } from './NewOrderForm';
import { generateCustomerPDF } from '../utils/pdfGenerator';

interface CustomerCardProps {
  customer: Customer;
  onAddOrder: (customerId: string, price: number) => Promise<void>;
  onDeleteCustomer: (customerId: string) => Promise<void>;
  onUpdateCustomer: (customerId: string, updates: Partial<Customer>) => Promise<void>;
  onDeleteOrder: (customerId: string, orderId: string) => Promise<void>;
  onDeleteAllOrders: (customerId: string) => Promise<void>;
}

export function CustomerCard({ 
  customer, 
  onAddOrder, 
  onDeleteCustomer, 
  onUpdateCustomer,
  onDeleteOrder,
  onDeleteAllOrders 
}: CustomerCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(customer.name);
  const [editedOrg, setEditedOrg] = useState(customer.organization);

  const handleSave = async () => {
    await onUpdateCustomer(customer.id, {
      name: editedName,
      organization: editedOrg
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(customer.name);
    setEditedOrg(customer.organization);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <div className="flex-1 w-full">
          {isEditing ? (
            <div className="space-y-2 w-full">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Nome do cliente"
              />
              <input
                type="text"
                value={editedOrg}
                onChange={(e) => setEditedOrg(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Organização"
              />
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold break-words">{customer.name}</h2>
              <p className="text-gray-600 break-words">{customer.organization}</p>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-green-600 hover:text-green-800 px-4 py-2 border border-green-600 rounded-lg"
              >
                <Save size={20} /> Salvar
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-600 rounded-lg"
              >
                <X size={20} /> Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 px-4 py-2 border border-blue-600 rounded-lg min-w-[120px]"
              >
                <Edit2 size={20} /> Editar
              </button>
              <button
                onClick={() => generateCustomerPDF(customer)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 px-4 py-2 border border-blue-600 rounded-lg min-w-[120px]"
              >
                <FileText size={20} /> Relatório
              </button>
              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja remover todas as comandas deste cliente?')) {
                    onDeleteAllOrders(customer.id);
                  }
                }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-orange-600 hover:text-orange-800 px-4 py-2 border border-orange-600 rounded-lg min-w-[120px]"
              >
                <Trash2 size={20} /> Limpar
              </button>
              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja remover este cliente?')) {
                    onDeleteCustomer(customer.id);
                  }
                }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-red-600 hover:text-red-800 px-4 py-2 border border-red-600 rounded-lg min-w-[120px]"
              >
                <Trash2 size={20} /> Remover
              </button>
            </>
          )}
        </div>
      </div>

      <NewOrderForm onSubmit={(price) => onAddOrder(customer.id, price)} />
      <OrderList orders={customer.orders} onDeleteOrder={(orderId) => onDeleteOrder(customer.id, orderId)} />
    </div>
  );
}