package com.invoiceGen.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class AiAnalysisResponseDTO {

    private RiskAnalysis riskAnalysis;
    private NlpAnomaly nlpAnomaly;
    private Double overdueProbability;
    private String recommendation;

    @Data
    public static class RiskAnalysis {
        private String status;   // PAID / UNPAID / RISKY
        private String reason;
    }

    @Data
    public static class NlpAnomaly {
        private Boolean anomalyDetected;
        private List<String> keywords;
    }
}
