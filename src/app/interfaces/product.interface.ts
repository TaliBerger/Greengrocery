export type Category = 'fruit' | 'vegetable';
export interface Product {
  id?: string;
  name: string;
  emoji?: string;
  price: number;
  link: string;
  category: Category;
}
