(() => {

    API_URL = "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json",
    JQUERY_URL  = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js",
    STORAGE_KEYS = {
        PRODUCTS: "products",
        FAVORITES: "favorites"
    }



    const init = () => {
        //buildHTML();
        //buildCSS();
        setEvents();
    };

    const buildHTML = () => {
        const html = `
            <div class="container">
                <h1></h1>
            </div>
        `;

        $('.product-detail').append(html);
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
        let storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);

        if (storedProducts) {
            let products = JSON.parse(storedProducts);
            console.log("Localstorage dan geldi", products);
            //buildCarouselHTML(products);
        } else {
            $.ajax({
                url: API_URL,
                method: "GET",
                dataType: "json",
                success: (data) => {
                    console.log("Products fetched from API:", data);
                    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data));
                    //buildCarouselHTML(data);
                },
                error: (jqXHR, textStatus, errorThrown) => {
                    console.error("Could not fetch product list:", textStatus, errorThrown);
                }
            });
        }
    };

    const setEvents = () => {
        fetchProducts();
    };


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