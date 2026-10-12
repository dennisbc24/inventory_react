import "./css/proforma.css";
import "./css/popupwindow.css";
import noImagen from "./img/no_imagen.png";

const BRANCH_NAMES = { 1: "B17", 3: "Departamento", 4: "Deposito", 5: "Los Nogales", 6: "Los Incas", 7: "Tambopata" };

export function ProformaModal({ lines, cliente, setCliente, fecha, setFecha, onClose, onQty, onPrice, onRemove, onSave, saving }) {
  const lineTotal = (l) => parseFloat(l.pUnit || 0) * l.count;
  const total = lines.reduce((a, l) => a + lineTotal(l), 0);

  return (
    <div className="popup_frame proforma_frame">
      <button className="closeButton" onClick={onClose}>X</button>
      <h3 className="title_popupwindow">NUEVA VENTA</h3>
      <div className="proforma_head">
        <label>Cliente: <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Cliente" /></label>
        <label>Fecha: <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} /></label>
      </div>
      <div className="proforma_lines">
        {lines.map((l) => (
          <div className="proforma_line" key={l.key}>
            <img
              className="proforma_img"
              src={l.product.url_image || noImagen}
              alt={l.product.name}
              onError={(e) => { e.currentTarget.src = noImagen; }}
            />
            <span className="proforma_name">{l.product.name}</span>
            <span>S/.</span>
            <input
              className="proforma_price"
              type="number"
              step="any"
              min="0"
              value={l.pUnit}
              onChange={(e) => onPrice(l.key, e.target.value)}
            />
            <button className="proforma_step" onClick={() => onQty(l.key, -1)}>-</button>
            <span className="proforma_qty">{l.count}</span>
            <button className="proforma_step" onClick={() => onQty(l.key, 1)}>+</button>
            <span className="proforma_branch">{BRANCH_NAMES[l.idBranch] || l.idBranch}</span>
            <span className="proforma_line_total">{lineTotal(l).toFixed(2)}</span>
            <button className="proforma_remove" onClick={() => onRemove(l.key)}>×</button>
          </div>
        ))}
        {lines.length === 0 && <p>No hay productos en la proforma</p>}
      </div>
      <div className="proforma_total">
        <span>TOTAL</span>
        <span>{total.toFixed(2)}</span>
      </div>
      <button className="pop_up_button" onClick={onSave} disabled={saving || lines.length === 0}>
        {saving ? "Guardando..." : "Guardar"}
      </button>
    </div>
  );
}
