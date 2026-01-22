package com.invoiceGen.demo.controller;

import com.invoiceGen.demo.entity.User;
import com.invoiceGen.demo.service.AuthService;
import com.invoiceGen.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    private final JwtUtil jwtUtil;


    public AuthController(AuthService authService, JwtUtil jwtUtil) {
      this.authService = authService;
       this.jwtUtil = jwtUtil;
    }




    // -------------------------
    // REGISTER
    // -------------------------
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        User savedUser = authService.register(user);

//        String token = jwtUtil.generateToken(savedUser.getEmail());

        return ResponseEntity.ok(
                Map.of(
                        "message", "Registration successful"
//                        "token", token
                )
        );
    }

    // -------------------------
    // LOGIN
    // -------------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String password = request.get("password");

        User user = authService.login(email, password);

        String token = jwtUtil.generateToken(user.getEmail());

        return ResponseEntity.ok(
                Map.of(
                        "message", "Login successful",
                        "token", token
                )
        );
    }
}