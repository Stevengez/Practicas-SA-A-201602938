# Inventory Manager - SOLID Principles

Este proyecto implementa un gestor de inventario utilizando los principios SOLID. A continuación, se explica cómo se aplicaron estos principios en el código.

## Principio de Responsabilidad Única (SRP)
Cada clase tiene una responsabilidad unica:
- `Product`: Representa un producto con sus propiedades (`name`, `price`, `quantity`).
- `Inventory`: Gestiona la colección de productos, proporcionando métodos para añadir, eliminar y listar productos.
- `InteractiveMenu`: Maneja la interacción con el usuario y las opciones del menú.

```typescript
// Product.ts
class Product {
    name: string;
    price: number;
    quantity: number;
    // ...
}

// Inventory/index.ts
class Inventory {
    private products: Product[] = [];
    addProduct()
    removeProduct()
    getProducts()
    getProductsSortedBy(sortKey: keyof Omit<Product, 'name'>, ascending: boolean = true)
    // ...
}

// Menu/index.ts
class InteractiveMenu {
    private inventory: Inventory;
    start(reader: Interface)
    // ...
}

```

## Principio de Abierto/Cerrado (OCP)
Las clases están abiertas para extensión pero cerradas para modificación. Por ejemplo, `Inventory` puede ser extendida para agregar nuevas funcionalidades sin modificar su implementación actual.


## Principio de Sustitución de Liskov (LSP)
Las subclases deben ser sustituibles por sus clases base. En este caso, `SelectableMenuEntry` es una interfaz que puede ser implementada por cualquier clase que necesite comportarse como una entrada de menú seleccionable.

```typescript
// Model/IMenu.ts
export interface SelectableMenuEntry {
    title: string;
    description: string;
    onSelect(): Promise<void>;
}
```

## Principio de Segregación de Interfaces (ISP)
Las interfaces están diseñadas para ser específicas y no forzar a las clases a implementar métodos que no necesitan. `SelectableMenuEntry` define solo los métodos necesarios para una entrada de menú seleccionable.

```typescript
// Model/IMenu.ts
export interface SelectableMenuEntry {
    title: string;
    description: string;
    onSelect(): Promise<void>;
}
```

## Principio de Inversión de Dependencias (DIP)
Las clases de alto nivel no dependen de clases de bajo nivel, sino de abstracciones. `InteractiveMenu` depende de la abstracción `SelectableMenuEntry` y no de implementaciones concretas.

```typescript
// Menu/index.ts
import { SelectableMenuEntry } from "../Model/IMenu";
import { Inventory } from "../Inventory";
import { HandleInput } from "../Util/Input";
import { Interface } from 'readline';

export class InteractiveMenu {
    private inventory: Inventory;
    // ...
}
```

Este diseño asegura que el código sea modular, fácil de mantener y extender.