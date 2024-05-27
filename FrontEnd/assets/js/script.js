let projects = [];
let categories = [];
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
const token = localStorage.getItem("token");




async function init() {
    const allProjects = await getData("works")
    projects = allProjects;

    const allCategories = await getData("categories")
    categories = allCategories;

    displayProjects()
    if (token) {
        setAdminView();
        generateProjectsInModal();
        generateCategoryOptions();
    }
    // setAdminView() fonction qui fait apparaitre le mode edition, le bouton modifier et le bouton logout, ajoute ausis l'eventListener du logout pour permettre de se deconnecter
    else {
        displayFilter()
    }


}

init()

async function getData(type) {
    try {
        const response = await fetch(`http://localhost:5678/api/${type}`);
        return response.json();
    }
    catch (error) {
        console.error("Une erreur est survenue lors de l'affichage", error);
    }

}



/*Afficher les projets*/
function displayProjects(filter = 0) {
    gallery.innerHTML = ""
    const fragment = document.createDocumentFragment()
    let filteredProject = projects
    console.log(filter);
    if (filter != 0) {
        // si filtre différent de tous
        // astuce array.filter(), [...projects].filter <- trasnforme le set en array pour le trier
        filteredProject = [...projects].filter(project => project.categoryId === parseInt(filter)); // filter a completer
        console.log(filteredProject);
    }
    for (const project of filteredProject) {
        console.log(project);
        const projectFigure = document.createElement("figure");
        projectFigure.dataset.setId = project.id;
        projectFigure.innerHTML = `
            <img src=${project.imageUrl} alt=${project.title}></img>
            <figcaption>${project.title}</figcaption>
        `
        fragment.appendChild(projectFigure);
    }
    gallery.appendChild(fragment)
}

function setAdminView() {
    const editBanner = document.getElementById("editBanner");
    const modify = document.querySelector(".icon-modify");
    const loginButton = document.querySelector("#login");

    editBanner.style.display = "block";

    modify.style.display = "block";

    loginButton.innerText = "logout";
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        window.location.reload();
    });



}



function displayFilter() {
    // créer les 4 filtre ste le sajoute au html
    filters.innerHTML = ""
    const fragment = document.createDocumentFragment();

    const allButton = document.createElement("button");
    allButton.innerText = "Tous";
    allButton.dataset.id = 0;
    allButton.classList.add("btn-filter");

    fragment.appendChild(allButton);

    categories.forEach(category => {
        const button = document.createElement("button");
        button.innerText = category.name;
        button.dataset.id = category.id;

        button.classList.add("btn-filter");

        fragment.appendChild(button);
    })


    filters.appendChild(fragment)


}
setFilterListener()


function setFilterListener() {
    // récupére les 4 filtres du html puis via un for of leur donne un event listener

    const filters = document.querySelectorAll(".btn-filter");
    for (const button of filters) {
        button.addEventListener("click", (e) => {
            displayProjects(e.target.dataset.id);
        })
    }

    const allButton = Array.from(filters).find(button => button.dataset.id === '0');
    if (allButton) {
        console.log("'Tous' button automatic");
        allButton.click();
    }
}





/*Connexion effectué*/

/*MODALE*/


// FONCTION QUI OUVRE LA MODAL
const openModal = function () {
    const modal = document.querySelector("#modal");
    const overlay = document.querySelector(".modal-overlay");
    modal.style.display = "block";
    overlay.style.display = "block";
}

const openModalButton = document.querySelector("#openModal");
openModalButton.addEventListener("click", openModal); //EventListener au click pour l'ouverture

// FONCTION POUR OUVRIR LA DEUXIEME MODAL
const openModalAdd = function () {
    const modal = document.querySelector("#modal");
    const modalAdd = document.querySelector("#modalAdd");
    const overlay = document.querySelector(".modal-overlay");

    modal.style.display = "none"; // Cache la première modale
    modalAdd.style.display = "block"; // Affiche la deuxième modale
    overlay.style.display = "block";  //Masque l'arrière-plan sombre

}

