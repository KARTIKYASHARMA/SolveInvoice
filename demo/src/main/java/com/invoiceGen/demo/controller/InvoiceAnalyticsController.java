package com.invoiceGen.demo.controller;


import com.invoiceGen.demo.dto.AiAnalysisRequestDTO;
import com.invoiceGen.demo.dto.AiAnalysisResponseDTO;
import com.invoiceGen.demo.entity.Invoice;
import com.invoiceGen.demo.entity.User;
import com.invoiceGen.demo.repository.InvoiceRepository;
import com.invoiceGen.demo.repository.UserRepository;
import com.invoiceGen.demo.service.InvoiceAnalyticsService;
import com.invoiceGen.demo.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices/ai")
public class InvoiceAnalyticsController {

    private final InvoiceAnalyticsService analyticsService;
    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public InvoiceAnalyticsController(
            InvoiceAnalyticsService analyticsService,
            InvoiceRepository invoiceRepository,
            UserRepository userRepository,
            JwtUtil jwtUtil) {
        this.analyticsService = analyticsService;
        this.invoiceRepository = invoiceRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // 🔥 AI ANALYSIS ENDPOINT
    @GetMapping("/{invoiceId}/analyze")
    public ResponseEntity<AiAnalysisResponseDTO> analyzeInvoice(
            @PathVariable Integer invoiceId,
            HttpServletRequest request) {

        // ---- JWT VALIDATION ----
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String email = jwtUtil.extractUsername(authHeader.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        if (!invoice.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        // ---- BUILD AI REQUEST ----
        AiAnalysisRequestDTO aiRequest = new AiAnalysisRequestDTO();
        aiRequest.setInvoiceId(invoice.getId());
        aiRequest.setClientId(user.getId().intValue());
        aiRequest.setAmount(invoice.getTotalAmount());
        aiRequest.setPaidAmount(0.0); // extend later
        aiRequest.setDueDate(invoice.getDueDate());
        aiRequest.setInvoiceDate(invoice.getCreatedAt().toLocalDate());
        aiRequest.setDescription("Invoice for " + invoice.getCustomerName());
        aiRequest.setPaymentHistoryScore(4);
        aiRequest.setPreviousOverdueCount(2);

        AiAnalysisResponseDTO response =
                analyticsService.analyzeInvoice(aiRequest);

        return ResponseEntity.ok(response);
    }
}
