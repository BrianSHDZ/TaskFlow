/*import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function HomeScreen({ userEmail, onLogout }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hola,</Text>
                    <Text style={styles.userEmail}>{userEmail || 'Usuario'}</Text>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                    <Text style={styles.logoutText}>Salir</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Tus Tareas</Text>
                <View style={styles.emptyCard}>
                    <Text style={styles.emptyText}>No tienes tareas pendientes por ahora.</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    greeting: {
        fontSize: 14,
        color: '#6B7280',
    },
    userEmail: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    logoutButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#FEE2E2',
        borderRadius: 6,
    },
    logoutText: {
        color: '#DC2626',
        fontWeight: '600',
        fontSize: 13,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
    },
    emptyCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
});*/
//version 2
/*import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Modal,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { getTareas, createTarea, deleteTarea } from '../services/TareaService';

export default function HomeScreen({ user, onLogout }) {
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        cargarTareas();
    }, []);

    const cargarTareas = async () => {
        try {
            setLoading(true);
            const data = await getTareas();
            setTareas(data);
        } catch (error) {
            console.error('Error cargando tareas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCrearTarea = async () => {
        if (!titulo.trim()) {
            Alert.alert('Atención', 'El título de la tarea es obligatorio.');
            return;
        }

        setCreating(true);
        try {
            await createTarea({
                titulo,
                descripcion,
                estado: 'PENDIENTE',
            });
            setTitulo('');
            setDescripcion('');
            setModalVisible(false);
            cargarTareas();
        } catch (error) {
            Alert.alert('Error', 'No se pudo crear la tarea.');
        } finally {
            setCreating(false);
        }
    };

    const handleEliminarTarea = (id) => {
        Alert.alert('Eliminar Tarea', '¿Estás seguro de eliminar esta tarea?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteTarea(id);
                        cargarTareas();
                    } catch (error) {
                        Alert.alert('Error', 'No se pudo eliminar la tarea.');
                    }
                },
            },
        ]);
    };

    // Obtener el primer nombre para mostrar un saludo limpio
    const nombreMostrar = user?.nombreUsuario
        ? user.nombreUsuario.split(' ')[0]
        : 'Usuario';

    return (
        <View style={styles.container}>
            {/* Encabezado Principal *///}
            /*<View style={styles.header}>
                <View>
                    <Text style={styles.welcomeLabel}>Hola,</Text>
                    <Text style={styles.userName}>{nombreMostrar}</Text>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                    <Text style={styles.logoutText}>Salir</Text>
                </TouchableOpacity>
            </View>

            {/* Contenido Principal *///}
           /* <View style={styles.body}>

                {/* Sección de Tareas Rápidas *///}
                /*<View style={styles.sectionHeader}>
                    <View>
                        <Text style={styles.sectionTitle}>Tareas Rápidas</Text>
                        <Text style={styles.sectionSubtitle}>Pendientes personales sin proyecto</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.addButtonText}>+ Nueva</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 40 }} />
                ) : tareas.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No tienes tareas rápidas pendientes.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={tareas}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <View style={styles.taskCard}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.taskTitle}>{item.titulo}</Text>
                                    {item.descripcion ? (
                                        <Text style={styles.taskDescription}>{item.descripcion}</Text>
                                    ) : null}
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleEliminarTarea(item.id)}
                                    style={styles.deleteButton}
                                >
                                    <Text style={styles.deleteText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                )}
            </View>

            {/* Modal para Crear Tarea Rápida *///}
            /*<Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Nueva Tarea Rápida</Text>

                        <Text style={styles.label}>Título</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej. Comprar material o hacer llamada"
                            value={titulo}
                            onChangeText={setTitulo}
                        />

                        <Text style={styles.label}>Descripción (Opcional)</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Detalles breves..."
                            value={descripcion}
                            onChangeText={setDescripcion}
                            multiline
                            numberOfLines={3}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleCrearTarea}
                                disabled={creating}
                            >
                                <Text style={styles.saveText}>
                                    {creating ? 'Guardando...' : 'Guardar'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    welcomeLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
    userName: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },
    logoutButton: {
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    logoutText: {
        color: '#DC2626',
        fontWeight: '600',
        fontSize: 13,
    },
    body: {
        flex: 1,
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    sectionSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    addButton: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 13,
    },
    emptyContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 30,
        alignItems: 'center',
        marginTop: 10,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    taskCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    taskTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    taskDescription: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 4,
    },
    deleteButton: {
        padding: 8,
    },
    deleteText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
    },
    input: {
        borderColor: '#E5E7EB',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 14,
        fontSize: 14,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 10,
    },
    cancelButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    cancelText: {
        color: '#6B7280',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 8,
    },
    saveText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});*/
