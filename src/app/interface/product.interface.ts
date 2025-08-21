export type Category = 'fruit' | 'vegetable';

export interface Product {
  name: string;
  imageUrl: string;
  price: number;
  link: string;
  category: Category;
}
