const annualDataUrl = "http://127.0.0.1:5000/annual"; // URL for annual_data
const url = "http://127.0.0.1:5000/matchdata"; // URL for match_data
const mapurl = "http://127.0.0.1:5000/latlong" // URL for latlng_data

let markers = [];

function init(annualData, matchData) {

    // Set the default year to 1930
    let defaultYear = 1930;

    // Fetch the necessary data based on the default year
    let yearData = annualData.filter(item => item.Year === defaultYear);
    let matchYearData = matchData.filter(item => item.Year === defaultYear);


    // Set the dropdown menu value to the default year
    dropdownmenu.property("value", defaultYear);

    // Update and display the bar chart with default data
    updateBarChart(yearData);

    // Update and display the sunburst chart with default data
    updateSunburst(matchYearData);

    // Update the logo with the default year's logo
    updateLogo(defaultYear);

}


let dropdownmenu = d3.select("#selDataset");

// Select the div elements for rendering Plotly charts using D3
let chart1Div = d3.select("#chart1");
let chart2Div = d3.select("#chart2");
let chart3Div = d3.select("#chart3");
let chart4Div = d3.select("#chart4");

// Function to update the sunburst chart based on selected year
function updateSunburst(matchData) {
    let selectedYear = +dropdownmenu.property("value"); // Convert to number

    // Filter data for the selected year
    let yearData = matchData.filter(item => item.Year === selectedYear);

   // Sort the data by Home_Goals in descending order and take the top 10
   let topHomeGoals = yearData
   .sort((a, b) => parseFloat(b.Home_Goals) - parseFloat(a.Home_Goals))
   .slice(0, 10);
// Sort the data by Away_Goals in descending order and take the top 10
let topAwayGoals = yearData
   .sort((a, b) => parseFloat(b.Away_Goals) - parseFloat(a.Away_Goals))
   .slice(0, 10);
let data = [{
   type: 'sunburst',
   labels: topHomeGoals.map(item => [item.Home_Team, item.Away_Team]),
   domain: {column: 0},
   parents: topHomeGoals.map(item => selectedYear),
   values: topHomeGoals.map(item => parseFloat(item.Home_Goals)),
   insidetextorientation: 'radial'
}, {
   type: 'sunburst',
   labels: topAwayGoals.map(item => [item.Away_Team, item.Home_Team]),
   domain: {column: 1},
   parents: topAwayGoals.map(item => selectedYear),
   values: topAwayGoals.map(item => parseFloat(item.Away_Goals)),
   insidetextorientation: 'radial'
}];

// Define layout for the chart
let layout = {
 title: `Top 10 scores for Year: ${selectedYear}`,
 grid: {rows: 1, columns: 2},
 annotations: [
     {
         x: 0.08,
         y: -0.2,
         text: 'Winning Teams',
         showarrow: false,
         xref: 'paper',
         yref: 'paper',
         font: {
             size: 14,
             color: 'black'
         }
     },
     {
         x: 0.93,
         y: -0.2,
         text: 'Losing Teams',
         showarrow: false,
         xref: 'paper',
         yref: 'paper',
         font: {
             size: 14,
             color: 'black'
         }
     }
 ]
};

    // Create the chart in the chart3Div element
    Plotly.newPlot(chart4Div.node(), data, layout);
}


// Function to update the bar chart based on selected year
function updateBarChart(annualData) {
    let selectedYear = +dropdownmenu.property("value"); // Convert to number
    // Call the updateLogo function to update the logo
    updateLogo(selectedYear);

    // Filter data for the selected year
    let yearData = annualData.filter(item => item.Year === selectedYear);

    function getColorForGoals(goals) {
        if (goals <= 3) {
            return 'rgb(255, 204, 204)'; // Red for low goals
        } else if (goals <= 6) {
            return 'rgb(255, 102, 102)'; // Orange for medium goals
        } else if (goals <= 9) {
            return 'rgb(255, 0, 0)'; // Green for high goals
        } else {
            return 'rgb(153, 0, 0)'; // Default color for very high goals (or any other condition)
        }
    }

    let goalValues = yearData.map(item => item.Goals);

    let data = [{
        x: yearData.map(item => item.Team),
        y: yearData.map(item => item.Goals),
        // text: yearData.map(item => countryFlagEmojis[item.Team]), // Use flag emoji as hover text
        marker: {
            color: goalValues.map(goals => getColorForGoals(goals)), // Use the getColorForGoals function
        },
        type: 'bar'
    }];

    // Define layout for the bar chart
    let layout = {
        title: `Goals by Country for Year: ${selectedYear}`,
        xaxis: { title: 'Country' },
        yaxis: { title: 'Goals' }
    };

    // Create the bar chart in the chart1Div element
    Plotly.newPlot(chart1Div.node(), data, layout);
}


