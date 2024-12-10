import React from 'react';
import { FileText, Search } from 'lucide-react';
import type { Cliente } from '../types';

interface ClienteListProps {
  clientes: Cliente[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onGenerateReport: (cliente?: Cliente) => void;
}

export function ClienteList({ clientes, searchTerm, onSearchChange, onGenerateReport }: ClienteListProps) {
  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.organizacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Clientes</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquisar clientes..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organização</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Gasto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClientes.map((cliente) => {
              const totalGasto = cliente.comandas.reduce(
                (sum, comanda) => sum + comanda.total,
                0
              );

              return (
                <tr key={cliente.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{cliente.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{cliente.organizacao}</td>
                  <td className="px-6 py-4 whitespace-nowrap">R$ {totalGasto.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onGenerateReport(cliente)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredClientes.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          Nenhum cliente encontrado
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onGenerateReport()}
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <FileText className="w-5 h-5 mr-2" />
          Gerar Relatório Geral
        </button>
      </div>
    </div>
  );
}