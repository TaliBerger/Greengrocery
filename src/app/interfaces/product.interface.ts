export type Category = 'fruit' | 'vegetable';

export interface Product {
  id?: string;
  name: string;
  price: number;
  category: Category;
  link: string;  
  emoji: string;  
}
