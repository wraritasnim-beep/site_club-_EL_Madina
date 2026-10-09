// =======================
// 🔐 CONNEXION
// =======================
const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const errorMessage = document.getElementById("error-message");

        errorMessage.style.display = "none";

        if (!email || !password) {
            errorMessage.textContent = "Veuillez remplir tous les champs !";
            errorMessage.style.display = "block";
            return;
        }

        if (email === "user@club.tn" && password === "1234") {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("currentUser", JSON.stringify({ email }));

            window.location.href = "home.html";
        } else {
            errorMessage.textContent = "Email ou mot de passe incorrect !";
            errorMessage.style.display = "block";
        }
    });
}

// =======================
// 🔒 PROTECTION PAGES
// =======================
if (
    window.location.pathname.includes("home.html") ||
    window.location.pathname.includes("profile.html") ||
    window.location.pathname.includes("register-event.html")
) {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "index.html";
    }
}

// =======================
// 🚪 LOGOUT
// =======================
function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// =======================
// 🎉 EVENEMENTS
// =======================
const evenements = [
    { id: 1, titre: "Soirée Gnawa", date: "15 mars 2026", lieu: "Tunis", image: "festival-de-gnaoua.jpg", description: "Musique Gnawa traditionnelle", places: 50 },
    { id: 2, titre: "La Rachidia", date: "30 mars 2026", lieu: "Tunis", image: "Rachidia-6.jpg", description: "Concert classique tunisien", places: 40 },
    { id: 3, titre: "Musique Soufie", date: "11 mars 2026", lieu: "Tunis", image: "soufie.jpg", description: "Ambiance spirituelle", places: 35 },
    { id: 4, titre: "Jazz World", date: "4 mars 2026", lieu: "Tunis", image: "jazz.jpg", description: "Fusion jazz moderne", places: 60 }
];

// =======================
// 🏠 AFFICHAGE HOME
// =======================
const grid = document.querySelector(".grid-evenements");

if (grid) {
    grid.innerHTML = "";

    evenements.forEach(ev => {
        grid.innerHTML += `
            <div class="card-event">
                <img src="${ev.image}">
                <h3>${ev.titre}</h3>
                <p>${ev.date} | ${ev.lieu}</p>
                <a href="event-details.html?id=${ev.id}" class="btn-primary">Voir</a>
            </div>
        `;
    });
}

// =======================
// 📄 DETAILS EVENT
// =======================
const params = new URLSearchParams(window.location.search);
const eventId = parseInt(params.get("id"));

const evenement = evenements.find(e => e.id === eventId);

if (evenement && document.getElementById("event-titre")) {
    document.getElementById("event-titre").textContent = evenement.titre;
    document.getElementById("event-image").src = evenement.image;
    document.getElementById("event-description").textContent = evenement.description;

    document.getElementById("inscription-link").href =
        `register-event.html?id=${evenement.id}`;
}

// =======================
// 📝 INSCRIPTION EVENT
// =======================
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("register-form");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (form) {

        // pré-remplir email
        if (currentUser) {
            document.getElementById("email").value = currentUser.email;
        }

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const nom = document.getElementById("nom").value.trim();
            const email = document.getElementById("email").value.trim();
            const telephone = document.getElementById("telephone").value.trim();
            const places = parseInt(document.getElementById("places").value);
            const message = document.getElementById("message").value.trim();

            const success = document.getElementById("success-message");
            const error = document.getElementById("error-message");

            success.style.display = "none";
            error.style.display = "none";

            // VALIDATION
            if (nom.length < 3) {
                error.textContent = "Nom minimum 3 caractères";
                error.style.display = "block";
                return;
            }

            if (!email.includes("@")) {
                error.textContent = "Email invalide";
                error.style.display = "block";
                return;
            }

            if (!/^\d{8}$/.test(telephone)) {
                error.textContent = "Téléphone = 8 chiffres";
                error.style.display = "block";
                return;
            }

            if (places < 1 || places > 10) {
                error.textContent = "Places entre 1 et 10";
                error.style.display = "block";
                return;
            }

            const inscription = {
                nom,
                email,
                telephone,
                places,
                message,
                date: new Date().toLocaleString(),
                user: currentUser.email,
                eventId: eventId
            };

            let inscriptions = JSON.parse(localStorage.getItem("inscriptions")) || [];
            inscriptions.push(inscription);

            localStorage.setItem("inscriptions", JSON.stringify(inscriptions));

            success.textContent = "Inscription réussie !";
            success.style.display = "block";

            setTimeout(() => {
                window.location.href = "profile.html";
            }, 1500);
        });
    }

    // =======================
    // 👤 PROFIL
    // =======================
    const list = document.getElementById("inscriptions-list");
    const userEmail = document.getElementById("user-email");

    if (list) {

        const inscriptions = JSON.parse(localStorage.getItem("inscriptions")) || [];
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        userEmail.textContent = currentUser.email;

        const userData = inscriptions.filter(i => i.user === currentUser.email);

        if (userData.length === 0) {
            list.innerHTML = "<li>Aucune inscription</li>";
            return;
        }

        userData.forEach((inscription, index) => {
            const ev = evenements.find(e => e.id == inscription.eventId);

            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${inscription.nom}</strong><br>
                ${ev ? ev.titre : "Event"}<br>
                ${inscription.places} place(s)<br>
                ${inscription.date}
                <br>
                <button onclick="deleteInscription(${index})">Supprimer</button>
            `;

            list.appendChild(li);
        });
    }
});

// =======================
// ❌ SUPPRESSION INSCRIPTION
// =======================
function deleteInscription(index) {
    let inscriptions = JSON.parse(localStorage.getItem("inscriptions")) || [];
    inscriptions.splice(index, 1);
    localStorage.setItem("inscriptions", JSON.stringify(inscriptions));
    location.reload();
}
