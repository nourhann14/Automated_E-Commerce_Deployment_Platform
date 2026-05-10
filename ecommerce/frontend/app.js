const healthPill = document.getElementById("healthPill");
const productsGrid = document.getElementById("productsGrid");
const refreshBtn = document.getElementById("refreshBtn");
const addForm = document.getElementById("addForm");
const formMsg = document.getElementById("formMsg");

function dollarsToCents(input) {
  const n = Number(String(input).replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

function centsToDollars(cents) {
  const n = Number(cents || 0);
  return (n / 100).toFixed(2);
}

async function apiGet(path) {
  const res = await fetch(path, { headers: { Accept: "application/json" } });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json && json.error ? json.error : `Request failed: ${res.status}`);
  return json;
}

async function apiPost(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body)
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json && json.error ? json.error : `Request failed: ${res.status}`);
  return json;
}

function renderProducts(items) {
  productsGrid.innerHTML = "";
  if (!items.length) {
    productsGrid.innerHTML = `<div class="muted">No products yet.</div>`;
    return;
  }

  for (const p of items) {
    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `
      <div class="product__img">
        ${p.image_url ? `<img src="${p.image_url}" alt="${escapeHtml(p.name)}" />` : `<span class="muted">No image</span>`}
      </div>
      <div class="product__body">
        <div class="product__name">${escapeHtml(p.name)}</div>
        <div class="product__desc">${escapeHtml(p.description || "")}</div>
        <div class="product__price">$${centsToDollars(p.price_cents)}</div>
      </div>
    `;
    productsGrid.appendChild(card);
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function refreshProducts() {
  productsGrid.innerHTML = `<div class="muted">Loading…</div>`;
  const data = await apiGet("/api/products");
  renderProducts(data.items || []);
}

async function checkHealth() {
  try {
    const data = await apiGet("/api/health");
    healthPill.textContent = data.ok ? "API OK + DB OK" : "API error";
    healthPill.classList.remove("pill--bad");
    healthPill.classList.add("pill--ok");
  } catch (e) {
    healthPill.textContent = `API/DB down: ${e.message}`;
    healthPill.classList.remove("pill--ok");
    healthPill.classList.add("pill--bad");
  }
}

refreshBtn.addEventListener("click", () => {
  refreshProducts().catch((e) => {
    productsGrid.innerHTML = `<div class="muted">Error: ${escapeHtml(e.message)}</div>`;
  });
});

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formMsg.textContent = "";

  const fd = new FormData(addForm);
  const name = String(fd.get("name") || "").trim();
  const description = String(fd.get("description") || "").trim();
  const price_cents = dollarsToCents(fd.get("price"));
  const image_url = String(fd.get("image_url") || "").trim();

  if (!name) {
    formMsg.textContent = "Name is required.";
    return;
  }
  if (price_cents === null) {
    formMsg.textContent = "Price must be a number.";
    return;
  }

  try {
    await apiPost("/api/products", {
      name,
      description: description || null,
      price_cents,
      image_url: image_url || null
    });
    addForm.reset();
    formMsg.textContent = "Created.";
    await refreshProducts();
  } catch (err) {
    formMsg.textContent = err.message;
  }
});

checkHealth();
refreshProducts().catch(() => {});

