package com.invoiceGen.demo.service;

import com.invoiceGen.demo.entity.Product;
import com.invoiceGen.demo.entity.User;
import com.invoiceGen.demo.repository.ProductRepository;
import com.invoiceGen.demo.repository.UserRepository;
import com.invoiceGen.demo.util.DefaultProducts;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       ProductRepository productRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // -------------------------
    // REGISTER COMPANY / USER
    // -------------------------
    public User register(User user) {

        // 1. Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // 2. Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 3. Save user
        User savedUser = userRepository.save(user);

        // 4. Create predefined products (exactly 5)
        List<Product> defaultProducts = DefaultProducts.getDefaultProducts();

        defaultProducts.forEach(product -> {
            product.setUser(savedUser);
            productRepository.save(product);
        });

        return savedUser;
    }

    // -------------------------
    // LOGIN
    // -------------------------
    public User login(String email, String rawPassword) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }
}
