//version 3
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { loginUser } from '../services/authService';

export default function LoginScreen({ onNavigateToRegister, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Atención', 'Por favor ingresa tu correo y contraseña');
            return;
        }

        setLoading(true);
        try {
            const usuarioRespuesta = await loginUser({ email, password });

            if (onLoginSuccess) {
                onLoginSuccess(usuarioRespuesta);
            }
        } catch (error) {
            Alert.alert('Error de acceso', 'Credenciales incorrectas o servidor no disponible.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>

                    {/* Cabecera */}
                    <View style={styles.headerContainer}>
                        <Text style={styles.logoText}>TaskFlow</Text>
                        <Text style={styles.subtitle}>Gestión de tareas sin complicaciones</Text>
                    </View>

                    {/* Tarjeta del Formulario */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Iniciar Sesión</Text>

                        <Text style={styles.label}>Correo electrónico</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="ejemplo@correo.com"
                            placeholderTextColor="#aaa"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#aaa"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Entrar'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onNavigateToRegister} style={styles.linkContainer}>
                            <Text style={styles.linkText}>
                                ¿No tienes cuenta? <Text style={styles.boldText}>Regístrate</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    logoText: {
        fontSize: 36,
        fontWeight: '800',
        color: '#2563EB',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
    },
    input: {
        height: 48,
        borderColor: '#E5E7EB',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 14,
        fontSize: 15,
        backgroundColor: '#F9FAFB',
        color: '#1F2937',
        marginBottom: 16,
    },
    button: {
        height: 48,
        backgroundColor: '#2563EB',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        backgroundColor: '#93C5FD',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    linkContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: '#6B7280',
        fontSize: 14,
    },
    boldText: {
        color: '#2563EB',
        fontWeight: '600',
    },
});