package com.taskflow.taskflow.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ControllerAdviceGlobal {

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

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> manejarIlegalArgument(IllegalArgumentException argException){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(argException.getMessage());
    }

    @ExceptionHandler(TareaNotFoundException.class)
    public ResponseEntity<?> manejarTareaNoEncontrado(TareaNotFoundException tareaNotFoundException){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(tareaNotFoundException.getMessage());
    }

}
