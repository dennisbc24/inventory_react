import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ContextUser } from "../context/userContext";

export function ExistenceEditableTable({ url }) {
  const { usuario } = useContext(ContextUser);
  const isAdmin = usuario?.role === 'admin' || usuario?.user?.role === 'admin';

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState("");

  const fetch = async () => {
    try {
      setLoading(true);
      const r = await axios.get(url);
      setRows(Array.isArray(r.data) ? r.data : []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { if (url) fetch(); }, [url]);

  const handleDoubleClick = (id, amount) => {
    if (!isAdmin) return;
    setEditId(id);
    setEditVal(String(amount));
  };

  const handleBlur = async (id) => {
    const val = parseInt(editVal, 10);
    if (isNaN(val) || val < 0) { alert("Cantidad inválida"); setEditId(null); return; }
    try {
      const res = await axios.patch(url.replace(/\/existence\?.*/, '/existence/count').replace(/existence\?.*/, 'existence/count').replace(/\/api\/v1\/existence.*/, '/api/v1/existence/count').replace(url.split('/api')[0] + '/api/v1/existence/count', url.split('/api')[0] + '/api/v1/existence/count'), { id_existence: id, count: val });
      // fallback directo
      if (!res) throw new Error("no res");
    } catch (e) {
      // intenta endpoint directo si el replace falla
      try { await axios.patch(`${url.split('/api')[0]}/api/v1/existence/count`, { id_existence: id, count: val }); } catch (e2) { console.error(e2); alert(e2?.response?.data?.message || e2.message); setEditId(null); return; }
    }
    setRows(prev => prev.map(r => r.id_existence === id ? { ...r, amount: val } : r));
    setEditId(null);
  };

  // intenta PATCH directo más simple
  const handleBlurSimple = async (id) => {
    const val = parseInt(editVal, 10);
    if (isNaN(val) || val < 0) { alert("Cantidad inválida"); setEditId(null); return; }
    try {
      const base = url.split('/api')[0];
      const r = await axios.patch(`${base}/api/v1/existence/count`, { id_existence: id, count: val });
      setRows(prev => prev.map(x => x.id_existence === id ? { ...x, amount: val } : x));
    } catch (e) { console.error(e); alert(e?.response?.data?.message || e.message); }
    setEditId(null);
  };

  if (loading) return <p>Cargando stock...</p>;
  if (!rows.length) return <p style={{color:'#666', fontSize:13}}>Sin stock registrado para este producto. {isAdmin && "Puedes crear existencia desde /inventory."}</p>;

  return (
    <div className="result">
      <table className="infoTable" style={{ minWidth: '600px', width:'100%' }}>
        <thead><tr><th>Sucursal</th><th>Cantidad {isAdmin && <span style={{fontWeight:'normal',fontSize:11,color:'#888'}}>(doble click para editar)</span>}</th><th>Actualizado</th><th>ID</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id_existence}>
              <td>{r.branch_name || r.branch || r.sucursal || '-'}</td>
              <td onDoubleClick={() => handleDoubleClick(r.id_existence, r.amount)} style={{ cursor: isAdmin ? 'pointer' : 'default', background: editId===r.id_existence ? '#fef3c7' : undefined }}>
                {editId === r.id_existence ? (
                  <input type="number" value={editVal} onChange={e=>setEditVal(e.target.value)} onBlur={()=>handleBlurSimple(r.id_existence)} onKeyDown={e=>{ if(e.key==='Enter') handleBlurSimple(r.id_existence); if(e.key==='Escape') setEditId(null); }} autoFocus style={{width:80}} />
                ) : (
                  <span>{r.amount} {isAdmin && <span style={{fontSize:10,color:'#aaa'}}>✎</span>}</span>
                )}
              </td>
              <td style={{fontSize:12}}>{r.updated ? new Date(r.updated).toLocaleString('es-PE') : (r.created ? new Date(r.created).toLocaleString('es-PE') : '-')}</td>
              <td style={{fontSize:11,color:'#888'}}>{r.id_existence}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!isAdmin && <p style={{fontSize:12,color:'#888',marginTop:4}}>Solo admin puede modificar stock.</p>}
    </div>
  );
}
