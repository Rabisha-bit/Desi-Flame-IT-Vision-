// Main JavaScript for Desi-Flame Restaurant
//---------HAMBURGER----------

function togglesidebar() {
  document.getElementById("side-bar").classList.toggle("active");
}
// Preloader
document.addEventListener("DOMContentLoaded", () => {
  // Simulate loading time (remove in production)
  setTimeout(() => {
    const preloader = document.getElementById("preloader");
    preloader.classList.add("fade-out");

    // Remove preloader from DOM after animation
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  }, 2000); // 2 seconds for demo purposes
});

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".nav-container");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Initialize Swiper for Hero Section
const heroSwiper = new Swiper(".hero-swiper", {
  // Optional parameters
  loop: true,
  effect: "fade",
  speed: 1000,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  // Pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Offset for navbar height
        behavior: "smooth",
      });

      // Update active nav link
      document.querySelectorAll(".nav-link").forEach((navLink) => {
        navLink.classList.remove("active");
      });
      this.classList.add("active");
    }
  });
});

// Update active nav link on scroll
window.addEventListener("scroll", () => {
  const scrollPosition = window.scrollY + 100; // Offset for navbar height

  document.querySelectorAll("section").forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      document.querySelectorAll(".nav-link").forEach((navLink) => {
        navLink.classList.remove("active");
        if (navLink.getAttribute("href") === `#${sectionId}`) {
          navLink.classList.add("active");
        }
      });
    }
  });
});

// Reservation Form Submission (Demo)
document
  .getElementById("tableReservationForm")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();

    // Simulate form submission
    const formData = new FormData(this);
    const formValues = {};

    for (let [key, value] of formData.entries()) {
      formValues[key] = value;
    }

    // Log form data to console (for demo purposes)
    console.log("Reservation Form Data:", formValues);

    // Show success message
    alert(
      "Thank you for your reservation request! This is a demo form, so no actual reservation has been made."
    );

    // Reset form
    this.reset();
  });

// Animation on scroll (simple implementation)
const animateOnScroll = () => {
  const elements = document.querySelectorAll(
    ".featured-dish, .menu-item, .contact-info"
  );

  elements.forEach((element) => {
    const elementPosition = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementPosition < windowHeight - 100) {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }
  });
};

// Initialize animation on scroll
window.addEventListener("load", () => {
  // Set initial state for animated elements
  document
    .querySelectorAll(".featured-dish, .menu-item, .contact-info")
    .forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition = "all 0.6s ease";
    });

  // Trigger animation on initial load
  animateOnScroll();

  // Trigger animation on scroll
  window.addEventListener("scroll", animateOnScroll);
});
// Countdown Timer
const endDate = new Date();
endDate.setHours(23, 59, 59, 999); // Today’s midnight

function updateCountdown() {
  const now = new Date().getTime();
  const distance = endDate - now;

  if (distance < 0) return;

  document.getElementById("days").innerText = Math.floor(
    distance / (1000 * 60 * 60 * 24)
  );
  document.getElementById("hours").innerText = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  document.getElementById("minutes").innerText = Math.floor(
    (distance % (1000 * 60 * 60)) / (1000 * 60)
  );
  document.getElementById("seconds").innerText = Math.floor(
    (distance % (1000 * 60)) / 1000
  );
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Login & Signup Script
document.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("loginModal");
  const signupModal = document.getElementById("signupModal");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const openSignup = document.getElementById("openSignup");
  const openLogin = document.getElementById("openLogin");
  const loginClose = document.querySelector(".login-modal-close");
  const signupClose = document.querySelector(".signup-modal-close");
  const logoutBtn = document.getElementById("logoutBtn");

  // Toast
  const toastContainer = document.createElement("div");
  toastContainer.id = "toastContainer";
  document.body.appendChild(toastContainer);

  function showToast(message, type="success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  // Show login if not logged in
  if (!sessionStorage.getItem("loggedInUser")) {
    loginModal.style.display = "flex";
  } else {
    logoutBtn.style.display = "inline-block";
  }

  // Switch Login -> Signup
  openSignup.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.style.display = "none";
    signupModal.style.display = "flex";
  });

  // Switch Signup -> Login
  openLogin.addEventListener("click", (e) => {
    e.preventDefault();
    signupModal.style.display = "none";
    loginModal.style.display = "flex";
  });

 // Signup
signupBtn.addEventListener("click", () => {
  const firstName = document.getElementById("signupFirstName").value.trim();
  const lastName = document.getElementById("signupLastName").value.trim();
  const contact = document.getElementById("signupContact").value.trim();
  const address = document.getElementById("signupAddress").value.trim();
  const city = document.getElementById("signupCity").value.trim();
  const area = document.getElementById("signupArea").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  // Regex checks
  if (!/^[A-Za-z]{2,30}$/.test(firstName)) {
    showToast("⚠️ First name must be 2-30 letters!", "error"); return;
  }
  if (!/^[A-Za-z]{2,30}$/.test(lastName)) {
    showToast("⚠️ Last name must be 2-30 letters!", "error"); return;
  }
  if (!/^(\+92|0)?3[0-9]{9}$/.test(contact)) {
    showToast("⚠️ Enter a valid Pakistani phone number!", "error"); return;
  }
  
  if (!/^[A-Za-z\s]{2,50}$/.test(city)) {
    showToast("⚠️ Enter a valid city name!", "error"); return;
  }
  if (!/^[A-Za-z0-9\s]{2,50}$/.test(area)) {
    showToast("⚠️ Enter a valid area!", "error"); return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    showToast("⚠️ Invalid email address!", "error"); return;
  }
  // if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
  //   showToast("⚠️ Password must be 8+ chars, include uppercase, lowercase, number & special char!", "error"); 
  //   return;
  // }

  // Save user
  const userData = { firstName, lastName, contact, address, city, area, email, password };
  localStorage.setItem("desiFlameUser", JSON.stringify(userData));

  showToast("🎉 Signup successful! Please login now.", "success");
  signupModal.style.display = "none";
  loginModal.style.display = "flex";
});

  // Login
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const storedUser = JSON.parse(localStorage.getItem("desiFlameUser"));

    if (!storedUser) {
      showToast("❌ No account found. Please sign up first!", "error");
      return;
    }

    if (storedUser.email === email && storedUser.password === password) {
      showToast(`👋 Welcome back, ${storedUser.firstName}!`, "success");
      sessionStorage.setItem("loggedInUser", storedUser.firstName);
      loginModal.style.display = "none";
      logoutBtn.style.display = "inline-block";
    } else {
      showToast("❌ Invalid email or password!", "error");
    }
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("loggedInUser");
    showToast("👋 You have been logged out!", "success");
    loginModal.style.display = "flex";
    logoutBtn.style.display = "none";
  });

  // Close modals
  loginClose.addEventListener("click", () => loginModal.style.display = "none");
  signupClose.addEventListener("click", () => signupModal.style.display = "none");
});
// Close modals when clicking outside

