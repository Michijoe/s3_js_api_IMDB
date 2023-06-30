import Router from "./lib/Router.js";
import homeCallback from "./routes/home/index.js";
import detailsCallback from "./routes/detail/index.js";

const bodyEl = document.querySelector("body");

(async () => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    // LIEN VERS LA VRAIE API
    // https://raw.githubusercontent.com/Michijoe/imdb/main/imdb.json?token=GHSAT0AAAAAACA5CT5BLIZ3TKMIQZQTR5XGZESHWFQ
    // https://imdb-api.com/en/API/ComingSoon/k_fkhd12o1
    const res = await fetch('https://imdb-api.com/fr/API/ComingSoon/k_fkhd12o1', requestOptions);
    let data = await res.json();
    data = data.items;

    // instanciation du Router
    const router = new Router(bodyEl);

    // création de la route pour l'accueil
    router.addRoute("Home", "/", "/routes/home/index.html", homeCallback.bind(null, data));

    // création des routes pour chaque film
    for (const movie of data) {
        const pathname = "/" + encodeURI(movie.title);
        router.addRoute(movie.title, pathname, "/routes/detail/index.html", detailsCallback.bind(null, movie));
    }

    // initialiser le router
    router.init();
})();