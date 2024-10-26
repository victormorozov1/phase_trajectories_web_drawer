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

    const trajectory = (x0, y0, steps, dt) => {
        const points = [];
        let x = x0;
        let y = y0;

        for (let i = 0; i < steps; i++) {
            points.push([x, y]);
            const { dx, dy } = system(x, y);
            x += dx * dt;
            y += dy * dt;
        }
        console.log(points);
        return points;
    };

    const trajectories = [
//        trajectory(1, 0, 100, 0.1),
//        trajectory(-1, 0, 100, 0.1),
//        trajectory(0, 1, 100, 0.1),
//        trajectory(0, -1, 100, 0.1),
//        trajectory(30, 30, 1000, 1),
//        trajectory(40, 20, 1000, 1),
//        trajectory(-10, 20, 1000, 1),
        trajectory(10, 10, 7000, 0.001),
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

drawPhasePortrait();
