export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  organization: string;
  orders: Order[];
}

export interface NewCustomer {
  name: string;
  organization: string;
}