

function init() {
    const annualDataUrl = "http://127.0.0.1:5000/annual"; // URL for annual_data

    // Select the dropdown menu using D3
    let dropdownmenu = d3.select("#selDataset");

    // Select the div elements for rendering Plotly charts using D3
    let chart1Div = d3.select("#chart1");
    let chart2Div = d3.select("#chart2");
    let chart3Div = d3.select("#chart3");
    let chart4Div = d3.select("#chart4");

    // Fetch annual_data for populating dropdown menu and creating bar chart
    d3.json(annualDataUrl).then((annualData) => {
        // Extract unique years from individual dictionaries and create an array of years
        let uniqueYears = [...new Set(annualData.map(item => item.Year))];

        // Populate dropdown menu with unique years
        uniqueYears.forEach((year) => {
            dropdownmenu
                .append("option")
                .text(year)
                .property("value", year);
        });

        // Add event listener for dropdown selection change
        dropdownmenu.on("change", updateBarChart);

        // Initialize bar chart with default year
        updateBarChart();

        // Function to update the bar chart based on selected year
        function updateBarChart() {
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
    }).catch(error => {
        console.error("Error fetching annual_data:", error);
    });
}

// Define a mapping of year logos (replace with actual image URLs)
let yearLogos = {
    1930: 'world cup logos/1930.jpeg',
    1934: 'world cup logos/1934.png',
    1938: 'world cup logos/1938.jpeg',
    1950: 'world cup logos/1950.png',
    1954: 'world cup logos/1954.jpeg',
    1958: 'world cup logos/1958.jpeg',
    1962: 'world cup logos/1962.png',
    1966: 'world cup logos/1966.jpeg',
    1970: 'world cup logos/1970.jpeg',
    1974: 'world cup logos/1974.png',
    1978: 'world cup logos/1978.jpeg',
    1982: 'world cup logos/1982.jpeg',
    1986: 'world cup logos/1986.jpeg',
    1990: 'world cup logos/1990.png',
    1994: 'world cup logos/1994.jpeg',
    1998: 'world cup logos/1998.png',
    2002: 'world cup logos/2002.png',
    2006: 'world cup logos/2006.png',
    2010: 'world cup logos/2010.png',
    2014: 'world cup logos/2014.png',
    2018: 'world cup logos/2018.png',
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

// Call the initialization function to set up the dropdown menu and charts

init();
