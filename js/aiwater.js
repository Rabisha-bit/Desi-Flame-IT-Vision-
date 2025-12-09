document.addEventListener("DOMContentLoaded", () => {
  const aiWaiterBtn = document.getElementById("aiWaiterBtn");
  const aiWaiterModal = document.getElementById("aiWaiterModal");
  const aiClose = document.querySelector(".ai-modal-close");
  const aiChatMessages = document.getElementById("aiChatMessages");
  const aiChatBody = document.querySelector(".ai-chat-body");
  const aiChatInput = document.getElementById("aiChatInput");
  const aiSendBtn = document.getElementById("aiSendBtn");

  // ✅ User name helper
  function getUserName() {
    const sessionName = sessionStorage.getItem("loggedInUser");
    return sessionName ? sessionName : "Guest";
  }

  // --- Foodie Points ---
  let foodiePoints = 0;
  let interactionCount = 0;

  // --- Dishes data (from JSON) ---
  let allDishes = { dishes: [] };

  // ✅ Fetch data from dishes.json
  fetch("/assets/data/dishes.json")
    .then((res) => res.json())
    .then((data) => {
      allDishes = data;
    })
    .catch((err) => console.error("Error loading dishes.json:", err));

  const desiJokes = [
    "Biryani bina pyaaz, jaise zindagi bina raaz! 😅",
    "Pehle khana ya pehle selfie? 🤔",
    "Aap order kijiye, baaki sab Allah pe chhod dijiye! 🙌",
  ];

  // --- Health restriction memory ---
  let userHealthRestrictions = [];

  // --- Cart system with localStorage ---
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // ✅ Add item to cart
  window.addToCartFromUI = function (dishName) {
    const dish = allDishes.dishes.find((d) => d.name === dishName);
    if (dish) {
      const price = dish.discount_price || dish.price || 0;
      cart.push({
        name: dish.name,
        price: price,
        image: dish.image || "",
      });
      saveCart();
      sendMessage(
        `🛒 <b>${dish.name}</b> cart me add ho gaya! `,
        "ai"
      );
    }
  };

  // ✅ Checkout Cart
  function checkoutCart() {
    if (!cart.length) {
      sendMessage("😅 Cart khaali hai.", "ai");
      return;
    }

    // Combine same dishes aur qty count karo
    const combined = {};
    cart.forEach((item) => {
      if (!combined[item.name]) {
        combined[item.name] = { ...item, qty: 1 };
      } else {
        combined[item.name].qty += 1;
      }
    });

    let total = 0;
let list = Object.values(combined)
  .map((d) => {
    const subtotal = Number(d.price) * d.qty;
    total += subtotal;
    return `🍴 <b>${d.name}</b> × ${d.qty} → Rs.${subtotal.toFixed(2)}`;
  })
  .join("<br>");

    sendMessage(
      `
      <div style="background:#1e1e1e; color:#fff; padding:12px; border-radius:12px; line-height:1.6;">
        <h4>🧾 <b>Cart Summary</b></h4>
        ${list}
        <hr style="border-color:#444;">
        <b>Total Amount:</b> Rs.${total.toFixed(2)}
        <br><br>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button onclick='placeOrder()' style='background:#ff7043; border:none; color:white; padding:8px 16px; border-radius:20px; cursor:pointer;'>✅ Place Order</button>
          <button onclick='clearCart()' style='background:#444; border:none; color:white; padding:8px 16px; border-radius:20px; cursor:pointer;'>🗑️ Clear Cart</button>
        </div>
      </div>
      `,
      "ai"
    );
  }

  // ✅ Clear Cart
  window.clearCart = function () {
    cart = [];
    saveCart();
    sendMessage("🗑️ Cart clear kar diya gaya hai!", "ai");
  };

  // ✅ Place Order
  window.placeOrder = function () {
    if (!cart.length) return;
    cart = [];
    saveCart();
    sendMessage("✅ Order place ho gaya! Thodi der me garma garam khana aapke table pe hoga 😋", "ai");
  };

  // --- Open modal ---
  aiWaiterBtn.addEventListener("click", () => {
    aiWaiterModal.style.display = "flex";
    aiChatInput.focus();
    startConversation();
  });

  // --- Close modal ---
  aiClose.addEventListener("click", () => {
    aiWaiterModal.style.display = "none";
    aiChatMessages.innerHTML = "";
    foodiePoints = 0;
    speechSynthesis.cancel();
  });

  aiWaiterModal.addEventListener("click", (e) => {
    if (e.target === aiWaiterModal) {
      aiWaiterModal.style.display = "none";
      aiChatMessages.innerHTML = "";
      foodiePoints = 0;
      speechSynthesis.cancel();
    }
  });

  // --- Voice Recognition ---
  let recognition;
  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      aiChatInput.value = transcript;
      handleSend();
    };
  }

  function speak(text) {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    const cleanHTML = text.replace(/<[^>]*>/g, "");
    const cleanText = cleanHTML.replace(/[^\w\s.,!?]/gu, "");
    if (!cleanText.trim()) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "hi-IN";
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }

  // ✅ Modified sendMessage
  function sendMessage(msg, sender = "user", speakIt = true) {
    const div = document.createElement("div");
    div.classList.add(sender === "user" ? "user-msg" : "ai-msg");
    div.innerHTML = msg;
    aiChatMessages.appendChild(div);
    setTimeout(() => {
      aiChatBody.scrollTo({ top: aiChatBody.scrollHeight, behavior: "smooth" });
    }, 100);
    if (sender === "ai" && speakIt) speak(msg);
  }

  // --- Intro ---
  function startConversation() {
    const userName = getUserName();
    aiChatMessages.innerHTML = "";
    sendMessage(
      `🍽️ AssalamOAlaikum <b>${userName}</b>! Welcome to <b>DesiFlame Restaurant</b><br>
       Main hoon aapka <b>AI Waiter 🤖</b><br><br>
       Aap mujhe likh sakte ho:<br>
       👉 <b>menu</b> likho toh categories milengi<br>
       👉 <b>checkout</b> likho toh apna cart dekh loge<br>
       👉 <b>clear cart</b> likho toh cart reset ho jaega<br>
       👉 <b>dish ka naam</b> likho toh details aayengi<br>
       👉 <b>under 500</b> likho toh Rs.500 se kam dishes milengi<br>
       👉 <b>veg/ non-veg / sweet / healthy</b> mood likho toh recommendations milengi<br><br>
       🩺 Agar aapko koi health restriction hai toh bata dijiye (Diabetes, High BP, Cholesterol, Allergy), main uske hisaab se suggestion dunga!`,
      "ai"
    );
  }

  // --- Smart responses ---
  function processQuery(query) {
    interactionCount++;
    foodiePoints += 10;

    // 🎁 Reward system
    if (foodiePoints >= 100) {
      sendMessage("🎉 Mubarak ho! Aapko ek free dessert mil gaya 🍨", "ai");
      foodiePoints = 0;
    }

    query = query.toLowerCase();

    // 📌 Cart system
    if (query.includes("checkout") || query.includes("cart")) {
      checkoutCart();
      return;
    }
    if (query.includes("clear cart")) {
      clearCart();
      return;
    }

    // 📌 Health restriction input
    const healthKeywords = ["diabetes", "high bp", "cholesterol", "allergy"];
    const foundHealth = healthKeywords.find((h) => query.includes(h));
    if (foundHealth) {
      if (!userHealthRestrictions.includes(foundHealth)) {
        userHealthRestrictions.push(foundHealth);
      }
      sendMessage(
        `🩺 Samajh gaya <b>${getUserName()}</b>! Aapne bataya ki aapko <b>${foundHealth}</b> hai. Main ab aapko safe recommendations dunga ✅`,
        "ai"
      );
      return;
    }

    // 📌 Price filter
    if (query.includes("under")) {
      const priceLimit = parseInt(query.match(/\d+/)[0]);
      const affordable = allDishes.dishes.filter((d) => (d.discount_price || d.price) <= priceLimit);
      if (affordable.length) {
        sendMessage(`💸 Rs.${priceLimit} ke andar ye options hain:`, "ai");
        affordable.forEach((d) =>
          sendMessage(`🍴 ${d.name} - Rs.${d.discount_price || d.price}`, "ai", false)
        );
      } else {
        sendMessage("😅 Is price range me koi dish nahi hai.", "ai");
      }
      return;
    }

    // 📌 Menu
    if (query.includes("menu")) {
      const categories = [...new Set(allDishes.dishes.map((d) => d.category))];
      let btns = categories
        .map(
          (cat) =>
            `<button onclick=\"processQuery('${cat}')\">${cat}</button>`
        )
        .join(" ");
      sendMessage(`🍴 Categories:<br>${btns}`, "ai");
      return;
    }

    // 📌 Restaurant info
    if (query.includes("restaurant")) {
      sendMessage("🏠 Ye hamara Desi Flame Restaurant hai – tradition aur AI ka perfect combo! ❤️", "ai");
      return;
    }

    // 📌 Exit
    if (query.includes("bye")) {
      sendMessage(`👋 Allah Hafiz ${getUserName()}! Dubara zaroor aaiyega 😋`, "ai");
      return;
    }

    // 📌 Mood / Tag filter
    const moods = ["healthy", "sweet", "bbq", "veg","non-veg"];
    const mood = moods.find((m) => query.includes(m));
    if (mood) {
      const moodDishes = allDishes.dishes.filter(
        (d) => d.tags && d.tags.includes(mood)
      );
      if (moodDishes.length) {
        sendMessage(`🔥 ${mood} mood ke liye options:`, "ai");
        moodDishes.forEach((d) =>
          sendMessage(`🍴 ${d.name} - Rs.${d.discount_price || d.price}`, "ai", false)
        );
      } else {
        sendMessage("😅 Is mood ke liye koi dish nahi mili.", "ai");
      }
      return;
    }

    // 📌 Category dishes
    const catDishes = allDishes.dishes.filter((d) =>
      d.category.toLowerCase().includes(query)
    );
    if (catDishes.length > 0) {
      sendMessage(`🍲 Ye rahi <b>${query}</b> category ki dishes:`, "ai");
      catDishes.forEach((d) =>
        sendMessage(`🍴 ${d.name} - Rs.${d.discount_price || d.price}`, "ai", false)
      );
      return;
    }

    // 📌 Specific dish search
    const dish = allDishes.dishes.find((d) =>
      d.name.toLowerCase().includes(query)
    );
    if (dish) {
      let warningLine = "";
      if (dish.not_good_for?.length) {
        const risky = dish.not_good_for.filter((r) =>
          userHealthRestrictions.some((u) =>
            u.toLowerCase().includes(r.toLowerCase())
          )
        );
        if (risky.length) {
          warningLine = `<p style='color:#ff4d4d; font-weight:bold; background:#fff3f3; padding:6px; border-radius:6px;'>
            ⚠️ HEALTH ALERT: <b>${getUserName()}</b>, aapne <u>${risky.join(
            ", "
          )}</u> bola tha. Isliye ye dish avoid karein! 🚫
          </p>`;
          const safeDish = allDishes.dishes.find(
            (d) => !d.not_good_for?.some((x) => risky.includes(x))
          );
          if (safeDish) {
            warningLine += `<p>👉 Lekin aap <b>${safeDish.name}</b> try kar sakte ho. 😋</p>`;
          }
        }
      }
      sendMessage(
        `<div class="dish-card">
          <img src="${dish.image}" alt="${dish.name}">
          <strong>${dish.name}</strong><br>
          <em>${dish.description}</em><br>
          <b>Price:</b> Rs.${dish.discount_price || dish.price}<br>
          <b>Rating:</b> ${dish.rating}<br>
          ${warningLine}
          <p>😂 ${
            dish.joke ||
            desiJokes[Math.floor(Math.random() * desiJokes.length)]
          }</p>
          <button onclick='window.addToCartFromUI("${dish.name}")'>➕ Add to Order</button>
        </div>`,
        "ai"
      );
      return;
    }

    // 📌 Default fallback
    sendMessage("😅 Sorry, samajh nahi aaya. 'menu' likh kar categories dekh lo!", "ai");
  }

  window.processQuery = processQuery;

  // --- Handle send ---
  function handleSend() {
    const msg = aiChatInput.value.trim();
    if (!msg) return;
    sendMessage(msg, "user");
    aiChatInput.value = "";
    processQuery(msg);
  }

  aiSendBtn.addEventListener("click", handleSend);
  aiChatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSend();
  });

  // --- Add mic button ---
  const micBtn = document.createElement("button");
  micBtn.textContent = "🎤";
  micBtn.style.borderRadius = "50px";
  micBtn.style.padding = "3px 15px";
  micBtn.style.fontSize = "1.2rem";
  micBtn.style.cursor = "pointer";
  micBtn.addEventListener("click", () => {
    if (recognition) recognition.start();
    else sendMessage("😔 Sorry, voice not supported.", "ai");
  });
  document.querySelector(".ai-modal-footer").appendChild(micBtn);
});
