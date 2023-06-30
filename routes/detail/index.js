import Movie from "/lib/Movie.js";
import Commentaires from "/lib/Commentaires.js";
import Form from "/lib/Form.js";

export default function (data) {
    //////////////////////////////////////////////////////////////////////////////
    // SECTION FILM
    //////////////////////////////////////////////////////////////////////////////

    // Affichage des informations du film sélectionné
    const h1El = document.querySelector("h1");
    h1El.innerText = data.title;
    const movieEl = document.querySelector(".movie");
    const movie = new Movie(data, movieEl);
    movie.displayMovie();


    //////////////////////////////////////////////////////////////////////////////
    // SECTION COMMENTAIRES
    //////////////////////////////////////////////////////////////////////////////

    // Initialisation de la liste de tous les commentaires de la BD
    const commentEl = document.querySelector(".comment");
    const codereseau = "e2296540";
    const commentaires = new Commentaires(commentEl, codereseau);

    // Affichage des commentaires du film sélectionné
    commentaires.displayComments(data.title);


    //////////////////////////////////////////////////////////////////////////////
    // SECTION FORMULAIRE - API PAYS / PROVINCES / VILLES
    //////////////////////////////////////////////////////////////////////////////

    // Initialisation des 3 selects de l'API dans le DOM
    const selectPays = document.querySelector("#pays");
    const selectProvince = document.querySelector("#province");
    const selectVille = document.querySelector("#ville");
    const form = new Form(selectPays, selectProvince, selectVille);

    // Affichage des options du select Countries
    form.displayCountries();

    // Attache un écouteur d'événements au select des pays. Une fois qu'une option est sélectionnée, affichage des options du select Provinces
    selectPays.addEventListener("change", () => {
        // récupération du countryCode sélectionné
        let countryCode = selectPays.value;
        // dans le cas où des provinces étaients déjà affichées, on ré-initialise les options et on en créé une par défaut
        let provincesOption = document.querySelectorAll("#province option");
        form.deleteOptions(provincesOption, "province", selectProvince);
        // dans le cas où des villes étaients déjà affichées, on ré-initialise les options et on en créé une par défaut
        let citiesOption = document.querySelectorAll("#ville option");
        form.deleteOptions(citiesOption, "city", selectVille);
        // affichage des options du select Provinces
        form.displayProvinces(countryCode);
    })

    // Attache un écouteur d'événements au select des provinces. Une fois qu'une option est sélectionnée, affichage des options du select Cities
    selectProvince.addEventListener("change", () => {
        // récupération du provinceCode sélectionné
        let provinceCode = selectProvince.value;
        // dans le cas où des villes étaients déjà affichées, on ré-initialise les options et on en créé une par défaut
        let citiesOption = document.querySelectorAll("#ville option");
        form.deleteOptions(citiesOption, "city", selectVille);
        // affichage des options du select Cities
        form.displayCities(provinceCode);
    })

    //////////////////////////////////////////////////////////////////////////////
    // SECTION FORMULAIRE - AJOUT COMMENTAIRE
    //////////////////////////////////////////////////////////////////////////////

    // Attache un écouteur d'événements au submit du form d'envoi d'un nouveau commentaire.
    // Stockage de ce nouveau commentaire dans la BD et réaffichage de tous les commentaires du film sélectionné.
    const commentForm = document.querySelector("#commentForm");
    commentForm.addEventListener("submit", (e) => {
        e.preventDefault();

        let firstnameValue = document.querySelector("#prenom").value;
        let lastnameValue = document.querySelector("#nom").value;
        let emailValue = document.querySelector("#courriel").value;
        let paysValue = selectPays.options[selectPays.selectedIndex].text;
        let provinceValue = selectProvince.options[selectProvince.selectedIndex].text;
        let cityValue = selectVille.options[selectVille.selectedIndex].text;
        let commentValue = document.querySelector("#commentaire").value;

        if (!firstnameValue || !lastnameValue || !emailValue || !paysValue || !provinceValue || !cityValue || !commentValue) {
            document.querySelector(".error").innerText = "Veuillez remplir tous les champs !";
        } else {
            document.querySelector(".error").innerText = "";
            const tComment = [
                {
                    movieTitle: data.title,
                    firstname: firstnameValue,
                    lastname: lastnameValue,
                    email: emailValue,
                    country: paysValue,
                    state: provinceValue,
                    city: cityValue,
                    comment: commentValue,
                }
            ];
            commentaires.addNewComment(...tComment, data.title);

        }
    })
}