// Fetch annual_data for populating dropdown menu and creating bar chart
d3.json(annualDataUrl).then((annualData) => {
    // Extract unique years from individual dictionaries and create an array of years
    let uniqueYears = [...new Set(annualData.map(item => item.Year))];

    dropdownmenu.html("");

    // Populate dropdown menu with unique years
    uniqueYears.forEach((year) => {
        dropdownmenu
            .append("option")
            .text(year)
            .property("value", year);
    });

    dropdownmenu.on("change", () => {
        updateBarChart(annualData);
        updateSunburst(matchData);
    });

    // Fetch data for populating dropdown menu and creating sunburst chart
    d3.json(url).then((matchData) => {
        // Extract unique years from individual dictionaries and create an array of years
        let uniqueYears = [...new Set(matchData.map(item => item.Year))];

        dropdownmenu.html("");

        // Populate dropdown menu with unique years
        uniqueYears.forEach((year) => {
            dropdownmenu
                .append("option")
                .text(year)
                .property("value", year);
        });

        dropdownmenu.on("change", () => {
            updateBarChart(annualData);
            updateSunburst(matchData);
        });


        init(annualData, matchData);

    }).catch(error => {
        console.error("Error fetching matches:", error);
    });
    }).catch(error => {
    console.error("Error fetching annual_data:", error);
    });

// Define a mapping of year logos
let yearLogos = {
    1930: 'static/world cup logos/1930.jpeg',
    1934: 'static/world cup logos/1934.png',
    1938: 'static/world cup logos/1938.png',
    1950: 'static/world cup logos/1950.png',
    1954: 'static/world cup logos/1954.jpeg',
    1958: 'static/world cup logos/1958.jpeg',
    1962: 'static/world cup logos/1962.png',
    1966: 'static/world cup logos/1966.jpeg',
    1970: 'static/world cup logos/1970.jpeg',
    1974: 'static/world cup logos/1974.png',
    1978: 'static/world cup logos/1978.jpeg',
    1982: 'static/world cup logos/1982.jpeg',
    1986: 'static/world cup logos/1986.jpeg',
    1990: 'static/world cup logos/1990.png',
    1994: 'static/world cup logos/994.jpeg',
    1998: 'static/world cup logos/1998.png',
    2002: 'static/world cup logos/2002.png',
    2006: 'static/world cup logos/2006.png',
    2010: 'static/world cup logos/2010.png',
    2014: 'static/world cup logos/2014.png',
    2018: 'static/world cup logos/2018.png',
};

// Function to update the logo based on the selected year
function updateLogo(selectedYear) {
    let chartSmallDiv = d3.select(".chart.small");
    let yearLogo = document.getElementById('yearLogo');
    
    if (yearLogos[selectedYear]) {
        yearLogo.src = yearLogos[selectedYear];
        chartSmallDiv.node().appendChild(yearLogo); // Append the logo to chart.small
    } else {
        yearLogo.src = '';
        chartSmallDiv.node().removeChild(yearLogo); // Remove the logo from chart.small
    }
}

