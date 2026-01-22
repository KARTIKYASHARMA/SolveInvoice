package com.invoiceGen.demo.service;


import com.invoiceGen.demo.dto.InvoiceRequestDTO;
import com.invoiceGen.demo.entity.*;
import com.invoiceGen.demo.enums.InvoiceStatus;
import com.invoiceGen.demo.repository.*;

import com.invoiceGen.demo.util.PdfRequest;
import com.invoiceGen.demo.util.PdfResponse;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;

import java.util.UUID;
@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceItemRepository invoiceItemRepository;
    private final ProductRepository productRepository;
    private final RestTemplate restTemplate;

    private static final double TAX_RATE = 0.18; // 18% GST

    public InvoiceService(
            InvoiceRepository invoiceRepository,
            InvoiceItemRepository invoiceItemRepository,
            ProductRepository productRepository,
            RestTemplate restTemplate
    ) {
        this.invoiceRepository = invoiceRepository;
        this.invoiceItemRepository = invoiceItemRepository;
        this.productRepository = productRepository;
        this.restTemplate = restTemplate;
    }

    // -------------------------
    // CREATE INVOICE (SECURE)
    // -------------------------
    public Invoice createInvoice(User user, InvoiceRequestDTO request) {

        InvoiceStatus status =
                request.getStatus() != null
                        ? request.getStatus()
                        : InvoiceStatus.UNPAID;
        // 1. Create invoice header
        Invoice invoice = Invoice.builder()
                .user(user)
                .invoiceNumber(generateInvoiceNumber())
                .customerName(request.getCustomerName())
                .dueDate(request.getDueDate())
                .status(status) // always controlled by backend
                .build();

        invoice = invoiceRepository.save(invoice);

        double subtotal = 0.0;

        // 2. Create invoice items
        for (InvoiceRequestDTO.Item itemDto : request.getItems()) {

            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // 🔐 SECURITY CHECK: product must belong to user
            if (!product.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized product access");
            }

            double price = product.getPrice(); // always from DB
            int quantity = itemDto.getQuantity();
            double lineTotal = price * quantity;

            subtotal += lineTotal;

            InvoiceItem invoiceItem = new InvoiceItem();
            invoiceItem.setInvoice(invoice);
            invoiceItem.setProduct(product);
            invoiceItem.setQuantity(quantity);
            invoiceItem.setPrice(price);
            invoiceItem.setTotal(lineTotal);

            invoiceItemRepository.save(invoiceItem);
        }

        // 3. Calculate totals (backend is source of truth)
        double tax = subtotal * TAX_RATE;
        double totalAmount = subtotal + tax;

        invoice.setSubtotal(subtotal);
        invoice.setTax(tax);
        invoice.setTotalAmount(totalAmount);

        invoice = invoiceRepository.save(invoice);

        // 4. Generate invoice PDF
        String pdfUrl = generateInvoicePdf(invoice);

        invoice.setPdfUrl(pdfUrl);

        return invoiceRepository.save(invoice);
    }

    // -------------------------
    // PYTHON INVOICE GENERATOR
    // -------------------------
    private String generateInvoicePdf(Invoice invoice) {

        String pythonServiceUrl = "http://localhost:5000/generate-invoice";

        PdfRequest payload = new PdfRequest(invoice.getId());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<PdfRequest> requestEntity =
                new HttpEntity<>(payload, headers);

        PdfResponse response = restTemplate.postForObject(
                pythonServiceUrl,
                requestEntity,
                PdfResponse.class
        );

        if (response == null || response.getPdfUrl() == null) {
            throw new RuntimeException("Failed to generate invoice PDF");
        }

        return response.getPdfUrl();
    }

    // -------------------------
    // INVOICE NUMBER GENERATOR
    // -------------------------
    private String generateInvoiceNumber() {
        return "INV-" + LocalDate.now().getYear() + "-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 6)
                        .toUpperCase();
    }
}
