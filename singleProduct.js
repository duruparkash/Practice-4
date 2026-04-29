function getSingleProduct() {
    let urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get("id");

    const myAds = JSON.parse(localStorage.getItem("myAds")) || [];
    const product = myAds.find(ad => ad.id == productId);

    if (product) {
        renderProductDetail(product);
    } else {
        document.getElementById("product-detail-container").innerHTML = `
            <div style="text-align:center; margin-top:50px;">
                <h2>Ad not found!</h2>
                <a href="index.html" class="btn">Return Home</a>
            </div>`;
    }
}

function renderProductDetail(product) {
    document.getElementById("product-detail-container").innerHTML = `
        <div class="detail-wrapper" style="max-width:900px; margin:40px auto; display:flex; gap:30px; background:white; padding:20px; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
            <img src="${product.thumbnail}" style="width:50%; border-radius:8px; object-fit:cover;">
            <div style="flex:1;">
                <h1 style="color:#002f34;">${product.title}</h1>
                <h2 style="color:#002f34; font-size:2rem; margin:20px 0;">$${product.price}</h2>
                <p style="color:#666; line-height:1.6;">${product.description}</p>
                <hr style="border:0; border-top:1px solid #eee; margin:20px 0;">
                <button class="btn" style="width:100%; padding:15px; font-size:1.1rem;">Chat with Seller</button>
            </div>
        </div>
    `;
}

getSingleProduct();