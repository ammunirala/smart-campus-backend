// package com.smartcampus.exception;

// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.ExceptionHandler;
// import org.springframework.web.bind.annotation.RestControllerAdvice;

// @RestControllerAdvice
// public class GlobalExceptionHandler {

//     @ExceptionHandler(UserNotFoundException.class)
//     public ResponseEntity<String> handleUserNotFound(UserNotFoundException ex) {
//         return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
//     }

//     @ExceptionHandler(InvalidCredentialsException.class)
//     public ResponseEntity<String> handleInvalidCredentials(InvalidCredentialsException ex) {
//         return new ResponseEntity<>(ex.getMessage(), HttpStatus.UNAUTHORIZED);
//     }

//     @ExceptionHandler(Exception.class)
//     public ResponseEntity<String> handleGeneric(Exception ex) {
//         return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
//     }
// }
