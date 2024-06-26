import { useEffect, useRef, useState } from "react";
import Device from "./Device";
import "./Die.css";
import Papa from "papaparse";
import { calculateDeviceStats } from "./functions/Calculations";
import Modal from "react-modal";
import Options from "./Options";

export default function Die({
    devices,
    setdevices,
    importoptions,
    setimportoptions,
    sethovereddevice,
    mode,
}) {
    var dieref = useRef();

    var [modelisopen, setmodalisopen] = useState(false);

    var [files, setfiles] = useState();

    Modal.setAppElement(document.getElementById("root"));

    function parsedToArrOfObj(input) {
        var out = [];
        for (var i = 0; i < input[0].length; i++) {
            out.push({ x: input[0][i], y: input[1][i] });
        }
        return out;
    }

    function parseFiles() {
        //parse files
        Promise.all(
            files.map(
                (file) =>
                    new Promise((resolve, reject) =>
                        Papa.parse(file, {
                            complete: resolve, // Resolve each promise
                            error: reject,
                        })
                    )
            )
        ).then((results) => {
            var currdevices = [...devices];
            results.forEach((result, index) => {
                //for each result
                var file = files[index];
                var filename = file.name;

                //get position in die
                var xpos = parseInt(filename[importoptions.xpos]);
                var ypos = parseInt(filename[importoptions.ypos]);

                var output = [[], []];

                //get data
                for (
                    var i = parseInt(importoptions.datamin);
                    i < parseInt(importoptions.datamax);
                    i++
                ) {
                    output[0].push(
                        parseFloat(result.data[i][parseInt(importoptions.Vcol)])
                    );
                    output[1].push(
                        parseFloat(result.data[i][parseInt(importoptions.Icol)])
                    );
                }

                //normalize
                if (importoptions.normalize) {
                    for (var j = 0; j < output[0].length; j++) {
                        output[1][j] = Math.abs(
                            output[1][j] / importoptions.devicearea
                        );
                    }
                }

                switch (importoptions.datatype) {
                    case "I-V":
                        currdevices[xpos][ypos].data.iv = [...output];
                        break;
                    case "Breakdown":
                        currdevices[xpos][ypos].data.breakdown = [...output];
                        break;
                }
            });
            currdevices = calculateDeviceStats(currdevices);
            setdevices(currdevices);
        });
    }

    function handleDrop(e) {
        setfiles([...e.dataTransfer.files]);
        setmodalisopen(true);
    }

    return (
        <>
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
                                        sethovereddevice={sethovereddevice}
                                        mode={mode}
                                    ></Device>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            <Modal
                isOpen={modelisopen}
                style={{
                    content: {
                        width: "50%",
                        margin: "auto",
                        backgroundColor: "rgb(225, 214, 169)",
                        overflow: "hidden",
                    },
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgb(225, 214, 169)",
                    }}
                >
                    <Options
                        importoptions={importoptions}
                        setimportoptions={setimportoptions}
                    ></Options>
                    <button
                        onClick={() => {
                            parseFiles();
                            setmodalisopen(false);
                        }}
                    >
                        Import Data
                    </button>
                </div>
            </Modal>
        </>
    );
}