// FONCTION QUI FERME LA MODAL
const closeModal = function () {
    const modal = document.querySelector("#modal");
    const modalAdd = document.querySelector("#modalAdd");
    const overlay = document.querySelector(".modal-overlay");

    if (modal) modal.style.display = "none"; // Masque la première modal
    if (modalAdd) modalAdd.style.display = "none"; // Masque la deuxième modal
    if (overlay) overlay.style.display = "none"; // Masque l'arrière-plan sombre
    // Effacer le contenu du champ titre lors de la fermeture de la modal d'ajout d'image
    document.getElementById("photo-title").value = "";
}

// ICONE QUI FERME LA MODALE
const closeIcon = document.querySelector(".js-modal-close");
closeIcon.addEventListener("click", closeModal);

// ICONE QUI FERME LA MODAL D'AJOUT D'IMAGE
const secondClosure = document.getElementById("closeIconModal2");
secondClosure.addEventListener("click", closeModal)

// SÉLECTIONNE LE LIEN QUI DÉCLENCHE L'OUVERTURE DE LA MODAL
const modalTrigger = document.querySelector(".js-modal-trigger");
modalTrigger.addEventListener("click", openModal);

// Ajout de l'événement de clic à l'arrière-plan
document.querySelector(".modal-overlay",).addEventListener("click", (event) => {
    // Vérifier si l'élément cliqué est l'arrière-plan ET ne fait pas partie de la modal
    if (!event.target.closest('.modal-content')) {
        // Fermer les modals
        closeModal();
    }
});
// Ajout de l'événement de clic à l'arrière-plan pour la deuxième modal
document.querySelector("#modalAdd").addEventListener("click", (event) => {
    // Vérifier si l'élément cliqué est l'arrière-plan ET ne fait pas partie de la deuxième modal
    if (!event.target.closest('.modal-content')) {
        // Fermer la deuxième modal
        closeModal();
    }
});

// GESTION DE LA NAVIGATION ENTRE LES 2 MODALES
const backToGallery = document.getElementById("backToGallery");
backToGallery.addEventListener("click", () => {
    const modalAdd = document.querySelector("#modalAdd");
    modalAdd.style.display = "none"; // Cache la deuxième modal
    openModal(); // Réaffiche la première modal

});

//PERMET D'OUVRIR LA MODAL D'AJOUT D'IMAGE VIA LE BOUTON AJOUTER UNE PHOTO
const btnAddPicture = document.getElementById("new-photo");
btnAddPicture.addEventListener("click", function () {
    openModalAdd();

});

// RÉCUPERATION TOKEN UTILISATEUR
function getUserToken() {
    return localStorage.getItem("token");
}



// FONCTION ASYNCHRONE /PROJETS MODAL
async function generateProjectsInModal() {
    try {
        const fragment = document.createDocumentFragment()
        const modalGallery = document.querySelector(".gallery-modal");
        for (const project of projects) {
        


            const imageContainer = document.createElement("div");
            imageContainer.dataset.projectId = project.id;
            imageContainer.classList.add("image-container");
            const imageElement = document.createElement("img");
            imageElement.src = project.imageUrl;

            const deleteIcon = document.createElement("i");
            deleteIcon.classList.add("fa", "fa-light", "fa-trash-can", "delete-icon");
            deleteIcon.id = `delete-icon-${project.id}`;

            deleteIcon.addEventListener("click", () => {
                if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
                    deleteProject(project.id);
                }
            });
            imageContainer.appendChild(imageElement);
            imageContainer.appendChild(deleteIcon);
            modalGallery.appendChild(imageContainer);
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des projets :", error);
    }
}





// Fonction pour supprimer un projet du DOM et du serveur en utilisant l'API 
async function deleteProject(itemId) {
    const userToken = getUserToken();
    if (!userToken) {
        console.error("Token d'utilisateur introuvable");
        return;
    }
    try {
        const response = await fetch(`http://localhost:5678/api/works/${itemId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getUserToken()}`,
            },
        });
        if (response.status === 204) {
            console.log("Succès : Le projet a été supprimé.");
            removeProjectFromDOM(itemId);
        } else {
            console.error("Erreur : Échec de la suppression du projet.");
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
}

