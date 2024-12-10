import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Customer, Order } from '../types';

export const generateCustomerPDF = (customer: Customer) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Relatório do Cliente', 14, 15);
  
  // Customer Info
  doc.setFontSize(12);
  doc.text(`Nome: ${customer.name}`, 14, 30);
  doc.text(`Organização: ${customer.organization}`, 14, 40);
  
  // Orders Table
  const tableData = customer.orders.map(order => [
    order.date,
    order.items.map(item => `${item.quantity}x ${item.name}`).join(', '),
    `R$ ${order.total.toFixed(2)}`
  ]);
  
  autoTable(doc, {
    head: [['Data', 'Itens', 'Total']],
    body: tableData,
    startY: 50
  });
  
  // Total
  const totalAmount = customer.orders.reduce((sum, order) => sum + order.total, 0);
  doc.text(`Valor Total: R$ ${totalAmount.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 20);
  
  doc.save(`relatorio-${customer.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

export const generateFullReport = (customers: Customer[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Relatório Completo da Cantina', 14, 15);
  
  let yPosition = 30;
  
  customers.forEach((customer, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Customer Section
    doc.setFontSize(14);
    doc.text(`${customer.name} - ${customer.organization}`, 14, yPosition);
    
    const tableData = customer.orders.map(order => [
      order.date,
      order.items.map(item => `${item.quantity}x ${item.name}`).join(', '),
      `R$ ${order.total.toFixed(2)}`
    ]);
    
    autoTable(doc, {
      head: [['Data', 'Itens', 'Total']],
      body: tableData,
      startY: yPosition + 10,
      margin: { left: 14 }
    });
    
    yPosition = doc.lastAutoTable.finalY + 20;
  });
  
  const totalAmount = customers.reduce((sum, customer) => 
    sum + customer.orders.reduce((orderSum, order) => orderSum + order.total, 0), 0
  );
  
  doc.text(`Receita Total: R$ ${totalAmount.toFixed(2)}`, 14, yPosition);
  
  doc.save('relatorio-completo-cantina.pdf');
};