import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TitleForm } from "./form/titleForm.jsx";
import { ButtonSave } from "./form/inputSearch";
import { ContextUser } from "../context/userContext.jsx";
import "./proyecciones.css";

const num = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const money = (value) =>
  `S/ ${num(value).toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const integer = (value) =>
  num(value).toLocaleString("es-PE", { maximumFractionDigits: 0 });

const decimal = (value) =>
  num(value).toLocaleString("es-PE", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const percent = (value) =>
  `${(num(value) * 100).toLocaleString("es-PE", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;

const dayLabel = (value) => {
  const raw = String(value || "").slice(0, 10);
  const [year, month, day] = raw.split("-");
  return year && month && day ? `${day}/${month}` : raw;
};

const weekLabel = (value) => {
  const raw = String(value || "").slice(0, 10);
  const [year, month, day] = raw.split("-");
  return year && month && day ? `Sem ${day}/${month}` : raw;
};

const keyOf = (forecast) => `${forecast.sku_id}-${forecast.branch_id}`;

const normalizeText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const levenshtein = (left, right) => {
  if (left === right) return 0;
  if (!left.length) return right.length;
  if (!right.length) return left.length;
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= right.length; column += 1) {
      const cost = left[row - 1] === right[column - 1] ? 0 : 1;
      current[column] = Math.min(
        current[column - 1] + 1,
        previous[column] + 1,
        previous[column - 1] + cost
      );
    }
    previous = current;
  }
  return previous[right.length];
};

const isCloseToken = (token, text) => {
  if (token.length < 4) return false;
  const maxDistance = token.length >= 8 ? 2 : 1;
  return text
    .split(/\s+/)
    .some(
      (word) =>
        Math.abs(word.length - token.length) <= maxDistance &&
        levenshtein(token, word) <= maxDistance
    );
};

const matchesText = (text, query) => {
  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;
  if (normalizedText.includes(normalizedQuery)) return true;
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  if (tokens.every((token) => normalizedText.includes(token))) return true;
  return tokens.every(
    (token) =>
      normalizedText.includes(token) || isCloseToken(token, normalizedText)
  );
};

const sumFuture = (forecast, field) =>
  (forecast?.future || []).reduce((total, row) => total + num(row[field]), 0);

const urgencyLabel = (value) => {
  const labels = {
    out_of_stock: "Agotado",
    running_out_soon: "Por agotarse",
    healthy: "Saludable",
    no_demand: "Sin demanda",
  };
  return labels[value] || value || "-";
};

const stockUrgencyOf = (item) => {
  if (item?.stock_urgency) return item.stock_urgency;
  const stock = num(item?.current_stock);
  if (stock <= 0) return "out_of_stock";
  const days = Number(item?.days_of_supply);
  const soon = Number(item?.soon_days) || 7;
  if (Number.isFinite(days) && days <= soon) return "running_out_soon";
  return "healthy";
};

const reasonLabel = (reason) => {
  const labels = {
    fully_funded: "Financiado",
    partial_budget: "Parcial",
    budget_exhausted: "Sin presupuesto",
    no_shortfall: "Sin faltante",
    zero_cost: "Costo cero",
    pending: "Pendiente",
  };
  return labels[reason] || reason || "-";
};

const errorMessage = (error) => {
  if (error?.response?.status === 404) {
    return "La API de proyecciones todavía no está disponible. Desplegá el backend y aplicá la migración 006_forecasting.sql.";
  }
  return (
    error?.response?.data?.message ||
    error?.message ||
    "No se pudieron cargar las proyecciones."
  );
};

const EyeIcon = ({ off = false }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    {off ? (
      <line x1="3" y1="3" x2="21" y2="21" />
    ) : (
      <circle cx="12" cy="12" r="3" />
    )}
  </svg>
);

