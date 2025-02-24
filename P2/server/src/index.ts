import { startApp } from "./app.js";

try {
    const { url } = await startApp(3030)

    console.log(`Server started at ${url}`)
}catch(e){
    console.error(e)
}