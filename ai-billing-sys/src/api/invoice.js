import api from "./axios";

export const fetchRecentInvoices = async () => {
  const res = await api.get("/invoices/recent");
  return res.data;
};

export const fetchInvoicePdf = async (id) => {
  const res = await api.get(`/invoices/${id}/pdf`);
  return res.data; // pdfUrl
};
