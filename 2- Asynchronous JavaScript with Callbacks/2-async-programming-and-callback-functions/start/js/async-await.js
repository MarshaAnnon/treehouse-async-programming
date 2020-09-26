const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

// Handle all fetch requests
async function getPeopleInSpace(url) {
  const peopleResp = await fetch(url);
  const peopleJSON = await peopleResp.json();

  const profiles = peopleJSON.people.map(async (person) => {
    const craft = person.craft;
    const profileResp = await fetch(wikiUrl + person.name);
    const profileJSON = await profileResp.json();

    return {...profileJSON, craft}
  });

  return Promise.all(profiles);
}

// Generate the markup for each profile
function generateHTML(data) {
  data.map( person => {
    const section = document.createElement('section');
    peopleList.appendChild(section);
    section.innerHTML = `
      <img src=${person.thumbnail.source}>
      <span>${person.craft}</span>
      <h2>${person.title}</h2>
      <p>${person.description}</p>
      <p>${person.extract}</p>
    `;
  });
}

btn.addEventListener('click', async (event) => {
  event.target.textContent = "Loading...";

  const astros = await getPeopleInSpace(astrosUrl);
  generateHTML(astros);
  event.target.remove()
});