export type Category = 'fruit' | 'vegetable';

export class Product {
  constructor(
    public name: string,
    public price: number,          
    public category: Category      
  ) {}
}
