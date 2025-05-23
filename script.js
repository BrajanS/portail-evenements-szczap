const themeBtn = document.getElementById("themeBtn");
themeBtn.addEventListener("click", () => {
  const current = document.body.getAttribute("data-theme") || "claire";
  const next = current === "claire" ? "sombre" : "claire";
  themeBtn.textContent = current === "claire" ? "Claire" : "Sombre";
  document.body.setAttribute("data-theme", next);
});
// #region Constantes Globales
const sectionEvents = document.getElementById("sectionEvents");
const sectionMonPlanning = document.getElementById("sectionMonPlanning");
const templateEvents = document.getElementById("templateEvents");
const templateDetails = document.getElementById("templateDetails");
const listEvents = document.getElementById("listEvents");
const listFavoris = document.getElementById("listFavoris");
const baseUrl =
  "https://demo.theeventscalendar.com/wp-json/tribe/events/v1/events";
// #endregion

async function getData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data) {
      return data.events;
    }
  } catch (error) {
    console.error(error);
  }
}

async function listEventsGenerate() {
  const event = await getData(baseUrl);
  const storedEvents = JSON.parse(localStorage.getItem("eventsFavoris")) || [];
  console.log("storedEvents", storedEvents);
  // Clone seulement les données de "event" qui n'éxiste pas déjà au LocalStorage
  const verifiedEvents = event.filter((data) =>
    storedEvents.every((storedData) => storedData.id !== data.id)
  );
  console.log("verifiedEvents", verifiedEvents);
  // Appel de la fonction qui affiche les données stoquer au LocalStorage
  listFavorisGenerate(storedEvents);

  verifiedEvents.forEach((eventObject) => {
    // #region Template de "event" et les Selecteurs
    const model = templateEvents.content.cloneNode(true);
    const title = model.querySelector("h3");
    const date = model.querySelector("div > div > p:first-child > span");
    const lieu = model.querySelector("div > div > p:nth-child(2)> span");
    const lesBoutons = model.querySelectorAll("button");
    const detailsBtn = lesBoutons[0];
    const ajouterBtn = lesBoutons[1];
    // #endregion

    title.textContent = eventObject.title;
    date.textContent = eventObject.date;
    lieu.textContent = !Array.isArray(eventObject.venue)
      ? `${eventObject.venue.address} | ${eventObject.venue.city}`
      : "Inconnu";
    detailsBtn.addEventListener("click", () => {
      const lookForDetails = document.querySelector("#details");
      if (!lookForDetails) {
        details(
          eventObject.start_date,
          eventObject.end_date,
          eventObject.description,
          eventObject.url,
          sectionEvents
        );
      } else {
        lookForDetails.remove();
        details(
          eventObject.start_date,
          eventObject.end_date,
          eventObject.description,
          eventObject.url,
          sectionEvents
        );
      }
    });

    ajouterBtn.addEventListener("click", () => {
      const getFavoris =
        JSON.parse(localStorage.getItem("eventsFavoris")) || [];
      getFavoris.push(eventObject);
      localStorage.setItem("eventsFavoris", JSON.stringify(getFavoris));
      ajouterBtn.parentElement.parentElement.remove();
    });

    listEvents.appendChild(model);
  });
}

function listFavorisGenerate(favoritesData) {
  // Vide la liste de favoris (car cette fonction sera appeler aussi à chaque cliques "Ajouter")
  listFavoris.replaceChildren();
  favoritesData.forEach((favData) => {
    // #region Template de "event" et les Selecteurs
    const model = templateEvents.content.cloneNode(true);
    const title = model.querySelector("h3");
    const date = model.querySelector("div > div > p:first-child > span");
    const lieu = model.querySelector("div > div > p:nth-child(2)> span");
    const lesBoutons = model.querySelectorAll("button");
    const detailsBtn = lesBoutons[0];
    const retirerBtn = lesBoutons[1];
    // #endregion

    title.textContent = favData.title;
    date.textContent = favData.date;
    lieu.textContent = !Array.isArray(favData.venue)
      ? `${favData.venue.address} | ${favData.venue.city}`
      : "Inconnu";
    detailsBtn.addEventListener("click", () => {
      const lookForDetails = document.querySelector("#details");
      if (!lookForDetails) {
        details(
          favData.start_date,
          favData.end_date,
          favData.description,
          favData.url,
          sectionMonPlanning
        );
      } else {
        lookForDetails.remove();
        details(
          favData.start_date,
          favData.end_date,
          favData.description,
          favData.url,
          sectionMonPlanning
        );
      }
    });
    retirerBtn.textContent = "Retirer";
    retirerBtn.addEventListener("click", () => {
      const getFavoris =
        JSON.parse(localStorage.getItem("eventsFavoris")) || [];
      const removedFavoris = getFavoris.filter(
        (deleteIfFound) => deleteIfFound.id !== favData.id
      );
      console.log("Verif suppr", removedFavoris);

      // localStorage.setItem("eventsFavoris", JSON.stringify(getFavoris));
      // ajouterBtn.parentElement.parentElement.remove();
    });

    listFavoris.appendChild(model);
  });
}

// localStorage.clear();
listEventsGenerate();

function details(dateStart, dateEnd, desc, extLink, insertInto) {
  const modelDetails = templateDetails.content.cloneNode(true);
  const dateDebut = modelDetails.querySelector(
    "div > div > p:nth-child(2) > span"
  );
  const dateFin = modelDetails.querySelector(
    "div > div > p:nth-child(3) > span"
  );
  const description = modelDetails.querySelector(
    "div > div > p:nth-child(4) > span"
  );
  const lienExt = modelDetails.querySelector("div > div > p:last-child > a");
  const btnFermer = modelDetails.querySelector("button");

  dateDebut.textContent = dateStart;
  dateFin.textContent = dateEnd;
  description.textContent = desc;
  lienExt.href = extLink;
  lienExt.textContent = extLink;
  btnFermer.addEventListener("click", () => {
    btnFermer.parentElement.remove();
  });
  insertInto.appendChild(modelDetails);
  lienExt.focus();
}
