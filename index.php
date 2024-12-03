<?php
session_start();
require_once 'config/database.php';
require_once 'includes/header.php';
?>

<div class="min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 py-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Sistema de Cantina</h1>
      <button
        onclick="showAddCustomerModal()"
        class="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        <i data-lucide="plus"></i> Adicionar Cliente
      </button>
    </div>

    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
      <div class="relative flex-1">
        <i data-lucide="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          type="text"
          id="searchInput"
          placeholder="Pesquisar clientes..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          oninput="filterCustomers()"
        />
      </div>
      <button
        onclick="generateFullReport()"
        class="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        <i data-lucide="download"></i> Gerar Relatório
      </button>
    </div>

    <div id="customerList" class="grid grid-cols-1 gap-6">
      <!-- Customers will be loaded here -->
    </div>
  </div>
</div>

<?php require_once 'includes/footer.php'; ?>