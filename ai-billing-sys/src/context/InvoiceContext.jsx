import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api from "../api/axios";

const InvoiceContext = createContext(null);

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ start true
  const [error, setError] = useState(null);

  // -------------------------
  // FETCH RECENT INVOICES (MYSQL)
  // -------------------------
  const fetchRecentInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/invoices/recent");
      setInvoices(res.data || []);
    } catch (err) {
      console.error("Failed to fetch invoices", err);
      setInvoices([]);
      setError("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }, []);

  // -------------------------
  // INITIAL LOAD
  // -------------------------
  useEffect(() => {
    fetchRecentInvoices();
  }, [fetchRecentInvoices]);

  // -------------------------
  // AFTER CREATE INVOICE
  // -------------------------
  const addInvoice = async () => {
    // ✅ Always sync with DB
    await fetchRecentInvoices();
  };

  // -------------------------
  // OPTIONAL DELETE
  // -------------------------
  const deleteInvoice = async (id) => {
    try {
      await api.delete(`/invoices/${id}`);
      fetchRecentInvoices();
    } catch (err) {
      console.error("Failed to delete invoice", err);
    }
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        loading,
        error,
        reloadInvoices: fetchRecentInvoices,
        addInvoice,
        deleteInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

// -------------------------
// SAFE HOOK
// -------------------------
export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoices must be used within InvoiceProvider");
  }
  return context;
};
