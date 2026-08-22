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