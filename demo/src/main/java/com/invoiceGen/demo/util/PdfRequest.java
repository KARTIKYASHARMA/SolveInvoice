package com.invoiceGen.demo.util;

public class PdfRequest {

    private Long invoiceId;

    // REQUIRED by Jackson
    public PdfRequest() {
    }

    public PdfRequest(Long invoiceId) {
        this.invoiceId = invoiceId;
    }

    public Long getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(Long invoiceId) {
        this.invoiceId = invoiceId;
    }
}