//version 3
/*import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { getTareasPorUsuario, createTarea, deleteTarea } from '../services/TareaService';

export default function HomeScreen({ user, onLogout }) {
    const [tareas, setTareas] = useState([]);
    const [loadingTareas, setLoadingTareas] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [proyectoId, setProyectoId] = useState('1'); // Valor por defecto para pruebas
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        cargarTareas();
    }, []);

    const cargarTareas = async () => {
        if (!user?.id) {
            setLoadingTareas(false);
            return;
        }
        try {
            setLoadingTareas(true);
            const data = await getTareasPorUsuario(user.id);
            setTareas(data);
        } catch (error) {
            console.log('Error al obtener tareas:', error);
        } finally {
            setLoadingTareas(false);
        }
    };

    const handleCrearTarea = async () => {
        if (!titulo.trim()) {
            Alert.alert('Atención', 'El título de la tarea es obligatorio.');
            return;
        }

        setCreating(true);
        try {
            await createTarea({
                titulo: titulo,
                descripcion: descripcion,
                estatus: 'PENDIENTE',
                prioridad: 'MEDIA',
                proyectoId: parseInt(proyectoId) || 1,
                asignadoA: user?.id || 1,
            });
            setTitulo('');
            setDescripcion('');
            setModalVisible(false);
            cargarTareas();
        } catch (error) {
            Alert.alert('Error', 'No se pudo crear la tarea. Revisa que el proyectoId exista.');
        } finally {
            setCreating(false);
        }
    };

    const handleEliminarTarea = (id) => {
        Alert.alert('Eliminar Tarea', '¿Estás seguro de eliminar esta tarea?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteTarea(id);
                        cargarTareas();
                    } catch (error) {
                        Alert.alert('Error', 'No se pudo eliminar la tarea.');
                    }
                },
            },
        ]);
    };

    const nombreMostrar = user?.nombreUsuario
        ? user.nombreUsuario.split(' ')[0]
        : 'Usuario';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeLabel}>Hola,</Text>
                    <Text style={styles.userName}>{nombreMostrar}</Text>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                    <Text style={styles.logoutText}>Salir</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>Mis Tareas</Text>
                            <Text style={styles.sectionSubtitle}>Listado de pendientes asignados</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={styles.addButtonText}>+ Nueva</Text>
                        </TouchableOpacity>
                    </View>

                    {loadingTareas ? (
                        <ActivityIndicator size="small" color="#2563EB" style={{ marginVertical: 20 }} />
                    ) : tareas.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No tienes tareas asignadas.</Text>
                        </View>
                    ) : (
                        tareas.map((item) => (
                            <View key={item.id} style={styles.taskCard}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.taskTitle}>{item.titulo}</Text>
                                    {item.descripcion ? (
                                        <Text style={styles.taskDescription}>{item.descripcion}</Text>
                                    ) : null}
                                    <Text style={styles.badge}>{item.estatus}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleEliminarTarea(item.id)}
                                    style={styles.deleteButton}
                                >
                                    <Text style={styles.deleteText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Nueva Tarea</Text>

                        <Text style={styles.label}>Título</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej. Diseñar prototipo"
                            value={titulo}
                            onChangeText={setTitulo}
                        />

                        <Text style={styles.label}>ID Proyecto</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="1"
                            keyboardType="numeric"
                            value={proyectoId}
                            onChangeText={setProyectoId}
                        />

                        <Text style={styles.label}>Descripción</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Detalles de la tarea..."
                            value={descripcion}
                            onChangeText={setDescripcion}
                            multiline
                            numberOfLines={3}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleCrearTarea}
                                disabled={creating}
                            >
                                <Text style={styles.saveText}>
                                    {creating ? 'Guardando...' : 'Guardar'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    welcomeLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
    userName: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },
    logoutButton: {
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    logoutText: {
        color: '#DC2626',
        fontWeight: '600',
        fontSize: 13,
    },
    body: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionContainer: {
        width: '100%',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    sectionSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    addButton: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 12,
    },
    emptyContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 13,
    },
    taskCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
    },
    taskTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    taskDescription: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 4,
    },
    badge: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2563EB',
        marginTop: 6,
        backgroundColor: '#EFF6FF',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    deleteButton: {
        padding: 8,
    },
    deleteText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
    },
    input: {
        borderColor: '#E5E7EB',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 14,
        fontSize: 14,
    },
    textArea: {
        height: 70,
        textAlignVertical: 'top',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 10,
    },
    cancelButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    cancelText: {
        color: '#6B7280',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 8,
    },
    saveText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});*/
