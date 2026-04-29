// --- ELEMENTS ---
const elements = {
    loginBtn: document.getElementById("loginBtn"),
    loginForm: document.getElementById("loginForm"),
    signupForm: document.getElementById("signupForm"),
    sellForm: document.getElementById("sellForm"),
    overlay: document.getElementById("overlay"),
    sellBtn: document.querySelector(".sell-btn"),
    postAdForm: document.getElementById("postAdForm"),
    authLinks: document.getElementById("authLinks"),
    userProfile: document.getElementById("userProfile"),
    userNameDisplay: document.getElementById("userNameDisplay"),
    logoutBtn: document.getElementById("logoutBtn")
};

// --- MODAL CONTROLS ---
const toggleModal = (modal, show) => {
    modal.classList.toggle("hidden", !show);
    elements.overlay.classList.toggle("hidden", !show);
};

// Open Login Modal
elements.loginBtn.onclick = () => toggleModal(elements.loginForm, true);

// Close Modals when clicking overlay
elements.overlay.onclick = () => {
    [elements.loginForm, elements.signupForm, elements.sellForm].forEach(m => m.classList.add("hidden"));
    elements.overlay.classList.add("hidden");
};

// Switch between Login and Signup
document.getElementById("showSignup").onclick = (e) => {
    e.preventDefault();
    elements.loginForm.classList.add("hidden");
    elements.signupForm.classList.remove("hidden");
};

document.getElementById("showLogin").onclick = (e) => {
    e.preventDefault();
    elements.signupForm.classList.add("hidden");
    elements.loginForm.classList.remove("hidden");
};

// --- AUTH SUBMISSION LOGIC ---

// SIGNUP SUBMISSION
const signupFormTag = elements.signupForm.querySelector("form");
signupFormTag.onsubmit = (e) => {
    e.preventDefault();
    const name = signupFormTag.querySelectorAll("input")[0].value;
    const email = signupFormTag.querySelectorAll("input")[1].value;
    const password = signupFormTag.querySelectorAll("input")[2].value;

    localStorage.setItem("user", JSON.stringify({ name, email, password }));
    
    alert("Account created successfully! Please login.");
    elements.signupForm.classList.add("hidden");
    elements.loginForm.classList.remove("hidden");
};

// LOGIN SUBMISSION
const loginFormTag = elements.loginForm.querySelector("form");
loginFormTag.onsubmit = (e) => {
    e.preventDefault();
    const emailInput = loginFormTag.querySelectorAll("input")[0].value;
    const passInput = loginFormTag.querySelectorAll("input")[1].value;

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.email === emailInput && storedUser.password === passInput) {
        localStorage.setItem("isLoggedIn", "true");
        updateUI();
        toggleModal(elements.loginForm, false);
    } else {
        alert("Invalid email or password!");
    }
};

// LOGOUT WITH CONFIRMATION
elements.logoutBtn.onclick = () => {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("isLoggedIn");
        updateUI();
        window.location.reload(); 
    }
};

// --- UI UPDATE LOGIC ---
function updateUI() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (isLoggedIn === "true" && storedUser) {
        elements.authLinks.classList.add("hidden");
        elements.userProfile.classList.remove("hidden");
        elements.userNameDisplay.innerText = `Hi, ${storedUser.name}`;
    } else {
        elements.authLinks.classList.remove("hidden");
        elements.userProfile.classList.add("hidden");
    }
}

// --- PRODUCT LOGIC ---
function getAllProductData() {
    const myAds = JSON.parse(localStorage.getItem("myAds")) || [];
    renderCards(myAds);
}

function renderCards(products) {
    const productsElement = document.getElementById("products");
    if (products.length === 0) {
        productsElement.innerHTML = `<h3 style="grid-column: 1/-1; text-align: center;">No ads found. Be the first to post something!</h3>`;
        return;
    }

    productsElement.innerHTML = products.map(product => `
        <div class="card">
            <img class="card-img" src="${product.thumbnail}" alt="${product.title}" />
            <div class="card-body">
                <h2 class="title">${product.title}</h2>
                <div class="price-section">
                    <span class="discounted-price">$${product.price}</span>
                    ${product.discountPercentage > 0 ? `<span class="discount">${product.discountPercentage}% OFF</span>` : ''}
                </div>
                <div class="card-footer">
                    <button class="btn" onclick="showSingleProduct(${product.id})">View Detail</button>
                    <button class="delete-btn" onclick="deleteAd(${product.id})">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');
}

function deleteAd(id) {
    if (confirm("Delete this ad?")) {
        let myAds = JSON.parse(localStorage.getItem("myAds")) || [];
        myAds = myAds.filter(ad => ad.id !== id);
        localStorage.setItem("myAds", JSON.stringify(myAds));
        getAllProductData();
    }
}

function showSingleProduct(id) {
    window.location.href = `./singleProduct.html?id=${id}`;
}

// --- SELL LOGIC WITH PROTECTION ---
elements.sellBtn.onclick = (e) => {
    e.preventDefault();
    if (localStorage.getItem("isLoggedIn") === "true") {
        toggleModal(elements.sellForm, true);
    } else {
        alert("Action Denied! Please login first to post an ad.");
        toggleModal(elements.loginForm, true);
    }
};

elements.postAdForm.onsubmit = (e) => {
    e.preventDefault();
    
    if (localStorage.getItem("isLoggedIn") !== "true") {
        alert("Session expired. Please login.");
        window.location.reload();
        return;
    }

    const newAd = {
        id: Date.now(),
        title: document.getElementById("adTitle").value,
        price: document.getElementById("adPrice").value,
        description: document.getElementById("adDesc").value,
        discountPercentage: document.getElementById("adDiscount").value || 0,
        thumbnail: document.getElementById("adThumbnail").value || "https://via.placeholder.com/300",
    };

    const myAds = JSON.parse(localStorage.getItem("myAds")) || [];
    myAds.unshift(newAd);
    localStorage.setItem("myAds", JSON.stringify(myAds));

    alert("Ad posted successfully!");
    elements.postAdForm.reset();
    toggleModal(elements.sellForm, false);
    getAllProductData();
};

// Initial Execution
updateUI();
getAllProductData();