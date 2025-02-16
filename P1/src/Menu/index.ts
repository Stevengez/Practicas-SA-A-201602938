import { Inventory } from "../Inventory"
import { SelectableMenuEntry } from "../Model/IMenu"
import { Product } from "../Model/Product"
import { HandleInput } from "../Util/Input"
import {Interface} from 'readline'

export class InteractiveMenu {
    private inventory: Inventory

    constructor(inventory: Inventory){
        this.inventory = inventory
    }

    async start(reader: Interface){

        const options:SelectableMenuEntry[] = [
            {
                title: "Add Product",
                description: "Add a new product to the inventory",
                onSelect: async () => {
                    console.log("#### PRODUCT CREATION MODE START ####")
                    const title = await HandleInput({ reader, inputMessage: "Enter the new product's name:", expectedType: 'string' })
                    const price = await HandleInput({ reader, inputMessage: "Enter the new product's price:", expectedType: 'decimal', onlyPositive: true })
                    const quantity = await HandleInput({ reader, inputMessage: "Enter the new product's quantity:", expectedType: 'integer', onlyPositive: true })
                    this.inventory.addProduct(new Product(title as string, price as number, quantity as number))
                    console.log("#### PRODUCT CREATION MOD END ####")
                }
            },
            {
                title: "Remove Product",
                description: "Remove a product from the inventory",
                onSelect: async () => {
                    console.log("#### PRODUCT DELETION MODE START ####")
                    const title = await HandleInput({ reader, inputMessage: "Enter the product's name:", expectedType: 'string' })
                    const target = this.inventory.getProductBy('name',title as string)

                    if(target){
                        this.inventory.removeProduct(target)
                    }else{
                        console.log(" - Product not found")
                    }
                    console.log("#### PRODUCT DELETION MODE END ####")
                }
            },
            {
                title: "List Products",
                description: "List all products in the inventory",
                onSelect: async () => {
                    console.log("#### PRINTING INVENTORY START ####")
                    this.inventory.getProducts().forEach(p => console.log(`Name: ${p.name}, Price: ${p.price}, Quantity: ${p.quantity}`))
                    console.log("#### PRINTING INVENTORY END ####")
                }
            },
            {
                title: "List Products (Ordered by Price)",
                description: "List all products in the inventory sorted by price",
                onSelect: async () => {
                    console.log("#### PRINTING INVENTORY START ####")
                    this.inventory.getProductsSortedBy('price').forEach(p => console.log(`Name: ${p.name}, Price: ${p.price}, Quantity: ${p.quantity}`))
                    console.log("#### PRINTING INVENTORY END ####")
                }
            },
            {
                title: "List Products (Ordered by Quantity)",
                description: "List all products in the inventory sorted byy quantity",
                onSelect: async () => {
                    console.log("#### PRINTING INVENTORY START ####")
                    this.inventory.getProductsSortedBy('quantity').forEach(p => console.log(`Name: ${p.name}, Price: ${p.price}, Quantity: ${p.quantity}`))
                    console.log("#### PRINTING INVENTORY END ####")
                }
            },
            {
                title: "Exit Program",
                description: "Exit the program",
                onSelect: () => {
                    reader.close()
                    process.exit()
                }
            }
        ]

        while(true) {
            console.log("** Select an option **")
            options.forEach((option, index) => console.log(`  ${index}. ${option.title} - ${option.description}`))
            
            const selection = await HandleInput({ reader, inputMessage: "Enter the number of the option you'd like to select:", expectedType: 'integer' }) as number

            if(selection < 0 || selection > (options.length-1)){
                console.log("Invalid selection, please try again")
            }else{
                await options[selection].onSelect()
                await HandleInput({ reader, inputMessage: "Press enter to continue...", expectedType: 'string' })
            }
        }
    }

}