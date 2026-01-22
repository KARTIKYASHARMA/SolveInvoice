package com.invoiceGen.demo.repository;

import com.invoiceGen.demo.entity.InvoiceItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceItemRepository  extends JpaRepository<InvoiceItem, Long> {
}
