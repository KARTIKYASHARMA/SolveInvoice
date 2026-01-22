package com.invoiceGen.demo.controller;

import com.invoiceGen.demo.entity.Product;
import com.invoiceGen.demo.entity.User;
import com.invoiceGen.demo.repository.ProductRepository;
import com.invoiceGen.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")

public class ProductController {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductController(ProductRepository productRepository,
                             UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getMyProducts(Authentication auth) {

        System.out.println("AUTH = " + auth);
        if (auth == null) {
            throw new RuntimeException("Authentication is null");
        }

        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(productRepository.findByUser(user));
    }
}
