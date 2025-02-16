export interface SelectableMenuEntry {
    title: string
    description: string

    onSelect(): Promise<void>
}