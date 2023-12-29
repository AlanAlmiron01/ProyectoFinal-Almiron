document.addEventListener("DOMContentLoaded", () => {
    const productsContainer = document.getElementById("products");
    const cartContent = document.getElementById("cart-content");
    const cartModal = document.getElementById("cart-modal");
    const overlay = document.getElementById("overlay");
    const totalSpan = document.getElementById("total");
    const checkoutButton = document.getElementById("checkout");
    const closeCartButton = document.getElementById("close-cart");
    const viewCartLink = document.getElementById("view-cart");

    let products = [];
    let cartItems = [];

    async function fetchData() {
        try {
            const response = await fetch("products.json");
            if (!response.ok) {
                throw new Error("No se pudo cargar la información de los productos.");
            }
            products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error("Error al cargar los datos:", error.message);
        }
    }

    function displayProducts(productsToDisplay) {
        productsContainer.innerHTML = "";

        productsToDisplay.forEach(product => {
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        });
    }

    function createProductCard(product) {
        const card = document.createElement("div");
        card.classList.add("product-card");

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = `Precio: $${product.price.toFixed(2)}`;

        const addToCartBtn = document.createElement("button");
        addToCartBtn.textContent = "Agregar al carrito";
        addToCartBtn.addEventListener("click", () => addToCart(product));

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(price);
        card.appendChild(addToCartBtn);

        return card;
    }

    function addToCart(product) {
        cartItems.push(product);
        updateCart();
        saveCartToLocalStorage();
    }

    function updateCart() {
        updateCartCount();
        showCartItems();
    }

    function updateCartCount() {
        viewCartLink.textContent = `Ver Carrito (${cartItems.length})`;
    }

    function showCartItems() {
        cartContent.innerHTML = "";
        cartItems.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;
            cartContent.appendChild(cartItem);
        });

        const total = cartItems.reduce((acc, item) => acc + item.price, 0);
        totalSpan.textContent = `Total: $${total.toFixed(2)}`;

        cartModal.classList.remove("hidden");
        overlay.classList.remove("hidden");
    }

    function hideCart() {
        cartModal.classList.add("hidden");
        overlay.classList.add("hidden");
    }

    function saveCartToLocalStorage() {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }

    function loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem("cartItems");
        if (savedCart) {
            cartItems = JSON.parse(savedCart);
            updateCart();
        }
    }

    closeCartButton.addEventListener("click", hideCart);

    viewCartLink.addEventListener("click", showCartItems);

    checkoutButton.addEventListener("click", () => {
        alert("¡Gracias por tu compra!");
        cartItems = [];
        updateCart();
        hideCart();
        saveCartToLocalStorage();
    });

    // Cargar el carrito desde localStorage al cargar la página
    loadCartFromLocalStorage();

    // Cargar los productos al iniciar la página
    fetchData();
});
