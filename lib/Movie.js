export default class Movie {
    #displayTarget;
    #image;
    #title;
    #year;
    #date;
    #genres;
    #stars;

    /**
     * 
     * @param {Array} movie - Données du film à afficher
     * @param {HTMLElement} displayTarget - Élément HTML dans lequel sera inséré les données du film
     */
    constructor(movie, displayTarget) {
        this.#displayTarget = displayTarget;
        this.#image = movie.image;
        this.#title = movie.title;
        this.#year = movie.year;
        this.#date = movie.releaseState;
        this.#genres = movie.genres;
        this.#stars = movie.stars;
    }

    //////////////////////////////////////////////////////////////////////////
    // AFFICHAGE
    /**
    * Affichage du film passé dans le constructeur
    */
    displayMovie() {
        this.#displayTarget.innerHTML = '';
        const articleEl = document.createElement("article");
        articleEl.setAttribute("class", "movieCard");
        articleEl.innerHTML = `
                <picture><img src="${this.#image}" alt="Image for ${this.#title}"></picture>
                <div>
                    <h2>${this.#title}</h2>
                    <ul>
                        <li>Year: ${this.#year}</li>
                        <li>Release date: ${this.#date}</li>
                        <li>Genres: ${this.#genres}</li>
                        <li>Stars: ${this.#stars}</li>
                    </ul>
                </div>
                `;
        this.#displayTarget.appendChild(articleEl);
    }

}