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
        let matches = [];
  
        // Beaches
        if (keyword.includes("beach") || keyword.includes("beaches")) {
          matches = data.beaches;
          displayTimeForBeaches(matches, resultsDiv);
        }
        // Temples
        else if (keyword.includes("temple") || keyword.includes("temples")) {
          matches = data.temples;
          displayTimeForTemples(matches, resultsDiv);
        }
        // Countries and their cities
        else {
          data.countries.forEach(country => {
            // Check country name
            if (country.name.toLowerCase().includes(keyword)) {
              matches = matches.concat(country.cities);
  
              // Display local time for the country
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
              if (city.name.toLowerCase().includes(keyword) && !matches.includes(city)) {
                matches.push(city);
              }
            });
          });
        }
  
        // Display matching results
        if (matches.length > 0) {
          matches.forEach(place => {
            resultsDiv.innerHTML += `
              <div class="card">
                <h2>${place.name}</h2>
                <img src="${place.imageUrl}" alt="${place.name}">
                <p>${place.description}</p>
              </div>
            `;
          });
        } else if (!resultsDiv.innerHTML) {
          resultsDiv.innerHTML = "<p>No results found.</p>";
        }
      })
      .catch(error => console.error("Error fetching JSON:", error));
  }
  
  // Function to clear results and input
  function clearResults() {
    document.getElementById("results").innerHTML = "";
    document.getElementById("searchInput").value = "";
  }
  
  // Optional: display time for beaches (example, using French Polynesia / Brazil)
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
  
  // Optional: display time for temples (example, Cambodia / India)
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