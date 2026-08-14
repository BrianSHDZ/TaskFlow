import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl
} from 'react-native';
import { getTareasCompletadasPorUsuario, deleteTarea } from '../services/TareaService';

export default function HistorialScreen({ user, onBack }) {
    const [tareasCompletadas, setTareasCompletadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        cargarHistorial();
    }, []);

    const cargarHistorial = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const data = await getTareasCompletadasPorUsuario(user.id);
            setTareasCompletadas(data);
        } catch (error) {
            console.log('Error al cargar historial:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        cargarHistorial();
    };

    const handleEliminarHistorial = (id) => {
        Alert.alert('Eliminar del historial', '¿Deseas eliminar este registro de forma permanente?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteTarea(id);
                        cargarHistorial();
                    } catch (error) {
                        Alert.alert('Error', 'No se pudo eliminar la tarea del historial.');
                    }
                },
            },
        ]);
    };

    const renderTareaItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.titulo}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>COMPLETADA</Text>
                </View>
            </View>

            {item.descripcion ? (
                <Text style={styles.description}>{item.descripcion}</Text>
            ) : null}

            <View style={styles.cardFooter}>
                <Text style={styles.priorityText}>Prioridad: {item.prioridad || 'MEDIA'}</Text>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleEliminarHistorial(item.id)}
                >
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* ENCABEZADO CON BOTÓN DE REGRESAR */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Text style={styles.backButtonText}>← Volver al Inicio</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Historial de Tareas</Text>
                <Text style={styles.headerSubtitle}>
                    {tareasCompletadas.length} {tareasCompletadas.length === 1 ? 'tarea completada' : 'tareas completadas'}
                </Text>
            </View>

            {loading && !refreshing ? (
                <ActivityIndicator size="large" color="#10B981" style={styles.loader} />
            ) : tareasCompletadas.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>Sin historial</Text>
                    <Text style={styles.emptySubtitle}>Aún no has marcado ninguna tarea como completada.</Text>
                </View>
            ) : (
                <FlatList
                    data={tareasCompletadas}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderTareaItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#10B981']} />
                    }
                />
            )}
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
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        alignSelf: 'flex-start',
        paddingVertical: 4,
        paddingRight: 12,
        marginBottom: 8,
    },
    backButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2563EB',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    loader: {
        marginTop: 40,
    },
    listContent: {
        padding: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        flex: 1,
        marginRight: 8,
    },
    badge: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    badgeText: {
        color: '#059669',
        fontSize: 10,
        fontWeight: '800',
    },
    description: {
        fontSize: 13,
        color: '#4B5563',
        marginBottom: 12,
        lineHeight: 18,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    priorityText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    deleteButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    deleteButtonText: {
        color: '#EF4444',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4B5563',
        marginBottom: 4,
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        textAlign: 'center',
    },
});