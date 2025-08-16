import { Product } from "../interface/product.interface";

export class Fruit implements Product {
  constructor(
    public name: string,
    public imageUrl: string,
    public price: number,
    public link: string,
    public category: 'fruit' | 'vegetable'
    
  ) {}

}