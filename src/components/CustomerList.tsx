import React from 'react';
import { Customer } from '../types';
import { CustomerCard } from './CustomerCard';

interface CustomerListProps {
  customers: Customer[];
  searchTerm: string;
  onAddOrder: (customerId: string, itemName: string, quantity: number, price: number) => Promise<void>;
  onUpdateCustomer: (customerId: string, updates: Partial<Customer>) => Promise<void>;
  onDeleteCustomer: (customerId: string) => Promise<void>;
  onDeleteOrder: (customerId: string, orderId: string) => Promise<void>;
  onDeleteAllOrders: (customerId: string) => Promise<void>;
}

export function CustomerList({ 
  customers, 
  searchTerm, 
  onAddOrder, 
  onUpdateCustomer,
  onDeleteCustomer,
  onDeleteOrder,
  onDeleteAllOrders
}: CustomerListProps) {
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredCustomers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum cliente encontrado
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {filteredCustomers.map(customer => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          onAddOrder={onAddOrder}
          onUpdateCustomer={onUpdateCustomer}
          onDeleteCustomer={onDeleteCustomer}
          onDeleteOrder={onDeleteOrder}
          onDeleteAllOrders={onDeleteAllOrders}
        />
      ))}
    </div>
  );
}