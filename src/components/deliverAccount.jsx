import { useState, useEffect } from "react";
import axios from "axios";
import { TitleForm } from "./form/titleForm.jsx";
import { todayPeru } from "../utils/date.js";
import "./salesForm.css";
import "./table.css";
import "./css/box.css";

const USERS = { 1: "Dennis", 2: "Luz Marina", 3: "Miguel Angel" };

const num = (v) => parseFloat(v || 0);
const money = (n) => `S/.${n.toFixed(2)}`;
const fechaLatina = (iso) => iso ? iso.split("-").reverse().join("/") : "";

export const DeliverAccount = ({ urlBase }) => {
  const today = todayPeru();
  const [idUser, setIdUser] = useState(1);
  const [idReceiver, setIdReceiver] = useState(2);
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [comida, setComida] = useState(13);
  const [ventas, setVentas] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [comidaEdit, setComidaEdit] = useState({});
  const [ventaEdit, setVentaEdit] = useState({});
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");

  const ventaDe = (r) =>
    ventaEdit[r.fecha] !== undefined && ventaEdit[r.fecha] !== ""
      ? num(ventaEdit[r.fecha])
      : num(r.venta);

  const comidaDe = (fecha) =>
    comidaEdit[fecha] !== undefined && comidaEdit[fecha] !== ""
      ? num(comidaEdit[fecha])
      : num(comida);

  const startEdit = (fecha, campo) => {
    setEditing({ fecha, campo });
    setEditValue(campo === "venta" ? ventaDe(ventas.find((v) => v.fecha === fecha)) : comidaDe(fecha));
  };

  const saveEdit = () => {
    if (editing === null) return;
    if (editing.campo === "venta") {
      setVentaEdit({ ...ventaEdit, [editing.fecha]: editValue });
    } else {
      setComidaEdit({ ...comidaEdit, [editing.fecha]: editValue });
    }
    setEditing(null);
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  const isEditing = (fecha, campo) =>
    editing !== null && editing.fecha === fecha && editing.campo === campo;

  useEffect(() => {
    if (!from || !to) return;
    let isActive = true;
    const load = async () => {
      try {
        const [rv, rg] = await Promise.all([
          axios.get(`${urlBase}/api/v1/ventas/byUserRange`, { params: { user: idUser, from, to } }),
          axios.get(`${urlBase}/api/v1/box/gastosByUserRange`, { params: { user: idUser, from, to } })
        ]);
        if (isActive) {
          setVentas(rv.data);
          setGastos(rg.data);
        }
      } catch (e) {
        console.error("Error al cargar la cuenta:", e);
      }
    };
    load();
    return () => { isActive = false; };
  }, [urlBase, idUser, from, to]);

  const totalVenta = ventas.reduce((a, r) => a + ventaDe(r), 0);
  const sumaComida = ventas.reduce((a, r) => a + comidaDe(r.fecha), 0);
  const totalGastos = gastos.reduce((a, r) => a + num(r.gasto), 0);
  const total = totalVenta - sumaComida + totalGastos;

  const handleEntregar = async () => {
    if (total <= 0) {
      alert("El total a entregar debe ser mayor a 0");
      return;
    }
    if (idUser === idReceiver) {
      alert("El vendedor y quien recibe deben ser personas distintas");
      return;
    }
    setSaving(true);
    try {
      await axios.post(`${urlBase}/api/v1/box/newTrans`, {
        userA: idUser,
        userB: idReceiver,
        concept: `ENTREGA DE CUENTA ${fechaLatina(from)} al ${fechaLatina(to)}`,
        amount: parseFloat(total.toFixed(2))
      });
      alert(`Cuenta entregada con éxito: ${money(total)}`);
    } catch (e) {
      console.error(e);
      alert("No se pudo registrar la entrega");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <TitleForm text="Cuenta para entregar" />

      <div className="deliver_filters">
        <div>
          <h3>Vendedor</h3>
          <select value={idUser} onChange={(e) => setIdUser(parseInt(e.target.value))}>
            <option value="1">Dennis</option>
            <option value="2">Luz Marina</option>
            <option value="3">Miguel Angel</option>
          </select>
        </div>
        <div>
          <h3>Entrega a</h3>
          <select value={idReceiver} onChange={(e) => setIdReceiver(parseInt(e.target.value))}>
            <option value="1">Dennis</option>
            <option value="2">Luz Marina</option>
            <option value="3">Miguel Angel</option>
          </select>
        </div>
        <div>
          <h3>Desde</h3>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <h3>Hasta</h3>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div>
          <h3>Comida diaria S/.</h3>
          <input type="number" step="any" min="0" value={comida} onChange={(e) => setComida(e.target.value)} />
        </div>
      </div>

      <h3>Ventas del periodo</h3>
      <p>Doble clic en Venta o Comida para editar el valor de ese día</p>
      <div className="result">
        <table className="infoTable">
          <thead>
            <tr>
              <th>fecha</th>
              <th>venta</th>
              <th>Comida</th>
              <th>total</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((r) => {
              const v = ventaDe(r);
              const rowTotal = v - comidaDe(r.fecha);
              return (
                <tr key={r.fecha}>
                  <td>{r.fecha}</td>
                  <td onDoubleClick={() => startEdit(r.fecha, "venta")} style={{ cursor: "pointer" }}>
                    {isEditing(r.fecha, "venta") ? (
                      <input
                        type="number"
                        step="any"
                        min="0"
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.target.blur();
                          if (e.key === "Escape") cancelEdit();
                        }}
                      />
                    ) : (
                      <>{v.toFixed(2)}</>
                    )}
                  </td>
                  <td onDoubleClick={() => startEdit(r.fecha, "comida")} style={{ cursor: "pointer" }}>
                    {isEditing(r.fecha, "comida") ? (
                      <input
                        type="number"
                        step="any"
                        min="0"
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.target.blur();
                          if (e.key === "Escape") cancelEdit();
                        }}
                      />
                    ) : (
                      <>-{comidaDe(r.fecha).toFixed(2)}</>
                    )}
                  </td>
                  <td>{rowTotal.toFixed(2)}</td>
                </tr>
              );
            })}
            {ventas.length === 0 && (
              <tr><td colSpan={4}>No hay ventas en el rango seleccionado</td></tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>Total</td>
              <td>{(totalVenta - sumaComida).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <h3>Gastos</h3>
      <div className="result">
        <table className="infoTable">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Gastos</th>
            </tr>
          </thead>
          <tbody>
            {gastos.map((r, i) => (
              <tr key={`${r.fecha}-${i}`}>
                <td>{r.fecha}</td>
                <td>{r.descripcion}</td>
                <td>{num(r.gasto).toFixed(2)}</td>
              </tr>
            ))}
            {gastos.length === 0 && (
              <tr><td colSpan={3}>No hay gastos en el rango seleccionado</td></tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>Total gastos</td>
              <td>{totalGastos.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="deliver_summary">
        <div>
          <h3>Vendedor</h3>
          <p>{USERS[idUser]}</p>
        </div>
        <div>
          <h3>Entrega a</h3>
          <p>{USERS[idReceiver]}</p>
        </div>
        <div>
          <h3>Desde</h3>
          <p className="date_cell">{fechaLatina(from)}</p>
        </div>
        <div>
          <h3>Hasta</h3>
          <p className="date_cell">{fechaLatina(to)}</p>
        </div>
        <div>
          <h3>Total</h3>
          <p>{money(total)}</p>
        </div>
      </div>

      <button onClick={handleEntregar} disabled={saving}>
        {saving ? "Entregando..." : "Entregar"}
      </button>
    </>
  );
};
