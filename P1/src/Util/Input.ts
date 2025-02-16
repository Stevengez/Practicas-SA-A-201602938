import { Interface } from 'readline'

type Props = {
    reader: Interface
    inputMessage: string
    expectedType: 'string'|'integer'|'decimal'
    onlyPositive?: boolean
}
export const HandleInput = async ({ reader, inputMessage, expectedType, onlyPositive }:Props): Promise<string|number> => {

    return new Promise((resolve) => {
        reader.question(inputMessage+' ', async (input) => {
            try {
                switch(expectedType) {
                    case 'string':
                        return resolve(input)
                    case 'integer':
                        const intValue = parseInt(input)
                        if(
                            isNaN(intValue) ||
                            onlyPositive && intValue < 0
                        ) throw new Error()
                        return resolve(intValue)
                    case 'decimal':
                        const floatValue = parseFloat(input)
                        if(
                            isNaN(floatValue) ||
                            onlyPositive && floatValue < 0
                        ) throw new Error()
                        return resolve(floatValue)
                }
            }catch(e){
                console.log(`Invalid input, expected: '${onlyPositive ? 'positive ':''}${expectedType}', please try again:`)
                resolve(await HandleInput({ reader, inputMessage, expectedType }))
            }
        })
    })
}