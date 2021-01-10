function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = sampleData.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleIds = result.otu_ids;
    var sampleLabels = result.otu_labels;
    var sampleValues = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var xticks = sampleValues.slice(0,10).reverse();
    var yticks = sampleIds.slice(0,10).map(ID => "OTU " + ID).reverse();
    var textdata = sampleLabels.slice(0,10).reverse();

    console.log(xticks)
    console.log(yticks)

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: xticks,
      y: yticks,
      type: "bar",
      text: textdata,
      orientation: "h"
    };
    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData ,barLayout);

    // 1. Create the trace for the bubble chart.
    var trace = {
      type: "bubble",
      x: sampleIds,
      y: sampleValues,
      text: sampleLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: sampleIds,
        colorscale: "Viridis"
  

      }
    };

    var bubbleData = [trace];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {
        title: 'OTU ID'
      },
      hovermode: "closest",
      hoverlabel: sampleIds, sampleLabels, sampleValues,

    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)

    // Gauge 
    
    // Gauge Variables 
    // 1. Create a variable that filters the meta data for an object array that matches the id
    var metadataArray = data.metadata.filter(sampleObject => sampleObject.id == sample);

    // 2. Create a variable that holds the first sample in the array 
    var metadataResult = metadataArray[0];

    // 3. Create a variable that converts the washing frequency to floating point 
    var washingFrequency = metadataResult.wfreq
    // 4. 

    console.log(washingFrequency)

    var  trace ={
      value: washingFrequency,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "Scrubs per Week"},
      gauge:{
        axis: {
          range: [0, 10]
        },
        bar: {color: "black"},
        steps: [
          {range: [0,2], color: "red"},
          {range: [2,4], color: "orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "blue"},
          {range: [8,10], color: "green"}
        ]
      }
    }
    // 4. Create the trace for the gauge chart.
    var gaugeData = [trace];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     title: "Belly Button Washing Frequency"
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
 

    