export function Proyecciones({ urlBase }) {
  const { usuario } = useContext(ContextUser);
  const canEdit = usuario?.role === "admin";
  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [skuId, setSkuId] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [productOpen, setProductOpen] = useState(false);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [horizon, setHorizon] = useState(28);
  const [granularity, setGranularity] = useState("day");
  const [budget, setBudget] = useState(2000);
  const [coverageDays, setCoverageDays] = useState(60);
  const [serviceLevel, setServiceLevel] = useState(0.8);
  const [forecast, setForecast] = useState(null);
  const [plan, setPlan] = useState(null);
  const [hiddenPlanKeys, setHiddenPlanKeys] = useState([]);
  const [showUnfunded, setShowUnfunded] = useState(false);
  const [stockView, setStockView] = useState("all");
  const [selectedKey, setSelectedKey] = useState(null);
  const [search, setSearch] = useState("");
  const [forecastStockView, setForecastStockView] = useState("all");
  const [loading, setLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);
  const [error, setError] = useState("");
  const [planError, setPlanError] = useState("");
  const [discontinuingKey, setDiscontinuingKey] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      axios.get(`${urlBase}/api/v1/branches`),
      axios.get(`${urlBase}/api/v1/products`),
    ])
      .then(([branchesResponse, productsResponse]) => {
        if (!active) return;
        setBranches(Array.isArray(branchesResponse.data) ? branchesResponse.data : []);
        setProducts(Array.isArray(productsResponse.data) ? productsResponse.data : []);
      })
      .catch((loadError) => {
        console.error("Error al cargar sucursales o productos:", loadError);
      });
    return () => {
      active = false;
    };
  }, [urlBase]);

  const branchName = (id) => {
    if (id === null || id === undefined || id === "") return "Todas";
    const branch = branches.find((item) => String(item.id_branch) === String(id));
    return branch?.name || `Sucursal ${id}`;
  };

  const productMatches = useMemo(() => {
    const query = productQuery.trim();
    const matches = query
      ? products.filter(
          (product) =>
            matchesText(product.name, query) ||
            String(product.id_product).includes(query)
        )
      : products;
    return matches.slice(0, 80);
  }, [products, productQuery]);

  const selectProduct = (product) => {
    setSkuId(product ? String(product.id_product) : "");
    setProductQuery(product ? product.name : "");
    setProductOpen(false);
    setActiveProductIndex(0);
  };

  const handleProductQuery = (event) => {
    const value = event.target.value;
    setProductQuery(value);
    setProductOpen(true);
    setActiveProductIndex(0);
    if (skuId) setSkuId("");
  };

  const handleProductKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setProductOpen(true);
      setActiveProductIndex((current) =>
        Math.min(current + 1, Math.max(0, productMatches.length - 1))
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setProductOpen(true);
      setActiveProductIndex((current) => Math.max(0, current - 1));
    } else if (event.key === "Enter") {
      if (productOpen && productMatches[activeProductIndex]) {
        event.preventDefault();
        selectProduct(productMatches[activeProductIndex]);
      }
    } else if (event.key === "Escape") {
      setProductOpen(false);
    }
  };

  const forecasts = useMemo(() => forecast?.forecasts || [], [forecast]);

  const selected = useMemo(() => {
    return (
      forecasts.find((item) => keyOf(item) === selectedKey) ||
      forecasts[0] ||
      null
    );
  }, [forecasts, selectedKey]);

  const visibleForecasts = useMemo(() => {
    const query = search.trim();
    return forecasts.filter((item) => {
      const stock = num(item.current_stock);
      if (forecastStockView === "in_stock" && stock <= 0) return false;
      if (forecastStockView === "out_of_stock" && stock > 0) return false;
      if (!query) return true;
      return (
        matchesText(item.name, query) || String(item.sku_id).includes(query)
      );
    });
  }, [forecasts, search, forecastStockView]);

  const totals = useMemo(() => {
    return {
      p50: forecasts.reduce((total, item) => total + sumFuture(item, "p50"), 0),
      p80: forecasts.reduce((total, item) => total + sumFuture(item, "p80"), 0),
      stockouts: forecasts.reduce(
        (total, item) =>
          total +
          (item.future || []).filter((row) => row.projected_stockout).length,
        0
      ),
    };
  }, [forecasts]);

  const chartData = useMemo(() => {
    const currentGranularity = forecast?.filters?.granularity || granularity;
    return (selected?.future || []).map((row) => ({
      label:
        currentGranularity === "week"
          ? weekLabel(row.date)
          : dayLabel(row.date),
      date: row.date,
      p50: num(row.p50),
      p80: num(row.p80),
      baseline: num(row.baseline_p50),
      stock:
        row.projected_stock === null || row.projected_stock === undefined
          ? null
          : num(row.projected_stock),
    }));
  }, [selected, forecast, granularity]);

  const loadForecast = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (branchId) params.set("branch_id", branchId);
      if (skuId) params.set("sku_id", skuId);
      params.set("horizon", String(horizon));
      params.set("granularity", granularity);
      const { data } = await axios.get(
        `${urlBase}/api/v1/forecasting/demand?${params.toString()}`
      );
      setForecast(data);
      setPlan(null);
      setHiddenPlanKeys([]);
      setPlanError("");
      const first = data?.forecasts?.[0];
      setSelectedKey(first ? keyOf(first) : null);
    } catch (loadError) {
      setForecast(null);
      setSelectedKey(null);
      setError(errorMessage(loadError));
    } finally {
      setLoading(false);
    }
  };

  const loadPlan = async () => {
    setPlanLoading(true);
    setPlanError("");
    try {
      const params = new URLSearchParams();
      if (branchId) params.set("branch_id", branchId);
      if (skuId) params.set("sku_id", skuId);
      params.set("budget", String(budget));
      params.set("coverage_days", String(Math.max(60, Number(coverageDays) || 60)));
      params.set("service_level", String(serviceLevel));
      const { data } = await axios.get(
        `${urlBase}/api/v1/forecasting/restock?${params.toString()}`
      );
      setPlan(data);
      setHiddenPlanKeys([]);
    } catch (loadError) {
      setPlan(null);
      setPlanError(errorMessage(loadError));
    } finally {
      setPlanLoading(false);
    }
  };

  const planView = useMemo(() => {
    const candidates = (plan?.items || [])
      .filter((item) => item.suggested_order_qty > 0)
      .sort(
        (left, right) =>
          (left.priority_rank ?? Number.MAX_SAFE_INTEGER) -
          (right.priority_rank ?? Number.MAX_SAFE_INTEGER)
      );
    const hiddenSet = new Set(hiddenPlanKeys);
    const hidden = candidates.filter((item) => hiddenSet.has(keyOf(item)));
    const visible = candidates.filter((item) => !hiddenSet.has(keyOf(item)));
    const budgetValue = Math.max(0, num(budget));
    let remaining = budgetValue;
    const allocated = visible.map((item) => {
      const suggested = Math.max(0, num(item.suggested_order_qty));
      const unitCost = Math.max(0, num(item.unit_cost));
      let allocatedQty = 0;
      let reason = "budget_exhausted";
      if (suggested <= 0) {
        reason = "no_shortfall";
      } else if (unitCost <= 0) {
        allocatedQty = suggested;
        reason = "zero_cost";
      } else {
        const affordable = Math.floor(remaining / unitCost);
        allocatedQty = Math.min(suggested, affordable);
        if (allocatedQty > 0) {
          reason =
            allocatedQty < suggested ? "partial_budget" : "fully_funded";
        }
      }
      const allocatedSpend = allocatedQty * unitCost;
      if (allocatedQty > 0) {
        remaining = Math.max(0, remaining - allocatedSpend);
      }
      const expectedProfit =
        Math.min(allocatedQty, num(item.shortfall_units)) *
        num(item.unit_margin);
      return {
        ...item,
        allocated_qty: allocatedQty,
        allocated_spend: Number(allocatedSpend.toFixed(2)),
        funded: allocatedQty > 0,
        allocation_reason: reason,
        expected_profit_gain: Number(expectedProfit.toFixed(2)),
      };
    });
    const funded = allocated.filter((item) => item.funded);
    const allocatedSpend = funded.reduce(
      (total, item) => total + item.allocated_spend,
      0
    );
    const expectedProfit = funded.reduce(
      (total, item) => total + item.expected_profit_gain,
      0
    );
    return {
      candidates,
      hidden,
      visible: allocated,
      summary: {
        budget: budgetValue,
        allocated_spend: Number(allocatedSpend.toFixed(2)),
        remaining_budget: Number(
          Math.max(0, budgetValue - allocatedSpend).toFixed(2)
        ),
        budget_utilization:
          budgetValue > 0
            ? Number((allocatedSpend / budgetValue).toFixed(4))
            : 0,
        expected_profit_protected: Number(expectedProfit.toFixed(2)),
        expected_return_on_spend:
          allocatedSpend > 0
            ? Number((expectedProfit / allocatedSpend).toFixed(4))
            : 0,
        items_funded: funded.length,
        items_recommended: candidates.length,
        items_unfunded: allocated.filter((item) => !item.funded).length,
        items_running_out_soon: allocated.filter(
          (item) => stockUrgencyOf(item) === "running_out_soon"
        ).length,
        items_out_of_stock: allocated.filter(
          (item) => stockUrgencyOf(item) === "out_of_stock"
        ).length,
      },
    };
  }, [plan, hiddenPlanKeys, budget]);

  const togglePlanItem = (item) => {
    const key = keyOf(item);
    setHiddenPlanKeys((current) =>
      current.includes(key)
        ? current.filter((value) => value !== key)
        : [...current, key]
    );
  };

  const markDiscontinued = async (item) => {
    if (!canEdit || discontinuingKey) return;
    const product = products.find(
      (candidate) => String(candidate.id_product) === String(item.sku_id)
    );
    if (!product) {
      setPlanError(`No se encontró el producto ${item.name} (#${item.sku_id}).`);
      return;
    }
    const confirmed = window.confirm(
      `¿Marcar "${item.name}" como descontinuado? No volverá a aparecer en la reposición.`
    );
    if (!confirmed) return;
    const key = keyOf(item);
    setDiscontinuingKey(key);
    setPlanError("");
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("cost", product.cost ?? 0);
      formData.append("sugested_price", product.list_price ?? "");
      formData.append("wholesale_price", product.lowest_price ?? "");
      formData.append("fk_category", product.fk_category ?? "");
      formData.append("is_online", product.is_online ? "true" : "false");
      formData.append("is_discontinued", "true");
      formData.append("attributes", JSON.stringify(product.attributes || {}));
      formData.append("fk_supplier", product.fk_supplier ?? "");
      formData.append("supplier", product.supplier ?? "");
      await axios.patch(
        `${urlBase}/api/v1/products/${product.id_product}`,
        formData
      );
      setProducts((current) =>
        current.map((candidate) =>
          String(candidate.id_product) === String(product.id_product)
            ? { ...candidate, is_discontinued: true }
            : candidate
        )
      );
      await loadPlan();
    } catch (patchError) {
      setPlanError(
        patchError?.response?.data?.message ||
          "No se pudo marcar el producto como descontinuado."
      );
    } finally {
      setDiscontinuingKey(null);
    }
  };

  const scopedPlanItems = planView.visible.filter((item) => {
    if (stockView === "soon") {
      return stockUrgencyOf(item) === "running_out_soon";
    }
    if (stockView === "in_stock") return num(item.current_stock) > 0;
    if (stockView === "out_of_stock") return num(item.current_stock) <= 0;
    return true;
  });
  const displayedPlanItems = showUnfunded
    ? scopedPlanItems
    : scopedPlanItems.filter((item) => item.funded);
  const emptyPlanMessage =
    planView.hidden.length > 0 && planView.visible.length === 0
      ? "Todos los productos están ocultos. Restaurá alguno para ver recomendaciones."
      : stockView === "soon" && scopedPlanItems.length === 0
        ? "No hay productos en stock que se agoten dentro del lead time."
        : stockView === "in_stock" && scopedPlanItems.length === 0
          ? "No hay productos con stock que necesiten reposición."
          : stockView === "out_of_stock" && scopedPlanItems.length === 0
            ? "No hay productos agotados que necesiten reposición."
            : !showUnfunded && planView.summary.items_unfunded > 0
              ? "No hay productos financiados con este presupuesto. Aumentá el presupuesto o revisá los no financiados."
              : "No hay faltantes para reponer con estos parámetros.";

  return (
    <div className="proyecciones_page">
      <TitleForm text="Proyecciones" />

      <section className="proyecciones_card">
        <div className="proyecciones_toolbar">
          <div className="proyecciones_field">
            <label htmlFor="proyecciones_branch">Sucursal</label>
            <select
              id="proyecciones_branch"
              className="only_select"
              value={branchId}
              onChange={(event) => setBranchId(event.target.value)}
            >
              <option value="">Todas las sucursales</option>
              {branches.map((branch) => (
                <option key={branch.id_branch} value={branch.id_branch}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="proyecciones_field proyecciones_field_wide proyecciones_combobox">
            <label htmlFor="proyecciones_sku">Producto</label>
            <div className="proyecciones_combobox_box">
              <input
                id="proyecciones_sku"
                type="text"
                className="only_input"
                value={productQuery}
                onChange={handleProductQuery}
                onFocus={() => setProductOpen(true)}
                onBlur={() => setProductOpen(false)}
                onKeyDown={handleProductKeyDown}
                placeholder="Buscar por nombre o SKU..."
                autoComplete="off"
                role="combobox"
                aria-expanded={productOpen}
                aria-controls="proyecciones_sku_list"
                aria-autocomplete="list"
              />
              {productQuery || skuId ? (
                <button
                  type="button"
                  className="proyecciones_combobox_clear"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectProduct(null)}
                  aria-label="Limpiar producto"
                >
                  ×
                </button>
              ) : null}
            </div>
            {productOpen ? (
              <ul
                id="proyecciones_sku_list"
                className="proyecciones_combobox_list"
                role="listbox"
              >
                <li
                  className="proyecciones_combobox_all"
                  role="option"
                  aria-selected="false"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectProduct(null);
                  }}
                >
                  Todos los productos
                </li>
                {productMatches.map((product, index) => (
                  <li
                    key={product.id_product}
                    role="option"
                    aria-selected={index === activeProductIndex}
                    className={index === activeProductIndex ? "active" : ""}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      selectProduct(product);
                    }}
                  >
                    <span>{product.name}</span>
                    <small>#{product.id_product}</small>
                  </li>
                ))}
                {productMatches.length === 0 ? (
                  <li className="empty">Sin coincidencias</li>
                ) : null}
              </ul>
            ) : null}
          </div>

          <div className="proyecciones_field">
            <label htmlFor="proyecciones_horizon">Horizonte</label>
            <select
              id="proyecciones_horizon"
              className="only_select"
              value={horizon}
              onChange={(event) => setHorizon(Number(event.target.value))}
            >
              <option value={7}>7 días</option>
              <option value={14}>14 días</option>
              <option value={28}>28 días</option>
              <option value={56}>56 días</option>
              <option value={90}>90 días</option>
            </select>
          </div>

          <div className="proyecciones_field">
            <label htmlFor="proyecciones_granularity">Vista</label>
            <select
              id="proyecciones_granularity"
              className="only_select"
              value={granularity}
              onChange={(event) => setGranularity(event.target.value)}
            >
              <option value="day">Diaria</option>
              <option value="week">Semanal</option>
            </select>
          </div>

          <ButtonSave
            titulo={loading ? "Calculando..." : "Ver proyecciones"}
            func={loadForecast}
            disabled={loading}
          />
        </div>
        <p className="proyecciones_hint">
          La proyección usa el historial de ventas, feriados, quincenas y
          temporadas. El lead time es fijo (4 a 20 días) para todos los
          productos. El stock mostrado es el total de todas las sucursales; la
          sucursal filtra solo la demanda. Si elegís un producto, el cálculo es
          más rápido. La búsqueda ignora tildes y tolera errores menores de
          escritura.
        </p>
      </section>

      {error ? <div className="proyecciones_error">{error}</div> : null}

      {forecast ? (
        <>
          <section className="proyecciones_stats">
            <div className="proyecciones_stat">
              <span>SKU / sucursal</span>
              <strong>{integer(forecasts.length)}</strong>
            </div>
            <div className="proyecciones_stat">
              <span>Demanda P50</span>
              <strong>{decimal(totals.p50)}</strong>
            </div>
            <div className="proyecciones_stat">
              <span>Demanda P80</span>
              <strong>{decimal(totals.p80)}</strong>
            </div>
            <div className="proyecciones_stat">
              <span>WAPE híbrido</span>
              <strong>{percent(forecast?.metrics?.hybrid?.wape)}</strong>
            </div>
            <div className="proyecciones_stat">
              <span>Días proyectados en quiebre</span>
              <strong>{integer(totals.stockouts)}</strong>
            </div>
          </section>

          <section className="proyecciones_grid">
            <div className="proyecciones_card">
              <div className="proyecciones_card_header">
                <div>
                  <h3>{selected?.name || "Demanda proyectada"}</h3>
                  <p>
                    {selected
                      ? `${branchName(selected.branch_id)} · SKU ${selected.sku_id}`
                      : "Sin datos"}
                  </p>
                </div>
                <div className="proyecciones_legend">
                  <span className="proyecciones_dot p50" /> P50
                  <span className="proyecciones_dot p80" /> P80
                  <span className="proyecciones_dot stock" /> Stock total
                </div>
              </div>

              {chartData.length === 0 ? (
                <div className="proyecciones_empty">
                  No hay datos para graficar.
                </div>
              ) : (
                <div className="proyecciones_chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={chartData}
                      margin={{ top: 10, right: 8, left: -18, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="proyeccionesP80" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2f5ce1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#2f5ce1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="var(--chart-grid)"
                      />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fill: "var(--chart-text)" }}
                        interval="preserveStartEnd"
                        minTickGap={18}
                      />
                      <YAxis
                        yAxisId="demand"
                        tick={{ fontSize: 11, fill: "var(--chart-text)" }}
                        tickFormatter={integer}
                        width={50}
                      />
                      <YAxis
                        yAxisId="stock"
                        orientation="right"
                        tick={{ fontSize: 11, fill: "var(--chart-text)" }}
                        tickFormatter={integer}
                        width={50}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid var(--chart-grid)",
                          backgroundColor: "var(--card-bg)",
                          color: "var(--card-text)",
                        }}
                        labelFormatter={(label, payload) =>
                          payload?.[0]?.payload?.date || label
                        }
                        formatter={(value, name) => [
                          name === "Stock proyectado"
                            ? integer(value)
                            : decimal(value),
                          name,
                        ]}
                      />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Area
                        yAxisId="demand"
                        type="monotone"
                        dataKey="p80"
                        name="P80"
                        stroke="#2f5ce1"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#proyeccionesP80)"
                      />
                      <Line
                        yAxisId="demand"
                        type="monotone"
                        dataKey="p50"
                        name="P50"
                        stroke="#16a34a"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        yAxisId="demand"
                        type="monotone"
                        dataKey="baseline"
                        name="Base estacional"
                        stroke="#94a3b8"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                        dot={false}
                      />
                      <Line
                        yAxisId="stock"
                        type="monotone"
                        dataKey="stock"
                        name="Stock proyectado"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={false}
                        connectNulls
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="proyecciones_card">
              <h3>Detalle del SKU</h3>
              {selected ? (
                <dl className="proyecciones_detail">
                  <div>
                    <dt>Producto</dt>
                    <dd>{selected.name}</dd>
                  </div>
                  <div>
                    <dt>Demanda</dt>
                    <dd>{branchName(selected.branch_id)}</dd>
                  </div>
                  <div>
                    <dt>Stock total</dt>
                    <dd>{integer(selected.current_stock)}</dd>
                  </div>
                  <div>
                    <dt>Lead time</dt>
                    <dd>
                      {selected.lead_time_min_days}–{selected.lead_time_max_days} días
                    </dd>
                  </div>
                  <div>
                    <dt>Modelo</dt>
                    <dd>
                      {selected.model}
                      {selected.is_intermittent ? " · intermitente" : ""}
                    </dd>
                  </div>
                  <div>
                    <dt>P50 en el horizonte</dt>
                    <dd>{decimal(sumFuture(selected, "p50"))}</dd>
                  </div>
                  <div>
                    <dt>P80 en el horizonte</dt>
                    <dd>{decimal(sumFuture(selected, "p80"))}</dd>
                  </div>
                  <div>
                    <dt>Días en riesgo</dt>
                    <dd>
                      {integer(
                        (selected.future || []).filter(
                          (row) => row.projected_stockout
                        ).length
                      )}
                    </dd>
                  </div>
                </dl>
              ) : (
                <div className="proyecciones_empty">Elegí un producto.</div>
              )}
            </div>
          </section>

          <section className="proyecciones_card">
            <div className="proyecciones_card_header">
              <div>
                <h3>Demanda por SKU</h3>
                <p>
                  {visibleForecasts.length} de {forecasts.length} resultados
                </p>
              </div>
              <div className="proyecciones_header_actions">
                {[
                  { key: "all", label: "Todos" },
                  { key: "in_stock", label: "Con stock" },
                  { key: "out_of_stock", label: "Agotados" },
                ].map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className={`proyecciones_restore ${
                      forecastStockView === option.key ? "is-active" : ""
                    }`}
                    aria-pressed={forecastStockView === option.key}
                    onClick={() => setForecastStockView(option.key)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="proyecciones_field proyecciones_search">
                <label htmlFor="proyecciones_search">Buscar</label>
                <input
                  id="proyecciones_search"
                  type="text"
                  className="only_input"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Nombre o SKU"
                />
              </div>
            </div>

            <div className="proyecciones_table_wrap">
              <table className="proyecciones_table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Producto</th>
                    <th>Demanda</th>
                    <th>Stock total</th>
                    <th>P50 total</th>
                    <th>P80 total</th>
                    <th>Lead time</th>
                    <th>Tipo</th>
                    <th>Modelo</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleForecasts.map((item) => (
                    <tr
                      key={keyOf(item)}
                      className={
                        selected && keyOf(selected) === keyOf(item)
                          ? "selected"
                          : ""
                      }
                      onClick={() => setSelectedKey(keyOf(item))}
                    >
                      <td>{item.sku_id}</td>
                      <td>{item.name}</td>
                      <td>{branchName(item.branch_id)}</td>
                      <td>{integer(item.current_stock)}</td>
                      <td>{decimal(sumFuture(item, "p50"))}</td>
                      <td>{decimal(sumFuture(item, "p80"))}</td>
                      <td>
                        {item.lead_time_min_days}–{item.lead_time_max_days}
                      </td>
                      <td>
                        <span
                          className={`proyecciones_badge ${
                            item.is_intermittent ? "warn" : ""
                          }`}
                        >
                          {item.is_intermittent ? "Intermitente" : "Denso"}
                        </span>
                      </td>
                      <td>{item.model}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visibleForecasts.length === 0 ? (
                <div className="proyecciones_empty">
                  {forecastStockView !== "all"
                    ? "No hay resultados con este filtro."
                    : "No hay resultados para la búsqueda."}
                </div>
              ) : null}
            </div>
          </section>
        </>
      ) : !error ? (
        <section className="proyecciones_card proyecciones_empty">
          Elegí una sucursal y/o producto, después presioná “Ver proyecciones”.
        </section>
      ) : null}

      <section className="proyecciones_card">
        <div className="proyecciones_card_header">
          <div>
            <h3>Reposición con presupuesto</h3>
            <p>
              Prioriza la proyección de demanda y el riesgo de quiebre; usa
              rotación, rentabilidad absoluta y urgencia de stock como factores
              de apoyo. Los productos con stock que se agota dentro del lead
              time se marcan como “Por agotarse”.
            </p>
          </div>
          {plan ? (
            <div className="proyecciones_header_actions">
              {[
                { key: "all", label: "Todos" },
                {
                  key: "soon",
                  label:
                    planView.summary.items_running_out_soon > 0
                      ? `Por agotarse (${integer(
                          planView.summary.items_running_out_soon
                        )})`
                      : "Por agotarse",
                },
                { key: "in_stock", label: "Con stock" },
                {
                  key: "out_of_stock",
                  label:
                    planView.summary.items_out_of_stock > 0
                      ? `Agotados (${integer(
                          planView.summary.items_out_of_stock
                        )})`
                      : "Agotados",
                },
              ].map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className={`proyecciones_restore ${
                    stockView === option.key ? "is-active" : ""
                  }`}
                  aria-pressed={stockView === option.key}
                  onClick={() => setStockView(option.key)}
                >
                  {option.label}
                </button>
              ))}
              {planView.summary.items_unfunded > 0 ? (
                <button
                  type="button"
                  className="proyecciones_restore"
                  onClick={() => setShowUnfunded((current) => !current)}
                >
                  {showUnfunded
                    ? "Ocultar no financiados"
                    : `Ver no financiados (${integer(
                        planView.summary.items_unfunded
                      )})`}
                </button>
              ) : null}
              {planView.hidden.length > 0 ? (
                <button
                  type="button"
                  className="proyecciones_restore"
                  onClick={() => setHiddenPlanKeys([])}
                >
                  Restaurar ocultos ({planView.hidden.length})
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="proyecciones_toolbar">
          <div className="proyecciones_field">
            <label htmlFor="proyecciones_budget">Presupuesto (S/)</label>
            <input
              id="proyecciones_budget"
              type="number"
              min="0"
              step="50"
              className="only_input"
              value={budget}
              onChange={(event) => setBudget(Number(event.target.value))}
            />
          </div>
          <div className="proyecciones_field">
            <label htmlFor="proyecciones_coverage">
              Cobertura mínima (días)
            </label>
            <input
              id="proyecciones_coverage"
              type="number"
              min="60"
              step="1"
              className="only_input"
              value={coverageDays}
              onChange={(event) =>
                setCoverageDays(Number(event.target.value))
              }
              onBlur={() =>
                setCoverageDays((current) =>
                  Math.max(60, Number(current) || 60)
                )
              }
            />
          </div>
          <div className="proyecciones_field">
            <label htmlFor="proyecciones_service">Nivel de servicio</label>
            <select
              id="proyecciones_service"
              className="only_select"
              value={serviceLevel}
              onChange={(event) => setServiceLevel(Number(event.target.value))}
            >
              <option value={0.7}>70%</option>
              <option value={0.8}>80%</option>
              <option value={0.9}>90%</option>
              <option value={0.95}>95%</option>
            </select>
          </div>
          <ButtonSave
            titulo={planLoading ? "Calculando..." : "Calcular reposición"}
            func={loadPlan}
            disabled={planLoading}
          />
        </div>
        <p className="proyecciones_hint">
          La reposición usa el stock total de todas las sucursales y la
          demanda de la sucursal seleccionada (o de todas). La cantidad
          sugerida cubre el lead time fijo (4 a 20 días) más al menos 60 días
          de ventas proyectadas. El cálculo se precalcula una vez al día, así
          que esta vista responde al instante. Ocultá un producto para liberar
          presupuesto y financiar el siguiente. Si un producto no se volverá a
          comprar, marcalo como “Descontinuar” para excluirlo de la reposición.
        </p>

        {planError ? (
          <div className="proyecciones_error">{planError}</div>
        ) : null}

        {plan ? (
          <>
            <div className="proyecciones_stats">
              <div className="proyecciones_stat">
                <span>Presupuesto</span>
                <strong>{money(planView.summary.budget)}</strong>
              </div>
              <div className="proyecciones_stat">
                <span>Asignado</span>
                <strong>{money(planView.summary.allocated_spend)}</strong>
              </div>
              <div className="proyecciones_stat">
                <span>Restante</span>
                <strong>{money(planView.summary.remaining_budget)}</strong>
              </div>
              <div className="proyecciones_stat">
                <span>Ganancia protegida</span>
                <strong>
                  {money(planView.summary.expected_profit_protected)}
                </strong>
              </div>
              <div className="proyecciones_stat">
                <span>Retorno sobre gasto</span>
                <strong>
                  {percent(planView.summary.expected_return_on_spend)}
                </strong>
              </div>
              <div className="proyecciones_stat">
                <span>SKU financiados</span>
                <strong>
                  {integer(planView.summary.items_funded)} /{" "}
                  {integer(planView.summary.items_recommended)}
                </strong>
              </div>
            </div>

            {planView.hidden.length > 0 ? (
              <div className="proyecciones_hidden">
                <div className="proyecciones_hidden_header">
                  <span>
                    Productos ocultos ({planView.hidden.length}) — presupuesto
                    liberado
                  </span>
                  <button
                    type="button"
                    className="proyecciones_restore"
                    onClick={() => setHiddenPlanKeys([])}
                  >
                    Restaurar todos
                  </button>
                </div>
                <div className="proyecciones_hidden_list">
                  {planView.hidden.map((item) => (
                    <button
                      type="button"
                      key={keyOf(item)}
                      className="proyecciones_hidden_item"
                      onClick={() => togglePlanItem(item)}
                    >
                      <EyeIcon off />
                      <span>{item.name}</span>
                      <small>Stock total: {integer(item.current_stock)}</small>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="proyecciones_table_wrap">
              <table className="proyecciones_table proyecciones_plan_table">
                <thead>
                  <tr>
                    <th title="Orden de compra según el score ponderado">
                      Prioridad
                    </th>
                    <th>Producto</th>
                    <th>Stock total</th>
                    <th>Días stock</th>
                    <th title="Agotado: sin stock. Por agotarse: el stock no cubre el lead time. Saludable: cobertura suficiente.">
                      Urgencia
                    </th>
                    <th>Ventas 90d</th>
                    <th>Pedido 2m+</th>
                    <th>Asignado</th>
                    <th>Gasto</th>
                    <th>Margen</th>
                    <th>Riesgo quiebre</th>
                    <th title="50% proyección, 25% rotación reciente, 15% rentabilidad absoluta, 10% urgencia de stock">
                      Score proy.
                    </th>
                    <th>Ganancia</th>
                    <th>Estado</th>
                    <th>Ocultar</th>
                    {canEdit ? (
                      <th title="Excluir el producto de la reposición">No reponer</th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {displayedPlanItems.map((item) => (
                    <tr
                      key={keyOf(item)}
                      className={item.funded ? "" : "muted"}
                    >
                      <td>
                        <span className="proyecciones_rank">
                          #{item.priority_rank}
                        </span>
                      </td>
                      <td>{item.name}</td>
                      <td>{integer(item.current_stock)}</td>
                      <td>{integer(item.days_of_supply)}</td>
                      <td>
                        <span
                          className={`proyecciones_badge ${
                            item.stock_urgency === "out_of_stock" ||
                            item.stock_urgency === "running_out_soon"
                              ? "warn"
                              : ""
                          }`}
                        >
                          {urgencyLabel(item.stock_urgency)}
                        </span>
                      </td>
                      <td>{integer(item.recent_units)}</td>
                      <td>{integer(item.suggested_order_qty)}</td>
                      <td>{integer(item.allocated_qty)}</td>
                      <td>{money(item.allocated_spend)}</td>
                      <td>{percent(item.recent_margin_ratio)}</td>
                      <td>{percent(item.stockout_risk)}</td>
                      <td>{decimal(item.forecast_score)}</td>
                      <td>{money(item.expected_profit_gain)}</td>
                      <td>
                        <span
                          className={`proyecciones_badge ${
                            item.funded ? "" : "warn"
                          }`}
                        >
                          {reasonLabel(item.allocation_reason)}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="proyecciones_eye"
                          onClick={() => togglePlanItem(item)}
                          title="Ocultar y liberar presupuesto"
                          aria-label={`Ocultar ${item.name}`}
                        >
                          <EyeIcon />
                        </button>
                      </td>
                      {canEdit ? (
                        <td>
                          <button
                            type="button"
                            className="proyecciones_discontinue"
                            onClick={() => markDiscontinued(item)}
                            disabled={discontinuingKey === keyOf(item)}
                            title="Marcar como descontinuado y excluir de la reposición"
                            aria-label={`Descontinuar ${item.name}`}
                          >
                            {discontinuingKey === keyOf(item)
                              ? "Guardando..."
                              : "Descontinuar"}
                          </button>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
              {displayedPlanItems.length === 0 ? (
                <div className="proyecciones_empty">{emptyPlanMessage}</div>
              ) : null}
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
