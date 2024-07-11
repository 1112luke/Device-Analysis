import { useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";

import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import Gradient from "javascript-color-gradient";
import "./Die.css";

export default function Device({ device, mode, sethovereddevice }) {
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
        if (hovered) {
            sethovereddevice(device);
        }
    }, [hovered]);

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
        <>
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

                {!!device.stats.ron && mode == "I-V" && (
                    <div>Ron: {device.stats.ron}</div>
                )}

                {!!device.stats.vbk && mode == "Breakdown" && (
                    <div>VBK: {device.stats.vbk}</div>
                )}
            </div>
        </>
    );
}
