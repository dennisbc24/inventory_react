import { useState, useEffect, useContext } from "react";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import { ButtonSave, SearchInput } from "./form/inputSearch";
import shoppingService from "../services/shoppingList";
import { ContextUser } from "../context/userContext.jsx";
import axios from "axios";
import noImagen from "./img/no_imagen.png";
import { ProductModal } from "./form/productModal.jsx";

export const ShoppingList = ({ urlBase }) => {
  const [items, setItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [supplierFilter, setSupplierFilter] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const suppliersInList = items.reduce((acc, it) => {
    const key = it.fk_supplier === null || it.fk_supplier === undefined ? "none" : String(it.fk_supplier);
    if (!acc.some((s) => s.key === key)) {
      acc.push({ key, name: it.supplier_name || "Sin proveedor" });
    }
    return acc;
  }, []);

  const visibleItems = supplierFilter === ""
    ? items
    : items.filter((it) => {
        const key = it.fk_supplier === null || it.fk_supplier === undefined ? "none" : String(it.fk_supplier);
        return key === supplierFilter;
      });

  const { usuario } = useContext(ContextUser)
  const canEdit = usuario.role === 'admin'

  const loadList = async () => {
    try {
      const response = await shoppingService.getList(urlBase);
      setItems(response);
    } catch (error) {
      console.error("Error al obtener la lista de compras:", error);
    }
  };

  useEffect(() => {
    loadList();
    axios.get(`${urlBase}/api/v1/suppliers`)
      .then((r) => setSuppliers(Array.isArray(r.data) ? r.data : []))
      .catch((e) => console.error("Error al obtener proveedores:", e));
  }, []);

  useEffect(() => {
    let isActive = true;
    const loadStock = async () => {
      if (selectedProduct && selectedProduct.id_product) {
        try {
          const { data } = await axios.get(`${urlBase}/api/v1/existence?product=${selectedProduct.id_product}`);
          if (isActive) {
            const total = data.reduce((acc, row) => acc + parseFloat(row.amount || 0), 0);
            setSelectedStock(total);
          }
        } catch (error) {
          console.error("Error al obtener el stock:", error);
          if (isActive) setSelectedStock(null);
        }
      } else if (isActive) {
        setSelectedStock(null);
      }
    };
    loadStock();
    return () => { isActive = false; };
  }, [selectedProduct, urlBase]);

  const addManual = async () => {
    if (!selectedProduct) {
      alert("Busca y selecciona un producto");
      return;
    }
    const response = await shoppingService.addManual(urlBase, selectedProduct.id_product);
    alert(response.message);
    setSelectedProduct(null);
    loadList();
  };

  const markPurchased = async (id_shopping) => {
    await shoppingService.markPurchased(urlBase, id_shopping);
    loadList();
  };

  const removeItem = async (id_shopping) => {
    await shoppingService.remove(urlBase, id_shopping);
    loadList();
  };

  const saveItemSupplier = async (item, newFk) => {
    try {
      const { data: prod } = await axios.get(`${urlBase}/api/v1/products/${item.id_product}`);
      const p = Array.isArray(prod) ? prod[0] : prod;
      if (!p) {
        alert("No se pudo obtener el producto");
        return;
      }
      const sup = suppliers.find((s) => String(s.id_supplier) === String(newFk));
      const fd = new FormData();
      fd.append('name', p.name);
      fd.append('cost', p.cost ?? 0);
      fd.append('sugested_price', p.list_price ?? '');
      fd.append('wholesale_price', p.lowest_price ?? '');
      fd.append('fk_category', p.fk_category ?? '');
      fd.append('is_online', p.is_online ? 'true' : 'false');
      fd.append('attributes', JSON.stringify(p.attributes || {}));
      fd.append('fk_supplier', newFk === '' ? '' : newFk);
      fd.append('supplier', sup ? sup.name : '');
      await axios.patch(`${urlBase}/api/v1/products/${item.id_product}`, fd);
      setItems((prev) => prev.map((it) =>
        it.id_shopping === item.id_shopping
          ? { ...it, fk_supplier: newFk === '' ? null : Number(newFk), supplier_name: sup ? sup.name : null }
          : it
      ));
      alert('Proveedor actualizado');
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || 'Error al actualizar proveedor');
    } finally {
      setEditingSupplier(null);
    }
  };

  const handleDragStart = (index) => { setDragIndex(index) }
  const handleDragOver = (e, index) => { e.preventDefault(); setDragOverIndex(index) }
  const handleDragEnd = () => { setDragIndex(null); setDragOverIndex(null) }

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) {
      const reordered = [...items];
      const [moved] = reordered.splice(dragIndex, 1);
      reordered.splice(index, 0, moved);
      setItems(reordered);
      const orderedIds = reordered.map((item) => item.id_shopping);
      shoppingService.reorder(urlBase, orderedIds).catch((error) => {
        console.error("Error al guardar el orden:", error);
        loadList();
      });
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <>
      <TitleForm text='Lista de Compras'></TitleForm>

      {canEdit ? (
      <div className="divForm">
        <h3>Agregar producto a mano</h3>
        <SearchInput urlApi={`${urlBase}/api/v1/products`} funcSet={setSelectedProduct} place="Buscar producto..."/>
        {selectedProduct ? (
          <div className="descriptionSell">
            <div className="image_box">
              <img
                className="product_image"
                src={selectedProduct.url_image ? selectedProduct.url_image : noImagen}
                alt={selectedProduct.name}
              />
            </div>
            <div>
              <p>{selectedProduct.name}</p>
              <p className="unitPrice">Stock total: {selectedStock !== null ? selectedStock : "Cargando..."}</p>
            </div>
          </div>
        ) : null}
        <ButtonSave titulo={'Agregar a la lista'} func={addManual}/>
      </div>
      ) : null}

      <h3>Productos por adquirir</h3>
      {canEdit ? <p>Arrastra las filas para cambiar la prioridad (las agregadas a mano van arriba por defecto)</p> : null}
      <div className="divForm">
        <div className="inputSimple">
          <h3>Proveedor</h3>
          <select value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)} className="only_select">
            <option value="">Todos ({items.length})</option>
            {suppliersInList.map((s) => (
              <option key={s.key} value={s.key}>{s.name} ({items.filter((it) => (it.fk_supplier === null || it.fk_supplier === undefined ? "none" : String(it.fk_supplier)) === s.key).length})</option>
            ))}
          </select>
        </div>
      </div>
      <div className="result">
      <table className="infoTable">
        <thead>
          <tr>
            {canEdit ? <th></th> : null}
            <th>Producto</th>
            <th>Proveedor</th>
            <th>Stock total</th>
            <th>Costo S/.</th>
            {canEdit ? <th>Acciones</th> : null}
            <th>Origen</th>
            <th>Agregado por</th>
            <th>Ver</th>
          </tr>
        </thead>
        <tbody>
          {visibleItems.map((item, index) => (
            <tr
              key={item.id_shopping}
              draggable={canEdit && !supplierFilter}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              style={{
                opacity: dragIndex === index ? 0.4 : 1,
                cursor: canEdit && !supplierFilter ? 'grab' : 'default',
                borderTop: dragOverIndex === index ? '3px solid #4f86c6' : '',
              }}
            >
              {canEdit ? <td>≡</td> : null}
              <td>{item.product_name}</td>
              <td
                onDoubleClick={() => canEdit && setEditingSupplier(item.id_shopping)}
                style={canEdit ? { cursor: 'pointer' } : undefined}
                title={canEdit ? 'Doble clic para cambiar proveedor' : undefined}
              >
                {editingSupplier === item.id_shopping ? (
                  <select
                    autoFocus
                    value={item.fk_supplier === null || item.fk_supplier === undefined ? '' : String(item.fk_supplier)}
                    onChange={(e) => saveItemSupplier(item, e.target.value)}
                    onBlur={() => setEditingSupplier(null)}
                    onKeyDown={(e) => { if (e.key === 'Escape') setEditingSupplier(null); }}
                  >
                    <option value="">Sin proveedor</option>
                    {suppliers.map((s) => <option key={s.id_supplier} value={s.id_supplier}>{s.name}</option>)}
                  </select>
                ) : (
                  <>{item.supplier_name || "—"}</>
                )}
              </td>
              <td>{item.total_stock}</td>
              <td>{item.cost}</td>
              
              {canEdit ? (
              <td>
                <button onClick={() => markPurchased(item.id_shopping)}>Comprado</button>
                <button onClick={() => removeItem(item.id_shopping)}>Eliminar</button>
              </td>
              ) : null}
              <td>{item.source === 'auto' ? 'Automático' : 'Manual'}</td>
              <td>{item.added_by}</td>
              <td><button onClick={() => setViewItem(item)}>Ver</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {viewItem ? <ProductModal product={viewItem} onClose={() => setViewItem(null)} /> : null}
    </>
  );
};