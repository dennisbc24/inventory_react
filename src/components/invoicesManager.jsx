import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { TitleForm } from "./form/titleForm.jsx";
import { InputSimple } from "./form/inputSearch";
import { todayPeru } from "../utils/date.js";
import "./salesForm.css";
import "./table.css";
import "./css/compactForm.css";
import "./css/invoices.css";

const num = (value) => parseFloat(value || 0);
const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
const money = (value) => `S/. ${num(value).toFixed(2)}`;
const fechaLatina = (iso) => (iso ? String(iso).slice(0, 10).split("-").reverse().join("/") : "—");

const emptyForm = () => ({
  invoice_date: todayPeru(),
  supplier: "",
  invoice_number: "",
  description: "",
  currency: "PEN",
  amount: "",
  exchange_rate: "",
});

const limitSteps = (used, limit) => {
  if (!limit) return 0;
  return Math.min(100, Math.max(0, (used / limit) * 100));
};

export const InvoicesManager = ({ urlBase }) => {
  const [month, setMonth] = useState(todayPeru().slice(0, 7));
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({ count: 0, total_pen: 0, limit: 8000, remaining: 8000 });
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!month) return;
    const [year, monthNumber] = month.split("-");
    try {
      const [invoiceRes, summaryRes] = await Promise.all([
        axios.get(`${urlBase}/api/v1/invoices`, { params: { year, month: monthNumber } }),
        axios.get(`${urlBase}/api/v1/invoices/summary`, { params: { year, month: monthNumber } }),
      ]);
      setRows(Array.isArray(invoiceRes.data) ? invoiceRes.data : []);
      setSummary(summaryRes.data || { count: 0, total_pen: 0, limit: 8000, remaining: 8000 });
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Error al cargar las facturas");
    }
  }, [urlBase, month]);

  useEffect(() => {
    load();
  }, [load]);

  const setField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const rate = form.currency === "USD" ? num(form.exchange_rate) : 1;
  const amountPen = round2(num(form.amount) * rate);
  const usedPercent = limitSteps(num(summary.total_pen), num(summary.limit));

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.invoice_date) {
      alert("Selecciona la fecha de la factura");
      return;
    }
    if (!form.supplier.trim()) {
      alert("Escribe el proveedor");
      return;
    }
    if (!(num(form.amount) > 0)) {
      alert("El monto debe ser mayor a 0");
      return;
    }
    if (form.currency === "USD" && !(num(form.exchange_rate) > 0)) {
      alert("Ingresa un tipo de cambio válido");
      return;
    }

    const payload = {
      ...form,
      supplier: form.supplier.trim(),
      amount: num(form.amount),
      exchange_rate: form.currency === "USD" ? num(form.exchange_rate) : 1,
    };

    setSaving(true);
    try {
      if (editingId) {
        await axios.put(`${urlBase}/api/v1/invoices/${editingId}`, payload);
      } else {
        await axios.post(`${urlBase}/api/v1/invoices`, payload);
      }

      const targetMonth = form.invoice_date.slice(0, 7);
      resetForm();
      if (targetMonth !== month) {
        setMonth(targetMonth);
      } else {
        await load();
      }
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Error al guardar la factura");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id_invoice);
    setForm({
      invoice_date: row.invoice_date,
      supplier: row.supplier || "",
      invoice_number: row.invoice_number || "",
      description: row.description || "",
      currency: row.currency || "PEN",
      amount: String(row.amount ?? ""),
      exchange_rate: row.currency === "USD" ? String(row.exchange_rate ?? "") : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`¿Eliminar la factura ${row.invoice_number || `#${row.id_invoice}`} de ${row.supplier}?`)) return;
    try {
      await axios.delete(`${urlBase}/api/v1/invoices/${row.id_invoice}`);
      if (editingId === row.id_invoice) resetForm();
      await load();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Error al eliminar la factura");
    }
  };

  return (
    <>
      <TitleForm text="Facturas de compra" />

      <div className="invoice_month">
        <InputSimple
          titulo="Mes"
          tipo="month"
          valor={month}
          func={(event) => setMonth(event.target.value)}
          className="compact"
        />
      </div>

      <div className="invoice_summary">
        <div className="invoice_summary_card">
          <span>Facturado en el mes</span>
          <strong>{money(summary.total_pen)}</strong>
          <small>{summary.count || 0} factura(s)</small>
        </div>
        <div className="invoice_summary_card">
          <span>Límite mensual</span>
          <strong>{money(summary.limit)}</strong>
          <small>No se permiten compras con factura por encima del límite</small>
        </div>
        <div className={`invoice_summary_card ${num(summary.remaining) <= 0 ? "invoice_summary_card--danger" : ""}`}>
          <span>Disponible</span>
          <strong>{money(summary.remaining)}</strong>
          <small>Para nuevas facturas de este mes</small>
        </div>
      </div>
      <div className="invoice_bar" aria-hidden="true">
        <span style={{ width: `${usedPercent}%` }} className={usedPercent >= 100 ? "invoice_bar_full" : ""} />
      </div>

      <form className="divForm" onSubmit={handleSubmit}>
        <h3>{editingId ? `Editar factura #${editingId}` : "Registrar factura"}</h3>
        <div className="invoice_grid">
          <InputSimple
            titulo="Fecha"
            tipo="date"
            valor={form.invoice_date}
            func={setField("invoice_date")}
            className="compact"
          />
          <InputSimple
            titulo="Proveedor"
            tipo="text"
            valor={form.supplier}
            func={setField("supplier")}
            callToAction="Nombre o RUC"
            className="compact"
          />
          <InputSimple
            titulo="N° factura"
            tipo="text"
            valor={form.invoice_number}
            func={setField("invoice_number")}
            callToAction="Serie-número"
            className="compact"
          />
          <InputSimple
            titulo="Descripción"
            tipo="text"
            valor={form.description}
            func={setField("description")}
            callToAction="Detalle de la compra"
            className="compact"
          />
          <div className="selectSimple compact">
            <h3>Moneda</h3>
            <select value={form.currency} onChange={setField("currency")} className="only_select">
              <option value="PEN">Soles (PEN)</option>
              <option value="USD">Dólares (USD)</option>
            </select>
          </div>
          <InputSimple
            titulo={form.currency === "USD" ? "Monto USD" : "Monto S/."}
            tipo="number"
            step="0.01"
            valor={form.amount}
            func={setField("amount")}
            callToAction="0.00"
            className="compact"
          />
          {form.currency === "USD" ? (
            <InputSimple
              titulo="Tipo de cambio"
              tipo="number"
              step="0.0001"
              valor={form.exchange_rate}
              func={setField("exchange_rate")}
              callToAction="Ej. 3.75"
              className="compact"
            />
          ) : null}
          <div className="invoice_amount_pen">
            <h3>Monto en soles</h3>
            <p>{money(amountPen)}</p>
          </div>
        </div>
        <div className="form_actions">
          <button type="submit" className="btn_primary" disabled={saving}>
            {saving ? "Guardando..." : editingId ? "Actualizar factura" : "Registrar factura"}
          </button>
          <button type="button" className="btn_clear" onClick={resetForm}>
            {editingId ? "Cancelar edición" : "Limpiar"}
          </button>
        </div>
      </form>

      <h3>Facturas registradas</h3>
      <p className="invoice_hint">
        {form.currency === "USD"
          ? "Las facturas en dólares se convierten a soles con el tipo de cambio ingresado."
          : "Puedes registrar facturas en soles o en dólares con su tipo de cambio."}
      </p>
      <div className="result">
        <table className="infoTable">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Proveedor</th>
              <th>Factura</th>
              <th>Descripción</th>
              <th>Moneda</th>
              <th>Monto</th>
              <th>T. C.</th>
              <th>Monto S/.</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id_invoice}>
                <td>{fechaLatina(row.invoice_date)}</td>
                <td>{row.supplier}</td>
                <td>{row.invoice_number || "—"}</td>
                <td>{row.description || "—"}</td>
                <td>{row.currency}</td>
                <td>{num(row.amount).toFixed(2)}</td>
                <td>{row.currency === "USD" ? num(row.exchange_rate).toFixed(4) : "—"}</td>
                <td>{num(row.amount_pen).toFixed(2)}</td>
                <td className="invoice_actions">
                  <button type="button" onClick={() => handleEdit(row)}>Editar</button>
                  <button type="button" className="invoice_delete" onClick={() => handleDelete(row)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr><td colSpan={9}>Sin facturas registradas en este mes</td></tr>
            ) : null}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7}>Total del mes</td>
              <td>{num(summary.total_pen).toFixed(2)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};
