import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

export default function CreateInvoice() {
  const navigate = useNavigate();
  const { addInvoice } = useInvoices();
  const [loading, setLoading] = useState(false);

  // -------------------------
  // PRODUCTS (FROM BACKEND)
  // -------------------------
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data || []);
      } catch (err) {
        console.error('Failed to load products', err);
      }
    };
    fetchProducts();
  }, []);

  // -------------------------
  // FORM DATA
  // -------------------------
  const [formData, setFormData] = useState({
    clientName: '',
    dueDate: '',
    status: 'UNPAID', // ✅ enum-safe
  });

  const [items, setItems] = useState([
    { id: 1, productId: '', quantity: 1, price: 0 },
  ]);

  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  const TAX_RATE = 0.18;

  // -------------------------
  // TOTAL CALCULATION
  // -------------------------
  useEffect(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    setTotals({ subtotal, tax, total });
  }, [items]);

  // -------------------------
  // ITEM HANDLERS
  // -------------------------
  const handleItemChange = (id, field, value) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleProductSelect = (id, productId) => {
    const product = products.find(p => p.id === Number(productId));
    if (!product) return;

    setItems(items.map(item =>
      item.id === id
        ? {
            ...item,
            productId: product.id,
            price: product.price,
          }
        : item
    ));
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), productId: '', quantity: 1, price: 0 },
    ]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  // -------------------------
  // SUBMIT
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        customerName: formData.clientName,
        dueDate: formData.dueDate,
        status: formData.status,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const res = await api.post('/invoices', payload);
      addInvoice(res.data);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">
          Create New Invoice
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">

          {/* CLIENT DETAILS */}
          <div className="bg-white p-6 rounded-xl border space-y-4">
            <h3 className="font-semibold text-lg">Client Details</h3>

            <Input
              label="Client Name"
              value={formData.clientName}
              onChange={e =>
                setFormData({ ...formData, clientName: e.target.value })
              }
              placeholder="Business Name or Contact"
            />

            <div>
              <label className="block text-sm font-medium">Due Date</label>
              <input
                type="date"
                className="w-full h-10 border rounded px-3 text-sm"
                value={formData.dueDate}
                onChange={e =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </div>

            {/* ✅ STATUS DROPDOWN */}
            <div>
              <label className="block text-sm font-medium">Invoice Status</label>
              <select
                className="w-full h-10 border rounded px-3 text-sm bg-white"
                value={formData.status}
                onChange={e =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="UNPAID">Unpaid</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>
          </div>

          {/* INVOICE ITEMS */}
          <div className="bg-white p-6 rounded-xl border space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Invoice Items</h3>
              <button
                onClick={addItem}
                className="text-sm text-primary-600 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Item
              </button>
            </div>

            {items.map(item => (
              <div key={item.id} className="flex gap-4 items-end">
                <select
                  className="flex-1 h-9 border rounded px-3 text-sm"
                  value={item.productId}
                  onChange={e =>
                    handleProductSelect(item.id, e.target.value)
                  }
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  className="w-20 h-9 border rounded px-2 text-sm text-right"
                  value={item.quantity}
                  onChange={e =>
                    handleItemChange(
                      item.id,
                      'quantity',
                      Number(e.target.value)
                    )
                  }
                />

                <input
                  type="number"
                  className="w-28 h-9 border rounded px-2 text-sm text-right bg-slate-100"
                  value={item.price}
                  disabled
                />

                <button
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                  className="text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-semibold text-lg mb-4">Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>₹{totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>₹{totals.total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              onClick={handleSubmit}
              isLoading={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
