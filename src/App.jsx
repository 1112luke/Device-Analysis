import { useEffect, useState } from "react";
import "./App.css";

import Die from "./Die";
import Options from "./Options";
import Radionav from "./Radionav";
import getRon, { getVbk } from "./functions/Calculations";
import Chartbox from "./Chartbox";

function App() {
    const WIDTH = 6;
    const HEIGHT = 8;

    var [devices, setdevices] = useState([]);

    var [dies, setdies] = useState([]);

    //can be "I-V, Breakdown"
    var [mode, setmode] = useState("I-V");

    var [importoptions, setimportoptions] = useState({
        xpos: 25,
        ypos: 27,
        Vcol: 1,
        Icol: 2,
        datamin: 254,
        datamax: 1254,
        datatype: "I-V",
        normalize: true,
        devicearea: 0.00017671458,
    });

    var [hovereddevice, sethovereddevice] = useState();

    useEffect(() => {
        console.log(mode);
    }, [mode]);

    useEffect(() => {
        if (devices.length > 0) {
            console.log(devices);
        }
    }, [devices]);

    useEffect(() => {}, [importoptions]);

    useEffect(() => {
        if (dies.length == 0) {
            makeDie();
        }
    }, []);

    function createDevices() {
        var temparr = [];

        for (var i = 0; i < WIDTH; i++) {
            var col = [];
            for (var j = 0; j < HEIGHT; j++) {
                col[j] = {
                    xpos: i,
                    ypos: j,
                    data: { iv: [], ron: [], breakdown: [] },
                    stats: { ron: 0, vbk: 0 },
                };
            }
            temparr[i] = col;
        }
        setdevices([...devices, temparr]);
    }

    function makeDie() {
        createDevices();
        setdies([...dies, { hey: "hi" }]);
    }

    return (
        <>
            <div className="container">
                <Radionav mode={mode} setmode={setmode}></Radionav>
                <div className="diebox">
                    <div
                        style={{
                            flex: 1,
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Chartbox mode={mode} device={hovereddevice}></Chartbox>
                    </div>
                    <div
                        style={{
                            flex: 3,
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderLeft: "1px solid black",
                        }}
                    >
                        <button
                            onClick={() => {
                                makeDie();
                            }}
                        >
                            {" "}
                            Make Die
                        </button>
                        {dies.map((die, index) => {
                            return (
                                <Die
                                    devices={devices[index]}
                                    setdevices={(newdevices) => {
                                        var tempdevices = [...devices];
                                        tempdevices[index] = newdevices;
                                        setdevices(tempdevices);
                                    }}
                                    importoptions={importoptions}
                                    setimportoptions={setimportoptions}
                                    sethovereddevice={sethovereddevice}
                                    mode={mode}
                                    key={index}
                                ></Die>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
