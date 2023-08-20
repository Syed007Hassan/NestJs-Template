interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  __v?: number;
}

export type Cart = CartItem[];
