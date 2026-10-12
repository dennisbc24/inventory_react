import { useState, useEffect, useMemo, useContext } from "react";
import axios from "axios";
import { TitleForm } from "./form/titleForm.jsx";
import { InputSimple } from "./form/inputSearch";
import { ProductModal } from "./form/productModal.jsx";
import { ContextUser } from "../context/userContext.jsx";
import "./salesForm.css";
import "./table.css";
import noImagen from "./img/no_imagen.png";

const PAGE_SIZE = 50;
const num = (v) => parseFloat(v || 0);

export const ProductsList = ({ urlBase }) => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [keyWord, setKeyWord] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [onlyStock, setOnlyStock] = useState(false);
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [sort, setSort] = useState("nombre-az");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const { usuario } = useContext(ContextUser);
  const canEdit = usuario?.role === 'admin';

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [rp, rs] = await Promise.all([
          axios.get(`${urlBase}/api/v1/products`),
          axios.get(`${urlBase}/api/v1/suppliers`)
        ]);
        if (active) {
          setProducts(Array.isArray(rp.data) ? rp.data : []);
          setSuppliers(Array.isArray(rs.data) ? rs.data : []);
        }
      } catch (e) {
        console.error("Error al cargar productos:", e);
      }
    };
    load();
    return () => { active = false; };
  }, [urlBase]);

  useEffect(() => { setPage(1); }, [keyWord, category, supplier, onlyStock, onlyOnline, sort]);

  const categories = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      if (p.fk_category && !map.has(p.fk_category)) {
        map.set(p.fk_category, p.category_name || `Categoría ${p.fk_category}`);
      }
    });
    return [...map.entries()];
  }, [products]);

  const supplierName = (p) => {
    if (p.supplier) return p.supplier;
    const s = suppliers.find((x) => String(x.id_supplier) === String(p.fk_supplier));
    return s ? s.name : "—";
  };

  const filtered = useMemo(() => {
    const q = keyWord.trim().toLowerCase();
    let list = products.filter((p) => {
      if (q && !String(p.name || "").toLowerCase().includes(q)) return false;
      if (category && String(p.fk_category) !== String(category)) return false;
      if (supplier && String(p.fk_supplier) !== String(supplier)) return false;
      if (onlyStock && num(p.stock_total) <= 0) return false;
      if (onlyOnline && !p.is_online) return false;
      return true;
    });
    const byNum = (fn) => (a, b) => fn(a) - fn(b);
    switch (sort) {
      case "nombre-az": list = [...list].sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""))); break;
      case "nombre-za": list = [...list].sort((a, b) => String(b.name || "").localeCompare(String(a.name || ""))); break;
      case "precio-menor": list = [...list].sort(byNum((p) => num(p.list_price ?? 999999999))); break;
      case "precio-mayor": list = [...list].sort((a, b) => num(b.list_price ?? -1) - num(a.list_price ?? -1)); break;
      case "mayor-menor": list = [...list].sort((a, b) => num(b.lowest_price ?? -1) - num(a.lowest_price ?? -1)); break;
      case "costo-mayor": list = [...list].sort((a, b) => num(b.cost) - num(a.cost)); break;
      case "stock-mayor": list = [...list].sort((a, b) => num(b.stock_total) - num(a.stock_total)); break;
      case "stock-menor": list = [...list].sort(byNum((p) => num(p.stock_total))); break;
      case "recientes": list = [...list].sort((a, b) => num(b.id_product) - num(a.id_product)); break;
      default: break;
    }
    return list;
  }, [products, keyWord, category, supplier, onlyStock, onlyOnline, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const saveSupplier = async (product, newFk) => {
    const sup = suppliers.find((s) => String(s.id_supplier) === String(newFk));
    try {
      const fd = new FormData();
      fd.append('name', product.name);
      fd.append('cost', product.cost ?? 0);
      fd.append('sugested_price', product.list_price ?? '');
      fd.append('wholesale_price', product.lowest_price ?? '');
      fd.append('fk_category', product.fk_category ?? '');
      fd.append('is_online', product.is_online ? 'true' : 'false');
      fd.append('attributes', JSON.stringify(product.attributes || {}));
      fd.append('fk_supplier', newFk === '' ? '' : newFk);
      fd.append('supplier', sup ? sup.name : '');
      await axios.patch(`${urlBase}/api/v1/products/${product.id_product}`, fd);
      setProducts((prev) => prev.map((p) =>
        p.id_product === product.id_product
          ? { ...p, fk_supplier: newFk === '' ? null : Number(newFk), supplier: sup ? sup.name : null }
          : p
      ));
      alert('Proveedor actualizado');
    } catch (e) {
      alert(e?.response?.data?.message || 'Error al actualizar proveedor');
    } finally {
      setEditingSupplier(null);
    }
  };

  return (
    <>
      <TitleForm text="Productos" />
      <div className="divForm">
        <InputSimple titulo="Palabra clave" tipo="text" valor={keyWord} func={(e) => setKeyWord(e.target.value)} nombre="kw" callToAction="Buscar por nombre..." />
        <div className="inputSimple">
          <h3>Categoría</h3>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="only_select">
            <option value="">Todas</option>
            {categories.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </select>
        </div>
        <div className="inputSimple">
          <h3>Proveedor</h3>
          <select value={supplier} onChange={(e) => setSupplier(e.target.value)} className="only_select">
            <option value="">Todos</option>
            {suppliers.map((s) => <option key={s.id_supplier} value={s.id_supplier}>{s.name}</option>)}
          </select>
        </div>
        <div className="inputSimple">
          <h3>Ordenar</h3>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="only_select">
            <option value="nombre-az">Nombre A-Z</option>
            <option value="nombre-za">Nombre Z-A</option>
            <option value="precio-mayor">P. Unit mayor a menor</option>
            <option value="precio-menor">P. Unit menor a mayor</option>
            <option value="mayor-menor">P. Mayor de mayor a menor</option>
            <option value="stock-mayor">Stock mayor a menor</option>
            <option value="stock-menor">Stock menor a mayor</option>
            <option value="costo-mayor">Costo mayor a menor</option>
            <option value="recientes">Recientes</option>
          </select>
        </div>
        <div className="inputSimple">
          <h3>Filtros</h3>
          <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13 }}>
            <input type="checkbox" checked={onlyStock} onChange={(e) => setOnlyStock(e.target.checked)} /> Solo con stock
          </label>
          <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13 }}>
            <input type="checkbox" checked={onlyOnline} onChange={(e) => setOnlyOnline(e.target.checked)} /> Solo online
          </label>
        </div>
      </div>

      <p>{filtered.length} producto(s) — Página {safePage} de {totalPages}</p>
      <div className="result">
        <table className="infoTable">
          <thead>
            <tr>
              <th></th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Proveedor</th>
              <th>Costo S/.</th>
              <th>P. Unit S/.</th>
              <th>P. Mayor S/.</th>
              <th>Stock</th>
              <th>Online</th>
              <th>Ver</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((p) => (
              <tr key={p.id_product}>
                <td><img src={p.url_image || noImagen} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} onError={(e) => { e.currentTarget.src = noImagen; }} /></td>
                <td>{p.name}</td>
                <td>{p.category_name || "—"}</td>
                <td
                  onDoubleClick={() => canEdit && setEditingSupplier(p.id_product)}
                  style={canEdit ? { cursor: 'pointer' } : undefined}
                  title={canEdit ? 'Doble clic para cambiar proveedor' : undefined}
                >
                  {editingSupplier === p.id_product ? (
                    <select
                      autoFocus
                      value={p.fk_supplier === null || p.fk_supplier === undefined ? '' : String(p.fk_supplier)}
                      onChange={(e) => saveSupplier(p, e.target.value)}
                      onBlur={() => setEditingSupplier(null)}
                      onKeyDown={(e) => { if (e.key === 'Escape') setEditingSupplier(null); }}
                    >
                      <option value="">Sin proveedor</option>
                      {suppliers.map((s) => <option key={s.id_supplier} value={s.id_supplier}>{s.name}</option>)}
                    </select>
                  ) : (
                    <>{supplierName(p)}</>
                  )}
                </td>
                <td>{p.cost ?? "—"}</td>
                <td>{p.list_price ?? "—"}</td>
                <td>{p.lowest_price ?? "—"}</td>
                <td>{num(p.stock_total)}</td>
                <td>{p.is_online ? "Sí" : "No"}</td>
                <td><button onClick={() => setSelected(p)}>Ver</button></td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr><td colSpan={10}>Sin productos con esos filtros</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
        <button onClick={() => setPage(1)} disabled={safePage <= 1}>{"<<"}</button>
        <button onClick={() => setPage((x) => Math.max(1, x - 1))} disabled={safePage <= 1}>Anterior</button>
        <span>Página {safePage} de {totalPages}</span>
        <button onClick={() => setPage((x) => Math.min(totalPages, x + 1))} disabled={safePage >= totalPages}>Siguiente</button>
        <button onClick={() => setPage(totalPages)} disabled={safePage >= totalPages}>{">>"}</button>
      </div>
      {selected ? <ProductModal product={selected} onClose={() => setSelected(null)} /> : null}
    </>
  );
};
