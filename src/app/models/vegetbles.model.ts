import { Product } from "../interface/product.interface";
import { ProductService } from "../service/product.service";

export class Vegetables implements Product {
  constructor(
    public name: string,
    public imageUrl: string,
    public price: number,
    public link: string,
    public category: string
  ) {}
}