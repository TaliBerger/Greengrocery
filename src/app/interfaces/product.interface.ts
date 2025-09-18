export type Category = 'fruit' | 'vegetable';
export interface Product {
link: any;
  id?: string;
  name: string;
  emoji?: string;
  price: number;
  category: Category;
}
