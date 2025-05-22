const themeBtn = document.getElementById("themeBtn");
themeBtn.addEventListener("click", () => {
  console.log("Switching color theme");
});

const templateEvents = document.getElementById("templateEvents");
const listEvents = document.getElementById("listEvents");
const listFavoris = document.getElementById("listFavoris");
const templateDetails = document.getElementById("templateDetails");
console.log(listEvents.outerHTML);
console.log(listFavoris.outerHTML);
console.log(templateEvents.content);
console.log(templateDetails.content);

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
  console.log(event[0]);
  event.forEach((eventObject) => {
    const model = templateEvents.content.cloneNode(true);
    const title = model.querySelector("h3");
    const date = model.querySelector("div > div > p:first-child > span");
    const lieu = model.querySelector("div > div > p:nth-child(2)> span");

    title.textContent = eventObject.title;
    date.textContent = eventObject.date;
    lieu.textContent = `${eventObject.venue.address} | ${eventObject.venue.city}`;

    listEvents.appendChild(model);
  });
}

listGenerate();
