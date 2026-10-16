let el = null;
let timer = null;

// toast simple sin dependencias, reutiliza el mismo nodo
export function showToast(msg, ms = 4000) {
  if (!el) {
    el = document.createElement("div");
    el.id = "app-toast";
    el.style.cssText =
      "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);" +
      "background:#b91c1c;color:#fff;padding:10px 16px;border-radius:10px;" +
      "font-size:13px;z-index:9999;max-width:90vw;text-align:center;" +
      "box-shadow:0 4px 12px rgba(0,0,0,.25);display:none;";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.display = "block";
  clearTimeout(timer);
  timer = setTimeout(() => {
    el.style.display = "none";
  }, ms);
}
