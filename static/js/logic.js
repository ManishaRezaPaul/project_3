const url = "http://127.0.0.1:5000/data";

// Function to build charts based on the selected year
function buildCharts(selectedYear) {
    // Clear existing charts if any
    // ... your chart creation/update logic here ...
}

// Initialize the page with default id
function init() {
    // Select the dropdown menu using D3
    let dropdownmenu = d3.select("#selDataset");

    // Access sample data using d3
    d3.json(url).then((data) => {
        // Set a variable for the sample year array
        let sampleYears = data.Year;

        // Add each year to the dropdown menu
        sampleYears.forEach((year) => {
            dropdownmenu
                .append("option")
                .text(year)
                .property("value", year);
        });

        // Get the first year as the default value
        let firstYear = sampleYears[0];

        // Log the first_year
        console.log(firstYear);

        // Build the initial charts based on the default year
        buildCharts(firstYear);
    });
}

// Event listener for dropdown change
d3.select("#selDataset").on("change", function () {
    const selectedYear = this.value;
    buildCharts(selectedYear);
});

// Call the initialization function to set up the dashboard
init();


// Call the initialization function to set up the dashboard
init();
