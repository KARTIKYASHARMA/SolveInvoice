package com.invoiceGen.demo.entity;




import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class InvoiceAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Invoice invoice;

    private String riskStatus;
    private String reason;
    private Double overdueProbability;
    private String recommendation;

    private LocalDateTime analyzedAt = LocalDateTime.now();
}
