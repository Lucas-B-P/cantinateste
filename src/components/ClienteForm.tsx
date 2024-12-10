import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import type { Cliente } from '../types';

interface ClienteFormProps {
  onAddCliente: (cliente: Omit<Cliente, 'id' | 'comandas'>) => void;
}

export function ClienteForm({ onAddCliente }: ClienteFormProps) {
  const [nome, setNome] = useState('');
  const [organizacao, setOrganizacao] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome && organizacao) {
      onAddCliente({ nome, organizacao });
      setNome('');
      setOrganizacao('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Adicionar Novo Cliente</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="organizacao" className="block text-sm font-medium text-gray-700">
            Organização
          </label>
          <input
            type="text"
            id="organizacao"
            value={organizacao}
            onChange={(e) => setOrganizacao(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Adicionar Cliente
        </button>
      </div>
    </form>
  );
}