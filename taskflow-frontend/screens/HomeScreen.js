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
import {
    getTareasPendientesPorUsuario,
    createTareaRapida,
    deleteTarea,
    updateTareaStatus
} from '../services/TareaService';
import {
    getProyectosPorUsuario,
    createProyecto
} from '../services/ProyectoService';

export default function HomeScreen({ user, onLogout, onNavigateToHistorial, onNavigateToProyecto }) {
    // Estado Tareas
    const [tareas, setTareas] = useState([]);
    const [loadingTareas, setLoadingTareas] = useState(true);
    const [modalTareaVisible, setModalTareaVisible] = useState(false);

    // Estado Modal Detalle Tarea
    const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
    const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    // Formulario Crear Tarea
    const [tituloTarea, setTituloTarea] = useState('');
    const [descripcionTarea, setDescripcionTarea] = useState('');
    const [prioridadTarea, setPrioridadTarea] = useState('MEDIA');
    const [creatingTarea, setCreatingTarea] = useState(false);

    // Estado Proyectos
    const [proyectos, setProyectos] = useState([]);
    const [loadingProyectos, setLoadingProyectos] = useState(true);
    const [modalProyectoVisible, setModalProyectoVisible] = useState(false);
    const [nombreProyecto, setNombreProyecto] = useState('');
    const [descripcionProyecto, setDescripcionProyecto] = useState('');
    const [creatingProyecto, setCreatingProyecto] = useState(false);

    useEffect(() => {
        cargarDatos();
    }, [user?.id]);

    const cargarDatos = () => {
        cargarTareas();
        cargarProyectos();
    };

    const cargarTareas = async () => {
        if (!user?.id) {
            setLoadingTareas(false);
            return;
        }
        try {
            setLoadingTareas(true);
            // Obtiene directamente solo tareas PENDIENTES ordenadas por prioridad desde el backend
            const data = await getTareasPendientesPorUsuario(user.id);
            setTareas(data);
        } catch (error) {
            console.log('Error al obtener tareas pendientes:', error);
        } finally {
            setLoadingTareas(false);
        }
    };

    const cargarProyectos = async () => {
        if (!user?.id) {
            setLoadingProyectos(false);
            return;
        }
        try {
            setLoadingProyectos(true);
            const data = await getProyectosPorUsuario(user.id);
            const proyectosActivos = data.filter(proj => proj.estatus !== 'COMPLETADO');
            setProyectos(proyectosActivos);
        } catch (error) {
            console.log('Error al obtener proyectos:', error);
        } finally {
            setLoadingProyectos(false);
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
                titulo: tituloTarea.trim(),
                descripcion: descripcionTarea.trim() || null,
                prioridad: prioridadTarea,
                asignadoA: user?.id,
            });

            setTituloTarea('');
            setDescripcionTarea('');
            setPrioridadTarea('MEDIA');
            setModalTareaVisible(false);
            cargarTareas();
        } catch (error) {
            console.log('Error al crear tarea rápida:', error);
            Alert.alert('Error', 'No se pudo crear la tarea rápida.');
        } finally {
            setCreatingTarea(false);
        }
    };

    const handleCrearProyecto = async () => {
        if (!nombreProyecto.trim()) {
            Alert.alert('Atención', 'El nombre del proyecto es obligatorio.');
            return;
        }

        setCreatingProyecto(true);
        try {
            await createProyecto({
                titulo: nombreProyecto.trim(),
                descripcion: descripcionProyecto.trim() || null,
                creadoPor: user?.id,
            });

            setNombreProyecto('');
            setDescripcionProyecto('');
            setModalProyectoVisible(false);
            cargarProyectos();
        } catch (error) {
            console.log('Error al crear proyecto:', error);
            Alert.alert('Error', 'No se pudo crear el proyecto.');
        } finally {
            setCreatingProyecto(false);
        }
    };

    const abrirDetalleTarea = (tarea) => {
        setTareaSeleccionada(tarea);
        setModalDetalleVisible(true);
    };

    const cerrarDetalleTarea = () => {
        setModalDetalleVisible(false);
        setTareaSeleccionada(null);
    };

    const handleCompletarTarea = async () => {
        if (!tareaSeleccionada) return;
        setUpdatingStatus(true);
        try {
            await updateTareaStatus(tareaSeleccionada.id);
            cerrarDetalleTarea();
            cargarTareas(); // Se recarga y la tarea completada desaparece de esta vista
        } catch (error) {
            console.log('Error al completar tarea:', error);
            Alert.alert('Error', 'No se pudo marcar la tarea como completada.');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleEliminarTareaDesdeDetalle = () => {
        if (!tareaSeleccionada) return;
        Alert.alert('Eliminar Tarea', '¿Estás seguro de eliminar esta tarea definitivamente?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteTarea(tareaSeleccionada.id);
                        cerrarDetalleTarea();
                        cargarTareas();
                    } catch (error) {
                        Alert.alert('Error', 'No se pudo eliminar la tarea.');
                    }
                },
            },
        ]);
    };

    const getPriorityStyle = (prioridad) => {
        switch (prioridad) {
            case 'ALTA':
                return { bg: '#FEE2E2', text: '#DC2626' };
            case 'MEDIA':
                return { bg: '#FEF3C7', text: '#D97706' };
            case 'BAJA':
            default:
                return { bg: '#E0E7FF', text: '#4338CA' };
        }
    };

    const nombreMostrar = user?.nombreUsuario
        ? user.nombreUsuario.split(' ')[0]
        : 'Usuario';

    return (
        <View style={styles.container}>
            {/* Header */}
             <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeLabel}>Hola,</Text>
                    <Text style={styles.userName}>{nombreMostrar}</Text>
                </View>

                <View style={styles.headerRightButtons}>
                    <TouchableOpacity
                        style={styles.historialButton}
                        onPress={onNavigateToHistorial}
                    >
                        <Text style={styles.historialText}>Historial</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                        <Text style={styles.logoutText}>Salir</Text>
                    </TouchableOpacity>
                </View>
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

                    {loadingProyectos ? (
                        <ActivityIndicator size="small" color="#2563EB" style={{ marginVertical: 15 }} />
                    ) : proyectos.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No tienes proyectos creados.</Text>
                        </View>
                    ) : (
                        proyectos.map((proj) => (
                            <TouchableOpacity
                                key={proj.id}
                                style={styles.projectCard}
                                activeOpacity={0.7}
                                onPress={() => onNavigateToProyecto && onNavigateToProyecto(proj)}
                            >
                                <Text style={styles.projectTitle}>{proj.titulo || proj.nombre}</Text>
                                <Text style={styles.projectSubtext}>
                                    {proj.totalTareas > 0
                                        ? `${proj.tareasCompletadas || 0} de ${proj.totalTareas} tareas completadas`
                                        : (proj.descripcion || 'Sin tareas asignadas')}
                                </Text>
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                {/* SECCIÓN 2: TAREAS RÁPIDAS PENDIENTES */}
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
                        tareas.map((item) => {
                            const pStyle = getPriorityStyle(item.prioridad);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.taskCard}
                                    activeOpacity={0.7}
                                    onPress={() => abrirDetalleTarea(item)}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.taskTitle}>{item.titulo}</Text>
                                        {item.descripcion ? (
                                            <Text style={styles.taskDescription} numberOfLines={2}>
                                                {item.descripcion}
                                            </Text>
                                        ) : null}
                                        <View style={styles.badgesRow}>
                                            <Text style={styles.badge}>{item.estatus}</Text>
                                            <Text
                                                style={[
                                                    styles.priorityBadge,
                                                    { backgroundColor: pStyle.bg, color: pStyle.text },
                                                ]}
                                            >
                                                {item.prioridad || 'MEDIA'}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* MODAL DETALLE DE TAREA */}
            <Modal
                visible={modalDetalleVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={cerrarDetalleTarea}
            >
                <TouchableOpacity
                    style={styles.sheetOverlay}
                    activeOpacity={1}
                    onPress={cerrarDetalleTarea}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.sheetContainer}>
                        <View style={styles.dragIndicator} />

                        <TouchableOpacity style={styles.backLink} onPress={cerrarDetalleTarea}>
                            <Text style={styles.backLinkText}>← Volver a Inicio</Text>
                        </TouchableOpacity>

                        {tareaSeleccionada && (
                            <View style={{ width: '100%' }}>
                                <View style={styles.typeBadge}>
                                    <Text style={styles.typeBadgeText}>Tarea Rápida</Text>
                                </View>

                                <Text style={styles.sheetTitle}>{tareaSeleccionada.titulo}</Text>

                                <Text style={styles.sheetLabel}>Descripción</Text>
                                <Text style={styles.sheetDescription}>
                                    {tareaSeleccionada.descripcion || 'Sin descripción detallada.'}
                                </Text>

                                <View style={styles.metaRow}>
                                    <Text style={styles.metaText}>
                                        Estatus: <Text style={styles.boldText}>{tareaSeleccionada.estatus}</Text>
                                    </Text>
                                    <Text style={styles.metaText}>
                                        Prioridad:{' '}
                                        <Text
                                            style={[
                                                styles.boldText,
                                                { color: getPriorityStyle(tareaSeleccionada.prioridad).text },
                                            ]}
                                        >
                                            {tareaSeleccionada.prioridad || 'MEDIA'}
                                        </Text>
                                    </Text>
                                </View>

                                <View style={styles.actionButtonsContainer}>
                                    <TouchableOpacity
                                        style={styles.completeButton}
                                        onPress={handleCompletarTarea}
                                        disabled={updatingStatus}
                                    >
                                        <Text style={styles.completeButtonText}>
                                            {updatingStatus ? 'Actualizando...' : '✓ Marcar como Completada'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.deleteSheetButton}
                                        onPress={handleEliminarTareaDesdeDetalle}
                                    >
                                        <Text style={styles.deleteSheetButtonText}>Eliminar Tarea</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

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

                        <Text style={styles.label}>Descripción (Opcional)</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Objetivo del proyecto..."
                            value={descripcionProyecto}
                            onChangeText={setDescripcionProyecto}
                            multiline={true}
                            numberOfLines={2}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalProyectoVisible(false)}
                            >
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleCrearProyecto}
                                disabled={creatingProyecto}
                            >
                                <Text style={styles.saveText}>
                                    {creatingProyecto ? 'Guardando...' : 'Guardar'}
                                </Text>
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
                            textAlignVertical="top"
                            autoCorrect={false}
                            spellCheck={false}
                        />

                        <Text style={styles.label}>Prioridad</Text>
                        <View style={styles.prioritySelector}>
                            {['BAJA', 'MEDIA', 'ALTA'].map((p) => {
                                const active = prioridadTarea === p;
                                const pColor = getPriorityStyle(p);
                                return (
                                    <TouchableOpacity
                                        key={p}
                                        style={[
                                            styles.priorityOption,
                                            active && { backgroundColor: pColor.bg, borderColor: pColor.text },
                                        ]}
                                        onPress={() => setPrioridadTarea(p)}
                                    >
                                        <Text
                                            style={[
                                                styles.priorityOptionText,
                                                active && { color: pColor.text, fontWeight: '800' },
                                            ]}
                                        >
                                            {p}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

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
    headerRightButtons: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    historialButton: {
        backgroundColor: '#E0E7FF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    historialText: {
        color: '#3730A3',
        fontWeight: '600',
        fontSize: 13,
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
    projectSubtext: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
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
    badgesRow: {
        flexDirection: 'row',
        gap: 6,
        marginTop: 8,
        alignItems: 'center',
    },
    badge: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#10B981',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    priorityBadge: {
        fontSize: 10,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    sheetOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    sheetContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 34,
        alignItems: 'center',
    },
    dragIndicator: {
        width: 38,
        height: 5,
        backgroundColor: '#D1D5DB',
        borderRadius: 3,
        marginBottom: 12,
    },
    backLink: {
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    backLinkText: {
        color: '#2563EB',
        fontWeight: '600',
        fontSize: 13,
    },
    typeBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    typeBadgeText: {
        fontSize: 11,
        color: '#4B5563',
        fontWeight: '600',
    },
    sheetTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 14,
    },
    sheetLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    sheetDescription: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
        marginBottom: 16,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    metaText: {
        fontSize: 13,
        color: '#6B7280',
    },
    boldText: {
        fontWeight: '700',
        color: '#10B981',
    },
    actionButtonsContainer: {
        gap: 10,
    },
    completeButton: {
        backgroundColor: '#10B981',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    completeButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    deleteSheetButton: {
        backgroundColor: '#FEE2E2',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    deleteSheetButtonText: {
        color: '#DC2626',
        fontWeight: '600',
        fontSize: 14,
    },
    prioritySelector: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 14,
    },
    priorityOption: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
    },
    priorityOptionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
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