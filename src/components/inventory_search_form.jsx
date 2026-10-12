import { useState, useEffect } from "react";
import { InputSimple } from "./form/inputSearch";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import { TableGet, TABLE_HEADERS } from "./table.jsx";

export const InventorySearchForm = ({ urlBase }) => {

  const [keyWord, setKeyWord] = useState('');
  const [search, setSearch] = useState('');

  const handleInput = ({ target: { value } }) => { setKeyWord(value) };

  useEffect(() => {
    if (!keyWord.trim()) {
      setSearch('');
      return;
    }
    const t = setTimeout(() => setSearch(keyWord.trim()), 600);
    return () => clearTimeout(t);
  }, [keyWord]);

  return (
    <>
    <TitleForm text='Buscar Stock de Producto'></TitleForm>
    <div className="divForm">
        <InputSimple func={handleInput} valor={keyWord} />
    </div>

    {<>{ search !== '' ? <TableGet key={search} url={`${urlBase}/api/v1/existence/byName?keyWord=${encodeURIComponent(search)}`} minWitdh="380px" headers={TABLE_HEADERS.byName}/> : <></>
    }</>}
    </>
  );
};
