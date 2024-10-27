//document.addEventListener("DOMContentLoaded", function() {

    // Добавляем обработчик событий
//    var plot = document.getElementById('plot');
//    plot.on('plotly_click', function(data) {
//        var xCoord = data.points[0].x;
//        var yCoord = data.points[0].y;
//        console.log(xCoord, yCoord);
//        console.log(data)
//        animateTrajectory(xCoord, yCoord);
//    });
//});

function drawPhasePortrait() {
    const a11 = parseFloat(document.getElementById('a11').value);
    const a12 = parseFloat(document.getElementById('a12').value);
    const a21 = parseFloat(document.getElementById('a21').value);
    const a22 = parseFloat(document.getElementById('a22').value);

    const matrix = [[a11, a12], [a21, a22]];
    // Расчёт собственных значений и собственных векторов
    const eigen = math.eigs(matrix);
    console.log(eigen);
    const eigenVectors = eigen.vectors;

    const system = (x, y) => {
        return {
            dx: a11 * x + a12 * y,
            dy: a21 * x + a22 * y,
        };
    };

//    const trajectory = (x0, y0, steps, dt) => {
//        const points = [];
//        let x = x0;
//        let y = y0;
//
//        for (let i = 0; i < steps; i++) {
//            points.push([x, y]);
//            const { dx, dy } = system(x, y);
//            x += dx * dt;
//            y += dy * dt;
//        }
//        return points;
//    };

    const trajectories = [
//        trajectory(1, 0, 100, 0.1),
//        trajectory(-1, 0, 100, 0.1),
//        trajectory(0, 1, 100, 0.1),
//        trajectory(0, -1, 100, 0.1),
//        trajectory(30, 30, 1000, 1),
//        trajectory(40, 20, 1000, 1),
//        trajectory(-10, 20, 1000, 1),
        trajectory(10, 10, 700000, 0.001, [-50, 50], [-50, 50], 0.1),
    ];

    const plotData = trajectories.map(traj => ({
        x: traj.map(p => p[0]),
        y: traj.map(p => p[1]),
        mode: 'lines',
        type: 'scatter',
    }));

    eigenVectors.forEach(vector => {
        const scale = 1;
        const vecPlot = {
            x: [0, vector[0] * scale],
            y: [0, vector[1] * scale],
            mode: 'lines+markers',
            marker: { size: 6 },
            line: { color: 'red', width: 3 }
        };
        plotData.push(vecPlot);
    });

    Plotly.newPlot('plot', plotData, {
        xaxis: { title: 'x', range: [-50, 50] },
        yaxis: { title: 'y', range: [-50, 50    ] },
        title: 'Фазовый портрет автономной системы',
    });
}


function trajectory(x0, y0, maxSteps, dt, xRange, yRange, epsilon) {
    const points = [];
    let x = x0;
    let y = y0;
    let was_far_away = false;

    for (let i = 0; i < maxSteps; i++) {
        points.push([x, y]);

        const { dx, dy } = system(x, y);
        x += dx * dt;
        y += dy * dt;

        if (x < xRange[0] || x > xRange[1] || y < yRange[0] || y > yRange[1]) {
            break;
        }
        //console.log(x, y, x0, y0, Math.hypot(x - x0, y - y0))
        if (Math.hypot(x - x0, y - y0) > epsilon) {
            was_far_away = true;
        }
        else if (was_far_away && Math.hypot(x - x0, y - y0) < epsilon) {
            break;
        }
    }
    console.log(points);
    return points;
}


function animateTrajectory(xStart, yStart) {
    const traj = trajectory(xStart, yStart, 100, 0.1);
    const xCoords = traj.map(p => p[0]);
    const yCoords = traj.map(p => p[1]);

    var update = {
        x: [[...xCoords]],
        y: [[...yCoords]]
    };

    Plotly.addTraces('plot', [{
        x: xCoords,
        y: yCoords,
        mode: 'lines',
        line: { color: 'blue' }
    }]);
}

function system(x, y) {
    const a11 = parseFloat(document.getElementById('a11').value);
    const a12 = parseFloat(document.getElementById('a12').value);
    const a21 = parseFloat(document.getElementById('a21').value);
    const a22 = parseFloat(document.getElementById('a22').value);

    return {
        dx: a11 * x + a12 * y,
        dy: a21 * x + a22 * y,
    };
}

drawPhasePortrait();

Number.prototype.between = function(min, max) {
   return this >= min && this <= max;
};

// Click event to add a new point
Plotly.d3.select(".plotly").on('click', function(d, i) {
   var myPlot = document.getElementById('plot');
   var e = Plotly.d3.event;
   var bg = document.getElementsByClassName('bg')[0];
   var x = ((e.layerX - bg.attributes['x'].value + 4) / (bg.attributes['width'].value)) * (myPlot.layout.xaxis.range[1] - myPlot.layout.xaxis.range[0]) + myPlot.layout.xaxis.range[0];
   var y = ((e.layerY - bg.attributes['y'].value + 4) / (bg.attributes['height'].value)) * (myPlot.layout.yaxis.range[0] - myPlot.layout.yaxis.range[1]) + myPlot.layout.yaxis.range[1];

   // Check if the clicked point is within the plot range
   if (x.between(myPlot.layout.xaxis.range[0], myPlot.layout.xaxis.range[1]) && y.between(myPlot.layout.yaxis.range[0], myPlot.layout.yaxis.range[1])) {
      Plotly.extendTraces(myPlot, {
         x: [
            [x]
         ],
         y: [
            [y]
         ]
      }, [3]); // Add new point to the empty trace
   }
   console.log(x, y);
});