// ==========================
// GLOBAL DATA
// ==========================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let recommendedDishes = []; // will hold JSON data

// Save cart to localStorage and update navbar count
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Update cart count badge in navbar
function updateCartCount() {
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountEl.textContent = totalItems;
  }
}

// Custom cart alert popup
function showCartAlert(message) {
  const alertEl = document.getElementById("cart-alert");
  const textEl = document.getElementById("cart-alert-text");

  textEl.textContent = message;
  alertEl.classList.add("show");

  setTimeout(() => {
    alertEl.classList.remove("show");
  }, 2500);
}

// Add a dish to cart
function addToCart(dish, qty = 1) {
  const existing = cart.find((item) => item.id === dish.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...dish, qty });
  }
  saveCart();
  showCartAlert(`${qty} x ${dish.name} added to cart 🛒`);
}

// ==========================
// LOAD RECOMMENDED JSON
// ==========================
fetch("./assets/data/recommended.json")
  .then((res) => res.json())
  .then((data) => {
    recommendedDishes = data.recommended;
    window.allDishes = recommendedDishes; // make it global for addToCart
    const container = document.querySelector("#recommended .row");
    container.innerHTML = "";

    recommendedDishes.forEach((dish) => {
      const card = document.createElement("div");
      card.classList.add("col-md-4", "mb-4");
      card.innerHTML = `
        <div class="explore-card ${dish.category}-card">
          <div class="dish-image">
            <img src="${dish.image}" alt="${dish.name}" class="img-fluid rounded">
          </div>
          <div class="dish-info">
            <h5 class="dish-title">${dish.name}</h5>
            <p class="desc">${dish.description}</p>
            <div class="meta my-3">
              <span class="price">Rs.${dish.price}</span>
              <span class="rating">⭐ ${dish.rating}</span>
            </div>
            <div class="tags mb-2">
              ${dish.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
            </div>
            ${
              dish.not_good_for && dish.not_good_for.length > 0
                ? `<div class="health-alert alert-warning py-1 px-2 mt-2">
                    ⚠️ Not good for: ${dish.not_good_for.join(", ")}</div>`
                : ""
            }
            <div class="d-flex justify-content-center align-items-center mt-3">
              <div class="qty-btn-main">
                <button class="qty-btn decrease" data-id="${dish.id}">-</button>
                <span class="qty-value mx-2" id="qty-${dish.id}">1</span>
                <button class="qty-btn increase" data-id="${dish.id}">+</button>
              </div>
              <button class="ms-3 add-to-cart" data-id="${dish.id}">
                <img src="./assets/images/icons/basket2.png" alt="Cart" />
              </button>
            </div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    // Update cart count on page load
    updateCartCount();
  })
  .catch((err) => console.error("Error loading recommended.json:", err));

// ==========================
// EVENT HANDLERS
// ==========================

// Quantity buttons (+ / -)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("increase")) {
    const id = parseInt(e.target.dataset.id);
    const qtyEl = document.getElementById(`qty-${id}`);
    qtyEl.textContent = parseInt(qtyEl.textContent) + 1;
  }
  if (e.target.classList.contains("decrease")) {
    const id = parseInt(e.target.dataset.id);
    const qtyEl = document.getElementById(`qty-${id}`);
    let current = parseInt(qtyEl.textContent);
    if (current > 1) qtyEl.textContent = current - 1;
  }
});

// Add to cart buttons
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-to-cart");
  if (btn) {
    const id = parseInt(btn.dataset.id);
    const qty = parseInt(document.getElementById(`qty-${id}`).textContent);
    const dish = recommendedDishes.find((d) => d.id === id);
    if (dish) addToCart(dish, qty);
  }
});

// ==========================
// OPTIONAL: Checkout / Invoice
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.querySelector("#checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      let subtotal = 0;
      cart.forEach(item => {
        const price = item.discount_price || item.price;
        subtotal += price * item.qty;
      });
      const discount = subtotal > 1000 ? 0.1 * subtotal : 0;
      const tax = 0.15 * (subtotal - discount);
      const delivery = 200;
      const grandTotal = subtotal - discount + tax + delivery;

      doc.setFontSize(18);
      doc.text("Invoice", 90, 20);

      doc.setFontSize(12);
      let y = 40;
      cart.forEach(item => {
        const price = item.discount_price || item.price;
        doc.text(`${item.name} (${item.qty} × Rs.${price}) = Rs.${item.qty * price}`, 20, y);
        y += 10;
      });

      y += 5;
      doc.text("-----", 20, y); y+=10;
      doc.text(`Subtotal: Rs.${subtotal.toFixed(2)}`, 20, y); y+=10;
      doc.text(`Discount: Rs.${discount.toFixed(2)}`, 20, y); y+=10;
      doc.text(`Tax: Rs.${tax.toFixed(2)}`, 20, y); y+=10;
      doc.text(`Delivery: Rs.${delivery.toFixed(2)}`, 20, y); y+=10;
      doc.text(`Grand Total: Rs.${grandTotal.toFixed(2)}`, 20, y);

      doc.save("invoice.pdf");
    });
  }
});
