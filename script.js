(() => {
    // Ana sayfa kontrolü yptım.
    const isHomePage = () => {
        const currentUrl = window.location.href.toLowerCase();
        const homePageUrls = [
            'https://www.e-bebek.com/',
            'https://www.e-bebek.com',
            'https://e-bebek.com/',
            'https://e-bebek.com'
        ];
        
        return homePageUrls.some(url => currentUrl === url);
    };


    if (!isHomePage()) {
        console.log('wrong page');
        return;
    }

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
                <div class="carousel-title">
                    <p>Beğenebileceğinizi düşündüklerimiz</p>
                </div>
                <div class="carousel-prev-button">&lt;</div>
                <div class="carousel-next-button">&gt;</div>
                <div class="carousel-container">
                    <div class="carousel">
                        
                    </div>
                </div>
            </div>
        `;

        //anasayfada stories kısmını görememdim banner altına ekledim
        $('cx-page-slot[position="Section1"]').after(html);
    };

    const buildCSS = () => {
        const css = `
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f8f8f8;
                }
                
            .container {
                max-width: 1200px;
                margin: 20px auto;
                position: relative;
                background-color: #FFFFFF;
                padding: 0;
                border-radius: 40px;
                overflow: visible;
            }

                .carousel-title {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: #F7931E;
                    background-color: #FEF8F0;
                    padding: 20px 30px;
                    border-top-left-radius: 40px;
                    border-top-right-radius: 40px;
                }           
                
                .carousel-container {
                    position: relative;
                    overflow: hidden;
                    background-color: #FFFFFF;
                    border-bottom-left-radius: 40px;
                    border-bottom-right-radius: 40px;
                    padding: 0 20px;
                }
                
                .carousel {
                display: flex;
                transition: transform 0.3s ease-in-out;
                }
                
                .product-card {
                min-width: 100%;
                padding: 15px;
                box-sizing: border-box;
                }
                
                @media screen and (min-width: 600px) {
                .product-card {
                    min-width: 50%;
                }
                }
                
                @media screen and (min-width: 800px) {
                .product-card {
                    min-width: 33.33%;
                }
                }
                
                @media screen and (min-width: 1000px) {
                .product-card {
                    min-width: 25%;
                }
                }
                
                @media screen and (min-width: 1200px) {
                .product-card {
                    min-width: 20%;
                }
                }
                
                .product-box {
                    border: 1px solid #ededed;
                    border-radius: 10px;
                    padding: 5px;
                    margin: 0 0 20px 3px;
                    color: #7d7d7d;
                    text-decoration: none;
                    background-color: #fff;
                    height: 100%;
                    box-sizing: border-box;
                    position: relative;
                    cursor: pointer;
                }

                
                .product-box:hover {
                    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
                   /*transform: translateY(-5px);*/
                    border: 2px solid orange;
                }
                
                .product-image {
                position: relative;
                width: 100%;
                height: 200px;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                }
                
                .product-image img {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                }
                
                .product-favorite {
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 2;
                }
                
                .product-heart {
                width: 30px;
                height: 30px;
                background: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
                }
                
                .product-heart.favorite {
                color: #e88616;
                transform: scale(1.1);
                }
                
                .product-info {
                padding: 0 5px;
                }
                
                .product-name {
                    font-size: 12px;
                    font-weight: 500;
                    color: #7d7d7d;
                    margin-bottom: 10px;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    word-wrap: break-word;
                    text-overflow: ellipsis;
                }

                .product-brand {
                    color: black;
                }
                
                .product-rating {
                display: flex;
                align-items: center;
                gap: 5px;
                margin-bottom: 10px;
                }
                
                .rating-stars {
                display: flex;
                gap: 2px;
                }
                
                .rating-count {
                font-size: 12px;
                color: #666;
                }
                
                .product-price-container {
                margin-bottom: 15px;
                height: 50px;
                padding: 5px 0;
                }
                
                .original-price {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 5px;
                }
                
                .product-original-price {
                font-size: 13px;
                color: #999;
                text-decoration: line-through;
                margin: 0;
                }
                
                .product-discount {
                color: rgb(50, 182, 6);
                font-size: 14px;
                font-weight: 700;
                }
                
                .product-price {
                font-size: 20px;
                font-weight: 600;
                color: #7d7d7d;
                display: block;
                }

                .product-price.discounted {
                    color: rgb(50, 182, 6);
                }
                
                .installment-text {
                font-size: 12px;
                color: #666;
                margin-bottom: 10px;
                }
                
                .add-to-cart-btn {
                    FONT-WEIGHT: 700;
                    background-color: #FEF8F0;
                    color: #f28e00;
                    border: none;
                    padding: 15px 5px;
                    border-radius: 37.5px;
                    cursor: pointer;
                    width: 100%;
                    font-size: 14px;
                    font-weight: 700;
                    transition: background-color 0.3s ease;
                }
                
                .add-to-cart-btn:hover {
                background-color: #f28e00;
                color: white;
                }
                
                .carousel-prev-button, .carousel-next-button {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: #FEF8F0;
                    color: #e88616;
                    border: 1px solid #ddd;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    font-size: 24px;
                    text-align: center;
                    line-height: 50px;
                    cursor: pointer;
                    font-weight: bold;
                    z-index: 10;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }

                .carousel-prev-button:hover, .carousel-next-button:hover {
                    background-color: white;
                    border: 2px solid orange;
                }

                .carousel-prev-button {
                    left: -60px;
                }
                
                .carousel-next-button {
                    right: -60px;
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
          
          //indirimli fiyat için kontrol yaptım.
          let discountHtml = '';
          let originalPriceHtml = '';
            if (product.price < product.original_price) {
            const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);
            discountHtml = `<span class="product-discount">%${discount}</span>`;
            originalPriceHtml = `<div class="product-original-price">${product.original_price.toFixed(2)} TL</div>`;
          }
        
            const productHTML = `
                <div class="product-card">
                <div class="product-box" data-url="${product.url}">
                <div class="product-image">
                    <img src="${product.img}" alt="${product.name}">
                    <div class="product-favorite">
                                <div class="product-heart ${isFavorite ? 'favorite' : ''}" data-id="${product.id}">❤</div>
                    </div>
                </div>
                <div class="product-info">
                            <div class="product-name"><span class="product-brand">${product.brand}</span> - ${product.name}</div>
                    <div class="product-rating">
                                ${generateRatingStars(product.rating || 0)}
                                <div class="rating-count">(${product.rating_count || 0})</div>
                    </div>
                    <div class="product-price-container">
                                <div class="original-price">
                                ${originalPriceHtml} ${discountHtml}
                                </div>
                                <div class="product-price ${product.price < product.original_price ? 'discounted' : ''}">
                                    ${product.price.toFixed(2)} TL 
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

    var currentSlide = 0;
    var slidesPerPage = 1;
    var totalSlides = 0;

    function setupCarousel() {
        var windowWidth = $(window).width();
        
        if (windowWidth >= 1200) {
            slidesPerPage = 5;
        } else if (windowWidth >= 1000) {
            slidesPerPage = 4;
        } else if (windowWidth >= 800) {
            slidesPerPage = 3;
        } else if (windowWidth >= 600) {
            slidesPerPage = 2;
        } else {
            slidesPerPage = 1;
        }

        totalSlides = $(".product-card").length;
        updateCarouselPosition();
    }

    function navigateCarousel(direction) {
        const maxSlide = Math.max(0, totalSlides - slidesPerPage);
        
        if (direction === 'next' && currentSlide < maxSlide) {
            currentSlide++;
        } else if (direction === 'prev' && currentSlide > 0) {
            currentSlide--;
        }

        updateCarouselPosition();
    }

    function updateCarouselPosition() {
        const slideWidth = $(".carousel-container").width() / slidesPerPage;
        const position = -currentSlide * slideWidth;
        $(".carousel").css("transform", `translateX(${position}px)`);
    }
    
    const setEvents = () => {
        loadProducts();
        

        $(document).on('click', '.product-heart', function(e) {
            e.stopPropagation();  // butona tıklandığında carda tıklanmamaması için
            const productId = $(this).data('id');
            toggleFavorite(productId);
        });
        
        $(document).on('click', '.product-box', function(e) {
            const url = $(this).data('url');
            
            if (url) {
                window.open(url, '_blank');
            } else {
                console.log('No URL found for this product');
            }
        });
        
        $(document).on('click', '.add-to-cart-btn', function(e) {
            e.stopPropagation(); // sepete ekle butonuna tıklandığında carda tıklanmamamsı için
        });
        
        $(".carousel-next-button").click(() => navigateCarousel('next'));
        $(".carousel-prev-button").click(() => navigateCarousel('prev'));

        $(window).resize(() => {
            setTimeout(setupCarousel, 100);
        });

        setTimeout(setupCarousel, 100);
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