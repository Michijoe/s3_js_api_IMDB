export default class Router {
    #routes = [];
    #currentUrl;
    #targetEl;

    /**
     * @param {HTMLElement} targetEl - Élément HTML dans lequel sera inséré la nouvelle vue lors du changement de route.
     */
    constructor(targetEl) {
        this.#targetEl = targetEl;
    }

    /**
     * Fonction d'initialisation du routeur
     */
    init() {
        this.#loadView();
        // Affiche la nouvelle vue lors de la navigation dans l'historique.
        window.addEventListener("popstate", () => {
            this.#loadView();
        });
        this.#handleAnchors();
        // Notifie l'utilisateur lors de l'actualisation du contenu dynamique avec un lecteur d'écran
        this.#targetEl.setAttribute("aria-live", "assertive");
    }

    /**
     * Ajout d'une route et alimente le tableau des routes.
     * 
     * @param {string} title 
     * @param {string} pathname 
     * @param {string} view 
     * @param {string} callback 
     */
    addRoute(title, pathname, view, callback) {
        const route = {
            title: title,
            pathname: pathname,
            view: view,
            callback: callback,
        };
        this.#routes.push(route);
    }

    /**
     * Effectue le changement de route, et affiche la vue associée à la nouvelle route.
     *
     * @param {String} pathname - Chaîne de caractères contenant une barre oblique initiale '/' suivie du chemin de l'URL n'incluant pas la chaîne de requête ou le fragment.
     */
    #navigateTo(pathname) {
        history.pushState({}, "", pathname);
        this.#loadView();
    }


    /**
     * Charge et affiche la vue de la route courante.
     */
    async #loadView() {
        this.#currentUrl = new URL(window.location);
        const currentPathname = this.#currentUrl.pathname;
        const currentRoute = this.#routes.find((route) => route.pathname === currentPathname);
        // on vide le html avant de réafficher
        this.#targetEl.innerHTML = "";
        let html;
        try {
            const response = await fetch(currentRoute.view);
            html = await response.text();
        } catch {
            html = "<h1>404</h1>";
        }
        this.#targetEl.innerHTML = html;
        currentRoute.callback();
        // mise à jour du titre de la page et focus sur le h1(accessibilité)
        document.title = currentRoute.title;
        try {
            const h1El = document.querySelector("h1");
            h1El.setAttribute("tabindex", "-1");
            h1El.focus();
        } catch {
            console.error(
                "Pour des raisons d'accessibilité, il devrait toujours y avoir un élément <h1> comme enfant de <main>."
            );
        }
    }

    /**
     * Empêche le chargement lors d'un clic sur n'importe quel <a> local de la page. 
     * Effectue ensuite le changement de route selon l'attribut `href` du <a> cliqué.
     */
    #handleAnchors() {
        const bodyEl = document.querySelector("body");
        const hostname = this.#currentUrl.hostname;
        bodyEl.addEventListener("click", (event) => {
            if (event.target.nodeName === "A" && event.target.hostname === hostname) {
                event.preventDefault();
                const href = event.target.getAttribute("href");
                this.#navigateTo(href);
            }
        })
    }
}