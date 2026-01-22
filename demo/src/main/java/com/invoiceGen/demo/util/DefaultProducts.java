package com.invoiceGen.demo.util;


import com.invoiceGen.demo.entity.Product;

import java.util.List;

public class DefaultProducts {

    public static List<Product> getDefaultProducts() {
        return List.of(
                new Product("Product 1", 1000.0, 100),
                new Product("Product 2", 2000.0, 100),
                new Product("Product 3", 3000.0, 100),
                new Product("Product 4", 4000.0, 100),
                new Product("Product 5", 5000.0, 100)
        );
    }
}