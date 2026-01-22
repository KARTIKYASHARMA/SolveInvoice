package com.invoiceGen.demo.dto;

import com.invoiceGen.demo.enums.InvoiceStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InvoiceResponseDTO {
    private Long id;
    private String invoiceNumber;
    private String customerName;
    private Double totalAmount;
    private InvoiceStatus status;
    private LocalDateTime createdAt;
}
