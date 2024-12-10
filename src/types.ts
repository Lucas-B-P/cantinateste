export interface Customer {
  id: string;
  name: string;
  organization: string;
  orders: Order[];
}

export interface Order {
  id: string;
  items: OrderItem[];
  date: string;
  total: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}