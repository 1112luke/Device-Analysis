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

    var [backgroundcolor, setbackgroundcolor] = useState("antiquewhite");

    useEffect(() => {}, [device.data.iv]);

    useEffect(() => {}, [device.data.breakdown]);

    useEffect(() => {
        setbackgroundcolor(
            gradientarr.current[99 - Math.floor(device.stats.vbkgradient * 99)]
        );
    }, [device.stats.vbkgradient]);

    return (
        <div
            className="device"
            style={{
                backgroundColor:
                    mode == "Breakdown" ? backgroundcolor : "antiquewhite",
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
                        labels: device.data.iv[0],
                        datasets: [
                            {
                                label: "I-V",
                                data: device.data.iv[1],
                                borderWidth: 0.01,
                            },
                            {
                                label: "Ron",
                                data: [
                                    { x: device.stats.ron, y: 0 },
                                    { x: device.stats.ron, y: 0.08 },
                                ],
                                pointRadius: 1,
                            },
                        ],
                    }}
                    options={{ aspectRatio: 1 }}
                ></Chart>
            )}

            {device.stats.vbk && mode == "Breakdown" && (
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