document.addEventListener('DOMContentLoaded', function() {
  // Create a map object.
  let myMap = L.map("chart3", {
    center: [15.5994, -0],
    zoom: 1.5
  });

  // Add a tile layer.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  // Define the custom icon properties
  let soccerBallIcon = L.icon({
    iconUrl: 'static/world cup logos/ball.png', // Replace with the path to your soccer ball image
    iconSize: [17, 17], // Adjust the size of the icon
    iconAnchor: [16, 16], // Adjust the anchor point of the icon
  });
  
  let countries_1930 = [
    {
      title: "France",
      year: 1930,
      latitude: 46.227638,
      longitude: 2.213749
    },

    {
      title: "United States",
      year: 1930,
      latitude: 37.09024,
      longitude: -95.712891
    },

    {
      title: "Yugoslavia",
      year: 1930,
      latitude: 44.819,
      longitude: 20.4573
    },

    {
      title: "Romania",
      year: 1930,
      latitude: 45.943161,
      longitude: 24.96676
    },

    // {
    //   title: "Argentina",
    //   year: 1930, 
    //   latitude: -38.416097,
    //   longitude: -63.616672
    // },

    {
      title: "Chile",
      year: 1930,
      latitude: -35.675147,
      longitude: -71.542969
    },

    {
      title: "Uruguay",
      year: 1930,
      latitude: -32.522779,
      longitude: -55.765835
    },

    {
      title: "Brazil",
      year: 1930,
      latitude: -14.235004,
      longitude: -51.92528
    },

    {
      title: "Paraguay",
      year: 1930,
      latitude: -23.442503,
      longitude: -58.443832
    },


  ]



  let countries = [
    {

      title: "Australia",
      year: 2018,
      latitude: -27.0000,
      longitude: 133.0000
    },
    {
      title: "Iran",
      year: 2018,
      latitude: 32.0000,
      longitude: 53.0000
    },
    {
      title: "Japan",
      year: 2018,
      latitude: 36.2048,
      longitude:138.2529
    },
    {
      title: "Saudi Arabia",
      year: 2018,
      latitude: 23.8859,
      longitude: 45.0791
    },
    {
      title: "South Korea",
      year: 2018,
      latitude: 37.0000,
      longitude: 127.5000
    },
    {
      title: "Egypt",
      year: 2018,
      latitude: 26.8205,
      longitude: 30.8024
    },
    {
      title: "Morocco",
      year: 2018,
      latitude: 31.7917,
      longitude: -7.0926
    },
    {
      title: "Nigeria",
      year: 2018,
      latitude: 9.0778,
      longitude: 8.6775
    },
    {
      title: "Senegal",
      year: 2018,
      latitude: 14.0000,
      longitude: -14.0000
    },
    {
      title: "Tunisia",
      year: 2018,
      latitude: 34.0000,
      longitude: 9.0000
    },
    {
      title: "Costa Rica",
      year: 2018,
      latitude: 10.0000,
      longitude: -84.0000
    },
    {
      title: "Mexico",
      year: 2018,
      latitude: 23.6260,
      longitude: -102.5375
    },
    {
      title: "Panama",
      year: 2018,
      latitude: 9.0000,
      longitude: -80.0000
    },
    {
      title: "Argentina",
      year: 2018,
      latitude: -34.0000,
      longitude: -64.0000
    },
    {
      title: "Brazil",
      year: 2018,
      latitude: -10.0000,
      longitude: -55.0000
    },
    {
      title: "Columbia",
      year: 2018,
      latitude:  4.5708,
      longitude: -74.2973
    },
    {
      title: "Peru",
      year: 2018,
      latitude: -10.0000,
      longitude: -76.0000
    },
    {
      title: "Uruguay",
      year: 2018,
      latitude: -33.0000,
      longitude: -56.0000
    },
    {
        title: "Belgium",
        year: 2018,
        latitude: 50.4459,
        longitude: 3.9390
      },
      {
        title: "Croatia",
        year: 2018,
        latitude: 43.7272,
        longitude: 15.9058
      },
      {
        title: "Denmark",
        year: 2018,
        latitude: 55.7090,
        longitude: 9.5349
      },
      {
        title: "England",
        year: 2018,
        latitude: 51.5000,
        longitude: 0.1167
      },
      {
        title: "France",
        year: 2018,
        latitude: 45.8999,
        longitude: 6.1166
      },
      {
        title: "Germany",
        year: 2018,
        latitude: 49.9824,
        longitude: 8.2732
      },
      {
        title: "Iceland",
        year: 2018,
        latitude: 64.5695,
        longitude: -21.8623
      },
      {
        title: "Poland",
        year: 2018,
        latitude: 53.8000,
        longitude: 20.4800
      },
      {
        title: "Portugal",
        year: 2018,
        latitude: 40.6410,
        longitude: -8.6509
      },
      {
        title: "Russia",
        year: 2018,
        latitude: 43.2330,
        longitude: 44.7830
      },
      {
        title: "Serbia",
        year: 2018,
        latitude: 46.0700,
        longitude: 19.6800
      },
      {
        title: "Spain",
        year: 2018,
        latitude: 38.9120,
        longitude: -6.3379
      },
      {
        title: "Sweden",
        year: 2018,
        latitude: 60.6130,
        longitude: 15.6470
      },
      {
        title: "Switzerland",
        year: 2018,
        latitude: 47.3699,
        longitude: 7.3449
      }

  ];

    let markersLayer = L.layerGroup().addTo(myMap);

  function updateMarkers(selectedYear) {
    markersLayer.clearLayers();
    let selectedCountries = selectedYear === '1930' ? countries_1930 : countries;

    selectedCountries.forEach(country => {
      L.marker([country.latitude, country.longitude], { icon: soccerBallIcon })
        .addTo(markersLayer)
        .bindPopup(country.title);
    });
  }

// Initialize with markers for 1930
updateMarkers('1930');

// Update markers when the dropdown value changes
document.getElementById('selDataset').addEventListener('change', function() {
  let selectedYear = this.value;
  updateMarkers(selectedYear);
});
});


// Call the initialization function to set up the dropdown menu and charts
init();
