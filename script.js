const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.querySelector('#navbar');
if (bar) {
    bar.addEventListener('click', () => { nav.classList.add('active'); });
}
if (close) {
    close.addEventListener('click', () => { nav.classList.remove('active'); });
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];          // --- CART LOGIC ---

function addToCart(element) {
  const product = element.closest(".pro");
  const name = product.dataset.name;
  const price = parseFloat(product.dataset.price);                  // Add to cart from product.html

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showToast(`${name} added to cart`);                               // Check if product is already in the cart
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countSpan = document.getElementById("cart-count");
  if (countSpan) countSpan.innerText = count;                        // Update cart icon
}

// Toast message
function showToast(message){
  const toast = document.createElement("div");
  toast.innerText = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "#4CAF50";
  toast.style.color = "#fff";
  toast.style.padding = "10px 15px";
  toast.style.borderRadius = "8px";
  toast.style.zIndex = "1000";
  toast.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  document.body.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 2000);
}

document.addEventListener("DOMContentLoaded", updateCartCount);

function checkoutCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    alert("You must be logged in to checkout.");
    window.location.href = "auth.html";
    return;
  }
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = {
    userId: user.id,
    date: new Date().toLocaleString(),
    items: [...cart],
    total
  };
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.removeItem("cart");
  alert("✅ Order placed successfully!");
  window.location.href = "order.html";                                    // --- CHECKOUT LOGIC (per-user) ---
}
