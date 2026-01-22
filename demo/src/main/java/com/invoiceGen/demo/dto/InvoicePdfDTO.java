package com.invoiceGen.demo.dto;



import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class InvoicePdfDTO {

    private String invoiceNumber;
    private String customerName;
    private LocalDate dueDate;
    private Double subtotal;
    private Double tax;
    private Double totalAmount;

    private List<Item> items;

    @Data
    public static class Item {
        private String productName;
        private Integer quantity;
        private Double price;
        private Double total;
    }
}
