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
import { searchUsuarios } from '../services/UsuarioService';
import {
    getTareasPorProyecto,
    createTarea,
    updateTareaStatus,
    updateTareaCompleta,
    deleteTarea
} from '../services/TareaService';
import { iniciarRegistroTiempo, obtenerRegistrosPorTarea } from '../services/RegistroTiempoService';
import TareaItem from './TareaItem';
import { updateProyectoStatus } from '../services/ProyectoService';

export default function ProyectoDetailScreen({ proyecto, user, onBack }) {
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal Crear Tarea del Proyecto
    const [modalCrearVisible, setModalCrearVisible] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [registroTiempo, setRegistroTiempo] = useState(null);
    const [prioridad, setPrioridad] = useState('MEDIA');

    // Fechas separadas
    const [fechaVencimiento, setFechaVencimiento] = useState('');
    const [horaVencimiento, setHoraVencimiento] = useState('');

    // Asignación por Nombre o Correo (Crear)
    const [asignadoInput, setAsignadoInput] = useState('');
    const [sugerenciasCrear, setSugerenciasCrear] = useState([]);
    const [mostrarSugerenciasCrear, setMostrarSugerenciasCrear] = useState(false);
    const [asignadoIdFinalCrear, setAsignadoIdFinalCrear] = useState(null);
    const [usuarioSeleccionadoObjCrear, setUsuarioSeleccionadoObjCrear] = useState(null);

    const [saving, setSaving] = useState(false);

    // Modal de Detalle / Edición de Tarea
    const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
    const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Campos editables
    const [editTitulo, setEditTitulo] = useState('');
    const [editDescripcion, setEditDescripcion] = useState('');
    const [editPrioridad, setEditPrioridad] = useState('MEDIA');
    const [editFechaVencimiento, setEditFechaVencimiento] = useState('');
    const [editHoraVencimiento, setEditHoraVencimiento] = useState('');

    // Asignación por Nombre o Correo (Editar)
    const [editAsignadoInput, setEditAsignadoInput] = useState('');
    const [sugerenciasEditar, setSugerenciasEditar] = useState([]);
    const [mostrarSugerenciasEditar, setMostrarSugerenciasEditar] = useState(false);
    const [asignadoIdFinalEditar, setAsignadoIdFinalEditar] = useState(null);
    const [usuarioSeleccionadoObjEditar, setUsuarioSeleccionadoObjEditar] = useState(null);

    // Panel Retráctil / Gestor de Proyecto del Líder
    const [panelLiderExpandido, setPanelLiderExpandido] = useState(false);
    const [correoNuevoColaborador, setCorreoNuevoColaborador] = useState('');
    const [codigoQrInput, setCodigoQrInput] = useState('');
    const [usuariosDb, setUsuariosDb] = useState([]);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await fetch('http://10.0.2.2:8080/api/taskflow/usuario');
                if (response.ok) {
                    const data = await response.json();
                    setUsuariosDb(data);
                }
            } catch (error) {
                console.error("Error al cargar los usuarios de la base de datos:", error);
            }
        };
        fetchUsuarios();
    }, []);

    useEffect(() => {
        cargarTareasDelProyecto();
    }, [proyecto?.id]);

    const cargarTareasDelProyecto = async () => {
        if (!proyecto?.id) return;
        try {
            setLoading(true);
            const data = await getTareasPorProyecto(proyecto.id);
            setTareas(data);
        } catch (error) {
            console.log('Error al obtener tareas del proyecto:', error);
        } finally {
            setLoading(false);
        }
    };

    // Efecto para buscar usuarios en tiempo real (Crear)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (asignadoInput.trim().length > 1) {
                try {
                    const resultados = await searchUsuarios(asignadoInput);
                    setSugerenciasCrear(resultados);
                    setMostrarSugerenciasCrear(true);
                } catch (e) {
                    console.log(e);
                }
            } else {
                setSugerenciasCrear([]);
                setMostrarSugerenciasCrear(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [asignadoInput]);

    // Efecto para buscar usuarios en tiempo real (Editar)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (editAsignadoInput.trim().length > 1) {
                try {
                    const resultados = await searchUsuarios(editAsignadoInput);
                    setSugerenciasEditar(resultados);
                    setMostrarSugerenciasEditar(true);
                } catch (e) {
                    console.log(e);
                }
            } else {
                setSugerenciasEditar([]);
                setMostrarSugerenciasEditar(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [editAsignadoInput]);

    const construirFechaHora = (fecha, hora) => {
        if (!fecha.trim()) return null;
        const h = hora.trim() ? hora.trim() : '00:00:00';
        return `${fecha.trim()} ${h}`;
    };

    const handleCrearTarea = async () => {
        if (!titulo.trim()) {
            Alert.alert('Atención', 'El título es obligatorio.');
            return;
        }

        setSaving(true);
        try {
            const vencimientoCompleto = construirFechaHora(fechaVencimiento, horaVencimiento);

            const response = await createTarea({
                titulo: titulo.trim(),
                descripcion: descripcion.trim() || null,
                prioridad: prioridad,
                vencimiento: vencimientoCompleto,
                asignadoA: asignadoIdFinalCrear,
                asignadoAInput: asignadoIdFinalCrear ? null : (asignadoInput.trim() ? asignadoInput.trim() : null),
                proyectoId: proyecto.id,
            });

            const nuevaTareaCreada = response.data || response;
            const tareaId = nuevaTareaCreada?.id;

            if (tareaId && asignadoIdFinalCrear) {
                try {
                    await iniciarRegistroTiempo(tareaId, asignadoIdFinalCrear);
                    console.log("Cronómetro iniciado automáticamente.");
                } catch (cronError) {
                    console.log('Aviso: No se pudo iniciar el cronómetro automáticamente:', cronError);
                }
            }

            setTitulo('');
            setDescripcion('');
            setPrioridad('MEDIA');
            setFechaVencimiento('');
            setHoraVencimiento('');
            setAsignadoInput('');
            setAsignadoIdFinalCrear(null);
            setUsuarioSeleccionadoObjCrear(null);
            setModalCrearVisible(false);

            if (typeof cargarTareasDelProyecto === 'function') {
                cargarTareasDelProyecto();
            }

        } catch (error) {
            console.log('Error al crear tarea:', error);
            Alert.alert('Error', 'No se pudo crear la tarea. Verifica los datos.');
        } finally {
            setSaving(false);
        }
    };

    const handleCompletarTarea = async (tareaId) => {
        try {
            await updateTareaStatus(tareaId);
            setModalDetalleVisible(false);
            cargarTareasDelProyecto();
        } catch (error) {
            Alert.alert('Error', 'No se pudo completar la tarea.');
        }
    };

    const handleActualizarTarea = async () => {
        if (tareaSeleccionada?.estatus === 'COMPLETADA') {
            Alert.alert('Acción no permitida', 'Las tareas completadas no se pueden modificar.');
            return;
        }

        if (!editTitulo.trim()) {
            Alert.alert('Atención', 'El título no puede estar vacío.');
            return;
        }

        try {
            const vencimientoCompleto = construirFechaHora(editFechaVencimiento, editHoraVencimiento);

            await updateTareaCompleta(tareaSeleccionada.id, {
                titulo: editTitulo.trim(),
                descripcion: editDescripcion.trim() || null,
                prioridad: editPrioridad,
                estatus: tareaSeleccionada.estatus,
                vencimiento: vencimientoCompleto,
                asignadoA: asignadoIdFinalEditar,
                asignadoAInput: asignadoIdFinalEditar ? null : (editAsignadoInput.trim() ? editAsignadoInput.trim() : null),
                proyectoId: proyecto.id,
            });

            setIsEditing(false);
            setModalDetalleVisible(false);
            cargarTareasDelProyecto();
            Alert.alert('Éxito', 'Tarea actualizada correctamente.');
        } catch (error) {
            console.log('Error al actualizar tarea:', error);
            Alert.alert('Error', 'No se pudo actualizar la tarea.');
        }
    };

    const handleEliminarTarea = async (tareaId, estatus) => {
        if (estatus === 'COMPLETADA') {
            Alert.alert('Acción no permitida', 'Las tareas completadas no se pueden eliminar.');
            return;
        }

        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que deseas eliminar esta tarea?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteTarea(tareaId);
                            setModalDetalleVisible(false);
                            cargarTareasDelProyecto();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la tarea.');
                        }
                    }
                }
            ]
        );
    };

    const abrirDetalleTarea = async (tarea) => {
        setTareaSeleccionada(tarea);
        setEditTitulo(tarea.titulo || '');
        setEditDescripcion(tarea.descripcion || '');
        setEditPrioridad(tarea.prioridad ? tarea.prioridad.toUpperCase() : 'MEDIA');

        if (tarea.vencimiento) {
            const partes = tarea.vencimiento.split(' ');
            setEditFechaVencimiento(partes[0] || '');
            setEditHoraVencimiento(partes[1] || '');
        } else {
            setEditFechaVencimiento('');
            setEditHoraVencimiento('');
        }

        setEditAsignadoInput(tarea.asignadoNombre || tarea.usuarioAsignado?.nombre || '');
        setAsignadoIdFinalEditar(tarea.asignadoA || null);
        const usuarioModal = usuariosDb.find(u => u.id === tarea.asignadoA);

        setUsuarioSeleccionadoObjEditar({
            nombreUsuario: usuarioModal ? usuarioModal.nombreUsuario : 'Usuario',
            correo: usuarioModal ? usuarioModal.correo : 'Correo no disponible',
            id: tarea.asignadoA
        });

        setIsEditing(false);
        setModalDetalleVisible(true);
        setRegistroTiempo(null);
        try {
            const registros = await obtenerRegistrosPorTarea(tarea.id);
            if (registros && registros.length > 0) {
                setRegistroTiempo(registros[registros.length - 1]);
            }
        } catch (error) {
            console.log('Error al obtener el registro de tiempo:', error);
        }
    };

    const getPriorityStyle = (p) => {
        const priorityStr = p ? p.toUpperCase() : 'MEDIA';
        switch (priorityStr) {
            case 'ALTA': return { bg: '#FEE2E2', text: '#DC2626' };
            case 'MEDIA': return { bg: '#FEF3C7', text: '#D97706' };
            default: return { bg: '#E0E7FF', text: '#4338CA' };
        }
    };

    const obtenerUsuariosProyecto = () => {
        const mapaUsuarios = new Map();
        tareas.forEach(t => {
            if (t.asignadoA) {
                // Cruzamos el ID de la tarea con la lista de usuarios completa
                const usuarioEncontrado = usuariosDb.find(u => u.id === t.asignadoA);

                mapaUsuarios.set(t.asignadoA, {
                    id: t.asignadoA,
                    nombreUsuario: usuarioEncontrado ? usuarioEncontrado.nombreUsuario : 'Usuario sin nombre',
                    correo: usuarioEncontrado ? usuarioEncontrado.correo : 'No disponible'
                });
            }
        });
        return Array.from(mapaUsuarios.values());
    };

    const usuariosProyecto = obtenerUsuariosProyecto();

    const calcularTiempoRealizado = (inicio, termino) => {
        if (!inicio || !termino) return 'No disponible';
        try {
            const formatoInicio = typeof inicio === 'string' ? inicio.replace(' ', 'T') : inicio;
            const formatoTermino = typeof termino === 'string' ? termino.replace(' ', 'T') : termino;

            const fechaInicio = new Date(formatoInicio);
            const fechaTermino = new Date(formatoTermino);
            const diferenciaMs = fechaTermino - fechaInicio;

            if (isNaN(diferenciaMs) || diferenciaMs <= 0) return 'Menos de un minuto';

            const segundos = Math.floor(diferenciaMs / 1000);
            const minutos = Math.floor(segundos / 60);
            const horas = Math.floor(minutos / 60);
            const dias = Math.floor(horas / 24);

            if (dias > 0) return `${dias} días, ${horas % 24} horas`;
            if (horas > 0) return `${horas} horas, ${minutos % 60} minutos`;
            if (minutos > 0) return `${minutos} minutos`;
            return `${segundos} segundos`;
        } catch (e) {
            return 'No disponible';
        }
    };

    // Lógica para saber si se puede completar el proyecto
    const todasLasTareasCompletadas = tareas.length > 0 && tareas.every(t => t.estatus === 'COMPLETADA');

    const handleCompletarProyecto = () => {
        Alert.alert(
            'Finalizar Proyecto',
            '¿Estás seguro de marcar este proyecto como completado? Pasará al historial.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sí, finalizar',
                    onPress: async () => {
                        try {
                            // Llamada a tu API para actualizar el estatus del proyecto
                            await updateProyectoStatus(proyecto.id, 'COMPLETADO');
                            Alert.alert('¡Éxito!', 'El proyecto ha sido completado.');
                            onBack();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo completar el proyecto.');
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTopRow}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Text style={styles.backButtonText}>← Volver a Inicio</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.projectInfoButton}
                        onPress={() => setPanelLiderExpandido(!panelLiderExpandido)}
                    >
                        <Text style={styles.projectInfoButtonText}>
                            {panelLiderExpandido ? 'Ocultar Panel Líder ✕' : '⚙️ Panel Líder'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.projectTitle} numberOfLines={1}>
                    {proyecto?.titulo || proyecto?.nombre || 'Detalle del Proyecto'}
                </Text>
            </View>

            {/* Panel Retráctil del Líder */}
            {panelLiderExpandido && (
                <View style={styles.panelLiderContainer}>
                    <Text style={styles.panelLiderHeader}>PANEL DE CONTROL DEL LÍDER</Text>

                    <View style={styles.modalMetaBox}>
                        <Text style={styles.modalMetaText}>Nombre del Proyecto: {proyecto?.titulo || proyecto?.nombre}</Text>
                        <Text style={styles.modalMetaText}>ID del Proyecto: {proyecto?.id}</Text>
                        <Text style={styles.modalMetaText}>Total de Tareas: {tareas.length}</Text>
                    </View>

                    <Text style={styles.label}>Usuarios Colaboradores en el Proyecto:</Text>
                    {usuariosProyecto.length === 0 ? (
                        <Text style={styles.emptyText}>No hay usuarios con tareas asignadas actualmente.</Text>
                    ) : (
                        usuariosProyecto.map((u) => (
                            <View key={u.id} style={styles.userCardItem}>
                                {/* Se reemplaza u.nombre por u.nombreUsuario */}
                                <Text style={styles.userCardName}>👤 {u.nombreUsuario || 'Sin nombre'}</Text>
                                <Text style={styles.userCardSub}>✉️ {u.correo || 'Sin correo'}</Text>
                                <Text style={styles.userCardSub}>🆔 ID de Usuario: {u.id}</Text>
                                <TouchableOpacity
                                    style={styles.removeUserMiniBtn}
                                    onPress={() => Alert.alert('Colaborador', `¿Desea eliminar a ${u.nombreUsuario} del proyecto?`)}
                                >
                                    <Text style={styles.removeUserMiniBtnText}>Eliminar Colaborador</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}

                    <View style={styles.agregarColaboradorBox}>
                        <Text style={styles.label}>Agregar Nuevo Colaborador</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Correo electrónico del usuario"
                            value={correoNuevoColaborador}
                            onChangeText={setCorreoNuevoColaborador}
                        />
                        <TouchableOpacity
                            style={styles.actionBtnSecundario}
                            onPress={() => {
                                if(!correoNuevoColaborador.trim()) {
                                    Alert.alert('Atención', 'Ingrese un correo electrónico válido.');
                                    return;
                                }
                                Alert.alert('Éxito', `Invitación enviada a ${correoNuevoColaborador}`);
                                setCorreoNuevoColaborador('');
                            }}
                        >
                            <Text style={styles.actionBtnSecundarioText}>Agregar por Correo</Text>
                        </TouchableOpacity>

                        <TextInput
                            style={[styles.input, { marginTop: 8 }]}
                            placeholder="Escanear o ingresar Código QR de usuario"
                            value={codigoQrInput}
                            onChangeText={setCodigoQrInput}
                        />
                        <TouchableOpacity
                            style={styles.actionBtnSecundario}
                            onPress={() => {
                                if(!codigoQrInput.trim()) {
                                    Alert.alert('Atención', 'Ingrese un código QR válido.');
                                    return;
                                }
                                Alert.alert('Éxito', 'Colaborador añadido mediante código QR.');
                                setCodigoQrInput('');
                            }}
                        >
                            <Text style={styles.actionBtnSecundarioText}>Vincular por Código QR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Tareas del Proyecto</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setModalCrearVisible(true)}
                    >
                        <Text style={styles.addButtonText}>+ Nueva Tarea</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="small" color="#2563EB" style={{ marginTop: 20 }} />
                ) : tareas.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No hay tareas asignadas a este proyecto.</Text>
                    </View>
                ) : (
                    tareas.map((item) => (
                        <TareaItem
                            key={item.id}
                            item={item}
                            onPress={abrirDetalleTarea}
                            getPriorityStyle={getPriorityStyle}
                        />
                    ))
                )}

                {/* NUEVO BOTÓN DE FINALIZAR PROYECTO */}
                {todasLasTareasCompletadas && (
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#10B981',
                            padding: 15,
                            borderRadius: 10,
                            alignItems: 'center',
                            marginTop: 20,
                            marginBottom: 40
                        }}
                        onPress={handleCompletarProyecto}
                    >
                        <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>
                            🏆 Finalizar Proyecto
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            {/* Modal de Detalle / Edición de Tarea */}
            <Modal visible={modalDetalleVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        {tareaSeleccionada && !isEditing && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={styles.modalTypeIndicator}>Detalle de Tarea</Text>
                                <Text style={styles.modalTaskTitle}>{tareaSeleccionada.titulo}</Text>

                                <Text style={styles.modalSubHeader}>DESCRIPCIÓN</Text>
                                <Text style={styles.modalDesc}>{tareaSeleccionada.descripcion || 'Sin descripción'}</Text>

                                <View style={styles.modalMetaBox}>
                                    {tareaSeleccionada.estatus === 'COMPLETADA' ? (
                                        <>
                                            <Text style={styles.modalMetaText}>
                                                Fecha de inicio: {registroTiempo?.inicioTiempo || tareaSeleccionada.creadoEn || tareaSeleccionada.creado_en || 'No especificada'}
                                            </Text>
                                            <Text style={styles.modalMetaText}>
                                                Fecha de término: {registroTiempo?.terminadoTiempo || tareaSeleccionada.vencimiento || 'No especificada'}
                                            </Text>
                                            <Text style={styles.modalMetaText}>
                                                Tiempo en realizarse: {calcularTiempoRealizado(
                                                registroTiempo?.inicioTiempo || tareaSeleccionada.creadoEn || tareaSeleccionada.creado_en,
                                                registroTiempo?.terminadoTiempo || tareaSeleccionada.vencimiento
                                            )}
                                            </Text>
                                        </>
                                    ) : (
                                        <Text style={styles.modalMetaText}>Vencimiento: {tareaSeleccionada.vencimiento || 'No definida'}</Text>
                                    )}
                                    <Text style={styles.modalMetaText}>Asignado a ID: {tareaSeleccionada.asignadoA || tareaSeleccionada.asignado_a || 'Sin asignar'}</Text>
                                </View>

                                <View style={styles.statusPriorityRow}>
                                    <Text style={styles.infoLabel}>Estatus: <Text style={styles.infoValue}>{tareaSeleccionada.estatus}</Text></Text>
                                    <Text style={styles.infoLabel}>Prioridad: <Text style={styles.infoValue}>{tareaSeleccionada.prioridad ? tareaSeleccionada.prioridad.toUpperCase() : 'MEDIA'}</Text></Text>
                                </View>

                                <View style={styles.actionButtonsContainer}>
                                    {Number(tareaSeleccionada.asignadoA) === Number(user?.id) && tareaSeleccionada.estatus !== 'COMPLETADA' && (
                                        <TouchableOpacity
                                            style={styles.completeButtonModal}
                                            onPress={() => handleCompletarTarea(tareaSeleccionada.id)}
                                        >
                                            <Text style={styles.completeButtonText}>Marcar como Completada</Text>
                                        </TouchableOpacity>
                                    )}

                                    {tareaSeleccionada.estatus !== 'COMPLETADA' ? (
                                        <>
                                            <TouchableOpacity
                                                style={styles.editButtonModal}
                                                onPress={() => setIsEditing(true)}
                                            >
                                                <Text style={styles.editButtonText}>Modificar / Reasignar Tarea</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.deleteButtonModal}
                                                onPress={() => handleEliminarTarea(tareaSeleccionada.id, tareaSeleccionada.estatus)}
                                            >
                                                <Text style={styles.deleteButtonText}>Eliminar Tarea</Text>
                                            </TouchableOpacity>
                                        </>
                                    ) : (
                                        <Text style={styles.helperTextBlocked}>Esta tarea está completada: No se puede modificar ni eliminar.</Text>
                                    )}
                                </View>

                                <TouchableOpacity
                                    style={styles.closeModalButton}
                                    onPress={() => setModalDetalleVisible(false)}
                                >
                                    <Text style={styles.closeModalText}>Cerrar</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        )}

                        {/* VISTA DE EDICIÓN */}
                        {tareaSeleccionada && isEditing && (
                            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                                <Text style={styles.modalTitle}>Modificar Tarea</Text>

                                <Text style={styles.label}>Título *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editTitulo}
                                    onChangeText={setEditTitulo}
                                />

                                <Text style={styles.label}>Descripción</Text>
                                <TextInput
                                    style={[styles.input, { height: 50 }]}
                                    value={editDescripcion}
                                    onChangeText={setEditDescripcion}
                                    multiline
                                />

                                <Text style={styles.label}>Fecha de Vencimiento (Opcional)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej. 01-09-2027"
                                    value={editFechaVencimiento}
                                    onChangeText={setEditFechaVencimiento}
                                />
                                <Text style={styles.helperText}>Formato obligatorio: DD-MM-AAAA</Text>

                                <Text style={styles.label}>Hora de Vencimiento (Opcional)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej. 14:30:00"
                                    value={editHoraVencimiento}
                                    onChangeText={setEditHoraVencimiento}
                                />
                                <Text style={styles.helperText}>Formato 24h: HH:MM:SS</Text>
                                <View style={{ marginBottom: 10, zIndex: 999 }}>
                                    <Text style={styles.label}>Asignar a Usuario (Nombre o Correo)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Ej. Juan Perez"
                                        value={editAsignadoInput}
                                        onChangeText={(text) => {
                                            setEditAsignadoInput(text);
                                            setAsignadoIdFinalEditar(null);
                                            setUsuarioSeleccionadoObjEditar(null);
                                        }}
                                    />

                                    {usuarioSeleccionadoObjEditar && (
                                        <View style={styles.usuarioSeleccionadoBox}>
                                            <Text style={styles.usuarioSeleccionadoLabel}>✓ Usuario Asignado Correctamente:</Text>
                                            <Text style={styles.usuarioSeleccionadoTexto}>Nombre: {usuarioSeleccionadoObjEditar.nombre}</Text>
                                            <Text style={styles.usuarioSeleccionadoTexto}>Correo: {usuarioSeleccionadoObjEditar.correo}</Text>
                                            <Text style={styles.usuarioSeleccionadoTexto}>ID: {usuarioSeleccionadoObjEditar.id}</Text>
                                        </View>
                                    )}

                                    {mostrarSugerenciasEditar && sugerenciasEditar.length > 0 && (
                                        <View style={styles.dropdownContainer}>
                                            <ScrollView
                                                nestedScrollEnabled={true}
                                                keyboardShouldPersistTaps="handled"
                                                showsVerticalScrollIndicator={true}
                                            >
                                                {sugerenciasEditar.map((item) => {
                                                    return (
                                                        <TouchableOpacity
                                                            key={item.id}
                                                            style={styles.dropdownItem}
                                                            onPress={() => {
                                                                setEditAsignadoInput(item.nombreUsuario);
                                                                setAsignadoIdFinalEditar(item.id);
                                                                setUsuarioSeleccionadoObjEditar({
                                                                    nombre: item.nombreUsuario,
                                                                    correo: item.correo,
                                                                    id: item.id
                                                                });
                                                                setMostrarSugerenciasEditar(false);
                                                            }}
                                                        >
                                                            <Text style={styles.dropdownItemTitle}>{item.nombreUsuario}</Text>
                                                            <Text style={styles.dropdownItemSub}>{item.correo} • ID: {item.id}</Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </ScrollView>
                                        </View>
                                    )}
                                </View>

                                <Text style={styles.label}>Prioridad</Text>
                                <View style={styles.prioridadContainer}>
                                    {['BAJA', 'MEDIA', 'ALTA'].map((item) => {
                                        const pStyle = getPriorityStyle(item);
                                        const isSelected = editPrioridad === item;
                                        return (
                                            <TouchableOpacity
                                                key={item}
                                                style={[
                                                    styles.prioridadBoton,
                                                    { borderColor: isSelected ? pStyle.text : '#D1D5DB' },
                                                    isSelected && { backgroundColor: pStyle.bg }
                                                ]}
                                                onPress={() => setEditPrioridad(item)}
                                            >
                                                <Text style={[
                                                    styles.prioridadTexto,
                                                    { color: isSelected ? pStyle.text : '#4B5563' },
                                                    isSelected && { fontWeight: 'bold' }
                                                ]}>
                                                    {item}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                <View style={styles.modalActions}>
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => setIsEditing(false)}
                                    >
                                        <Text style={styles.cancelText}>Cancelar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.saveButton}
                                        onPress={handleActualizarTarea}
                                    >
                                        <Text style={styles.saveText}>Guardar Cambios</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Modal Crear Tarea del Proyecto */}
            <Modal visible={modalCrearVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                            <Text style={styles.modalTitle}>Nueva Tarea para {proyecto?.titulo}</Text>

                            <Text style={styles.label}>Título *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej. Diseñar base de datos"
                                value={titulo}
                                onChangeText={setTitulo}
                            />

                            <Text style={styles.label}>Descripción</Text>
                            <TextInput
                                style={[styles.input, { height: 50 }]}
                                placeholder="Detalles de la tarea..."
                                value={descripcion}
                                onChangeText={setDescripcion}
                                multiline
                            />

                            <Text style={styles.label}>Fecha de Vencimiento (Opcional)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej. 01/12/2026"
                                value={fechaVencimiento}
                                onChangeText={setFechaVencimiento}
                            />
                            <Text style={styles.helperText}>Formato obligatorio: DD/MM/AAAA</Text>

                            <Text style={styles.label}>Hora de Vencimiento (Opcional)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej. 18:00:00"
                                value={horaVencimiento}
                                onChangeText={setHoraVencimiento}
                            />
                            <Text style={styles.helperText}>Formato 24h: HH:MM:SS</Text>

                            <View style={{ marginBottom: 10, zIndex: 999 }}>
                                <Text style={styles.label}>Asignar a Usuario (Nombre o Correo)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej. Juan Perez • correo@ejemplo.com"
                                    value={asignadoInput}
                                    onChangeText={(text) => {
                                        setAsignadoInput(text);
                                        setAsignadoIdFinalCrear(null);
                                        setUsuarioSeleccionadoObjCrear(null);
                                    }}
                                />

                                {usuarioSeleccionadoObjCrear && (
                                    <View style={styles.usuarioSeleccionadoBox}>
                                        <Text style={styles.usuarioSeleccionadoLabel}>✓ Usuario Asignado Correctamente:</Text>
                                        <Text style={styles.usuarioSeleccionadoTexto}>Nombre: {usuarioSeleccionadoObjCrear.nombre}</Text>
                                        <Text style={styles.usuarioSeleccionadoTexto}>Correo: {usuarioSeleccionadoObjCrear.correo}</Text>
                                        <Text style={styles.usuarioSeleccionadoTexto}>ID: {usuarioSeleccionadoObjCrear.id}</Text>
                                    </View>
                                )}

                                {mostrarSugerenciasCrear && sugerenciasCrear.length > 0 && (
                                    <View style={styles.dropdownContainer}>
                                        <ScrollView
                                            nestedScrollEnabled={true}
                                            keyboardShouldPersistTaps="handled"
                                            showsVerticalScrollIndicator={true}
                                        >
                                            {sugerenciasCrear.map((item) => (
                                                <TouchableOpacity
                                                    key={item.id}
                                                    style={styles.dropdownItem}
                                                    onPress={() => {
                                                        setAsignadoInput(item.nombreUsuario);
                                                        setAsignadoIdFinalCrear(item.id);
                                                        setUsuarioSeleccionadoObjCrear({
                                                            nombre: item.nombreUsuario,
                                                            correo: item.correo,
                                                            id: item.id
                                                        });
                                                        setSugerenciasCrear([]);
                                                        setMostrarSugerenciasCrear(false);
                                                    }}
                                                >
                                                    <Text style={styles.dropdownItemTitle}>{item.nombreUsuario}</Text>
                                                    <Text style={styles.dropdownItemSub}>{item.correo} • ID: {item.id}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>

                            <Text style={styles.label}>Prioridad</Text>
                            <View style={styles.prioridadContainer}>
                                {['BAJA', 'MEDIA', 'ALTA'].map((item) => {
                                    const pStyle = getPriorityStyle(item);
                                    const isSelected = prioridad === item;
                                    return (
                                        <TouchableOpacity
                                            key={item}
                                            style={[
                                                styles.prioridadBoton,
                                                { borderColor: isSelected ? pStyle.text : '#D1D5DB' },
                                                isSelected && { backgroundColor: pStyle.bg }
                                            ]}
                                            onPress={() => setPrioridad(item)}
                                        >
                                            <Text style={[
                                                styles.prioridadTexto,
                                                { color: isSelected ? pStyle.text : '#4B5563' },
                                                isSelected && { fontWeight: 'bold' }
                                            ]}>
                                                {item}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setModalCrearVisible(false)}
                                >
                                    <Text style={styles.cancelText}>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPress={handleCrearTarea}
                                    disabled={saving}
                                >
                                    <Text style={styles.saveText}>{saving ? 'Guardando...' : 'Guardar'}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6', paddingTop: 50 },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    backButton: {},
    backButtonText: { color: '#2563EB', fontWeight: '600', fontSize: 14 },
    projectInfoButton: { backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#BFDBFE' },
    projectInfoButtonText: { color: '#2563EB', fontSize: 12, fontWeight: 'bold' },
    projectTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },

    panelLiderContainer: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 10,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        elevation: 2,
    },
    panelLiderHeader: { fontSize: 13, fontWeight: 'bold', color: '#2563EB', marginBottom: 8 },
    agregarColaboradorBox: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    actionBtnSecundario: { backgroundColor: '#2563EB', marginTop: 6, padding: 8, borderRadius: 6, alignItems: 'center' },
    actionBtnSecundarioText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
    removeUserMiniBtn: { marginTop: 4, backgroundColor: '#FEE2E2', padding: 4, borderRadius: 4, alignSelf: 'flex-start' },
    removeUserMiniBtnText: { color: '#DC2626', fontSize: 10, fontWeight: 'bold' },

    body: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
    addButton: { backgroundColor: '#2563EB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    addButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },
    emptyContainer: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 24, alignItems: 'center' },
    emptyText: { color: '#9CA3AF', fontSize: 13 },

    userCardItem: { backgroundColor: '#F9FAFB', padding: 8, borderRadius: 8, marginTop: 6, borderWidth: 1, borderColor: '#E5E7EB' },
    userCardName: { fontSize: 12, fontWeight: 'bold', color: '#111827' },
    userCardSub: { fontSize: 10, color: '#6B7280', marginTop: 1 },

    usuarioSeleccionadoBox: {
        backgroundColor: '#ECFDF5',
        borderWidth: 1,
        borderColor: '#A7F3D0',
        borderRadius: 8,
        padding: 8,
        marginTop: 6,
        marginBottom: 6,
    },
    usuarioSeleccionadoLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#047857',
        marginBottom: 2,
    },
    usuarioSeleccionadoTexto: {
        fontSize: 11,
        color: '#065F46',
    },

    prioridadContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        marginTop: 4,
        gap: 8,
    },
    prioridadBoton: {
        flex: 1,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    prioridadTexto: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4B5563',
    },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 20 },
    modalContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, maxHeight: '85%' },
    modalTypeIndicator: { fontSize: 11, fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', marginBottom: 4 },
    modalTaskTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 8 },
    modalSubHeader: { fontSize: 11, fontWeight: 'bold', color: '#9CA3AF', marginTop: 8 },
    modalDesc: { fontSize: 14, color: '#374151', marginBottom: 10 },
    modalMetaBox: { backgroundColor: '#F9FAFB', padding: 8, borderRadius: 8, marginVertical: 6 },
    modalMetaText: { fontSize: 12, color: '#4B5563', fontWeight: '500' },
    statusPriorityRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
    infoLabel: { fontSize: 13, color: '#6B7280' },
    infoValue: { fontWeight: 'bold', color: '#111827' },
    actionButtonsContainer: { gap: 8, marginTop: 12 },
    completeButtonModal: { backgroundColor: '#10B981', padding: 12, borderRadius: 8, alignItems: 'center' },
    completeButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
    editButtonModal: { backgroundColor: '#EFF6FF', padding: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#BFDBFE' },
    editButtonText: { color: '#2563EB', fontWeight: 'bold', fontSize: 14 },
    deleteButtonModal: { backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, alignItems: 'center' },
    deleteButtonText: { color: '#DC2626', fontWeight: 'bold', fontSize: 14 },
    helperTextBlocked: { textAlign: 'center', color: '#9CA3AF', fontSize: 11, fontStyle: 'italic', marginTop: 4 },
    closeModalButton: { marginTop: 10, padding: 8, alignItems: 'center' },
    closeModalText: { color: '#6B7280', fontWeight: '600' },

    modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
    label: { fontSize: 12, fontWeight: '600', color: '#374151', marginBottom: 2, marginTop: 6 },
    helperText: { fontSize: 10, color: '#9CA3AF', marginBottom: 4 },
    input: { borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#FFF' },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 14 },
    cancelButton: { padding: 10 },
    cancelText: { color: '#6B7280', fontWeight: '600' },
    saveButton: { backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
    saveText: { color: '#FFFFFF', fontWeight: '600' },

    dropdownContainer: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        marginTop: 4,
        maxHeight: 150,
        marginBottom: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        zIndex: 9999,
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    dropdownItemTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#111827',
    },
    dropdownItemSub: {
        fontSize: 11,
        color: '#6B7280',
    },
});