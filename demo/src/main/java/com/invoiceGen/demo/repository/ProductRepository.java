package com.invoiceGen.demo.repository;

import com.invoiceGen.demo.entity.Product;
import com.invoiceGen.demo.entity.User;
import org.jspecify.annotations.Nullable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product,Integer> {
    @Nullable List<Product> findByUser(User user);
}