function removeProjectFromDOM(projectId) {
    console.log("Removing project from DOM:", projectId);
    const projectElementModal = document.querySelector(`[data-project-id="${projectId}"]`);
    const projectElement = document.querySelector(`[data-set-id="${projectId}"]`);

    if (projectElementModal) {
        projectElementModal.remove();
    }

    if (projectElement) {
        projectElement.remove();
    }
}


//*  AJOUTS D'IMAGE  *//

// LISTE CATEGORIE


// Fonction pour générer les options de la liste déroulante des catégories
function generateCategoryOptions() {
    const categorySelect = document.getElementById("category-select");

    // Parcours la liste des catégories et créer une option pour chaque catégorie
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.text = category.name;
        categorySelect.appendChild(option);
    });
}

//fonction pour la couleur du bouton valider
function checkForm() {
    const title = document.getElementById("photo-title").value;
    const categoryId = document.getElementById("category-select").value;
    const imageInput = document.getElementById("add-photo-input").files[0];
    const submit = document.getElementById("valid");



    if (title && categoryId && imageInput) {
        submit.disabled = false;
        submit.style.backgroundColor = "#1d6154";

    } else {
        submit.disabled = true;
        submit.style.backgroundColor = "";
    }
}
//ajouter les evénements de changement aux champs du formulaire
document.getElementById("photo-title").addEventListener('input', checkForm);
document.getElementById("category-select").addEventListener('change', checkForm);
document.getElementById("add-photo-input").addEventListener('change', checkForm);





// AJOUT IMAGES - TITRE - CATEGORIE 
async function addNewImage() {
    const workForm = document.querySelector("#newWork");


    // evénement de clic au bouton de validation
    document.getElementById("valid").addEventListener('click', async function (event) {
        event.preventDefault();

        //recupere les valeurs des champs du formulaire
        const title = document.getElementById("photo-title").value;
        const categoryId = document.getElementById("category-select").value;
        const imageInput = document.getElementById("add-photo-input");//image

        //validation des champs du formulaire
        if (!title || !categoryId || !imageInput.files[0]) {
            console.error("Veuillez remplir tous les champs.");
            return;// sortir de la fonction si la validation echoue
        }

        // Récupére le premier fichier du champ de type fichier
        const imageFile = imageInput.files[0];

        // Construire un objet FormData pour envoyer le fichier au serveur
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', categoryId);
        formData.append('image', imageFile);

        try {
            // Effectue la requête POST vers le serveur
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${getUserToken()}`,
                },
                body: formData,
            });

            // Vérifie si la requête a réussi
            if (response.ok) {
                console.log("Ce projet a été ajouté avec succès.");
                // Efface le contenu actuel de la galerie avant d'ajouter les nouveaux projets
                init();
                // appeler nouvel function//
                
            }

        } catch (error) {
            console.error("Erreur :", error);
        }


    }
    );

};

addNewImage();



// PRÉVISUALISATION
// Sélectionne le champ de fichier et ajoute un écouteur d'événements au changement
const fileInput = document.getElementById("add-photo-input");
fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    previewPicture(file);

    // Cache seulement le texte du label après la sélection de l'image
    const fileLabel = document.getElementById("file");
    const buttonText = fileLabel.querySelector(".custom-button");
    buttonText.style.display = "none";
});

// La fonction previewPicture qui affiche la prévisualisation de l'image
function previewPicture(file) {
    // Vérifie si un fichier a été sélectionné
    if (file) {
        // Créez un nouvel élément d'image
        const previewImg = document.createElement("img");
        previewImg.alt = "Image Preview";

        // Utilise FileReader pour lire le contenu du fichier en tant que Data URL
        const reader = new FileReader();
        reader.onload = function (event) {
            previewImg.src = event.target.result;
        };
        reader.readAsDataURL(file);

        // Insére l'image prévisualisée après le label
        fileInput.insertAdjacentElement("afterend", previewImg);
    }
}






