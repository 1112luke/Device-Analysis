import "chart.js/auto";
import { Chart } from "react-chartjs-2";

export default function Chartbox({ mode, device }) {
    return (
        <>
            <div className="chartbox">
                {device && mode == "I-V" && (
                    <Chart
                        type="line"
                        data={{
                            //x axis
                            labels: device.data.iv[0],
                            datasets: [
                                {
                                    //left axis
                                    label: "I-V",
                                    data: device.data.iv[1],
                                    yAxisID: "left",
                                    borderWidth: 0.01,
                                },
                                {
                                    //right/ron
                                    label: "Ron",
                                    data: device.data.ron[1],
                                    yAxisID: "right",
                                },
                                {
                                    //minron
                                    label: "minRon",
                                    yAxisId: "right",
                                    data: [
                                        { y: device.stats.ron, x: 0 },
                                        { y: device.stats.ron, x: 3 },
                                    ],
                                    pointRadius: 1,
                                },
                                {
                                    //tov
                                    label: "TOV",
                                    yAxisId: "left",
                                    data: [
                                        { x: device.stats.ron, y: 0 },
                                        { x: device.stats.ron, y: 200 },
                                    ],
                                    pointRadius: 1,
                                },
                            ],
                        }}
                        //tjis might be problem
                        options={{
                            aspectRatio: 1,
                            scales: {
                                x: {},
                                y: {
                                    display: false,
                                },
                                left: {
                                    position: "left",
                                },
                                right: {
                                    position: "right",
                                    min: 0,
                                    max: 0.007,
                                },
                            },
                        }}
                    ></Chart>
                )}

{device && mode == "Breakdown" && (
                    <Chart
                    type="line"
                    data={{
                        labels: device.data.breakdown[0],
                        datasets: [
                            {
                                label: "Breakdown",
                                data: device.data.breakdown[1],
                                borderWidth: 2,
                                pointRadius: 1.3,
                            },
                            {
                                label: "Vbk",
                                data: [
                                    {
                                        x: device.stats.vbk,
                                        y: 0.05,
                                    },
                                    { x: device.stats.vbk, y: 10 },
                                ],
                                pointRadius: 1,
                                pointHitRadius: 3,
                            },
                        ],
                    }}
                    options={{
                        aspectRatio: 1,
                        scales: {
                            x: {
                                display: true,
                                max: 0,
                                type: "linear",
                            },
                            y: {
                                type: "logarithmic",
                            },
                        },
                    }}
                ></Chart>
                )}
            </div>
        </>
    );
}
