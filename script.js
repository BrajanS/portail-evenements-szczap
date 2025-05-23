const themeBtn = document.getElementById("themeBtn");
themeBtn.addEventListener("click", () => {
  const current = document.body.getAttribute("data-theme") || "claire";
  const next = current === "claire" ? "sombre" : "claire";
  themeBtn.textContent = current === "claire" ? "Claire" : "Sombre";
  document.body.setAttribute("data-theme", next);
});

const sectionEvents = document.getElementById("sectionEvents");
const templateEvents = document.getElementById("templateEvents");
const listEvents = document.getElementById("listEvents");
const listFavoris = document.getElementById("listFavoris");
const templateDetails = document.getElementById("templateDetails");

const baseUrl =
  "https://demo.theeventscalendar.com/wp-json/tribe/events/v1/events";

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

async function listGenerate() {
  const event = await getData(baseUrl);
  event.forEach((eventObject) => {
    const model = templateEvents.content.cloneNode(true);
    const title = model.querySelector("h3");
    const date = model.querySelector("div > div > p:first-child > span");
    const lieu = model.querySelector("div > div > p:nth-child(2)> span");
    const detailsBtn = model.querySelector("div > div > button");

    title.textContent = eventObject.title;
    date.textContent = eventObject.date;
    detailsBtn.addEventListener("click", () => {
      const lookForDetails = document.querySelector("#details");
      if (!lookForDetails) {
        console.log(lookForDetails);

        details(
          eventObject.start_date,
          eventObject.end_date,
          eventObject.description,
          eventObject.url,
          sectionEvents
        );
      } else {
        console.log(lookForDetails);

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

    lieu.textContent = !Array.isArray(eventObject.venue)
      ? `${eventObject.venue.address} | ${eventObject.venue.city}`
      : "Inconnu";

    listEvents.appendChild(model);
  });
}

listGenerate();

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
