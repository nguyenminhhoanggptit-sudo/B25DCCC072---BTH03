export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  username: string;
}

/** Dữ liệu `state` truyền qua router khi chuyển hướng sang /login */
export interface LocationState {
  from?: { pathname: string };
}
