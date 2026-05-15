import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // On mount: validate stored token by fetching current user from API
        const initAuth = async () => {
            const storedToken = localStorage.getItem('pronote_token');
            if (storedToken) {
                try {
                    const response = await authService.getCurrentUser();
                    const userData = response.data || response;
                    setUser(userData);
                    localStorage.setItem('pronote_user', JSON.stringify(userData));
                } catch (e) {
                    // Token is invalid or expired — clear storage
                    localStorage.removeItem('pronote_user');
                    localStorage.removeItem('pronote_token');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email, password) => {
        const response = await authService.login(email, password);
        const { user: userData, token } = response.data || response;

        setUser(userData);
        localStorage.setItem('pronote_user', JSON.stringify(userData));
        localStorage.setItem('pronote_token', token);
        return userData;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (e) {
            // Even if API call fails, clear local state
        }
        setUser(null);
        localStorage.removeItem('pronote_user');
        localStorage.removeItem('pronote_token');
    };

    const isAuthenticated = () => {
        return !!user;
    };

    const hasRole = (role) => {
        return user?.role === role;
    };

    const value = {
        user,
        setUser,
        loading,
        login,
        logout,
        isAuthenticated,
        hasRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
