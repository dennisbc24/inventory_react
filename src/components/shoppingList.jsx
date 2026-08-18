import { useState, useEffect, useContext } from "react";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import { ButtonSave, SearchInput } from "./form/inputSearch";
import shoppingService from "../services/shoppingList";
import { ContextUser } from "../context/userContext.jsx";

export const ShoppingList = ({ urlBase }) => {
  const [items, setItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

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
  }, []);

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
        <p>{selectedProduct ? `Seleccionado: ${selectedProduct.name}` : ""}</p>
        <ButtonSave titulo={'Agregar a la lista'} func={addManual}/>
      </div>
      ) : null}

      <h3>Productos por adquirir</h3>
      {canEdit ? <p>Arrastra las filas para cambiar la prioridad (las agregadas a mano van arriba por defecto)</p> : null}
      <table>
        <thead>
          <tr>
            {canEdit ? <th></th> : null}
            <th>Producto</th>
            <th>Stock total</th>
            <th>Costo S/.</th>
            <th>Origen</th>
            <th>Agregado por</th>
            {canEdit ? <th>Acciones</th> : null}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={item.id_shopping}
              draggable={canEdit}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              style={{
                opacity: dragIndex === index ? 0.4 : 1,
                cursor: canEdit ? 'grab' : 'default',
                borderTop: dragOverIndex === index ? '3px solid #4f86c6' : '',
              }}
            >
              {canEdit ? <td>≡</td> : null}
              <td>{item.product_name}</td>
              <td>{item.total_stock}</td>
              <td>{item.cost}</td>
              <td>{item.source === 'auto' ? 'Automático' : 'Manual'}</td>
              <td>{item.added_by}</td>
              {canEdit ? (
              <td>
                <button onClick={() => markPurchased(item.id_shopping)}>Comprado</button>
                <button onClick={() => removeItem(item.id_shopping)}>Eliminar</button>
              </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};