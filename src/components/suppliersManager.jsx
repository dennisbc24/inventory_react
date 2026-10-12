import { useState } from "react";
import axios from "axios";
import { TitleForm } from "./form/titleForm.jsx";
import { InputSimple, ParrafoInput, SearchInput } from "./form/inputSearch";
import { TableGet, TABLE_HEADERS } from "./table.jsx";
import "./salesForm.css";

export const SuppliersManager = ({ urlBase }) => {
  const [supKey, setSupKey] = useState(0);
  const [newName, setNewName] = useState("");
  const [selected, setSelected] = useState({ name: "", id_supplier: "" });
  const [editName, setEditName] = useState("");

  const handleCreate = async () => {
    if (!newName.trim()) {
      alert("Nombre requerido");
      return;
    }
    try {
      const { data } = await axios.post(`${urlBase}/api/v1/suppliers`, { name: newName.trim() });
      alert(data);
      setNewName("");
      setSupKey((k) => k + 1);
    } catch (e) {
      alert(e?.response?.data?.message || "Error al crear proveedor");
    }
  };

  const handleSelect = (s) => {
    setSelected(s);
    setEditName(s.name || "");
  };

  const handleUpdate = async () => {
    if (!selected.id_supplier) {
      alert("Busca y selecciona un proveedor");
      return;
    }
    if (!editName.trim()) {
      alert("Nombre requerido");
      return;
    }
    try {
      const { data } = await axios.patch(`${urlBase}/api/v1/suppliers/${selected.id_supplier}`, { name: editName.trim() });
      alert(data);
      setSelected({ name: "", id_supplier: "" });
      setEditName("");
      setSupKey((k) => k + 1);
    } catch (e) {
      alert(e?.response?.data?.message || "Error al actualizar proveedor");
    }
  };

  return (
    <>
      <TitleForm text="Proveedores" />
      <div className="divForm">
        <h3>Crear proveedor</h3>
        <InputSimple titulo="Nombre" tipo="text" valor={newName} func={(e) => setNewName(e.target.value)} nombre="new_supplier" />
        <button onClick={handleCreate}>Crear</button>
      </div>
      <div className="divForm">
        <h3>Editar proveedor</h3>
        <SearchInput urlApi={`${urlBase}/api/v1/suppliers`} funcSet={handleSelect} place="Buscar proveedor..." />
        <ParrafoInput titulo="Seleccionado" parrafo={selected.name || "—"} />
        {selected.id_supplier ? (
          <>
            <InputSimple titulo="Nombre" tipo="text" valor={editName} func={(e) => setEditName(e.target.value)} nombre="edit_supplier" />
            <button onClick={handleUpdate}>Guardar cambios</button>
          </>
        ) : null}
      </div>
      <h3>Lista de proveedores</h3>
      <TableGet key={supKey} url={`${urlBase}/api/v1/suppliers`} minWitdh="600px" headers={TABLE_HEADERS.suppliers} />
    </>
  );
};
