// eslint-disable-next-line no-unused-vars
function createPlots(response, index) {
  const plotDigest = response.hits[index].recipe.digest;
  const plotYield = response.hits[index].recipe.yield;

  const firstPlot = {
    values: [],
    labels: [],
  };
  const secondPlot = {
    values: [],
    labels: [],
  };
  const thirdPlot = {
    values: [],
    labels: [],
  };
  const fourthPlot = {
    values: [],
    labels: [],
  };

  const ultimateColors = [
    ['#2E5894', '#8FD400', '#9C2542'],
    ['#0095B7', '#2D383A', '#1AB385', '#A50B5E'],
    [
      '#ABAD48',
      '#469496',
      '#436CB9',
      '#469A84',
      '#353839',
      '#2D5DA1',
      '#64609A',
    ],
    [
      '#E97451',
      '#FC80A5',
      '#C62D42',
      '#C9A0DC',
      '#76D7EA',
      '#FF8833',
      '#29AB87',
      '#AF593E',
      '#01786F',
      '#FFCBA4',
      '#FCD667',
      '#ED0A3F',
      '#FBE870',
    ],
  ];

  plotDigest.forEach((nutrient, i) => {
    if (
      nutrient.label === 'Fat'
      || nutrient.label === 'Carbs'
      || nutrient.label === 'Protein'
    ) {
      firstPlot.values.push(nutrient.total / plotYield);
      firstPlot.labels.push(nutrient.label);

      if (nutrient.label === 'Fat') {
        nutrient.sub.forEach(fat => {
          secondPlot.values.push(fat.total / plotYield);
          secondPlot.labels.push(fat.label);
        });
      }
    } else if ((i > 3) && (i < 11)) {
      thirdPlot.values.push(nutrient.total / plotYield);
      thirdPlot.labels.push(nutrient.label);
    } else if ((i > 10) && (i < 24)) {
      fourthPlot.values.push(nutrient.total / plotYield);
      fourthPlot.labels.push(nutrient.label);
    }
  });

  // // process nutrition data
  // const totalNutrients = response.hits[1].recipe.plotDigest;

  // // calculate totalNutrient per serving for our recipe
  // for (const key in totalNutrients) {
  //   if (totalNutrients.hasOwnProperty(key)) {
  //     const val = totalNutrients[key];
  //     const perServing = val.quantity / 8;
  //   }
  // }

  // populate the website with beautiful plots
  const dataOne = [
    {
      values: firstPlot.values,
      labels: firstPlot.labels,
      name: 'Macronutrients',
      hoverinfo: 'label+percent+name',
      hole: 0.6,
      type: 'pie',
      marker: {
        colors: ultimateColors[0],
      },
    },
  ];

  const dataTwo = [
    {
      values: secondPlot.values,
      labels: secondPlot.labels,
      text: 'Fats',
      textposition: 'inside',
      name: 'Lipids',
      hoverinfo: 'label+percent+name',
      hole: 0.6,
      type: 'pie',
      marker: {
        colors: ultimateColors[1],
      },
    },
  ];

  const dataThree = [
    {
      values: thirdPlot.values,
      labels: thirdPlot.labels,
      name: 'Minerals',
      textposition: 'inside',
      hoverinfo: 'label+percent+name',
      hole: 0.6,
      type: 'pie',
    },
  ];

  const dataFour = [
    {
      values: fourthPlot.values,
      labels: fourthPlot.labels,
      text: 'Vitamins',
      textposition: 'inside',
      name: 'Vitamins',
      hoverinfo: 'label+percent+name',
      hole: 0.6,
      type: 'pie',
    },
  ];

  const layoutOne = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    annotations: [
      {
        font: { size: 18, color: '#749541' },
        showarrow: false,
        text: 'Macros',
        x: 0.5,
        y: 0.5,
      },
    ],
    showlegend: false,
    width: 350,
    height: 400,
  };

  const layoutTwo = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    annotations: [
      {
        font: { size: 18, color: '#749541' },
        showarrow: false,
        text: 'Fats',
        x: 0.5,
        y: 0.5,
      },
    ],
    showlegend: false,
    width: 350,
    height: 400,
  };

  const layoutThree = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    annotations: [
      {
        font: { size: 18, color: '#749541' },
        showarrow: false,
        text: 'Minerals',

        x: 0.5,
        y: 0.5,
      },
    ],
    showlegend: false,
    width: 350,
    height: 400,
  };

  const layoutFour = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    annotations: [
      {
        font: { size: 18, color: '#749541' },
        showarrow: false,
        text: 'Vitamins',
        x: 0.5,
        y: 0.5,
      },
    ],
    showlegend: false,
    width: 350,
    height: 400,
  };

  Plotly.newPlot('macros-container', dataOne, layoutOne);
  Plotly.newPlot('fats-container', dataTwo, layoutTwo);
  Plotly.newPlot('minerals-container', dataThree, layoutThree);
  Plotly.newPlot('vitamins-container', dataFour, layoutFour);
}
