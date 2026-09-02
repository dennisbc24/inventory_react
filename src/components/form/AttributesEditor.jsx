import { useState, useEffect } from "react";

export function AttributesEditor({ value, onChange }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      setRows(Object.entries(value).map(([k, v]) => ({ key: k, val: String(v) })));
    } else if (typeof value === 'string' && value.trim()) {
      try {
        const obj = JSON.parse(value);
        setRows(Object.entries(obj).map(([k, v]) => ({ key: k, val: String(v) })));
      } catch { setRows([]); }
    } else setRows([]);
  }, [value]);

  const emit = (newRows) => {
    const obj = {};
    newRows.forEach(r => { if (r.key.trim()) obj[r.key.trim()] = r.val; });
    onChange(obj);
  };

  const update = (idx, field, v) => {
    const nr = rows.map((r, i) => i === idx ? { ...r, [field]: v } : r);
    setRows(nr); emit(nr);
  };
  const add = () => { const nr = [...rows, { key: '', val: '' }]; setRows(nr); };
  const del = (idx) => { const nr = rows.filter((_, i) => i !== idx); setRows(nr); emit(nr); };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, margin: '12px 0' }}>
      <h4 style={{ margin: '0 0 8px' }}>Especificaciones (atributos variables)</h4>
      <p style={{ fontSize: 11, color: '#666' }}>Ej: Potencia: 800 watts, Material: Vidrio, Diámetro: 28 cm. Se guarda como JSON en la BD compartida.</p>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
          <input placeholder="Etiqueta ej: Potencia" value={r.key} onChange={e => update(i, 'key', e.target.value)} style={{ flex: 1, padding: 6, borderRadius: 6, border: '1px solid #ccc' }} />
          <input placeholder="Valor ej: 800 watts" value={r.val} onChange={e => update(i, 'val', e.target.value)} style={{ flex: 1, padding: 6, borderRadius: 6, border: '1px solid #ccc' }} />
          <button type="button" onClick={() => del(i)} style={{ background: '#fee', border: '1px solid #fcc', borderRadius: 6, padding: '6px 10px' }}>×</button>
        </div>
      ))}
      <button type="button" onClick={add} style={{ marginTop: 6, padding: '6px 12px', borderRadius: 20, border: '1px solid #ccc', background: '#f5f5f5' }}>+ Agregar atributo</button>
      {rows.length === 0 && <p style={{ fontSize: 12, color: '#888' }}>Sin atributos. Agrega los que necesite esta categoría.</p>}
    </div>
  );
}
