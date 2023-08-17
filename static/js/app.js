url = "http://127.0.0.1:5000/data"

d3.json(url).then((data) => {
    console.log(data)
});

// Initialize the page with default id
function init () {
  
    // Select the dropdown menu using D3
    let dropdownmenu = d3.select("#selDataset");


    // Access sample data using d3
    d3.json(url).then((data) => {
    
        // Set a variable for the sample year
        let sampleyear = data.Year;

        // Add each name to the dropdown menu
        sampleyear.forEach((year) => {
        dropdownmenu
        .append("option")
        .text(year)
        .property("value", year);
    
        });

        // Add first name as the default value
        let first_match = sampleyear[0];
            
        // Log the irst_value
        console.log(first_match);

        // Build the initial plots
        buildtable(first_match);
        buildchart(first_match);

    });
}
// Initialize the dashboard
// init ();