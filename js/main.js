let customers = [];

async function loadCustomers() {
    try {
        const response = await fetch('api/customers.php');
        customers = await response.json();
        renderCustomers();
    } catch (error) {
        console.error('Failed to load customers:', error);
    }
}

function renderCustomers() {
    const customerList = document.getElementById('customerList');
    customerList.innerHTML = customers.map(customer => `
        <div class="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div class="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div>
                    <h2 class="text-xl font-bold">${customer.name}</h2>
                    <p class="text-gray-600">${customer.organization}</p>
                </div>
                <div class="flex gap-2 w-full sm:w-auto">
                    <button
                        onclick="generateCustomerReport(${JSON.stringify(customer).replace(/"/g, '&quot;')})"
                        class="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 px-4 py-2 border border-blue-600 rounded-lg"
                    >
                        <i data-lucide="file-text"></i> Relatório
                    </button>
                    <button
                        onclick="deleteCustomer('${customer.id}')"
                        class="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-red-600 hover:text-red-800 px-4 py-2 border border-red-600 rounded-lg"
                    >
                        <i data-lucide="trash-2"></i> Remover
                    </button>
                </div>
            </div>

            <div class="mb-4">
                <h3 class="font-semibold mb-2">Adicionar Pedido</h3>
                <div class="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Nome do item"
                        id="itemName_${customer.id}"
                        class="flex-1 p-2 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="number"
                        min="1"
                        placeholder="Qtd"
                        value="1"
                        id="quantity_${customer.id}"
                        class="w-full sm:w-24 p-2 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Preço"
                        id="price_${customer.id}"
                        class="w-full sm:w-32 p-2 border border-gray-300 rounded-lg"
                    />
                    <button
                        onclick="addOrder('${customer.id}')"
                        class="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Adicionar
                    </button>
                </div>
            </div>

            ${renderOrders(customer.orders)}
        </div>
    `).join('');
    lucide.createIcons();
}

function renderOrders(orders) {
    if (!orders.length) return '';

    const totalAmount = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);

    return `
        <div>
            <h3 class="font-semibold mb-2">Pedidos</h3>
            <div class="space-y-2">
                ${orders.map(order => `
                    <div class="border border-gray-200 p-3 rounded-lg">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">${order.date}</span>
                            <span class="font-semibold">R$ ${parseFloat(order.total).toFixed(2)}</span>
                        </div>
                        <div class="mt-1">
                            ${order.items.map(item => `
                                <div class="text-sm text-gray-600">
                                    ${item.quantity}x ${item.name} - R$ ${(item.quantity * item.price).toFixed(2)}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="mt-4 text-right">
                <span class="font-bold">
                    Total: R$ ${totalAmount.toFixed(2)}
                </span>
            </div>
        </div>
    `;
}

async function addOrder(customerId) {
    const itemName = document.getElementById(`itemName_${customerId}`).value;
    const quantity = parseInt(document.getElementById(`quantity_${customerId}`).value);
    const price = parseFloat(document.getElementById(`price_${customerId}`).value);

    if (!itemName || isNaN(quantity) || isNaN(price)) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    try {
        const response = await fetch('api/orders.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customer_id: customerId,
                items: [{ name: itemName, quantity, price }],
                total: quantity * price
            })
        });

        if (!response.ok) throw new Error('Failed to add order');
        
        await loadCustomers();
    } catch (error) {
        console.error('Failed to add order:', error);
        alert('Erro ao adicionar pedido.');
    }
}

async function deleteCustomer(id) {
    if (!confirm('Tem certeza que deseja remover este cliente?')) return;

    try {
        const response = await fetch(`api/customers.php?id=${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete customer');
        
        await loadCustomers();
    } catch (error) {
        console.error('Failed to delete customer:', error);
        alert('Erro ao remover cliente.');
    }
}

function filterCustomers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.organization.toLowerCase().includes(searchTerm)
    );
    renderCustomers(filteredCustomers);
}

function generateCustomerReport(customer) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Relatório do Cliente', 14, 15);

    doc.setFontSize(12);
    doc.text(`Nome: ${customer.name}`, 14, 30);
    doc.text(`Organização: ${customer.organization}`, 14, 40);

    const tableData = customer.orders.map(order => [
        order.date,
        order.items.map(item => `${item.quantity}x ${item.name}`).join(', '),
        `R$ ${parseFloat(order.total).toFixed(2)}`
    ]);

    doc.autoTable({
        head: [['Data', 'Itens', 'Total']],
        body: tableData,
        startY: 50
    });

    const totalAmount = customer.orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    doc.text(`Valor Total: R$ ${totalAmount.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 20);

    doc.save(`relatorio-${customer.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}

function generateFullReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Relatório Completo da Cantina', 14, 15);

    let yPosition = 30;

    customers.forEach((customer, index) => {
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }

        doc.setFontSize(14);
        doc.text(`${customer.name} - ${customer.organization}`, 14, yPosition);

        const tableData = customer.orders.map(order => [
            order.date,
            order.items.map(item => `${item.quantity}x ${item.name}`).join(', '),
            `R$ ${parseFloat(order.total).toFixed(2)}`
        ]);

        doc.autoTable({
            head: [['Data', 'Itens', 'Total']],
            body: tableData,
            startY: yPosition + 10,
            margin: { left: 14 }
        });

        yPosition = doc.lastAutoTable.finalY + 20;
    });

    const totalAmount = customers.reduce((sum, customer) =>
        sum + customer.orders.reduce((orderSum, order) => orderSum + parseFloat(order.total), 0), 0
    );

    doc.text(`Receita Total: R$ ${totalAmount.toFixed(2)}`, 14, yPosition);

    doc.save('relatorio-completo-cantina.pdf');
}

function showAddCustomerModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center';
    modal.innerHTML = `
        <div class="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 class="text-xl font-bold mb-4">Adicionar Novo Cliente</h2>
            <form onsubmit="addCustomer(event)">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                        type="text"
                        id="newCustomerName"
                        required
                        class="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Organização</label>
                    <input
                        type="text"
                        id="newCustomerOrg"
                        required
                        class="w-full p-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <div class="flex justify-end gap-2">
                    <button
                        type="button"
                        onclick="document.body.removeChild(this.closest('.fixed'))"
                        class="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Adicionar
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

async function addCustomer(event) {
    event.preventDefault();
    
    const name = document.getElementById('newCustomerName').value;
    const organization = document.getElementById('newCustomerOrg').value;

    try {
        const response = await fetch('api/customers.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, organization })
        });

        if (!response.ok) throw new Error('Failed to add customer');
        
        document.body.removeChild(event.target.closest('.fixed'));
        await loadCustomers();
    } catch (error) {
        console.error('Failed to add customer:', error);
        alert('Erro ao adicionar cliente.');
    }
}

// Load customers when the page loads
document.addEventListener('DOMContentLoaded', loadCustomers);