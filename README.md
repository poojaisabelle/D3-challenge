# D3 Challenge - Visualising Demographic Data with D3
---

## Data 

The data used in this challenge is based on the [2014 American Community Survey (ACS) 1-year Estimates](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml).

This dataset incoudes data on rates of income, obseity, poverty, etc. by state. Do note that MOE stands for "Margin Of Error". 

## What was accomplished 
---

### Core Challenge: D3 Dabbler 

![4-scatter](Images/4-scatter.jpg)

The main objective of this core challenge was to create a scatter plot between two of the data variables: `Healthcare vs. Poverty` OR `Smokers vs. Age`. Features included in the scatter plot visualisation include: 

* Each state represented with circle elements 

* State abbreviations in the circles 

* Axes and labels are situated to the left and bottom of the chart 


### Bonus: More Data, More Dynamics 

Out with the static, In with the dynamic! 

![7-animated-scatter](Images/7-animated-scatter.gif)

#### 1: More Data, More Dynamics 

The objective of this challenge was to include more demographics and more risk factors. Features added include:

* Additional labels in the scatter plot that have click events so that users can decide which data to display

* Animated transitions for the circles' locations and the range of the axes


#### 2: Incorporate d3-tip

![8-tooltip](Images/8-tooltip.gif)

The objective of this challenge was to introduce the d3-tip.js plugin and add tooltips to reveal the individual element's data when the user hovers their cursor over the element. Features added include:

* Tooltips to the circles that are displayed with the data that the user has selected




