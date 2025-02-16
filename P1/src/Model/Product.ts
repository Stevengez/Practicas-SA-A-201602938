
export class Product {
  name: string;
  price: number;
  quantity: number;

  constructor(name: string, price: number, quantity: number = 0) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }
}