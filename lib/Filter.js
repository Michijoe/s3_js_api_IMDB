export default class Filter {
    #data;
    #name;
    #options;

    /**
     * Crée un nouveau filtre correspondant à la propriété donnée, et y ajoute dynamiquement les options selon le jeu de données.
     * @param {Array} data - Jeu de données selon lequel peupler les options du filtre.
     * @param {String} propertyName - Propriété selon laquelle filtrer les films
     */
    constructor(data, propertyName) {
        this.#data = data;
        this.#name = propertyName;
        this.#options = new Set();
    }

    /**
     * Pour chaque film du jeu de données, peuple les `options` du filtre selon les valeurs du nom de la propriété donné.
     * @returns {HTMLElement} fieldsetEl - Élément HTML dans lequel a été populé les valeurs du filtre
     */
    createFilterEl() {
        for (const movie of this.#data) {
            if (this.#name === "genres") {
                let properties = movie[this.#name].split(', ');
                properties.forEach(property => {
                    this.#options.add(property);
                });
            } else {
                this.#options.add(movie[this.#name]);
            }
        }
        // tri des options du filtre
        let sortArray = Array.from(this.#options).sort();
        this.#options = new Set(sortArray);

        // Fieldset
        const fieldsetEl = document.createElement("fieldset");
        // Legend
        const legendEl = document.createElement("legend");
        legendEl.innerText = `Filter by ${this.#name}`;
        fieldsetEl.appendChild(legendEl);
        // Select
        const selectEl = document.createElement("select");
        selectEl.setAttribute("id", this.#name);
        fieldsetEl.appendChild(selectEl);
        // Options
        const optionEl = document.createElement("option");
        const optionText = document.createTextNode("--choisir une option--");
        optionEl.appendChild(optionText);
        selectEl.appendChild(optionEl);
        for (const option of this.#options) {
            const optionEl = document.createElement("option");
            optionEl.setAttribute("value", option);
            optionEl.innerText = option;
            selectEl.append(optionEl);
        }
        return fieldsetEl;
    }
}