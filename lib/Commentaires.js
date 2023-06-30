export default class Commentaires {
    #targetEl;
    #codereseau;
    commentsBD;

    /**
     * @param {HTMLElement} targetEl - Élément HTML dans lequel sera inséré la nouvelle vue lors du changement de route.
     * @param {string} codereseau - Code réseau du pays ou de la province sélectionnée
     */
    constructor(targetEl, codereseau) {
        this.#targetEl = targetEl;
        this.#codereseau = codereseau;
    }

    /**
     * Récupère tous les commentaires stockés dans la base de données
     * @returns Promesse
     */
    async getComments() {
        try {
            const response = await fetch(`https://maisonneuve.maximepigeon.workers.dev/${this.#codereseau}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const allComments = await response.json();
            this.commentsBD = allComments;
            return allComments;
        } catch {
            console.log("Erreur getComments()");
        }
    };

    /**
     * Affiche les commentaires du film présentement affiché
     * @param {string} movieTitle - Titre du film présentement affiché
     */
    displayComments(movieTitle) {
        this.getComments().then(comments => {
            this.#targetEl.innerHTML = "";

            const h2El = document.createElement("h2");
            h2El.innerText = "Comments";
            this.#targetEl.appendChild(h2El);

            const divEl = document.createElement("div");
            divEl.setAttribute("class", "gridComment");
            comments.forEach(comment => {
                if (comment.movieTitle === movieTitle) {
                    const articleEl = document.createElement("article");
                    articleEl.innerHTML = `
                                <ul>
                                    <li>First name: ${comment.firstname}</li>
                                    <li>Last name: ${comment.lastname}</li>
                                    <li>From: ${comment.city}, ${comment.state}, ${comment.country}</li>
                                    <li>Comment: ${comment.comment}</li>
                                </ul>
                    `;
                    divEl.appendChild(articleEl);
                }
            });
            this.#targetEl.appendChild(divEl);
        }).catch((reason) => console.log("Erreur displayComments(), raison: " + reason));
    }

    /**
     * Enregistre sur la base de données un tableau de commentaires
     * @param {Array} allComments - Tableau de tous les commentaires
     */
    async postComment(allComments) {
        try {
            const response = await fetch(`https://maisonneuve.maximepigeon.workers.dev/${this.#codereseau}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(allComments),
            });
            const content = await response.json();
        } catch (error) {
            console.log("Erreur postComment(): " + error);
        }
    }

    /**
     * Ajoute le nouveau commentaire au tableau de tous les commentaires déjà enregistrés
     * @param {Array} newComment - Tableau du nouveau commentaire
     * @param {String} movieTitle - Titre du film
     */
    async addNewComment(newComment, movieTitle) {
        this.commentsBD.push(newComment);
        await this.postComment(this.commentsBD);
        this.displayComments(movieTitle);
    }
}