/*import React, { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';

export default function App() {
  const [screen, setScreen] = useState('login'); // 'login' | 'register' | 'home'
  const [userEmail, setUserEmail] = useState('');

  const handleLoginSuccess = (email) => {
    setUserEmail(email);
    setScreen('home');
  };

  const handleLogout = () => {
    setUserEmail('');
    setScreen('login');
  };

  if (screen === 'home') {
    return <HomeScreen userEmail={userEmail} onLogout={handleLogout} />;
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
/*import React, { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';

export default function App() {
    const [screen, setScreen] = useState('login');
    const [user, setUser] = useState(null);

    // Al iniciar la app, verificar si ya existe una sesión guardada
    useEffect(() => {
        const checkUser = async () => {
            const savedUser = await AsyncStorage.getItem('user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        };
        checkUser();
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData); // Guarda la entidad Usuario recibida del Backend
        setScreen('home');
    };

    const handleLogout = () => {
        setUser(null);
        setScreen('login');
    };

    if (screen === 'home') {
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
import React, { useState, useEffect } from 'react'; // 👈 Se agrega useEffect
import AsyncStorage from '@react-native-async-storage/async-storage'; // 👈 Se agrega AsyncStorage
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';

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
}