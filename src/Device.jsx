import { useEffect, useRef, useState } from "react";

import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import Gradient from "javascript-color-gradient";

export default function Device({ device, mode }) {
    var [hovered, sethovered] = useState(false);

    var gradientarr = useRef(
        new Gradient()
            .setColorGradient("#db1414", "#0acf14")
            .setMidpoint(100)
            .getColors()
    );

    var [vbkbackgroundcolor, setvbkbackgroundcolor] = useState("antiquewhite");
    var [ronbackgroundcolor, setronbackgroundcolor] = useState("antiquewhite");

    useEffect(() => {}, [device.data.iv]);

    useEffect(() => {}, [device.data.breakdown]);

    useEffect(() => {
        setvbkbackgroundcolor(
            gradientarr.current[99 - Math.floor(device.stats.vbkgradient * 99)]
        );
    }, [device.stats.vbkgradient]);

    useEffect(() => {
        setronbackgroundcolor(
            gradientarr.current[99 - Math.floor(device.stats.rongradient * 99)]
        );
    }, [device.stats.rongradient]);

    return (
        <div
            className="device"
            style={{
                backgroundColor: hovered
                    ? "antiquewhite"
                    : mode == "Breakdown"
                    ? vbkbackgroundcolor
                    : mode == "I-V"
                    ? ronbackgroundcolor
                    : "antiquewhite",
            }}
            onMouseOver={() => {
                sethovered(true);
            }}
            onMouseLeave={() => {
                sethovered(false);
            }}
        >
            {`${device.xpos}, ${device.ypos}`}
            {device.data.iv.length > 0 && <div>I have iv data</div>}
            {device.data.breakdown.length > 0 && (
                <div>I have breakdown data</div>
            )}

            {device.data.iv.length > 0 && hovered && mode == "I-V" && (
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
            {!!device.stats.ron && mode == "I-V" && (
                <div>Ron: {device.stats.ron}</div>
            )}

            {!!device.stats.vbk && mode == "Breakdown" && (
                <div>VBK: {device.stats.vbk}</div>
            )}
            {device.data.breakdown.length > 0 &&
                hovered &&
                mode == "Breakdown" && (
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
    );
}
