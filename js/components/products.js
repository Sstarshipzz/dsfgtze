// Gestionnaire de base de données
class DatabaseManager {
    constructor() {
        this.products = databaseContent.products;
        this.categories = databaseContent.categories;
    }

    getProducts() {
        return this.products;
    }

    getCategories() {
        return this.categories;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }
}

// Fonction pour afficher les produits
function displayProducts(productsToShow = products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card reveal';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">${product.price.toFixed(2)}€</div>
                <button class="product-button" data-id="${product.id}">Voir détails</button>
            </div>
        `;
        container.appendChild(productCard);
    });

    // Réinitialiser les animations
    initRevealAnimations();
}

// Fonction de recherche
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    displayProducts(filteredProducts);
}

// Fonction de filtrage par catégorie
function filterByCategory(category) {
    if (!category) {
        displayProducts();
        return;
    }
    const filteredProducts = products.filter(product => 
        product.category === category
    );
    displayProducts(filteredProducts);
}

// Fonction de tri
function sortProducts(criterion) {
    let sortedProducts = [...products];
    switch(criterion) {
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        // Par défaut : popularité (vous pouvez ajouter une propriété popularity aux produits)
    }
    displayProducts(sortedProducts);
}

// Gestionnaire de modal
function showProductModal(productId) {
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const modalContent = modal.querySelector('.modal-product-details');
    
    modalContent.innerHTML = `
        <div class="modal-product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-product-info">
            <h2>${product.name}</h2>
            <p class="product-category">${product.category}</p>
            <p class="product-price">${product.price.toFixed(2)}€</p>
            <div class="product-details">
                <p>${product.description}</p>
                <div class="product-specs">
                    <p><strong>THC:</strong> ${product.thc}</p>
                    <p><strong>CBD:</strong> ${product.cbd}</p>
                    <p><strong>En stock:</strong> ${product.stock} unités</p>
                </div>
            </div>
            <button class="product-button">Ajouter au panier</button>
        </div>
    `;

    modal.style.display = 'block';
}

// Événements
document.addEventListener('DOMContentLoaded', () => {
    // Affichage initial des produits
    displayProducts();

    // Gestionnaire de recherche
    const searchInput = document.getElementById('search-products');
    searchInput.addEventListener('input', (e) => {
        searchProducts(e.target.value);
    });
	
    const dbManager = new DatabaseManager();
    const uiManager = new UIManager(dbManager);
    uiManager.displayProducts();
    uiManager.populateCategoryFilter();
	
    // Gestionnaire de filtre par catégorie
    const categoryFilter = document.getElementById('category-filter');
    categoryFilter.addEventListener('change', (e) => {
        filterByCategory(e.target.value);
    });

    // Gestionnaire de tri
    const sortFilter = document.getElementById('sort-filter');
    sortFilter.addEventListener('change', (e) => {
        sortProducts(e.target.value);
    });

    // Gestionnaire de modal
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('product-button')) {
            const productId = e.target.dataset.id;
            showProductModal(productId);
        }
        if (e.target.classList.contains('close-modal')) {
            e.target.closest('.product-modal').style.display = 'none';
        }
    });

    // Fermer la modal en cliquant en dehors
    const modal = document.getElementById('product-modal');
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }