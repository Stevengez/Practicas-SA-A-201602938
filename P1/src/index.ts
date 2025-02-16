import { Inventory } from "./Inventory";
import { InteractiveMenu } from "./Menu";
import { createInterface } from "readline";

const inventory = new Inventory()
const reader = createInterface({
    input: process.stdin,
    output: process.stdout
})

const menu = new InteractiveMenu(inventory)


console.log("#### Welcome to the Inventory Manager")
console.log("#### By Steven Jocol v1.0 / PRACTICA 1")
console.log("#### Carne: 201602938")
console.log("")
menu.start(reader)