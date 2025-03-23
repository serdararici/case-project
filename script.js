(() => {

    API_URL = "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json",
    JQUERY_URL  = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js",
    STORAGE_KEYS = {
        PRODUCTS: "ebebek_products",
        FAVORITES: "ebebek_favorites"
    }



    const init = () => {
        buildHTML();
        buildCSS();
        setEvents();
    };

    const buildHTML = () => {
        const html = `
            <div class="container">
                <div class="prev-button">&lt;</div>
                <div class="next-button">&gt;</div>
                <div class="carousel-container">
                    <div class="carousel">
                        <!-- Products will be rendered here -->
                    </div>
                </div>
            </div>
        `;

        $('body').append(html);
    };

    const buildCSS = () => {
        const css = `
            .container {
                background-color: red;
                height: 100px;
                width: 100px;
            }
        `;

        $('<style>').addClass('carousel-style').html(css).appendTo('head');
    };

   

    const fetchProducts = () => {
        $.ajax({
            url: API_URL,
            method: "GET",
            dataType: "json",
            success: (data) => {
                console.log("Products fetched from API:", data);
                localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data));
                const favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
                renderProducts(data, favorites);
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.error("Could not fetch product list:", textStatus, errorThrown);
            }
        });
    };
    
    function loadProducts() {
        const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        const favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
        
        if (storedProducts) {
            const products = JSON.parse(storedProducts);
            console.log("Products loaded from localStorage");
            renderProducts(products, favorites);
        } else {
            console.log("Fetching products from API");
            fetchProducts();
        }
    }

    function renderProducts(products, favorites) {
        const carousel = $('.carousel');
        carousel.empty();
        
        products.forEach((product) => {
            const isFavorite = favorites.includes(product.id);
            
            // Calculate discount if needed
            let discountHtml = '';
            let originalPriceHtml = '';
            if (product.price !== product.original_price) {
                const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);
                discountHtml = `<span class="product-discount">-%${discount}</span>`;
                originalPriceHtml = `<div class="product-original-price">${product.original_price.toFixed(2)} TL</div>`;
            }
            
            const productHTML = `
                <div class="product-card">
                    <div class="product-box">
                        <div class="product-image">
                            <img src="${product.img}" alt="${product.name}">
                            <div class="product-favorite">
                                <img src="assets/svg/${isFavorite ? 'active' : 'default'}-favorite.svg" 
                                     alt="heart" 
                                     class="heart-icon ${isFavorite ? 'active' : ''}"
                                     data-product-id="${product.id}">
                            </div>
                        </div>
                        <div class="product-info">
                            <div class="product-name">${product.brand} - ${product.name}</div>
                            <div class="product-rating">
                                ${generateRatingStars(product.rating || 0)}
                                <div class="rating-count">(${product.rating_count || 0})</div>
                            </div>
                            <div class="product-price-container">
                                ${originalPriceHtml}
                                <div class="product-price">
                                    ${product.price.toFixed(2)} TL 
                                    ${discountHtml}
                                </div>
                            </div>
                            ${product.installment ? `
                                <div class="installment-text">${product.installment}</div>
                            ` : ''}
                            <button class="add-to-cart-btn">Sepete Ekle</button>
                        </div>
                    </div>
                </div>
            `;
            
            carousel.append(productHTML);
        });
    }

    // Yıldız değerlendirmesi için yardımcı fonksiyon
    function generateRatingStars(rating) {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            const starColor = i <= rating ? '#ffc107' : '#ccc';
            starsHtml += `<span class="rating-star" style="color: ${starColor}">★</span>`;
        }
        return `<div class="rating-stars">${starsHtml}</div>`;
    }

    const setEvents = () => {
        loadProducts();
        
        // Favori butonları için event listener
        $(document).on('click', '.heart-icon', function() {
            const productId = $(this).data('product-id');
            toggleFavorite(productId);
        });
        
        // Carousel navigation için event listener'lar
        $('.prev-button').on('click', () => navigateCarousel('prev'));
        $('.next-button').on('click', () => navigateCarousel('next'));
    };

    function toggleFavorite(productId) {
        let favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
        
        if (favorites.includes(productId)) {
            favorites = favorites.filter(id => id !== productId);
        } else {
            favorites.push(productId);
        }
        
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
        loadProducts(); 
    }

    function navigateCarousel(direction) {
        const carousel = $('.carousel');
        const scrollAmount = direction === 'next' ? 300 : -300;
        carousel.animate({
            scrollLeft: carousel.scrollLeft() + scrollAmount
        }, 300);
    }

    const ensureJQuery = (callback) => {
        if (window.jQuery) {
            $(document).ready(callback);
        } else {
            let script = document.createElement("script");
            script.src = JQUERY_URL;
            script.onload = () => $(document).ready(callback);
            document.head.appendChild(script);
        }
    };

    ensureJQuery(() => {
        init();
    });

})();