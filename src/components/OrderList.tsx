import React from 'react';
import { Trash2 } from 'lucide-react';
import { Order } from '../types';

interface OrderListProps {
  orders: Order[];
  onDeleteOrder: (orderId: string) => void;
}

export function OrderList({ orders, onDeleteOrder }: OrderListProps) {
  if (orders.length === 0) return null;

  const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div>
      <h3 className="font-semibold mb-2">Pedidos</h3>
      <div className="space-y-2">
        {orders.map(order => (
          <div key={order.id} className="border border-gray-200 p-3 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-gray-600 text-sm">{order.date}</span>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <span className="font-semibold">R$ {order.total.toFixed(2)}</span>
                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja remover esta comanda?')) {
                      onDeleteOrder(order.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-right">
        <span className="font-bold">
          Total: R$ {totalAmount.toFixed(2)}
        </span>
      </div>
    </div>
  );
}