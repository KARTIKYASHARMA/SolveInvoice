package com.invoiceGen.demo.entity;

import com.invoiceGen.demo.enums.InvoiceStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Company / User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Invoice details
    @Column(nullable = false, unique = true)
    private String invoiceNumber;

    private LocalDate dueDate;
    private String customerName;

    // Amounts
    private Double subtotal;
    private Double tax;
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;

    // File reference
    private String pdfUrl;

    @CreationTimestamp
    private LocalDateTime createdAt;

    // 🔥 IMPORTANT: Invoice → InvoiceItems
    @OneToMany(
            mappedBy = "invoice",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER
    )
    private List<InvoiceItem> items;
}
