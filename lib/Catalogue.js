import Filter from "../../lib/Filter.js";
import Movie from "../../lib/Movie.js";

export default class Catalogue {
    #data;
    #displayTarget;
    filteredMovies;

    /**
     * 
     * @param {Array} data - Tous les films
     * @param {HTMLElement} displayTarget - Élément HTML où insérer le catalogue de films
     */
    constructor(data, displayTarget) {
        this.#data = data;
        this.#displayTarget = displayTarget;
        this.filteredMovies = [];
    }


    /**
    * Affichage de tous les films par défaut ou de ceux contenus dans le tableau passé en paramètre.
    * @param {array} listMovies - Tableau de tous les films ou tableau des films filtrés si non vide
    */
    displayMovies(listMovies = (this.filteredMovies.length === 0) ? this.#data : this.filteredMovies) {
        this.#displayTarget.innerHTML = '';
        const sectionEl = document.createElement("section");
        if (listMovies.length != 0) {
            listMovies.forEach(movie => {
                const aEl = document.createElement("a");
                const href = "/" + encodeURI(movie.title);
                aEl.href = href;
                const oMovie = new Movie(movie, aEl);
                oMovie.displayMovie();
                sectionEl.appendChild(aEl);
            });
        }
        else {
            this.#displayTarget.innerHTML = '<p>No match.</p>';
        }
        this.#displayTarget.appendChild(sectionEl);
    }


    /**
     * Applique la classe associée à la nouvelle vue désirée
     * @param {"grid" | "list"} newView - Nouvelle vue à appliquer à l'affichage des films.
     */
    setView(newView) {
        if (!this.#displayTarget.classList.contains(newView)) {
            this.#displayTarget.classList.toggle('list');
            this.#displayTarget.classList.toggle('grid');
        }
    }


    /**
    * Recherche dans les champs titre et acteurs du jeu de données et affiche les résultats
    * @param {string} searchString - Chaine selon laquelle effectuer la recherche
    */
    searchMovies(searchString) {
        let selection = (this.filteredMovies.length === 0) ? this.#data : this.filteredMovies;
        let results = selection.filter((movie) => {
            return movie.title.toLowerCase().includes(searchString.toLowerCase()) || movie.stars.toLowerCase().includes(searchString.toLowerCase());
        });
        this.filteredMovies = results;
        this.displayMovies(results);
    }


    /**
    * Tri du tableau de films affichés selon les 4 critères du menu déroulant : Titre ascendant ou descendant, Date de sortie ascendante ou descendante
    * @param {string} sortString - Chaine selon laquelle effectuer le tri
    */
    sortMovies(sortString) {
        function compareValues(key, order = 'asc') {
            return function innerSort(a, b) {
                const varA = (key === 'releaseState') ? Date.parse(new Date(a[key])) : a[key].toUpperCase();
                const varB = (key === 'releaseState') ? Date.parse(new Date(b[key])) : b[key].toUpperCase();
                let comparison = 0;
                if (varA > varB) comparison = 1;
                else if (varA < varB) comparison = -1;
                return (order === 'desc') ? (comparison * -1) : comparison;
            };
        }
        let results;
        let selection = (this.filteredMovies.length === 0) ? this.#data : this.filteredMovies;

        switch (sortString) {
            case 'yearReleaseAsc':
                results = selection.sort(compareValues('releaseState'));
                break;
            case 'yearReleaseDesc':
                results = selection.sort(compareValues('releaseState', 'desc'));
                break;
            case 'titleAsc':
                results = selection.sort(compareValues('title'));
                break;
            case 'titleDesc':
                results = selection.sort(compareValues('title', 'desc'));
                break;
        }
        this.filteredMovies = results;
        this.displayMovies(results);
    }


    /**
     * Crée un nouveau filtre correspondant à la propriété donnée, et y ajoute dynamiquement les options selon le jeu de données.
     * @param {String} propertyName - Une des propriétés des valeurs du jeu de données selon laquelle filtrer les films.
     * @returns {HTMLElement} Un `<fieldset>` contenant le nom du filtre et les options de celui-ci.
     */
    createFilter(propertyName) {
        const filter = new Filter(this.#data, propertyName);
        const filterEl = filter.createFilterEl();
        return filterEl;
    }

    /**
     * Filtre le tableau des films affichés selon l'option présentement sélectionnée, et affiche le résultat.
     * @param {String} filter - filtre sélectionné
     * @param {String} category - catégorie du filtre sélectionné
     */
    filterMovies(filter, category) {
        let selection = (this.filteredMovies.length === 0) ? this.#data : this.filteredMovies;
        let results = new Set();
        let filteredMovies;
        if (category === "genres") {
            filteredMovies = selection.filter((movie) =>
                movie.genres.includes(filter)
            );
        } else if (category === "year") {
            filteredMovies = selection.filter((movie) =>
                movie.year.includes(filter)
            );
        }
        for (const movie of filteredMovies) {
            results.add(movie);
        }
        results = Array.from(results);
        this.filteredMovies = results;
        this.displayMovies(results);
    }
}