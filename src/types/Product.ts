export interface Product {
  _id?: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  inStock: boolean;
  createdAt?: Date;
}