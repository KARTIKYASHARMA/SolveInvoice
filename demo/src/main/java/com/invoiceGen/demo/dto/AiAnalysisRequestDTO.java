package com.invoiceGen.demo.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AiAnalysisRequestDTO {

    private Long invoiceId;
    private Integer clientId;

    private Double amount;
    private Double paidAmount;

    private LocalDate dueDate;
    private LocalDate invoiceDate;

    private String description;

    private Integer paymentHistoryScore;     // 1–5
    private Integer previousOverdueCount;
}
