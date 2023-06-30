export default class Form {
    #selectPays;
    #selectProvince;
    #selectVille;
    #headers;
    #requestOptions;
    #url;
    #provinceCode;
    #cityCode;

    /**
     * 
     * @param {HTMLElement} selectPays - Élément HTML dans lequel sera inséré les données des pays
     * @param {HTMLElement} selectProvince - Élément HTML dans lequel sera inséré les données des provinces
     * @param {HTMLElement} selectVille - Élément HTML dans lequel sera inséré les données des villes
     */
    constructor(selectPays, selectProvince, selectVille) {
        this.#selectPays = selectPays;
        this.#selectProvince = selectProvince;
        this.#selectVille = selectVille;
        this.#headers = new Headers();
        this.#headers.append("X-CSCAPI-KEY", "WVRrckJTYjI5bzRyVkllVDVEdzdXUzZiS0Y2bkh3WGNoMGdWd2hwaA==");
        this.#requestOptions = {
            method: 'GET',
            headers: this.#headers,
            redirect: 'follow'
        };
        this.#url = "https://api.countrystatecity.in/v1/countries";
    }

    /**
     * Récupération des données de l'API pays / provinces / villes
     * 
     * @param {string} url - url de l'api
     */
    async loadAPI(url) {
        try {
            const response = await fetch(url, this.#requestOptions);
            const allData = await response.text();
            return JSON.parse(allData);
        } catch {
            // remplacement des select par un champ texte dans le cas où l'api ne fonctionne pas
            const inputElPays = document.createElement("input");
            inputElPays.setAttribute("type", "text");
            inputElPays.setAttribute("id", "pays");
            this.#selectPays.replaceWith(inputElPays);

            const inputElProvince = document.createElement("input");
            inputElProvince.setAttribute("type", "text");
            inputElProvince.setAttribute("id", "province");
            this.#selectPays.replaceWith(inputElProvince);

            const inputElVille = document.createElement("input");
            inputElVille.setAttribute("type", "text");
            inputElVille.setAttribute("id", "ville");
            this.#selectPays.replaceWith(inputElVille);
            exit;
        }
    }

    /**
     * Affichage des options du select Countries récupérées par une promesse
     */
    displayCountries() {
        this.loadAPI(this.#url).then(countries => {
            countries.forEach(country => {
                let optionEl = document.createElement("option");
                optionEl.value = country.iso2;
                optionEl.innerText = country.name;
                this.#selectPays.append(optionEl);
            });
        });
    }

    /**
     * Affichage des options du select Provinces récupérées par une promesse
     * 
     * @param {string} code - Code du pays pour lequel récupérer les données des provinces
     */
    displayProvinces(code) {
        this.#provinceCode = code;
        let url = this.#url + "/" + this.#provinceCode + "/states";
        this.loadAPI(url).then(provinces => {
            provinces.forEach(province => {
                let optionEl = document.createElement("option");
                optionEl.value = province.iso2;
                optionEl.innerText = province.name;
                this.#selectProvince.append(optionEl);
            });
        })
    }

    /**
     * Affichage des options du select Cities récupérées par une promesse
     * 
     * @param {string} code - Code de la province pour laquelle récupérer les données des villes
     */
    displayCities(code) {
        this.#cityCode = code;
        let url = this.#url + "/" + this.#provinceCode + "/states" + "/" + this.#cityCode + "/cities";
        this.loadAPI(url).then(cities => {
            cities.forEach(citie => {
                let optionEl = document.createElement("option");
                optionEl.value = citie.iso2;
                optionEl.innerText = citie.name;
                this.#selectVille.append(optionEl);
            });
        })
    }

    /**
     * Suppression des options existantes dans une select et création d'une nouvelle option par défault
     * 
     * @param {Array} options - Options existantes à supprimmer
     * @param {String} name - Nom de l'option à choisir
     * @param {HTMLElement} target - Élément HTML dans lequel insérer la nouvelle option par défault
     */
    deleteOptions(options, name, target) {
        for (const option of options) option.remove();
        let optionEl = document.createElement("option");
        optionEl.innerText = "Please select a " + name;
        target.append(optionEl);
    };
}
