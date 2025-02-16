import { Product } from "../Model/Product";

/**
 * Represents an inventory of products.
 */
export class Inventory {

    /**
     * An array of products in the inventory, starts empty
     */
    private products: Product[]

    constructor(){
        this.products = []
    }

    /**
     * Adds a product to the inventory.
     * @param product - The product to add.
     */
    addProduct(product: Product) {
        this.products.push(product);
    }

    /**
     * Removes a product from the inventory.
     * @param product - The product to remove.
     */
    removeProduct(product: Product) {
        this.products = this.products.filter(p => p !== product);
    }

    /**
     * Gets all products in the inventory.
     * @returns An array of products.
     */
    getProducts() {
        return this.products;
    }
    
    /**
     * Sorts the products by the specified key in either ascending or descending order.
     *
     * @param sortKey - The key of the product to sort by, excluding 'name'.
     * @param ascending - Optional. If true, sorts in ascending order; if false, sorts in descending order. Defaults to true.
     * @returns The sorted array of products.
     */
    getProductsSortedBy(sortKey: keyof Omit<Product, 'name'>, ascending: boolean = true) {
        return this.products.sort(
            (a:Product, b:Product) => ascending ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
        )
    }

    
    /**
     * Retrieves a product from the inventory that matches the specified filter key and value.
     *
     * @param filterKey - The key of the product property to filter by.
     * @param filterValue - The value of the product property to match.
     * @returns The first product that matches the filter criteria, or undefined if no match is found.
     */
    getProductBy(filterKey: keyof Product, filterValue: string) {
        return this.products.find(p => String(p[filterKey]) === filterValue);
    }
}