document.addEventListener("DOMContentLoaded", () => {
  const userIcon = document.getElementById("userIcon");
  const userDropdown = document.getElementById("userDropdown");
  const userName = document.getElementById("userName");
  const userEmail = document.getElementById("userEmail");
  const userContact = document.getElementById("userContact");
  const userAddress = document.getElementById("userAddress");
  const userCity = document.getElementById("userCity");
  const userArea = document.getElementById("userArea");
  const dropdownLogout = document.getElementById("dropdownLogout");

  let isLocked = false; // 👈 hover lock toggle

  function setUserInfo() {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    const storedUser = JSON.parse(localStorage.getItem("desiFlameUser"));

    if (loggedInUser && storedUser) {
  userName.innerHTML = `<img src="./assets/images/icons/employees.png" class="icon"> ${storedUser.firstName} ${storedUser.lastName}`;
  userEmail.innerHTML = `<img src="./assets/images/icons/email.png" class="icon"> ${storedUser.email}`;
  userContact.innerHTML = `<img src="./assets/images/icons/phone.png" class="icon"> ${storedUser.contact}`;

  document.getElementById("userCity").innerHTML = `<img src="./assets/images/icons/address.png" class="icon">  ${storedUser.city}`;
  document.getElementById("userArea").innerHTML = `${storedUser.area}`;

  userAddress.innerHTML = `${storedUser.address}`;
  
  userIcon.style.display = "inline-block";
} else {
  userIcon.style.display = "none";
  userDropdown.style.display = "none";
}

  }

  // ✅ Page load → check user
  setUserInfo();

  // ✅ Login hone ke baad update
  document.getElementById("loginBtn").addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const storedUser = JSON.parse(localStorage.getItem("desiFlameUser"));

    if (storedUser && storedUser.email === email && storedUser.password === password) {
      sessionStorage.setItem("loggedInUser", storedUser.firstName);
      setUserInfo(); // Navbar update
    }
  });

  // Hover par show/hide (sirf jab lock na ho)
  userIcon.addEventListener("mouseenter", () => {
    if (!isLocked) userDropdown.style.display = "block";
  });
  userIcon.addEventListener("mouseleave", () => {
    if (!isLocked) userDropdown.style.display = "none";
  });
  userDropdown.addEventListener("mouseenter", () => {
    if (!isLocked) userDropdown.style.display = "block";
  });
  userDropdown.addEventListener("mouseleave", () => {
    if (!isLocked) userDropdown.style.display = "none";
  });

  // Click → lock/unlock
  userIcon.addEventListener("click", () => {
    isLocked = !isLocked;
    userDropdown.style.display = isLocked ? "block" : "none";
  });

  // Logout
  dropdownLogout.addEventListener("click", () => {
    sessionStorage.removeItem("loggedInUser");
    userDropdown.style.display = "none";
    userIcon.style.display = "none";
    alert("✅ You have been logged out!");
    location.reload();
  });

  // Bahar click par close (sirf jab lock na ho)
  document.addEventListener("click", (e) => {
    if (
      !userDropdown.contains(e.target) &&
      !userIcon.contains(e.target) &&
      !isLocked
    ) {
      userDropdown.style.display = "none";
    }
  });
});

 const form = document.getElementById("reservationForm");
const popup = document.getElementById("confirmationPopup");
const popupDetails = document.getElementById("popupDetails");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Form Submit → Show Popup
form.addEventListener("submit", function(e) {
  e.preventDefault();

  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let persons = document.getElementById("persons").value;
  let date = document.getElementById("date").value;
  let time = document.getElementById("time").value;
  let message = document.getElementById("message").value;

  popupDetails.innerHTML = `
    <span>Name:</span> ${name}<br>
    <span>Phone:</span> ${phone}<br>
    <span>Persons:</span> ${persons}<br>
    <span>Date:</span> ${date}<br>
    <span>Time:</span> ${time}<br>
    <span>Message:</span> ${message || "N/A"}
  `;

  popup.style.display = "flex"; // Show popup
});

// Confirm → Alert + Direct Refresh
confirmBtn.addEventListener("click", function() {
  alert("✅ Your booking is confirmed!");
  popup.style.display = "none";

  // 1.5 second baad page reload hoga taaki inputs reset ho jayein
  setTimeout(() => {
    location.reload();
  }, 500);
});

// Cancel → Hide Popup
cancelBtn.addEventListener("click", function() {
  popup.style.display = "none";
});
