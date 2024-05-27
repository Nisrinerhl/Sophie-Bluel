// Récupération des éléments du formulaire
const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const token = localStorage.getItem("token");

if (token) {
  window.location.href = "./index.html";
}
// Événement de soumission du formulaire
async function fetchLogin(email, password) {
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de l'authentification :", error);
    throw new Error("Une erreur est survenue lors de l'authentification");
  }
}

async function loginUser(event) {
  event.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    alert("L'identifiant et/ou le mot de passe est incorrect");
    return;
  }

  try {
    const data = await fetchLogin(email, password);

    if (data.token) {
      localStorage.setItem("token", data.token);
      // Authentification réussie : redirige l'utilisateur vers la page d'accueil
      window.location.href = "./index.html";
    } else {
      // Authentification échouée : afficher un message d'erreur
      alert("La connexion a échoué, veuillez réessayer");
    }
  } catch (error) {
    alert(error.message);
  }
}

form.addEventListener("submit", loginUser);
