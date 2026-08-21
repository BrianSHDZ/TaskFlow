/*import React, { useState, useEffect } from 'react'; // 👈 Se agrega useEffect
import AsyncStorage from '@react-native-async-storage/async-storage'; // 👈 Se agrega AsyncStorage
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import HistorialScreen from './screens/HistorialScreen';

export default function App() {
    const [screen, setScreen] = useState('login');
    const [user, setUser] = useState(null);

    // Restaurar la sesión al abrir la app
    useEffect(() => {
        const checkUser = async () => {
            try {
                const savedUser = await AsyncStorage.getItem('user');
                if (savedUser) {
                    const userData = JSON.parse(savedUser);
                    setUser(userData);
                    setScreen('home');
                }
            } catch (error) {
                console.log('Error al leer sesión:', error);
            }
        };
        checkUser();
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setScreen('home');
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('user');
        setUser(null);
        setScreen('login');
    };

    // Renderizado condicional de pantallas
    if (screen === 'home' && user) {
        return <HomeScreen user={user} onLogout={handleLogout} />;
    }

    if (screen === 'register') {
        return <RegisterScreen onNavigateToLogin={() => setScreen('login')} />;
    }

    return (
        <LoginScreen
            onNavigateToRegister={() => setScreen('register')}
            onLoginSuccess={handleLoginSuccess}
        />
    );
}*/
//version 5
/*import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import HistorialScreen from './screens/HistorialScreen';

export default function App() {
    const [screen, setScreen] = useState('login');
    const [user, setUser] = useState(null);

    // Restaurar la sesión al abrir la app
    useEffect(() => {
        const checkUser = async () => {
            try {
                const savedUser = await AsyncStorage.getItem('user');
                if (savedUser) {
                    const userData = JSON.parse(savedUser);
                    setUser(userData);
                    setScreen('home');
                }
            } catch (error) {
                console.log('Error al leer sesión:', error);
            }
        };
        checkUser();
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setScreen('home');
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('user');
        setUser(null);
        setScreen('login');
    };

    // Renderizado condicional de pantallas
    if (screen === 'home' && user) {
        return (
            <HomeScreen
                user={user}
                onLogout={handleLogout}
                onNavigateToHistorial={() => setScreen('historial')}
            />
        );
    }

    if (screen === 'historial' && user) {
        return (
            <HistorialScreen
                user={user}
                onBack={() => setScreen('home')}
            />
        );
    }

    if (screen === 'register') {
        return <RegisterScreen onNavigateToLogin={() => setScreen('login')} />;
    }

    return (
        <LoginScreen
            onNavigateToRegister={() => setScreen('register')}
            onLoginSuccess={handleLoginSuccess}
        />
    );
}*/
//version 6
/*import React, { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import HistorialScreen from './screens/HistorialScreen';
import ProyectoDetailScreen from './screens/ProyectoDetailScreen'; // Asegúrate de importar la vista del proyecto

export default function App() {
    const [user, setUser] = useState({ id: 1, nombreUsuario: 'Luis' }); // Tu usuario activo
    const [currentScreen, setCurrentScreen] = useState('HOME');
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

    const handleNavigateToProyecto = (proyecto) => {
        setProyectoSeleccionado(proyecto);
        setCurrentScreen('PROYECTO');
    };
    if (currentScreen === 'HISTORIAL') {
        return (
            <HistorialScreen
                user={user}
                onBack={() => setCurrentScreen('HOME')}
            />
        );
    }
    if (currentScreen === 'PROYECTO') {
        return (
            <ProyectoDetailScreen
                proyecto={proyectoSeleccionado}
                user={user}
                onBack={() => setCurrentScreen('HOME')}
            />
        );
    }
    return (
        <HomeScreen
            user={user}
            onLogout={() => console.log('Logout')}
            onNavigateToHistorial={() => setCurrentScreen('HISTORIAL')}
            onNavigateToProyecto={handleNavigateToProyecto}
        />
    );
}*/
//version 7
import React, { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import HistorialScreen from './screens/HistorialScreen';
import ProyectoDetailScreen from './screens/ProyectoDetailScreen';

export default function App() {
    const [user, setUser] = useState(null);
    const [authScreen, setAuthScreen] = useState('LOGIN'); // 'LOGIN' o 'REGISTER'
    const [currentScreen, setCurrentScreen] = useState('HOME');
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

    const handleNavigateToProyecto = (proyecto) => {
        setProyectoSeleccionado(proyecto);
        setCurrentScreen('PROYECTO');
    };

    // Si no hay usuario, maneja la navegación entre Login y Registro
    if (!user) {
        if (authScreen === 'REGISTER') {
            return (
                <RegisterScreen
                    onNavigateToLogin={() => setAuthScreen('LOGIN')}
                />
            );
        }

        return (
            <LoginScreen
                onLoginSuccess={(userData) => setUser(userData)}
                onNavigateToRegister={() => setAuthScreen('REGISTER')}
            />
        );
    }

    if (currentScreen === 'HISTORIAL') {
        return (
            <HistorialScreen
                user={user}
                onBack={() => setCurrentScreen('HOME')}
            />
        );
    }

    if (currentScreen === 'PROYECTO') {
        return (
            <ProyectoDetailScreen
                proyecto={proyectoSeleccionado}
                user={user}
                onBack={() => setCurrentScreen('HOME')}
            />
        );
    }

    return (
        <HomeScreen
            user={user}
            onLogout={() => {
                setUser(null);
                setCurrentScreen('HOME');
            }}
            onNavigateToHistorial={() => setCurrentScreen('HISTORIAL')}
            onNavigateToProyecto={handleNavigateToProyecto}
        />
    );
}