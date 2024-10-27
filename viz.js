document.addEventListener("DOMContentLoaded", function() {
    const inputs = ['a11', 'a12', 'a21', 'a22'];

    inputs.forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', function() {
            drawPhasePortrait();
        });
    });

    drawPhasePortrait();
});

function drawPhasePortrait() {
    const a11 = parseFloat(document.getElementById('a11').value);
    const a12 = parseFloat(document.getElementById('a12').value);
    const a21 = parseFloat(document.getElementById('a21').value);
    const a22 = parseFloat(document.getElementById('a22').value);

    const matrix = [[a11, a12], [a21, a22]];
    const eigen = math.eigs(matrix);
    const eigenVectors = eigen.vectors;

    const system = (x, y) => {
        return {
            dx: a11 * x + a12 * y,
            dy: a21 * x + a22 * y,
        };
    };

    const SZ = 50;

    const trajectories = [
        trajectory(40, 40, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(-20, 20, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(10, -10, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(-1, -1, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(0, 0, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(10, 7, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(-15, 5, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(-20, 30, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(2, 7, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(3, 37, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(0, -SZ, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(-SZ, 0, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(SZ, 0, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(0, SZ, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(SZ, SZ, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(-SZ, -SZ, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(SZ, -SZ, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(-SZ, SZ, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(0, 0, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(0, 1, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(1, 0, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(-1, 0, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(0, -1, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(1, 1, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(-1, -1, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(-1, 1, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
        trajectory(1, -1, 70000, 0.001, [-SZ, SZ], [-SZ, SZ], 0.3),
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
        xaxis: { title: 'x', range: [-SZ, SZ]},
        yaxis: { title: 'y', range: [-SZ, SZ]},
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
        if (Math.hypot(x - x0, y - y0) > epsilon) {
            was_far_away = true;
        }
        else if (was_far_away && Math.hypot(x - x0, y - y0) < epsilon) {
            break;
        }
    }
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

Plotly.d3.select(".plotly").on('click', function(d, i) {
   var myPlot = document.getElementById('plot');
   var e = Plotly.d3.event;
   var bg = document.getElementsByClassName('bg')[0];
   var x = ((e.layerX - bg.attributes['x'].value + 4) / (bg.attributes['width'].value)) * (myPlot.layout.xaxis.range[1] - myPlot.layout.xaxis.range[0]) + myPlot.layout.xaxis.range[0];
   var y = ((e.layerY - bg.attributes['y'].value + 4) / (bg.attributes['height'].value)) * (myPlot.layout.yaxis.range[0] - myPlot.layout.yaxis.range[1]) + myPlot.layout.yaxis.range[1];

   if (x.between(myPlot.layout.xaxis.range[0], myPlot.layout.xaxis.range[1]) && y.between(myPlot.layout.yaxis.range[0], myPlot.layout.yaxis.range[1])) {
      Plotly.extendTraces(myPlot, {
         x: [
            [x]
         ],
         y: [
            [y]
         ]
      }, [3]);
   }
});