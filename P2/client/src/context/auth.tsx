import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LoginPage } from '../pages/login';
import auth from '../repository/auth';

interface AuthContextType {
    user: any|null;
    login: (email:string, password: string, errCB: (err:any)=> void) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => null,
    logout: () => null
})

export const useAuth = () => useContext(AuthContext)

type Props = {
    children: ReactNode;
}
const AuthProvider = ({ children }:Props) => {
    const [validating, setValidating] = useState(true);
    const [user, setUser] = useState<any|null>(null);

    useEffect(() => {
        if(!validating) return;

        auth.validate().then((res) => {
            if(res.data.success){
                setUser(res.data.data)
            }
            setValidating(false)
        }).catch(() => {
            setValidating(false)
        })

    }, [validating, user])

    const login = async (email:string, password: string, errCB: (err:any)=> void) => {
        auth
            .login(email, password)
            .then((res) => setUser(res.data.data))
            .catch(errCB)
    };

    const register = async (name: string, email:string, password: string, errCB: (err:any)=> void) => {
        auth
            .register(name, email, password)
            .then((res) => setUser(res.data.data))
            .catch(errCB)
    };

    const logout = () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setUser(null);        
    }

    if(validating)
    return <div>Validating...</div>

    if(!user)
    return <LoginPage login={login} register={register} />

    return <AuthContext.Provider value={{ user, login, logout }}>
        {children}
    </AuthContext.Provider>
}

export default AuthProvider