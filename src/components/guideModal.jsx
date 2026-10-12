import "./css/proforma.css";
import "./css/popupwindow.css";
import noImagen from "./img/no_imagen.png";

export const BRANCH_NAMES = { 1: "B17", 3: "Departamento", 4: "Deposito", 5: "Los Nogales", 6: "Los Incas", 7: "Tambopata" };
export const USER_NAMES = { 1: "Dennis", 2: "Luz", 3: "Miguel" };

export const genGuideCode = (prefix) => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${prefix}-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
};

export function GuideModal({ title, code, header, lines, onQty, onRemove, totalLabel, onSave, saving, onClose, suppliers, onSupplier, onCost }) {
  const totalQty = lines.reduce((a, l) => a + (parseInt(l.count) || 0), 0);
  return (
    <div className="popup_frame proforma_frame">
      <button className="closeButton" onClick={onClose}>X</button>
      <h3 className="title_popupwindow">{title}</h3>
      <div className="product_modal_fields">
        <div className="product_modal_field"><strong>Guía:</strong><span>{code}</span></div>
        {header.map(([k, v]) => (
          <div className="product_modal_field" key={k}><strong>{k}:</strong><span>{v}</span></div>
        ))}
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
            <button className="proforma_step" onClick={() => onQty(l.key, -1)}>-</button>
            <span className="proforma_qty">{l.count}</span>
            <button className="proforma_step" onClick={() => onQty(l.key, 1)}>+</button>
            {(suppliers && onSupplier && onCost) && (
              <div className="guide_extra">
                <label>Prov.:
                  <select value={l.fk_supplier === null || l.fk_supplier === undefined ? '' : String(l.fk_supplier)} onChange={(e) => onSupplier(l.key, e.target.value)}>
                    <option value="">Sin proveedor</option>
                    {suppliers.map((s) => <option key={s.id_supplier} value={s.id_supplier}>{s.name}</option>)}
                  </select>
                </label>
                <label>Costo S/.:
                  <input type="number" step="any" min="0" value={l.cost} onChange={(e) => onCost(l.key, e.target.value)} style={{ width: '80px' }} />
                </label>
              </div>
            )}
            <button className="proforma_remove" onClick={() => onRemove(l.key)}>×</button>
          </div>
        ))}
        {lines.length === 0 && <p>Sin productos en la guía</p>}
      </div>
      <div className="proforma_total">
        <span>{totalLabel}</span>
        <span>{totalQty} uds.</span>
      </div>
      <button className="pop_up_button" onClick={onSave} disabled={saving || lines.length === 0}>
        {saving ? "Guardando..." : "Guardar"}
      </button>
    </div>
  );
}
