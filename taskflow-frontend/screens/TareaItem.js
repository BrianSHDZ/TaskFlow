import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TareaItem({ item, onPress, getPriorityStyle }) {
    const pStyle = getPriorityStyle(item.prioridad);
    const esCompletada = item.estatus === 'COMPLETADA';

    return (
        <TouchableOpacity
            style={styles.taskCard}
            onPress={() => onPress(item)}
        >
            <View style={{ flex: 1 }}>
                <Text style={[styles.taskTitle, esCompletada && styles.taskCompleted]}>
                    {item.titulo}
                </Text>
                {item.descripcion ? (
                    <Text style={styles.taskDesc} numberOfLines={2}>{item.descripcion}</Text>
                ) : null}

                <View style={styles.metaInfoRow}>
                    {esCompletada ? (
                        <Text style={styles.metaText}>Fecha de término: {item.terminadoTiempo || item.vencimiento || 'N/D'}</Text>
                    ) : (
                        <Text style={styles.metaText}>Vencimiento: {item.vencimiento || 'No definida'}</Text>
                    )}
                    <Text style={styles.metaText}>ID: {item.asignadoA}</Text>
                </View>

                <View style={styles.badgesRow}>
                    <Text style={[styles.badge, esCompletada && styles.badgeCompleted]}>
                        {item.estatus}
                    </Text>
                    <Text style={[styles.priorityBadge, { backgroundColor: pStyle.bg, color: pStyle.text }]}>
                        {item.prioridad ? item.prioridad.toUpperCase() : 'MEDIA'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    taskCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
    taskCompleted: { textDecorationLine: 'line-through', color: '#9CA3AF' },
    taskDesc: { fontSize: 12, color: '#6B7280', marginTop: 2 },
    metaInfoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
    metaText: { fontSize: 11, color: '#4B5563', fontWeight: '500' },
    badgesRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
    badge: { fontSize: 10, fontWeight: 'bold', color: '#D97706', backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    badgeCompleted: { color: '#10B981', backgroundColor: '#ECFDF5' },
    priorityBadge: { fontSize: 10, fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
});