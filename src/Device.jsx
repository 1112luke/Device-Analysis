import { useEffect, useRef, useState } from "react";

import "chart.js/auto";
import { Chart } from "react-chartjs-2";

export default function Device({ device }) {
    var [hovered, sethovered] = useState(false);

    useEffect(() => {}, [device.data.iv]);

    useEffect(() => {}, [device.data.breakdown]);

    return (
        <div
            className="device"
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

            {device.data.iv.length > 0 && hovered && (
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
                                label: "turn on",
                                data: [{ x: 1, y: 0.002 }],
                                pointRadius: 10,
                            },
                        ],
                    }}
                    options={{ aspectRatio: 1 }}
                ></Chart>
            )}
        </div>
    );
}
