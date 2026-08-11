package com.taskflow.taskflow.exception;

import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ControllerAdviceGlobal {

    @ExceptionHandler(RolEnUsoException.class)
    public ResponseEntity<?> manejarRolEnUso(RolEnUsoException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> manejarListaDeErroresdeValidacion(MethodArgumentNotValidException exception){
        Map<String, String> errores = new HashMap<>(); //almacena datos(errores) por clave valor
        for (FieldError error : exception.getFieldErrors()){
            errores.put(error.getField(), error.getDefaultMessage());
        }return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errores);
    }

    @ExceptionHandler(UsuarioNotFoundException.class)
    public ResponseEntity<?> manejarUsuarioNoEncontrado(UsuarioNotFoundException usuarioNotFoundException){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(usuarioNotFoundException.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> manejarViolacionIntegridad(DataIntegrityViolationException dataIntegrityViolationException){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(dataIntegrityViolationException.getMessage());
    }

    @ExceptionHandler(EmailAlreadyExistsExceptions.class)
    public ResponseEntity<?> manejarCorreoDuplicado(EmailAlreadyExistsExceptions emailAlreadyExistsExceptions){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(emailAlreadyExistsExceptions.getMessage());
    }

    @ExceptionHandler(RolNotFoundException.class)
    public ResponseEntity<?> manejarRolNoEncontrado(RolNotFoundException rolNotFoundException){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(rolNotFoundException.getMessage());
    }

    @ExceptionHandler(RolAlreadyExistsExceptions.class)
    public ResponseEntity<?> manejarRolDuplicado(RolAlreadyExistsExceptions rolAlreadyExistsExceptions){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(rolAlreadyExistsExceptions.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> manejarIlegalArgument(IllegalArgumentException argException){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(argException.getMessage());
    }

    @ExceptionHandler(TareaNotFoundException.class)
    public ResponseEntity<?> manejarTareaNoEncontrado(TareaNotFoundException tareaNotFoundException){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tareaNotFoundException.getMessage());
    }

    @ExceptionHandler(ProyectoWithTareaException.class)
    public ResponseEntity<String> manejarProyectoConTareas(ProyectoWithTareaException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(UsuarioWithProyectException.class)
    public ResponseEntity<String> manejarUsuarioConProyectos(UsuarioWithProyectException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(ProyectoNotFoundException.class)
    public ResponseEntity<?> manejarProyectoNoEncontrada(ProyectoNotFoundException proyectoNotFoundException){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(proyectoNotFoundException.getMessage());
    }

    @ExceptionHandler(RegistroTiempoNotFoundException.class)
    public ResponseEntity<?> manejarRegistroTiempoNoEncontrado(RegistroTiempoNotFoundException registroTiempoNotFoundException){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(registroTiempoNotFoundException.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalState(IllegalStateException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("message", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DatosInvalidosException.class)
    public ResponseEntity<String> manejarDatosInvalidos(DatosInvalidosException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> manejarJsonInvalido(HttpMessageNotReadableException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("El cuerpo de la petición (JSON) viene mal formado o contiene un formato inválido");
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<String> manejarTipoParametroIncorrecto(MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("El parámetro enviado en la URL debe ser un número entero válido");
    }
}
