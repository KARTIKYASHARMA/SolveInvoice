package com.invoiceGen.demo.repository;

import com.invoiceGen.demo.entity.Invoice;
import com.invoiceGen.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice,Integer> {
    List<Invoice> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
}
