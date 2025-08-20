// Mapping countries to their main time zones
const countryTimeZones = {
  "Australia": "Australia/Sydney",
  "Japan": "Asia/Tokyo",
  "Brazil": "America/Sao_Paulo",
  "Cambodia": "Asia/Phnom_Penh",
  "India": "Asia/Kolkata",
  "French Polynesia": "Pacific/Tahiti"
};

// Function to search places based on keyword
function searchPlaces() {
  const keyword = document.getElementById("searchInput").value.toLowerCase().trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (!keyword) {
    resultsDiv.innerHTML = "<p>Please enter a keyword to search.</p>";
    return;
  }

  fetch("travel_recommendation_api.json")
    .then(res => res.json())
    .then(data => {

      // 1️⃣ Beaches
      if (keyword.includes("beach") || keyword.includes("beaches")) {
        displayTimeForBeaches(data.beaches, resultsDiv);
        data.beaches.forEach(beach => {
          resultsDiv.innerHTML += `
            <div class="card">
              <h2>${beach.name}</h2>
              <img src="${beach.imageUrl}" alt="${beach.name}">
              <p>${beach.description}</p>
            </div>
          `;
        });
      }

      // 2️⃣ Temples
      else if (keyword.includes("temple") || keyword.includes("temples")) {
        displayTimeForTemples(data.temples, resultsDiv);
        data.temples.forEach(temple => {
          resultsDiv.innerHTML += `
            <div class="card">
              <h2>${temple.name}</h2>
              <img src="${temple.imageUrl}" alt="${temple.name}">
              <p>${temple.description}</p>
            </div>
          `;
        });
      }

      // 3️⃣ All countries
      else if (keyword === "country" || keyword === "countries") {
        data.countries.forEach(country => {
          country.cities.forEach(city => {
            resultsDiv.innerHTML += `
              <div class="card">
                <h2>${city.name}</h2>
                <img src="${city.imageUrl}" alt="${city.name}">
                <p>${city.description}</p>
              </div>
            `;
          });

          // Display local time
          const timeZone = countryTimeZones[country.name];
          if (timeZone) {
            const options = {
              timeZone: timeZone,
              hour12: true,
              hour: "numeric",
              minute: "numeric",
              second: "numeric"
            };
            const localTime = new Date().toLocaleTimeString("en-US", options);
            resultsDiv.innerHTML += `<p><strong>Local time in ${country.name}:</strong> ${localTime}</p>`;
          }
        });
      }

      // 4️⃣ Specific country or city names
      else {
        let found = false;

        data.countries.forEach(country => {
          // Check country name
          if (country.name.toLowerCase().includes(keyword)) {
            found = true;
            country.cities.forEach(city => {
              resultsDiv.innerHTML += `
                <div class="card">
                  <h2>${city.name}</h2>
                  <img src="${city.imageUrl}" alt="${city.name}">
                  <p>${city.description}</p>
                </div>
              `;
            });

            const timeZone = countryTimeZones[country.name];
            if (timeZone) {
              const options = {
                timeZone: timeZone,
                hour12: true,
                hour: "numeric",
                minute: "numeric",
                second: "numeric"
              };
              const localTime = new Date().toLocaleTimeString("en-US", options);
              resultsDiv.innerHTML += `<p><strong>Local time in ${country.name}:</strong> ${localTime}</p>`;
            }
          }

          // Check city names
          country.cities.forEach(city => {
            if (city.name.toLowerCase().includes(keyword)) {
              found = true;
              resultsDiv.innerHTML += `
                <div class="card">
                  <h2>${city.name}</h2>
                  <img src="${city.imageUrl}" alt="${city.name}">
                  <p>${city.description}</p>
                </div>
              `;
            }
          });
        });

        if (!found) {
          resultsDiv.innerHTML = "<p>No results found.</p>";
        }
      }

    })
    .catch(error => console.error("Error fetching JSON:", error));
}

// Function to clear results and input
function clearResults() {
  document.getElementById("results").innerHTML = "";
  document.getElementById("searchInput").value = "";
}

// Display time for beaches (French Polynesia / Brazil)
function displayTimeForBeaches(beaches, resultsDiv) {
  beaches.forEach(beach => {
    let country = "";
    if (beach.name.includes("Bora Bora")) country = "French Polynesia";
    else if (beach.name.includes("Copacabana")) country = "Brazil";

    const timeZone = countryTimeZones[country];
    if (timeZone) {
      const options = {
        timeZone: timeZone,
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      };
      const localTime = new Date().toLocaleTimeString("en-US", options);
      resultsDiv.innerHTML += `<p><strong>Local time in ${country}:</strong> ${localTime}</p>`;
    }
  });
}

// Display time for temples (Cambodia / India)
function displayTimeForTemples(temples, resultsDiv) {
  temples.forEach(temple => {
    let country = "";
    if (temple.name.includes("Angkor Wat")) country = "Cambodia";
    else if (temple.name.includes("Taj Mahal")) country = "India";

    const timeZone = countryTimeZones[country];
    if (timeZone) {
      const options = {
        timeZone: timeZone,
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      };
      const localTime = new Date().toLocaleTimeString("en-US", options);
      resultsDiv.innerHTML += `<p><strong>Local time in ${country}:</strong> ${localTime}</p>`;
    }
  });
}
