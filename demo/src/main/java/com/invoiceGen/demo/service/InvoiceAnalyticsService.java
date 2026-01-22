
package com.invoiceGen.demo.service;

import com.invoiceGen.demo.dto.AiAnalysisRequestDTO;
import com.invoiceGen.demo.dto.AiAnalysisResponseDTO;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class InvoiceAnalyticsService {

    private static final String PYTHON_AI_URL =
            "http://localhost:8000/analyze-invoice";

    private final RestTemplate restTemplate = new RestTemplate();

    public AiAnalysisResponseDTO analyzeInvoice(AiAnalysisRequestDTO request) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<AiAnalysisRequestDTO> entity =
                new HttpEntity<>(request, headers);

        ResponseEntity<AiAnalysisResponseDTO> response =
                restTemplate.exchange(
                        PYTHON_AI_URL,
                        HttpMethod.POST,
                        entity,
                        AiAnalysisResponseDTO.class
                );

        return response.getBody();
    }
}
