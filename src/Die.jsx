import { useEffect, useRef, useState } from "react";
import Device from "./Device";
import "./Die.css";
import Papa from "papaparse";

export default function Die({ devices, setdevices, importoptions, mode }) {
    var dieref = useRef();

    function parsedToArrOfObj(input) {
        var out = [];
        for (var i = 0; i < input[0].length; i++) {
            out.push({ x: input[0][i], y: input[1][i] });
        }
        return out;
    }

    async function handleDrop(e) {
        var currdevices = [...devices];

        //for each file
        for (var i = 0; i < e.dataTransfer.files.length; i++) {
            //get data from file
            var file = e.dataTransfer.files[i];
            var filename = file.name;

            //get position in die
            console.log(filename);
            var xpos = parseInt(filename[importoptions.xpos]);
            var ypos = parseInt(filename[importoptions.ypos]);

            //parse file
            Papa.parse(file, {
                complete: (results) => {
                    console.log("complete");
                    var output = [[], []];

                    //get data
                    for (
                        var i = parseInt(importoptions.datamin);
                        i < parseInt(importoptions.datamax);
                        i++
                    ) {
                        output[0].push(
                            parseFloat(
                                results.data[i][parseInt(importoptions.Vcol)]
                            )
                        );
                        output[1].push(
                            parseFloat(
                                results.data[i][parseInt(importoptions.Icol)]
                            )
                        );
                    }

                    //normalize
                    if (importoptions.normalize) {
                        for (var i = 0; i < output[0].length; i++) {
                            output[1][i] = Math.abs(
                                output[1][i] / importoptions.devicearea
                            );
                        }
                    }

                    switch (importoptions.datatype) {
                        case "I-V":
                            currdevices[xpos][ypos].data.iv = output;
                            break;
                        case "Breakdown":
                            currdevices[xpos][ypos].data.breakdown = output;
                            break;
                    }
                    setdevices(currdevices);
                },
            });
        }
    }

    return (
        <div
            className="die"
            onDrop={(e) => {
                e.preventDefault();
                handleDrop(e);
                dieref.current.style.backgroundColor = "antiquewhite";
            }}
            onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dieref.current.style.backgroundColor = "red";
            }}
            onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dieref.current.style.backgroundColor = "antiquewhite";
            }}
            ref={dieref}
        >
            {devices.map((devicecol, col) => {
                return (
                    <div className="devicecol" key={col}>
                        {devicecol.map((device, row) => {
                            return (
                                <Device
                                    importoptions={importoptions}
                                    device={device}
                                    key={row}
                                    setdevices={setdevices}
                                    mode={mode}
                                ></Device>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}
