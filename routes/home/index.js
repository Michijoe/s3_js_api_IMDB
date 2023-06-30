import Catalogue from "/lib/Catalogue.js";

export default function (data) {
    const mainEl = document.querySelector("main");
    const catalogue = new Catalogue(data, mainEl);
    let params = new URLSearchParams(window.location.search);

    // affichage de tous les films
    catalogue.displayMovies();

    /////////////////////////////////////////////////////////////
    // VUES
    //////////////////////////
    // Configure la vue par défaut.
    // Attache un écouteur d'évènements au contrôle de la vue qui transmet la valeur sélectionnée à la méthode `setView` lorsque la valeur de celle-ci change.
    // Mise à jour des paramètres URL et de l'historique.
    const defaultView = document.querySelector("#displayForm input:checked").value;
    catalogue.setView(defaultView);

    const viewInputEls = document.querySelectorAll('#displayForm input');
    viewInputEls.forEach(viewInputEl => {
        viewInputEl.addEventListener("change", () => {
            catalogue.setView(viewInputEl.value);
            params.set('view', viewInputEl.value);
            history.pushState({}, "", `?${params.toString()}`);
        })
    })

    ////////////////////////////////////////////////////////////////////////////
    // RECHERCHE
    //
    // Attache un écouteur d'évènement au contrôle de la recherche qui transmet la valeur sélectionnée à la méthode `searchMovies` lorsque le bouton associé est cliqué.
    // Mise à jour des paramètres URL et de l'historique.
    // Lorsqu'une recherche est en cours, affichage de la string de recherche dans un h1.
    const searchInput = document.querySelector("#searchForm input");
    const searchButton = document.querySelector("#searchButton");
    const headerEl = document.querySelector("header");
    const searchResultEl = document.createElement("h1");
    headerEl.prepend(searchResultEl);

    searchButton.addEventListener("click", (e) => {
        e.preventDefault();
        searchInput.value = searchInput.value.trim();
        catalogue.searchMovies(searchInput.value);
        if (searchInput.value !== "") {
            searchResultEl.innerHTML = "Résultat de recherche : " + searchInput.value;
            params.set('search', searchInput.value);
            history.pushState({}, "", `?${params.toString()}`);
        }
    });


    ////////////////////////////////////////////////////////////////////////////
    // TRI
    //
    // Attache un écouteur d'évènement au contrôle du tri qui transmet la valeur sélectionnée à la méthode `sortMovies` lorsque celle-ci change.
    // Mise à jour des paramètres URL et de l'historique.
    const sortSelect = document.querySelector("#sortSelect");
    sortSelect.addEventListener("change", () => {
        catalogue.sortMovies(sortSelect.value);
        params.set('sort', sortSelect.value);
        history.pushState({}, "", `?${params.toString()}`);
    });


    ////////////////////////////////////////////////////////////////////////////
    // FILTRES
    //
    // Instancie deux filtres, un pour les genres et un pour les années, et insère ceux-ci dans le formulaire approprié.
    const filterFormEl = document.querySelector("#filterForm");
    const genreFilter = catalogue.createFilter("genres");
    const yearFilter = catalogue.createFilter("year");
    filterFormEl.appendChild(genreFilter);
    filterFormEl.appendChild(yearFilter);

    // Attache un écouteur d'évènement au contrôle des filtres qui transmet la valeur sélectionnée à la méthode `filterMovies` lorsque celle-ci change ainsi que la catégorie du filtre (genres ou year).
    // Mise à jour des paramètres URL et de l'historique.
    const filtersSelect = document.querySelectorAll("#genres, #year");
    filtersSelect.forEach(element => {
        element.addEventListener("change", () => {
            let category = element.id;
            catalogue.filterMovies(element.value, category);
            params.set(category, element.value);
            history.pushState({}, "", `?${params.toString()}`);
        })
    });


    ////////////////////////////////////////////////////////////////////////////
    // RESET
    //
    // Réinitialisation de tous les formulaires et retour à l'affichage d'origine
    const resetButton = document.querySelector("#resetButton");
    resetButton.addEventListener("click", (e) => {
        e.preventDefault();
        // reset des inputs, select et checkbox de tous les formulaires
        searchInput.value = '';
        sortSelect.value = 'yearReleaseAsc';
        document.getElementById('list').checked = true;
        filtersSelect.forEach(element => {
            element.value = "--choisir une option--";
        })
        // reset du h1
        searchResultEl.innerHTML = "";
        // reset du catalogue des films
        catalogue.sortMovies('yearReleaseAsc');
        catalogue.setView(defaultView);
        catalogue.filters = {};
        catalogue.filteredMovies = [];
        catalogue.displayMovies();
        // reset des params
        params.delete('view');
        params.delete('search');
        params.delete('sort');
        params.delete('year');
        params.delete('genres');
        // reset de l'url
        history.pushState({}, "", `?${params.toString()}`);
    });


    ////////////////////////////////////////////////////////////////////////////
    // CAS OÙ DES PARAMÈTRES SONT PRÉSENTS DANS L'URL AU MOMENT DU CHARGEMENT
    //
    if (params.has('view')) {
        let viewValue = params.get('view');
        catalogue.setView(viewValue);
        document.getElementById(viewValue).checked = true;
    }
    if (params.has('search')) {
        let searchValue = params.get('search').trim();
        catalogue.searchMovies(searchValue);
        if (searchValue !== "") {
            searchInput.value = searchValue;
            searchResultEl.innerHTML = "Résultat de recherche : " + searchValue;
        }
    }
    if (params.has('sort')) {
        let sortValue = params.get('sort');
        catalogue.sortMovies(sortValue);
        sortSelect.value = sortValue;
    }
    if (params.has('genres')) {
        let filterValue = params.get('genres');
        catalogue.filterMovies(filterValue, "genres");
        const genresFilter = document.querySelector("#genres");
        genresFilter.value = filterValue;
    }
    if (params.has('year')) {
        let filterValue = params.get('year');
        catalogue.filterMovies(filterValue, "year");
        const yearFilter = document.querySelector("#year");
        yearFilter.value = filterValue;
    }
}