import { useEffect, useMemo, useRef, useState } from "react";
import shoppingOrderService from "../services/shoppingOrders";
import noImagen from "./img/no_imagen.png";
import "./css/popupwindow.css";
import "./css/shoppingOrders.css";

const money = (value) => Number(value || 0).toFixed(2);

const fromShoppingItem = (item) => ({
  rowKey: `p-${item.id_product}`,
  id_item: null,
  id_product: item.id_product,
  id_shopping: item.id_shopping,
  product_name: item.product_name,
  url_image: item.url_image,
  supplier_name: item.supplier_name,
  total_stock: item.total_stock,
  quantity: 1,
  unit_cost: Number(item.cost || 0),
  selected: false,
});

const fromOrderItem = (item) => ({
  rowKey: `i-${item.id_item}`,
  id_item: item.id_item,
  id_product: item.fk_product,
  id_shopping: item.fk_shopping,
  product_name: item.product_name,
  url_image: item.url_image,
  supplier_name: item.supplier_name,
  total_stock: item.total_stock,
  quantity: Number(item.quantity || 1),
  unit_cost: Number(item.unit_cost || 0),
  selected: true,
});

export function ShoppingOrderModal({ urlBase, orderId, shoppingItems, canEdit, onClose, onSaved }) {
  const [order, setOrder] = useState(null);
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(!!orderId);
  const [saving, setSaving] = useState(false);
  const [customName, setCustomName] = useState("");
  const customKeyRef = useRef(0);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    let active = true;

    if (!orderId) {
      setRows(shoppingItems.map(fromShoppingItem));
      setOrder(null);
      setLoading(false);
      return () => { active = false; };
    }

    const load = async () => {
      setLoading(true);
      try {
        const data = await shoppingOrderService.getOrder(urlBase, orderId);
        if (!active) return;

        const orderItems = (data.items || []).map(fromOrderItem);
        const editable = canEdit && data.status === "draft";
        const inOrder = new Set(orderItems.map((item) => String(item.id_product)));
        const pending = editable
          ? shoppingItems
              .filter((item) => !inOrder.has(String(item.id_product)))
              .map(fromShoppingItem)
          : [];

        setOrder(data);
        setTitle(data.title || "");
        setNote(data.note || "");
        setRows([...orderItems, ...pending]);
      } catch (error) {
        if (!active) return;
        alert(error?.response?.data?.message || "No se pudo cargar el pedido");
        onCloseRef.current?.();
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => { active = false; };
  }, [orderId, urlBase, shoppingItems, canEdit]);

  const readOnly = !canEdit || (order !== null && order.status !== "draft");
  const selectedRows = useMemo(() => rows.filter((row) => row.selected), [rows]);
  const total = useMemo(
    () => selectedRows.reduce((acc, row) => acc + Number(row.quantity || 0) * Number(row.unit_cost || 0), 0),
    [selectedRows]
  );

  const toggleRow = (rowKey) => {
    setRows((prev) => prev.map((row) =>
      row.rowKey === rowKey ? { ...row, selected: !row.selected } : row
    ));
  };

  const setAllSelected = (selected) => {
    setRows((prev) => prev.map((row) => ({ ...row, selected })));
  };

  const updateRow = (rowKey, field, value) => {
    setRows((prev) => prev.map((row) =>
      row.rowKey === rowKey ? { ...row, [field]: value } : row
    ));
  };

  const addCustomRow = () => {
    const name = customName.trim();
    if (!name) {
      alert("Escribe un nombre provisional para el producto nuevo");
      return;
    }

    const duplicated = rows.some((row) =>
      !row.id_product && String(row.product_name || "").trim().toLowerCase() === name.toLowerCase()
    );
    if (duplicated) {
      alert("Ese producto provisional ya está en el pedido");
      return;
    }

    customKeyRef.current += 1;
    setRows((prev) => [
      ...prev,
      {
        rowKey: `n-${customKeyRef.current}`,
        id_item: null,
        id_product: null,
        id_shopping: null,
        product_name: name,
        url_image: null,
        supplier_name: null,
        total_stock: null,
        quantity: 1,
        unit_cost: 0,
        selected: true,
      },
    ]);
    setCustomName("");
  };

  const save = async (confirmAfter) => {
    if (readOnly || saving) return;

    if (selectedRows.length === 0) {
      alert("Selecciona al menos un producto para el pedido");
      return;
    }

    const customNames = new Set();
    for (const row of selectedRows) {
      if (!(Number(row.quantity) > 0)) {
        alert(`La cantidad de "${row.product_name}" debe ser mayor a 0`);
        return;
      }
      if (!row.id_product) {
        const name = String(row.product_name || "").trim();
        if (!name) {
          alert("Completa el nombre del producto provisional");
          return;
        }
        const key = name.toLowerCase();
        if (customNames.has(key)) {
          alert(`El producto provisional "${name}" está repetido`);
          return;
        }
        customNames.add(key);
      }
    }

    const items = selectedRows.map((row) => (
      row.id_product
        ? {
            id_product: row.id_product,
            id_shopping: row.id_shopping,
            quantity: Number(row.quantity),
            unit_cost: Number(row.unit_cost),
          }
        : {
            product_name: String(row.product_name).trim(),
            quantity: Number(row.quantity),
            unit_cost: Number(row.unit_cost),
          }
    ));

    setSaving(true);
    try {
      const payload = { title: title.trim(), note: note.trim(), items };
      const saved = orderId
        ? await shoppingOrderService.updateOrder(urlBase, orderId, payload)
        : await shoppingOrderService.createOrder(urlBase, payload);

      const id_order = saved.id_order || orderId;

      if (confirmAfter) {
        await shoppingOrderService.confirmOrder(urlBase, id_order);
        alert("Pedido confirmado. Ya no podrá modificarse.");
      } else {
        alert("Borrador guardado");
      }

      onSaved?.();
      onClose?.();
    } catch (error) {
      alert(error?.response?.data?.message || "No se pudo guardar el pedido");
    } finally {
      setSaving(false);
    }
  };

  const heading = orderId
    ? (order?.title || `Pedido #${orderId}`)
    : "Nueva proforma de pedido";

  return (
    <div className="popup_frame shopping_order_frame">
      <button className="closeButton" onClick={onClose}>X</button>
      <h3 className="title_popupwindow">{heading}</h3>

      {loading ? (
        <p>Cargando pedido...</p>
      ) : (
        <>
          <div className="shopping_order_meta">
            {order ? (
              <>
                <span>
                  <strong>Estado:</strong>{" "}
                  <span className={`shopping_order_badge ${order.status}`}>
                    {order.status === "draft" ? "Borrador" : "Pedido confirmado"}
                  </span>
                </span>
                <span><strong>Creado por:</strong> {order.created_by || "—"}</span>
                {order.ordered_at ? (
                  <span><strong>Confirmado:</strong> {new Date(order.ordered_at).toLocaleString()}</span>
                ) : null}
              </>
            ) : (
              <span className="shopping_order_hint">
                Selecciona los productos de la lista de compras que formarán parte de esta proforma.
              </span>
            )}
          </div>

          {readOnly ? (
            <div className="shopping_order_meta">
              {order?.note ? <span><strong>Nota:</strong> {order.note}</span> : null}
            </div>
          ) : (
            <div className="shopping_order_fields">
              <label>
                Título
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={orderId ? `Pedido #${orderId}` : "Ej. Pedido proveedor Lima"}
                />
              </label>
              <label>
                Nota
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Observaciones del pedido"
                />
              </label>
            </div>
          )}

          {!readOnly ? (
            <>
              <div className="shopping_order_tools">
                <span>{selectedRows.length} producto(s) seleccionado(s)</span>
                <button type="button" className="btn_clear" onClick={() => setAllSelected(true)}>Seleccionar todos</button>
                <button type="button" className="btn_clear" onClick={() => setAllSelected(false)}>Quitar selección</button>
              </div>

              <div className="shopping_order_custom_add">
                <div className="shopping_order_custom_info">
                  <strong>Producto nuevo</strong>
                  <span>Escribe un nombre provisional. No se creará en el inventario, solo en esta proforma.</span>
                </div>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addCustomRow(); }}
                  placeholder="Nombre provisional del producto"
                />
                <button type="button" className="btn_clear" onClick={addCustomRow}>
                  Agregar producto nuevo
                </button>
              </div>
            </>
          ) : null}

          <div className="shopping_order_table_wrap">
            <table className="infoTable shopping_order_table">
              <thead>
                <tr>
                  {!readOnly ? <th></th> : null}
                  <th>Producto</th>
                  <th>Proveedor</th>
                  <th>Stock</th>
                  <th>Cantidad</th>
                  <th>Costo unit.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={readOnly ? 6 : 7}>No hay productos en la lista de compras.</td>
                  </tr>
                ) : rows.map((row) => (
                  <tr
                    key={row.rowKey}
                    className={!readOnly && !row.selected ? "shopping_order_row_off" : ""}
                  >
                    {!readOnly ? (
                      <td>
                        <input
                          type="checkbox"
                          checked={row.selected}
                          onChange={() => toggleRow(row.rowKey)}
                        />
                      </td>
                    ) : null}
                    <td>
                      <div className="shopping_order_product">
                        <img
                          src={row.url_image || noImagen}
                          alt={row.product_name}
                          onError={(e) => { e.currentTarget.src = noImagen; }}
                        />
                        {row.id_product || readOnly ? (
                          <span>{row.product_name}</span>
                        ) : (
                          <input
                            className="shopping_order_custom_name"
                            type="text"
                            value={row.product_name}
                            onChange={(e) => updateRow(row.rowKey, "product_name", e.target.value)}
                            placeholder="Nombre provisional"
                          />
                        )}
                        {!row.id_product ? (
                          <span className="shopping_order_custom_badge">Nuevo</span>
                        ) : null}
                      </div>
                    </td>
                    <td>{row.id_product ? (row.supplier_name || "Sin proveedor") : "—"}</td>
                    <td>{row.id_product ? (row.total_stock ?? 0) : "—"}</td>
                    <td>
                      {readOnly ? row.quantity : (
                        <input
                          className="shopping_order_number"
                          type="number"
                          min="0.01"
                          step="any"
                          value={row.quantity}
                          disabled={!row.selected}
                          onChange={(e) => updateRow(row.rowKey, "quantity", e.target.value)}
                        />
                      )}
                    </td>
                    <td>
                      {readOnly ? `S/. ${money(row.unit_cost)}` : (
                        <input
                          className="shopping_order_number"
                          type="number"
                          min="0"
                          step="any"
                          value={row.unit_cost}
                          disabled={!row.selected}
                          onChange={(e) => updateRow(row.rowKey, "unit_cost", e.target.value)}
                        />
                      )}
                    </td>
                    <td>S/. {money(Number(row.quantity || 0) * Number(row.unit_cost || 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="shopping_order_total">
            <span>Total</span>
            <span>S/. {money(total)}</span>
          </div>

          <div className="shopping_order_actions">
            {readOnly ? (
              <button className="btn_clear" onClick={onClose}>Cerrar</button>
            ) : (
              <>
                <button className="btn_primary" onClick={() => save(false)} disabled={saving}>
                  {saving ? "Guardando..." : "Guardar borrador"}
                </button>
                <button className="btn_confirm" onClick={() => save(true)} disabled={saving}>
                  Confirmar pedido
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
