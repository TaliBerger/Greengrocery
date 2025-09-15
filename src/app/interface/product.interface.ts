export type Category = 'fruit' | 'vegetable';
export interface Product {
  id?: string;
  name: string;
  imageUrl: string;
  price: number;
  link: string;
  category: Category;
}