//version 4
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { getTareasPorUsuario, createTarea, createTareaRapida, deleteTarea } from '../services/TareaService';

export default function HomeScreen({ user, onLogout }) {
    // Estado para Tareas
    const [tareas, setTareas] = useState([]);
    const [loadingTareas, setLoadingTareas] = useState(true);
    const [modalTareaVisible, setModalTareaVisible] = useState(false);

    // Formulario Tarea
    const [tituloTarea, setTituloTarea] = useState('');
    const [descripcionTarea, setDescripcionTarea] = useState('');
    const [proyectoIdTarea, setProyectoIdTarea] = useState('1');
    const [creatingTarea, setCreatingTarea] = useState(false);

    // Estado para Proyectos
    const [proyectos, setProyectos] = useState([]);
    const [modalProyectoVisible, setModalProyectoVisible] = useState(false);
    const [nombreProyecto, setNombreProyecto] = useState('');

    useEffect(() => {
        cargarTareas();
    }, []);

    const cargarTareas = async () => {
        if (!user?.id) {
            setLoadingTareas(false);
            return;
        }
        try {
            setLoadingTareas(true);
            const data = await getTareasPorUsuario(user.id);
            setTareas(data);
        } catch (error) {
            console.log('Error al obtener tareas:', error);
        } finally {
            setLoadingTareas(false);
        }
    };

    const handleCrearTarea = async () => {
        if (!tituloTarea.trim()) {
            Alert.alert('Atención', 'El título de la tarea es obligatorio.');
            return;
        }

        setCreatingTarea(true);
        try {
            await createTareaRapida({
                titulo: tituloTarea,
                descripcion: descripcionTarea,
                estatus: 'PENDIENTE',
                prioridad: 'MEDIA',
                asignadoA: user?.id || 1,
            });

            setTituloTarea('');
            setDescripcionTarea('');
            setModalTareaVisible(false);
            cargarTareas();
        } catch (error) {
            console.log('Error al crear tarea rápida:', error);
            Alert.alert('Error', 'No se pudo crear la tarea rápida.');
        } finally {
            setCreatingTarea(false);
        }
    };

    const handleCrearProyecto = () => {
        if (!nombreProyecto.trim()) {
            Alert.alert('Atención', 'El nombre del proyecto es obligatorio.');
            return;
        }
        const nuevoProj = { id: Date.now(), nombre: nombreProyecto };
        setProyectos([...proyectos, nuevoProj]);
        setNombreProyecto('');
        setModalProyectoVisible(false);
    };

    const handleEliminarTarea = (id) => {
        Alert.alert('Eliminar Tarea', '¿Estás seguro de eliminar esta tarea?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteTarea(id);
                        cargarTareas();
                    } catch (error) {
                        Alert.alert('Error', 'No se pudo eliminar la tarea.');
                    }
                },
            },
        ]);
    };

    const nombreMostrar = user?.nombreUsuario
        ? user.nombreUsuario.split(' ')[0]
        : 'Usuario';

    return (
        <View style={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeLabel}>Hola,</Text>
                    <Text style={styles.userName}>{nombreMostrar}</Text>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                    <Text style={styles.logoutText}>Salir</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

                {/* SECCIÓN 1: MIS PROYECTOS */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>Mis Proyectos</Text>
                            <Text style={styles.sectionSubtitle}>Espacios de trabajo en equipo</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => setModalProyectoVisible(true)}
                        >
                            <Text style={styles.addButtonText}>+ Proyecto</Text>
                        </TouchableOpacity>
                    </View>

                    {proyectos.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No tienes proyectos creados.</Text>
                        </View>
                    ) : (
                        proyectos.map((proj) => (
                            <View key={proj.id} style={styles.projectCard}>
                                <Text style={styles.projectTitle}>{proj.nombre}</Text>
                            </View>
                        ))
                    )}
                </View>

                {/* SECCIÓN 2: TAREAS RÁPIDAS */}
                <View style={[styles.sectionContainer, { marginTop: 24 }]}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>Tareas Rápidas</Text>
                            <Text style={styles.sectionSubtitle}>Pendientes y asignaciones directas</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: '#10B981' }]}
                            onPress={() => setModalTareaVisible(true)}
                        >
                            <Text style={styles.addButtonText}>+ Nueva</Text>
                        </TouchableOpacity>
                    </View>

                    {loadingTareas ? (
                        <ActivityIndicator size="small" color="#2563EB" style={{ marginVertical: 20 }} />
                    ) : tareas.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No tienes tareas rápidas pendientes.</Text>
                        </View>
                    ) : (
                        tareas.map((item) => (
                            <View key={item.id} style={styles.taskCard}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.taskTitle}>{item.titulo}</Text>
                                    {item.descripcion ? (
                                        <Text style={styles.taskDescription}>{item.descripcion}</Text>
                                    ) : null}
                                    <Text style={styles.badge}>{item.estatus}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleEliminarTarea(item.id)}
                                    style={styles.deleteButton}
                                >
                                    <Text style={styles.deleteText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* MODAL CREAR PROYECTO */}
            <Modal visible={modalProyectoVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Nuevo Proyecto</Text>

                        <Text style={styles.label}>Nombre del Proyecto</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej. Sistema de Inventario"
                            value={nombreProyecto}
                            onChangeText={setNombreProyecto}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalProyectoVisible(false)}
                            >
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.saveButton} onPress={handleCrearProyecto}>
                                <Text style={styles.saveText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* MODAL CREAR TAREA RÁPIDA */}
            <Modal visible={modalTareaVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Nueva Tarea Rápida</Text>

                        <Text style={styles.label}>Título</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej. Comprar componentes"
                            value={tituloTarea}
                            onChangeText={setTituloTarea}
                        />

                        <Text style={styles.label}>Descripción</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Detalles breves..."
                            value={descripcionTarea}
                            onChangeText={setDescripcionTarea}
                            multiline={true}
                            numberOfLines={3}
                            textAlignVertical="top"      // 1. Evita saltos y errores de layout nativo en Android
                            autoCorrect={false}          // 2. Evita el crash del motor de autocorrección de Android
                            spellCheck={false}           // 3. Desactiva la revisión ortográfica continua de secuencias repetidas
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalTareaVisible(false)}
                            >
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.saveButton, { backgroundColor: '#10B981' }]}
                                onPress={handleCrearTarea}
                                disabled={creatingTarea}
                            >
                                <Text style={styles.saveText}>
                                    {creatingTarea ? 'Guardando...' : 'Guardar'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    welcomeLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
    userName: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },
    logoutButton: {
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    logoutText: {
        color: '#DC2626',
        fontWeight: '600',
        fontSize: 13,
    },
    body: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionContainer: {
        width: '100%',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    sectionSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    addButton: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 12,
    },
    emptyContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 13,
    },
    projectCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        elevation: 1,
    },
    projectTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    taskCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
    },
    taskTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    taskDescription: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 4,
    },
    badge: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#10B981',
        marginTop: 6,
        backgroundColor: '#ECFDF5',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    deleteButton: {
        padding: 8,
    },
    deleteText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
    },
    input: {
        borderColor: '#E5E7EB',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 14,
        fontSize: 14,
    },
    textArea: {
        height: 70,
        textAlignVertical: 'top',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 10,
    },
    cancelButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    cancelText: {
        color: '#6B7280',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 8,
    },
    saveText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});