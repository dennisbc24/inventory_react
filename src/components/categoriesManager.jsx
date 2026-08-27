import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { TitleForm } from "./form/titleForm.jsx";
import { InputSimple, ParrafoInput, SearchInput } from "./form/inputSearch";

export const CategoriesManager = ({ urlBase }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // crear
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPos, setNewPos] = useState(0);

  // editar
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPos, setEditPos] = useState(0);
  const [editActive, setEditActive] = useState(true);

  // mover productos
  const [allProducts, setAllProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [targetCat, setTargetCat] = useState({ name: '', id_category: '' });
  const [filterCat, setFilterCat] = useState(""); // para ver productos por categoria

  const fetchCats = async () => {
    try {
      setLoading(true);
      setError(null);
      // intenta endpoint privado; si 404 (prod sin deploy), fallback a public
      let r;
      try {
        r = await axios.get(`${urlBase}/api/v1/categories`, { params: { includeInactive: true } });
      } catch (e) {
        if (e?.response?.status === 404) {
          r = await axios.get(`${urlBase}/api/v1/public/categories`, { params: { withCounts: true } });
          // public no devuelve inactive ni product_count completo, normaliza
          const data = Array.isArray(r.data) ? r.data : [];
          // si public no trae product_count, ya viene del nuevo código si está deployado; si no, fallback a 0
          r = { data };
        } else throw e;
      }
      setCategories(Array.isArray(r.data) ? r.data : []);
    } catch (e) { setError(e?.response?.data?.message || e.message); } finally { setLoading(false); }
  };

  const fetchProducts = async () => {
    try {
      const r = await axios.get(`${urlBase}/api/v1/products`);
      setAllProducts(Array.isArray(r.data) ? r.data : []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchCats(); fetchProducts(); }, []);

  // sugerencias productos para mover
  useEffect(() => {
    if (!query) { setSuggestions([]); return; }
    const q = query.toLowerCase();
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(q)).slice(0,8);
    setSuggestions(filtered);
  }, [query, allProducts]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return alert("Nombre requerido");
    try {
      await axios.post(`${urlBase}/api/v1/categories`, { name: newName, slug: newSlug || undefined, description: newDesc || undefined, position: Number(newPos) || 0 });
      setNewName(""); setNewSlug(""); setNewDesc(""); setNewPos(0);
      await fetchCats();
    } catch (e) {
      if (e?.response?.status === 404) alert("Backend en producción aún no tiene /api/v1/categories. Haz push de inventory (ver instrucciones). En local sí funciona.");
      else alert(e?.response?.data?.message || e.message);
    }
  };

  const startEdit = (c) => {
    setEditId(c.id_category);
    setEditName(c.name);
    setEditSlug(c.slug || "");
    setEditDesc(c.description || "");
    setEditPos(c.position ?? 0);
    setEditActive(c.active ?? true);
  };

  const handlePatch = async () => {
    if (!editId) return;
    try {
      await axios.patch(`${urlBase}/api/v1/categories/${editId}`, { name: editName, slug: editSlug || undefined, description: editDesc, position: Number(editPos), active: editActive });
      setEditId(null);
      await fetchCats(); await fetchProducts();
    } catch (e) { alert(e?.response?.data?.message || e.message); }
  };

  const handleDelete = async (c) => {
    const count = c.product_count ?? 0;
    const msg = count > 0
      ? `¿Borrar categoría "${c.name}"? Tiene ${count} productos que quedarán SIN CATEGORÍA (fk_category=NULL). ¿Continuar?`
      : `¿Borrar categoría "${c.name}"?`;
    if (!confirm(msg)) return;
    try {
      await axios.delete(`${urlBase}/api/v1/categories/${c.id_category}`, { params: { force: true } });
      await fetchCats(); await fetchProducts();
    } catch (e) { alert(e?.response?.data?.message || e.message); }
  };

  const handleSelectProduct = (p) => {
    setSelectedProduct(p);
    setQuery("");
    setSuggestions([]);
    // precarga target con su categoria actual
    const cat = categories.find(x => x.id_category === p.fk_category);
    if (cat) setTargetCat(cat);
  };

  const handleMove = async () => {
    if (!selectedProduct) return alert("Selecciona producto");
    const fk = targetCat?.id_category || "";
    // "" => sin categoria
    try {
      const fd = new FormData();
      fd.append('name', selectedProduct.name);
      fd.append('cost', selectedProduct.cost ?? 0);
      fd.append('sugested_price', selectedProduct.list_price ?? 0);
      fd.append('wholesale_price', selectedProduct.lowest_price ?? 0);
      fd.append('fk_category', fk);
      await axios.patch(`${urlBase}/api/v1/products/${selectedProduct.id_product}`, fd);
      alert(`Producto "${selectedProduct.name}" movido a ${targetCat?.name || 'Sin categoría'}`);
      await fetchProducts(); await fetchCats();
      setSelectedProduct(null); setTargetCat({ name:'', id_category:''});
    } catch (e) { alert(e?.response?.data?.message || e.message); }
  };

  const handleBulkMove = async (fromId, toId) => {
    if (!fromId) return alert("Selecciona categoría origen");
    const prods = allProducts.filter(p => String(p.fk_category) === String(fromId));
    if (prods.length === 0) return alert("No hay productos en esa categoría");
    if (!confirm(`¿Mover ${prods.length} productos de "${categories.find(c=>String(c.id_category)===String(fromId))?.name}" a "${toId ? categories.find(c=>String(c.id_category)===String(toId))?.name || 'Sin categoría' : 'Sin categoría'}"?`)) return;
    for (const p of prods) {
      const fd = new FormData();
      fd.append('name', p.name); fd.append('cost', p.cost ?? 0);
      fd.append('sugested_price', p.list_price ?? 0); fd.append('wholesale_price', p.lowest_price ?? 0);
      fd.append('fk_category', toId || "");
      await axios.patch(`${urlBase}/api/v1/products/${p.id_product}`, fd);
    }
    alert("Movidos");
    await fetchProducts(); await fetchCats();
  };

  const filteredProductsByCat = useMemo(() => {
    if (!filterCat) return [];
    if (filterCat === 'null') return allProducts.filter(p => !p.fk_category);
    return allProducts.filter(p => String(p.fk_category) === String(filterCat));
  }, [filterCat, allProducts]);

  if (loading) return <p className="py-8 text-center">Cargando categorías...</p>;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 16 }}>
      <TitleForm text="Gestión de Categorías" />
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Crear */}
      <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <h3>Crear categoría</h3>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'end' }}>
          <InputSimple titulo="Nombre*" tipo="text" valor={newName} func={e=>setNewName(e.target.value)} nombre="newName" callToAction="Ej: Ollas" />
          <InputSimple titulo="Slug (auto)" tipo="text" valor={newSlug} func={e=>setNewSlug(e.target.value)} nombre="newSlug" callToAction="ollas" />
          <InputSimple titulo="Posición" tipo="number" valor={newPos} func={e=>setNewPos(e.target.value)} nombre="newPos" />
          <InputSimple titulo="Descripción" tipo="text" valor={newDesc} func={e=>setNewDesc(e.target.value)} nombre="newDesc" callToAction="opcional" widthInput="250px" />
          <button type="submit" style={{ height: 36, padding: '0 16px', borderRadius: 20, background: 'black', color: 'white' }}>Crear</button>
        </form>
        <p style={{ fontSize: 12, color: '#666' }}>Slug vacío se genera de nombre. Compartida con shop: `cocinamejor.store/categoria/{"{slug}"}`</p>
      </div>

      {/* Tabla categorías */}
      <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, marginBottom: 20, overflowX: 'auto' }}>
        <h3>Categorías ({categories.length})</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr style={{ background: '#f5f5f5' }}><th style={{textAlign:'left',padding:8}}>ID</th><th style={{textAlign:'left',padding:8}}>Nombre</th><th style={{textAlign:'left',padding:8}}>Slug</th><th style={{padding:8}}>Prod.</th><th style={{padding:8}}>Pos</th><th style={{padding:8}}>Activa</th><th style={{padding:8}}>Acciones</th></tr></thead>
          <tbody>
            {categories.map(c=> (
              <tr key={c.id_category} style={{ borderTop:'1px solid #eee', opacity: c.active===false?0.5:1 }}>
                <td style={{padding:8}}>{c.id_category}</td>
                <td style={{padding:8}}>
                  {editId===c.id_category ? <input value={editName} onChange={e=>setEditName(e.target.value)} style={{width:140}}/> : c.name}
                </td>
                <td style={{padding:8}}>
                  {editId===c.id_category ? <input value={editSlug} onChange={e=>setEditSlug(e.target.value)} style={{width:120}}/> : <code>{c.slug}</code>}
                </td>
                <td style={{padding:8,textAlign:'center'}}><b>{c.product_count ?? '-'}</b></td>
                <td style={{padding:8,textAlign:'center'}}>{editId===c.id_category ? <input type="number" value={editPos} onChange={e=>setEditPos(e.target.value)} style={{width:60}}/> : c.position}</td>
                <td style={{padding:8,textAlign:'center'}}>{editId===c.id_category ? <input type="checkbox" checked={editActive} onChange={e=>setEditActive(e.target.checked)}/> : (c.active===false?'❌':'✅')}</td>
                <td style={{padding:8,display:'flex',gap:6,flexWrap:'wrap'}}>
                  {editId===c.id_category ? (
                    <>
                      <button onClick={handlePatch} style={{background:'#16a34a',color:'white',borderRadius:12,padding:'4px 10px'}}>Guardar</button>
                      <button onClick={()=>setEditId(null)} style={{background:'#ddd',borderRadius:12,padding:'4px 10px'}}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button onClick={()=>startEdit(c)} style={{background:'#f59e0b',color:'white',borderRadius:12,padding:'4px 10px'}}>Editar</button>
                      <button onClick={()=>handleDelete(c)} style={{background:'#dc2626',color:'white',borderRadius:12,padding:'4px 10px'}}>Borrar</button>
                      <button onClick={()=>setFilterCat(String(c.id_category))} style={{background:'#eee',borderRadius:12,padding:'4px 10px'}}>Ver prods</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{marginTop:10,display:'flex',gap:8,alignItems:'center'}}>
          <button onClick={()=>setFilterCat('null')} style={{padding:'6px 12px',borderRadius:20,border:'1px solid #ccc'}}>Sin categoría ({allProducts.filter(p=>!p.fk_category).length})</button>
          <button onClick={()=>setFilterCat('')} style={{padding:'6px 12px',borderRadius:20,border:'1px solid #ccc'}}>Limpiar filtro</button>
          {filterCat && <span> Viendo: <b>{filterCat==='null'?'Sin categoría': categories.find(c=>String(c.id_category)===filterCat)?.name}</b> — {filteredProductsByCat.length} productos</span>}
        </div>
        {filterCat && (
          <div style={{marginTop:10, maxHeight:240, overflow:'auto', border:'1px solid #eee', borderRadius:8}}>
            <table style={{width:'100%',fontSize:13}}><thead><tr style={{background:'#fafafa'}}><th style={{padding:6,textAlign:'left'}}>Producto</th><th style={{padding:6}}>Costo</th><th style={{padding:6}}>Precio</th></tr></thead>
              <tbody>{filteredProductsByCat.slice(0,100).map(p=> <tr key={p.id_product} style={{borderTop:'1px solid #eee'}}><td style={{padding:6}}>{p.name}</td><td style={{padding:6,textAlign:'center'}}>{p.cost}</td><td style={{padding:6,textAlign:'center'}}>{p.list_price}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mover productos individual */}
      <div style={{ border:'1px solid #ddd', borderRadius:12, padding:16, marginBottom:20 }}>
        <h3>Mover producto de categoría</h3>
        <p style={{fontSize:13,color:'#666'}}>Busca producto, selecciona nueva categoría (o deja vacío para Sin categoría) y guarda.</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:12,alignItems:'end'}}>
          <div>
            <p style={{margin:'4px 0',fontSize:13}}>Buscar producto</p>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Escribe nombre..." style={{width:260,padding:'8px 12px',borderRadius:20,border:'1px solid #ccc'}}/>
            {suggestions.length>0 && (
              <ul style={{position:'absolute',background:'white',border:'1px solid #ddd',borderRadius:8, marginTop:4, listStyle:'none', padding:0, maxHeight:160, overflow:'auto', width:260, zIndex:10}}>
                {suggestions.map(p=> <li key={p.id_product} onClick={()=>handleSelectProduct(p)} style={{padding:'6px 10px',cursor:'pointer',borderBottom:'1px solid #eee'}}>{p.name} <span style={{color:'#888',fontSize:11}}>({p.category_name||'Sin cat.'})</span></li>)}
              </ul>
            )}
          </div>
          <div>
            <ParrafoInput titulo="Seleccionado" parrafo={selectedProduct ? `${selectedProduct.name} (${selectedProduct.category_name||'Sin categoría'})` : '—'} />
          </div>
          <div style={{minWidth:260}}>
            <p style={{margin:'4px 0',fontSize:13}}>Nueva categoría</p>
            <SearchInput urlApi={`${urlBase}/api/v1/categories`} funcSet={setTargetCat} place="Buscar Categoría (vacío=sin cat)"/>
            <select value={targetCat.id_category || ""} onChange={e=>{ const id=e.target.value; const c=categories.find(x=>String(x.id_category)===id); setTargetCat(c||{name:'',id_category:''}); }} style={{width:'100%',padding:8,borderRadius:8,border:'1px solid #ccc',marginTop:6}}>
              <option value="">-- Sin categoría --</option>
              {categories.map(c=> <option key={c.id_category} value={c.id_category}>{c.name} ({c.slug})</option>)}
            </select>
            <ParrafoInput titulo="Destino" parrafo={targetCat?.name || 'Sin categoría'} />
          </div>
          <button onClick={handleMove} style={{height:36,padding:'0 16px',borderRadius:20,background:'black',color:'white'}}>Mover</button>
          <button onClick={()=>{setSelectedProduct(null); setTargetCat({name:'',id_category:''})}} style={{height:36,padding:'0 16px',borderRadius:20,border:'1px solid #ccc'}}>Limpiar</button>
        </div>
        <div style={{marginTop:8,fontSize:12,color:'#888'}}>Al mover, se hace PATCH /products/:id con fk_category. Sin categoría = campo vacío.</div>
      </div>

      {/* Bulk mover */}
      <div style={{ border:'1px solid #ddd', borderRadius:12, padding:16 }}>
        <h3>Mover en lote</h3>
        <BulkMove categories={categories} urlBase={urlBase} onDone={()=>{fetchCats(); fetchProducts();}} allProducts={allProducts} handleBulkMove={handleBulkMove} />
      </div>
    </div>
  );
};

function BulkMove({ categories, handleBulkMove }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:12,alignItems:'end'}}>
      <label>De: <select value={from} onChange={e=>setFrom(e.target.value)} style={{padding:8,borderRadius:8,border:'1px solid #ccc'}}><option value="">—</option>{categories.map(c=> <option key={c.id_category} value={c.id_category}>{c.name} ({c.product_count})</option>)}<option value="null">Sin categoría</option></select></label>
      <label>A: <select value={to} onChange={e=>setTo(e.target.value)} style={{padding:8,borderRadius:8,border:'1px solid #ccc'}}><option value="">Sin categoría</option>{categories.map(c=> <option key={c.id_category} value={c.id_category}>{c.name}</option>)}</select></label>
      <button onClick={()=>handleBulkMove(from, to)} style={{padding:'8px 16px',borderRadius:20,background:'#ea580c',color:'white'}}>Mover lote</button>
    </div>
  );
}
