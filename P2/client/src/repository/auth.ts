import { baseQuery } from "./basequery"

const login = async (email: string, password: string) => {

    return await baseQuery({
        method: 'post',
        path: 'login',
        body: { email, password }
    })
}


const register = async (name: string, email: string, password: string) => {

    return await baseQuery({
        method: 'post',
        path: 'register',
        body: { name, email, password }
    })
}

const validate = async () => {
    
    return await baseQuery({
        method: 'post',
        path: 'validate'
    })
}

export default {
    login,
    register,
    validate
}