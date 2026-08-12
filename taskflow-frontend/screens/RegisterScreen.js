//version 2
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
import { registerUser } from '../services/authService';

export default function RegisterScreen({ onNavigateToLogin }) {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!nombre || !email || !password) {
            Alert.alert('Atención', 'Por favor llena todos los campos');
            return;
        }

        setLoading(true);
        try {
            const data = await registerUser({ nombre, email, password });
            Alert.alert('Éxito', 'Cuenta creada correctamente');
            console.log('Respuesta:', data);
            onNavigateToLogin();
        } catch (error) {
            Alert.alert('Error', 'No se pudo crear la cuenta.');
            console.error(error);
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
                        <Text style={styles.subtitle}>Crea tu cuenta para comenzar</Text>
                    </View>

                    {/* Tarjeta del Formulario */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Crear Cuenta</Text>

                        <Text style={styles.label}>Nombre completo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Juan Pérez"
                            placeholderTextColor="#aaa"
                            value={nombre}
                            onChangeText={setNombre}
                        />

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
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>{loading ? 'Registrando...' : 'Registrarse'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onNavigateToLogin} style={styles.linkContainer}>
                            <Text style={styles.linkText}>
                                ¿Ya tienes cuenta? <Text style={styles.boldText}>Inicia sesión</Text>
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
        color: '#10B981',
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
        backgroundColor: '#10B981',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        backgroundColor: '#A7F3D0',
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
        color: '#10B981',
        fontWeight: '600',
    },
});