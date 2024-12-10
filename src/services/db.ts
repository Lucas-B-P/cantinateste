import initSqlJs from 'sql.js';
import type { Customer, Order, OrderItem, NewCustomer } from '../types';

export class DatabaseService {
  private db: Database | null = null;
  private initialized: Promise<void>;

  constructor() {
    this.initialized = this.init();
  }

  private async init(): Promise<void> {
    const SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });
    
    this.db = new SQL.Database();
    
    // Initialize database tables
    this.db.run(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        organization TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        date TEXT NOT NULL,
        total REAL NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id)
      );
    `);

    // Load data from localStorage if available
    const savedData = localStorage.getItem('cantinaDb');
    if (savedData) {
      const binaryArray = new Uint8Array(savedData.split(',').map(Number));
      this.db = new SQL.Database(binaryArray);
    }
  }

  private saveToLocalStorage() {
    if (!this.db) return;
    const data = this.db.export();
    const binaryArray = Array.from(data);
    localStorage.setItem('cantinaDb', binaryArray.toString());
  }

  async addCustomer(customer: Customer): Promise<void> {
    await this.initialized;
    if (!this.db) throw new Error('Database not initialized');

    this.db.run(
      'INSERT INTO customers (id, name, organization) VALUES (?, ?, ?)',
      [customer.id, customer.name, customer.organization]
    );
    this.saveToLocalStorage();
  }

  async updateCustomer(customer: Customer): Promise<void> {
    await this.initialized;
    if (!this.db) throw new Error('Database not initialized');

    this.db.run(
      'UPDATE customers SET name = ?, organization = ? WHERE id = ?',
      [customer.name, customer.organization, customer.id]
    );
    this.saveToLocalStorage();
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.initialized;
    if (!this.db) throw new Error('Database not initialized');

    // Delete related order items first
    this.db.run(`
      DELETE FROM order_items 
      WHERE order_id IN (
        SELECT id FROM orders WHERE customer_id = ?
      )
    `, [id]);

    // Delete orders
    this.db.run('DELETE FROM orders WHERE customer_id = ?', [id]);

    // Delete customer
    this.db.run('DELETE FROM customers WHERE id = ?', [id]);
    
    this.saveToLocalStorage();
  }

  async getAllCustomers(): Promise<Customer[]> {
    await this.initialized;
    if (!this.db) throw new Error('Database not initialized');

    const customers = this.db.exec(`
      SELECT 
        c.id,
        c.name,
        c.organization,
        o.id as order_id,
        o.date,
        o.total,
        oi.id as item_id,
        oi.name as item_name,
        oi.quantity,
        oi.price
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ORDER BY c.name
    `)[0];

    if (!customers) return [];

    const result = new Map<string, Customer>();

    for (let i = 0; i < customers.values.length; i++) {
      const row = customers.values[i];
      const [customerId, name, organization, orderId, date, total, itemId, itemName, quantity, price] = row;

      if (!result.has(customerId)) {
        result.set(customerId, {
          id: customerId,
          name,
          organization,
          orders: []
        });
      }

      const customer = result.get(customerId)!;

      if (orderId) {
        let order = customer.orders.find(o => o.id === orderId);
        if (!order) {
          order = {
            id: orderId,
            date,
            total,
            items: []
          };
          customer.orders.push(order);
        }

        if (itemId) {
          order.items.push({
            id: itemId,
            name: itemName,
            quantity,
            price
          });
        }
      }
    }

    return Array.from(result.values());
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const customers = await this.getAllCustomers();
    return customers.find(c => c.id === id);
  }

  async addOrder(customerId: string, order: Order): Promise<void> {
    await this.initialized;
    if (!this.db) throw new Error('Database not initialized');

    this.db.run(
      'INSERT INTO orders (id, customer_id, date, total) VALUES (?, ?, ?, ?)',
      [order.id, customerId, order.date, order.total]
    );

    for (const item of order.items) {
      this.db.run(
        'INSERT INTO order_items (id, order_id, name, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [item.id, order.id, item.name, item.quantity, item.price]
      );
    }

    this.saveToLocalStorage();
  }

  async deleteOrder(orderId: string): Promise<void> {
    await this.initialized;
    if (!this.db) throw new Error('Database not initialized');

    // Delete order items first
    this.db.run('DELETE FROM order_items WHERE order_id = ?', [orderId]);

    // Delete the order
    this.db.run('DELETE FROM orders WHERE id = ?', [orderId]);

    this.saveToLocalStorage();
  }

  async deleteAllOrders(customerId: string): Promise<void> {
    await this.initialized;
    if (!this.db) throw new Error('Database not initialized');

    // Delete all order items for the customer's orders
    this.db.run(`
      DELETE FROM order_items 
      WHERE order_id IN (
        SELECT id FROM orders WHERE customer_id = ?
      )
    `, [customerId]);

    // Delete all orders for the customer
    this.db.run('DELETE FROM orders WHERE customer_id = ?', [customerId]);

    this.saveToLocalStorage();
  }
}