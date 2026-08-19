import "../css/popupwindow.css";
import noImagen from "../img/no_imagen.png";

export const IMAGE_KEYS = ["img", "url_image"];

const prettify = (key) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const isMoney = (key) =>
  /costo|valor|total|ganancia|venta|ingreso|price|p_unit|p_total|revenue/i.test(key);

export function ProductModal({ product, onClose }) {
  const imageUrl = product.img || product.url_image || null;
  const name =
    product.producto ||
    product.nombre ||
    product.product_name ||
    product.name ||
    "Detalle del producto";

  const fields = Object.entries(product).filter(
    ([key]) => !IMAGE_KEYS.includes(key)
  );

  return (
    <div className="popup_frame">
      <button className="closeButton" onClick={onClose}>X</button>
      <h3 className="title_popupwindow">{name}</h3>
      <img
        className="popup_image"
        src={imageUrl || noImagen}
        alt={name}
        onError={(e) => { e.currentTarget.src = noImagen; }}
      />
      <div className="product_modal_fields">
        {fields.map(([key, value]) => {
          const display = value ?? "";
          return (
            <div className="product_modal_field" key={key}>
              <strong>{prettify(key)}:</strong>
              <span>{isMoney(key) && display !== "" ? `S/. ${display}` : String(display)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}