package com.invoiceGen.demo.controller;

import com.invoiceGen.demo.dto.InvoicePdfDTO;
import com.invoiceGen.demo.dto.InvoiceRequestDTO;
import com.invoiceGen.demo.dto.InvoiceResponseDTO;
import com.invoiceGen.demo.entity.Invoice;
import com.invoiceGen.demo.entity.User;
import com.invoiceGen.demo.repository.InvoiceRepository;
import com.invoiceGen.demo.repository.UserRepository;
import com.invoiceGen.demo.service.InvoiceService;
import com.invoiceGen.demo.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")

public class InvoiceController {

    private final InvoiceService invoiceService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final InvoiceRepository invoiceRepository;

    public InvoiceController(InvoiceService invoiceService,
                             JwtUtil jwtUtil,
                             UserRepository userRepository,
                             InvoiceRepository invoiceRepository) {
        this.invoiceService = invoiceService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.invoiceRepository = invoiceRepository;
    }

    // -------------------------
    // CREATE INVOICE
    // -------------------------
    @PostMapping
    public ResponseEntity<Invoice> createInvoice(
            @RequestBody InvoiceRequestDTO request,
            HttpServletRequest httpRequest) {

        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Invoice invoice = invoiceService.createInvoice(user, request);
        return ResponseEntity.ok(invoice);
    }

    // -------------------------
    // RECENT INVOICES (TOP 5)
    // -------------------------
    @GetMapping("/recent")
    public ResponseEntity<List<InvoiceResponseDTO>> getRecentInvoices(
            HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String email = jwtUtil.extractUsername(authHeader.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(0, 5);
        List<Invoice> invoices =
                invoiceRepository.findByUserOrderByCreatedAtDesc(user, pageable);

        List<InvoiceResponseDTO> response = invoices.stream().map(inv -> {
            InvoiceResponseDTO dto = new InvoiceResponseDTO();
            dto.setId(inv.getId());
            dto.setInvoiceNumber(inv.getInvoiceNumber());
            dto.setCustomerName(inv.getCustomerName());
            dto.setTotalAmount(inv.getTotalAmount());
            dto.setStatus(inv.getStatus());
            dto.setCreatedAt(inv.getCreatedAt());
            return dto;
        }).toList();

        return ResponseEntity.ok(response);
    }


    // -------------------------
    // DOWNLOAD PDF URL
    // -------------------------
    @GetMapping("/{id}/pdf")
    public ResponseEntity<String> getInvoicePdf(@PathVariable Integer id,
                                                HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        if (!invoice.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(invoice.getPdfUrl());
    }

    // -------------------------
    // INTERNAL (PYTHON PDF SERVICE)
    // -------------------------
    @GetMapping("/internal/{id}")
    public InvoicePdfDTO getInvoiceInternal(@PathVariable Integer id) {

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        InvoicePdfDTO dto = new InvoicePdfDTO();
        dto.setInvoiceNumber(invoice.getInvoiceNumber());
        dto.setCustomerName(invoice.getCustomerName());
        dto.setDueDate(invoice.getDueDate());
        dto.setSubtotal(invoice.getSubtotal());
        dto.setTax(invoice.getTax());
        dto.setTotalAmount(invoice.getTotalAmount());

        List<InvoicePdfDTO.Item> items = invoice.getItems().stream().map(i -> {
            InvoicePdfDTO.Item item = new InvoicePdfDTO.Item();
            item.setProductName(i.getProduct().getName());
            item.setQuantity(i.getQuantity());
            item.setPrice(i.getPrice());
            item.setTotal(i.getTotal());
            return item;
        }).toList();

        dto.setItems(items);
        return dto;
    }
}
