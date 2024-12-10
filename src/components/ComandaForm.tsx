import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { ItemComanda } from '../types';

interface ComandaFormProps {
  onAddComanda: (items: ItemComanda[]) => void;
}

export function ComandaForm({ onAddComanda }: ComandaFormProps) {
  const [items, setItems] = useState<ItemComanda[]>([]);
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [precoUnitario, setPrecoUnitario] = useState(0);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome && quantidade > 0 && precoUnitario > 0) {
      const newItem: ItemComanda = {
        id: crypto.randomUUID(),
        nome,
        quantidade,
        precoUnitario,
        total: quantidade * precoUnitario
      };
      setItems([...items, newItem]);
      setNome('');
      setQuantidade(1);
      setPrecoUnitario(0);
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSubmit = () => {
    if (items.length > 0) {
      onAddComanda(items);
      setItems([]);
    }
  };

  const total = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Nova Comanda</h2>
      
      <form onSubmit={handleAddItem} className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Item</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              Required/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantidade</label>
            <input
              type="number"
              value={quantidade}
              min="1"
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preço Unitário</label>
            <input
              type="number"
              value={precoUnitario}
              min="0"
              step="0.01"
              onChange={(e) => setPrecoUnitario(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Item
        </button>
      </form>

      {items.length > 0 && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Un.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.quantidade}</td>
                    <td className="px-6 py-4 whitespace-nowrap">R$ {item.precoUnitario.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">R$ {item.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-6 py-4 text-right font-bold">Total:</td>
                  <td className="px-6 py-4 font-bold">R$ {total.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Finalizar Comanda
          </button>
        </div>
      )}
    </div>
  );
}