package com.taskflow.taskflow.exception;

public class TareaNotFoundException extends RuntimeException{
    public TareaNotFoundException(String message){
        super(message);
    }
}
