// Load data from hours-of-tv-watched.csv
d3.csv("./data.csv").then(function(censusData) {

    console.log(censusData);
  
}).catch(function(error) {
    console.log(error);
});
  