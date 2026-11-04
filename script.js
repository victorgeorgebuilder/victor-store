const products = [
  { id: 'aura-vessel', name: 'Aura Vessel', category: 'home', description: 'Hand-finished ceramic', price: 68, visual: 'art-vase' },
  { id: 'linen-throw', name: 'Linen Throw', category: 'textiles', description: 'Washed European linen', price: 124, visual: 'art-throw' },
  { id: 'form-candle', name: 'Form Candle', category: 'wellness', description: 'Cedarwood & vetiver', price: 42, visual: 'art-candle' },
  { id: 'daily-bottle', name: 'Daily Bottle', category: 'objects', description: 'Insulated steel / 500ml', price: 54, visual: 'art-bottle' },
  { id: 'stone-tray', name: 'Stone Tray', category: 'home', description: 'Carved travertine', price: 86, visual: 'art-vase' },
  { id: 'ritual-oil', name: 'Ritual Oil', category: 'wellness', description: 'Neroli & soft cedar', price: 38, visual: 'art-bottle' },
  { id: 'wool-cushion', name: 'Wool Cushion', category: 'textiles', description: 'Natural undyed wool', price: 76, visual: 'art-throw' },
  { id: 'object-hook', name: 'Object Hook', category: 'objects', description: 'Solid brushed brass', price: 29, visual: 'art-candle' }
];

const money = (value) => `$${value.toFixed(2)}`;
let cart = JSON.parse(localStorage.getItem('victor-cart') || '[]');
const grid = document.querySelector('#product-grid');
const emptyState = document.querySelector('#empty-state');
const searchInput = document.querySelector('#search-input');
const categoryFilter = document.querySelector('#category-filter');

function filteredProducts() {
  const term = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  return products.filter((product) => (category === 'all' || product.category === category) && `${product.name} ${product.description}`.toLowerCase().includes(term));
}

function renderProducts() {
  const visible = filteredProducts();
  grid.innerHTML = visible.map((product) => `<article class="product-card product-${product.id}"><div class="product-visual"><span class="product-label">${product.category}</span><div class="product-art ${product.visual}"></div></div><div class="product-info"><div><h3>${product.name}</h3><p>${product.description}</p></div><span class="price">${money(product.price)}</span></div><button class="add-button" data-add="${product.id}">Add to bag +</button></article>`).join('');
  emptyState.hidden = visible.length > 0;
  grid.querySelectorAll('[data-add]').forEach((button) => button.addEventListener('click', () => addToCart(button.dataset.add)));
}

function saveCart() { localStorage.setItem('victor-cart', JSON.stringify(cart)); }
function cartCount() { return cart.reduce((total, item) => total + item.quantity, 0); }
function updateCounts() { document.querySelectorAll('.bag-count').forEach((count) => { count.textContent = cartCount(); }); }

function addToCart(id) {
  const item = cart.find((entry) => entry.id === id);
  if (item) item.quantity += 1;
  else cart.push({ id, quantity: 1 });
  saveCart(); renderCart(); openCart();
}

function renderCart() {
  const container = document.querySelector('#cart-items');
  const total = cart.reduce((sum, item) => { const product = products.find((entry) => entry.id === item.id); return sum + product.price * item.quantity; }, 0);
  document.querySelector('#cart-total').textContent = money(total);
  document.querySelector('.checkout-button').disabled = cart.length === 0;
  updateCounts();
  container.innerHTML = cart.length ? cart.map((item) => { const product = products.find((entry) => entry.id === item.id); return `<div class="cart-item"><div class="cart-thumb"></div><div><h3>${product.name}</h3><p>${money(product.price)}</p><div class="qty-control"><button data-qty="minus" data-id="${item.id}" aria-label="Decrease ${product.name} quantity">−</button><span>${item.quantity}</span><button data-qty="plus" data-id="${item.id}" aria-label="Increase ${product.name} quantity">+</button></div><button class="remove-item" data-remove="${item.id}">Remove</button></div><strong>${money(product.price * item.quantity)}</strong></div>`; }).join('') : '<p class="cart-empty">Your bag is waiting to be filled.</p>';
  container.querySelectorAll('[data-qty]').forEach((button) => button.addEventListener('click', () => changeQuantity(button.dataset.id, button.dataset.qty)));
  container.querySelectorAll('[data-remove]').forEach((button) => button.addEventListener('click', () => removeFromCart(button.dataset.remove)));
}
function changeQuantity(id, direction) { const item = cart.find((entry) => entry.id === id); if (!item) return; item.quantity += direction === 'plus' ? 1 : -1; if (item.quantity < 1) cart = cart.filter((entry) => entry.id !== id); saveCart(); renderCart(); }
function removeFromCart(id) { cart = cart.filter((item) => item.id !== id); saveCart(); renderCart(); }

const drawer = document.querySelector('.cart-drawer');
const backdrop = document.querySelector('.drawer-backdrop');
function openCart() { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); backdrop.classList.add('open'); }
function closeCart() { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); backdrop.classList.remove('open'); }
document.querySelector('.cart-toggle').addEventListener('click', openCart);
document.querySelector('.cart-close').addEventListener('click', closeCart);
backdrop.addEventListener('click', closeCart);

const checkoutModal = document.querySelector('.checkout-modal');
document.querySelector('.checkout-button').addEventListener('click', () => { closeCart(); checkoutModal.classList.add('open'); checkoutModal.setAttribute('aria-hidden', 'false'); });
document.querySelector('.checkout-close').addEventListener('click', () => { checkoutModal.classList.remove('open'); checkoutModal.setAttribute('aria-hidden', 'true'); });
document.querySelector('#checkout-form').addEventListener('submit', (event) => { event.preventDefault(); event.currentTarget.hidden = true; document.querySelector('.order-success').hidden = false; cart = []; saveCart(); renderCart(); });
document.querySelector('.success-close').addEventListener('click', () => { checkoutModal.classList.remove('open'); checkoutModal.setAttribute('aria-hidden', 'true'); document.querySelector('#checkout-form').hidden = false; document.querySelector('.order-success').hidden = true; });

searchInput.addEventListener('input', renderProducts);
categoryFilter.addEventListener('change', renderProducts);
document.querySelectorAll('.category-pills button').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.category-pills button').forEach((pill) => pill.classList.remove('active')); button.classList.add('active'); categoryFilter.value = button.dataset.category; renderProducts(); }));
document.querySelector('.menu-toggle').addEventListener('click', (event) => { const open = document.querySelector('#main-nav').classList.toggle('open'); event.currentTarget.setAttribute('aria-expanded', String(open)); });
document.querySelectorAll('#main-nav a').forEach((link) => link.addEventListener('click', () => { document.querySelector('#main-nav').classList.remove('open'); document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false'); }));
document.querySelector('#newsletter-form').addEventListener('submit', (event) => { event.preventDefault(); event.currentTarget.querySelector('.form-message').textContent = 'Thank you — you are on the list.'; event.currentTarget.reset(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeCart(); checkoutModal.classList.remove('open'); checkoutModal.setAttribute('aria-hidden', 'true'); document.querySelector('#main-nav').classList.remove('open'); document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false'); } });

renderProducts();
renderCart();
