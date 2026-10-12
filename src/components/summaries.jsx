import { useState } from "react";
import { InputSimple } from "./form/inputSearch";
import "./salesForm.css";
import { TitleForm } from "./form/titleForm.jsx";
import { TableGet, TABLE_HEADERS } from "./table.jsx";


export const SearchSummary = ({urlBase}) => {

    const now = new Date();
    const [year, setYear] = useState(String(now.getFullYear()));
    const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));

    const handleDate = ({ target: { value } }) => {
      if (!value) return;
      setYear(value.substring(0, 4)),
      setMonth(value.substring(5, 7))
  };


    return (
      <>
      <TitleForm text='Buscar Resumen'></TitleForm>
      <div className="divForm">
              <InputSimple titulo="Fecha" tipo="month" func={handleDate} valor={`${year}-${month}`}></InputSimple>
      </div>


      {<>{ year && month ? <TableGet key={`${year}-${month}`} url={`${urlBase}/api/v1/summaries/summaryByDay?year=${year}&month=${month}`} headers={TABLE_HEADERS.summaryByDay}/> : <></>
      }</>}
      </>
    );
  };
