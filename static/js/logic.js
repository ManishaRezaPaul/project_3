

function init() {
    const url = "http://127.0.0.1:5000/matchdata"; // URL for annual_data

    // Select the dropdown menu using D3
    let dropdownmenu = d3.select("#selDataset");

    // Select the div elements for rendering Plotly charts using D3
    let chart1Div = d3.select("#chart1");
    let chart2Div = d3.select("#chart2");
    let chart3Div = d3.select("#chart3");
    let chart4Div = d3.select("#chart4");

    // Fetch data for populating dropdown menu and creating sunburst chart
    d3.json(url).then((matchData) => {
        // Extract unique years from individual dictionaries and create an array of years
        let uniqueYears = [...new Set(matchData.map(item => item.Year))];

        // Populate dropdown menu with unique years
        uniqueYears.forEach((year) => {
            dropdownmenu
                .append("option")
                .text(year)
                .property("value", year);
        });

        // Add event listener for dropdown selection change
        dropdownmenu.on("change", updateSunburst);

        // Initialize sunburst with default year
        updateSunburst();

        //Function to update the sunburst based on selected year
        
        // function updateSunburst() {
        //     let selectedYear = +dropdownmenu.property("value"); // Convert to number
        
        //     // Filter data for the selected year
        //     let yearData = matchData.filter(item => item.Year === selectedYear);
        
        //     // Create hierarchical data for Plotly sunburst chart
        //     let data = [{
        //         type: 'sunburst',
        //         ids: yearData.map(item => item.Home_Team),
        //         labels: yearData.map(item => item.Home_Team),
        //         parents: yearData.map(item => selectedYear), // For the root level
        //         values: yearData.map(item => parseFloat(item.Home_Goals)), // Example, you can adjust this
        //     }];
        
        //     // Define layout for the chart
        //     let layout = {
        //         margin: { l: 0, r: 0, b: 0, t: 0 },
        //         title: `Sunburst Chart of Matches for Year: ${selectedYear}`,
        //     };
        
        //     // Create the chart in the chart3Div element
        //     Plotly.newPlot(chart3Div.node(), data, layout);
        // }

        function updateSunburst() {
            let selectedYear = +dropdownmenu.property("value"); // Convert to number

            // Filter data for the selected year
            let yearData = matchData.filter(item => item.Year === selectedYear);

            // Create data for Plotly sunburst chart

            let data = [{
                type: 'sunburst',
                labels: yearData.map(item => [item.Stage, item.Home_Team, item.Away_Team]),
                parents: yearData.map(item => selectedYear),
                values: yearData.map(item => parseFloat([item.Home_Goals, item.Away_Goals])),
            }];

            // Define layout for the chart
            let layout = {
                title: `Sunburst Chart of Matches for Year: ${selectedYear}`,
            };

            // Create the chart in the chart3Div element
            Plotly.newPlot(chart3Div.node(), data, layout);
        }

    }).catch(error => {
        console.error("Error fetching matches:", error);
    });
}

// Call the initialization function to set up the dropdown menu and charts
init();
