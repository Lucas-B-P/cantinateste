import { useEffect, useState } from 'react';
import { DatabaseService } from '../services/db';
import type { Customer, Order, NewCustomer } from '../types';

const db = new DatabaseService();

export function useDatabase() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const loadedCustomers = await db.getAllCustomers();
      setCustomers(loadedCustomers);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Falha ao carregar clientes'));
    } finally {
      setIsLoading(false);
    }
  }

  async function addCustomer(customer: NewCustomer) {
    try {
      const newCustomer: Customer = {
        id: crypto.randomUUID(),
        ...customer,
        orders: []
      };
      await db.addCustomer(newCustomer);
      setCustomers(prev => [...prev, newCustomer]);
      return newCustomer;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Falha ao adicionar cliente'));
      throw err;
    }
  }

  async function updateCustomer(id: string, updates: Partial<Customer>) {
    try {
      await db.updateCustomer({ id, ...updates } as Customer);
      setCustomers(prev => prev.map(customer => 
        customer.id === id ? { ...customer, ...updates } : customer
      ));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Falha ao atualizar cliente'));
      throw err;
    }
  }

  async function deleteCustomer(id: string) {
    try {
      await db.deleteCustomer(id);
      setCustomers(prev => prev.filter(customer => customer.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Falha ao remover cliente'));
      throw err;
    }
  }

  async function addOrder(customerId: string, order: Omit<Order, 'id' | 'date'>) {
    try {
      const newOrder: Order = {
        id: crypto.randomUUID(),
        date: new Date().toLocaleDateString(),
        ...order
      };
      await db.addOrder(customerId, newOrder);
      setCustomers(prev =>
        prev.map(customer =>
          customer.id === customerId
            ? { ...customer, orders: [...customer.orders, newOrder] }
            : customer
        )
      );
      return newOrder;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Falha ao adicionar pedido'));
      throw err;
    }
  }

  async function deleteOrder(customerId: string, orderId: string) {
    try {
      await db.deleteOrder(orderId);
      setCustomers(prev =>
        prev.map(customer =>
          customer.id === customerId
            ? { ...customer, orders: customer.orders.filter(order => order.id !== orderId) }
            : customer
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Falha ao remover pedido'));
      throw err;
    }
  }

  async function deleteAllOrders(customerId: string) {
    try {
      await db.deleteAllOrders(customerId);
      setCustomers(prev =>
        prev.map(customer =>
          customer.id === customerId
            ? { ...customer, orders: [] }
            : customer
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Falha ao remover todos os pedidos'));
      throw err;
    }
  }

  return {
    customers,
    isLoading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addOrder,
    deleteOrder,
    deleteAllOrders
  };
}