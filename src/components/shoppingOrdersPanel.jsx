import { useCallback, useEffect, useState } from "react";
import shoppingOrderService from "../services/shoppingOrders";
import { ShoppingOrderModal } from "./shoppingOrderModal";
import "./css/shoppingOrders.css";

const money = (value) => Number(value || 0).toFixed(2);

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
};

export function ShoppingOrdersPanel({ urlBase, shoppingItems, canEdit, onChanged }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOrderId, setModalOrderId] = useState(undefined);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await shoppingOrderService.getOrders(urlBase);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    } finally {
      setLoading(false);
    }
  }, [urlBase]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const openNew = () => {
    if (!canEdit) return;
    if (shoppingItems.length === 0) {
      alert("No hay productos pendientes en la lista de compras");
      return;
    }
    setModalOrderId(null);
  };

  const handleSaved = async () => {
    setModalOrderId(undefined);
    await loadOrders();
    onChanged?.();
  };

  const removeOrder = async (order) => {
    if (!canEdit || order.status !== "draft") return;
    if (!window.confirm(`¿Eliminar el borrador "${order.title || `Pedido #${order.id_order}`}"?`)) return;

    try {
      await shoppingOrderService.deleteOrder(urlBase, order.id_order);
      await loadOrders();
    } catch (error) {
      alert(error?.response?.data?.message || "No se pudo eliminar el pedido");
    }
  };

  return (
    <section className="shopping_orders_section">
      <div className="shopping_orders_header">
        <div>
          <h3>Proformas de pedido</h3>
          <p>Selecciona productos de la lista y guárdalos como borrador o como pedido confirmado.</p>
        </div>
        {canEdit ? (
          <button type="button" className="btn_primary" onClick={openNew}>
            Nuevo pedido
          </button>
        ) : null}
      </div>

      {loading ? (
        <p>Cargando pedidos...</p>
      ) : orders.length === 0 ? (
        <p className="shopping_orders_empty">
          Aún no hay pedidos. Crea una proforma para agrupar los productos que vas a comprar.
        </p>
      ) : (
        <div className="result">
          <table className="infoTable shopping_orders_table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Estado</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Creado por</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isDraft = order.status === "draft";
                return (
                  <tr key={order.id_order}>
                    <td>
                      <strong>{order.title || `Pedido #${order.id_order}`}</strong>
                      {order.title ? <span className="shopping_order_id">#{order.id_order}</span> : null}
                    </td>
                    <td>
                      <span className={`shopping_order_badge ${order.status}`}>
                        {isDraft ? "Borrador" : "Pedido confirmado"}
                      </span>
                    </td>
                    <td>{order.items_count}</td>
                    <td>S/. {money(order.total)}</td>
                    <td>{order.created_by || "—"}</td>
                    <td>{formatDate(isDraft ? order.updated : order.ordered_at)}</td>
                    <td>
                      <div className="shopping_order_actions">
                        <button
                          type="button"
                          className={isDraft && canEdit ? "btn_primary" : "btn_clear"}
                          onClick={() => setModalOrderId(order.id_order)}
                        >
                          {isDraft && canEdit ? "Editar" : "Ver"}
                        </button>
                        {isDraft && canEdit ? (
                          <button type="button" className="btn_danger" onClick={() => removeOrder(order)}>
                            Eliminar
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modalOrderId !== undefined ? (
        <ShoppingOrderModal
          urlBase={urlBase}
          orderId={modalOrderId}
          shoppingItems={shoppingItems}
          canEdit={canEdit}
          onClose={() => setModalOrderId(undefined)}
          onSaved={handleSaved}
        />
      ) : null}
    </section>
  );
}
