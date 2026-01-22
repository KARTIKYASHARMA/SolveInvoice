package com.invoiceGen.demo.dto;

import com.invoiceGen.demo.enums.InvoiceStatus;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data

public class InvoiceRequestDTO {

    private String customerName;
    private LocalDate dueDate;
    private InvoiceStatus status;

    private String urlName;
    private List<Item> items;

    @Data
    public static class Item {
        private Integer productId;
        private Integer quantity;


    }

    // getters & setters
}

