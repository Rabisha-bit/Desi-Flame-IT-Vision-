// ==========================
// CART SYSTEM
// ==========================

// Load existing cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart back to localStorage
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

  if (!alertEl || !textEl) return;

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
    cart.push({ ...dish, qty: qty });
  }

  saveCart();
  showCartAlert(`${qty} × ${dish.name} added to cart 🛒`);
}

// ==========================
// INVOICE SYSTEM
// ==========================

// Generate unique order ID
function generateOrderId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const randomPart = Math.floor(10000 + Math.random() * 90000); // 5-digit random
  return `ORD-${year}${month}${day}-${randomPart}`;
}


// Open invoice modal
function openInvoiceModal() {
  if (cart.length === 0) {
    showCartAlert("Your cart is empty!");
    return;
  }

  // ✅ Unique Order ID
  const orderId = generateOrderId();
  document.getElementById("order-id").textContent = orderId;

  // ✅ Get user data from localStorage (signup info)
  const storedUser = JSON.parse(localStorage.getItem("desiFlameUser")) || {};
  document.getElementById("user-name").textContent = `${storedUser.firstName || ""} ${storedUser.lastName || ""}`;
  document.getElementById("user-phone").textContent = storedUser.contact || "";
  document.getElementById("user-address").textContent = `${storedUser.address || ""}, ${storedUser.city || ""}, ${storedUser.area || ""}`;
  document.getElementById("user-email").textContent = storedUser.email || "";

  // ✅ Fill invoice items
  const itemsContainer = document.getElementById("invoice-items");
  itemsContainer.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item) => {
    const price = item.discount_price || item.price;
    subtotal += price * item.qty;
    itemsContainer.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>Rs.${price}</td>
        <td>Rs.${(item.qty * price).toFixed(2)}</td>
      </tr>
    `;
  });

  // ✅ Totals
  const discount = subtotal > 1000 ? 0.1 * subtotal : 0;
  const tax = 0.15 * (subtotal - discount);
  const delivery = 200;
  const grandTotal = subtotal - discount + tax + delivery;

  document.getElementById("invoice-subtotal").textContent = "Rs." + subtotal.toFixed(2);
  document.getElementById("invoice-discount").textContent = "Rs." + discount.toFixed(2);
  document.getElementById("invoice-tax").textContent = "Rs." + tax.toFixed(2);
  document.getElementById("invoice-delivery").textContent = "Rs." + delivery.toFixed(2);
  document.getElementById("invoice-grandtotal").textContent = "Rs." + grandTotal.toFixed(2);

  // ✅ Show modal
  const modalEl = document.getElementById("invoiceModal");
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}
// Confirm Order button
// ==========================
// ORDER CONFIRM BUTTON
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  const confirmBtn = document.getElementById("confirm-order");

  if (confirmBtn) {
  confirmBtn.addEventListener("click", () => {
    Swal.fire({
      title: "✅ Order Confirmed",
      text: "Your order has been placed successfully!",
      icon: "success",
      background: "#101c1cb9;", // Modal background (white or your theme’s card color)
      backdropfilter: "blur(8px)", // Optional: blur effect
      border: "2px solid var(--gold)", // Gold border
      color: "#333", // Text color
      iconColor: "#28a745", // Success green
      showClass: {
        popup: "animate__animated animate__fadeInDown"
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp"
      },
      customClass: {
        title: "swal-title",
        popup: "swal-popup",
        confirmButton: "swal-confirm-btn"
      },
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        // ✅ Empty cart
        cart = [];
        saveCart();
        updateCartCount();

        // ✅ Close modal if open
        const modalEl = document.getElementById("invoiceModal");
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) modal.hide();
        }

          // ✅ Redirect to home page
          window.location.href = "index.html"; // apni home page file ka naam lagao
        }
      });
    });
  }
});





// ==========================
// EVENT HANDLERS
// ==========================

// Handle + and - quantity buttons
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("increase")) {
    const id = parseInt(e.target.dataset.id);
    const qtyEl = document.getElementById(`qty-${id}`);
    if (qtyEl) qtyEl.textContent = parseInt(qtyEl.textContent) + 1;
  }

  if (e.target.classList.contains("decrease")) {
    const id = parseInt(e.target.dataset.id);
    const qtyEl = document.getElementById(`qty-${id}`);
    if (qtyEl) {
      let current = parseInt(qtyEl.textContent);
      if (current > 1) {
        qtyEl.textContent = current - 1;
      }
    }
  }
});

// Handle "Add to Cart" button
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-to-cart");
  if (btn) {
    const id = parseInt(btn.dataset.id);
    const qtyEl = document.getElementById(`qty-${id}`);
    const qty = qtyEl ? parseInt(qtyEl.textContent) : 1;

    // Get dish from global JSON data
    if (window.allDishes) {
      const dish = window.allDishes.find((d) => d.id === id);
      if (dish) {
        addToCart(dish, qty);
      }
    }
  }
});

// ==========================
// CHECKOUT
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const checkoutBtn = document.querySelector("#checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openInvoiceModal();
    });
  }

  // Download PDF
  const downloadBtn = document.getElementById("download-pdf");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.html(document.querySelector("#invoiceModal .modal-body"), {
        callback: function (doc) {
          doc.save("invoice.pdf");
        },
        x: 10,
        y: 10,
        width: 180,
        windowWidth: 800,
      });
    });
  }

  // Print Invoice
  const printBtn = document.getElementById("print-invoice");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      const printContents = document.querySelector("#invoiceModal .modal-body").innerHTML;
      const newWindow = window.open("", "", "width=800,height=600");
      newWindow.document.write("<html><head><title>Invoice</title></head><body>");
      newWindow.document.write(printContents);
      newWindow.document.write("</body></html>");
      newWindow.document.close();
      newWindow.print();
    });
  }
});
