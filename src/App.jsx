import { useEffect, useState } from "react";
import "./App.css";

import Die from "./Die";
import Options from "./Options";
import Radionav from "./Radionav";
import getRon, { getVbk } from "./functions/Calculations";

function App() {
    const WIDTH = 6;
    const HEIGHT = 8;

    var [devices, setdevices] = useState([]);

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
        createDevices();
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
        setdevices(temparr);
    }

    return (
        <>
            <div className="container">
                <div className="left">
                    <Radionav mode={mode} setmode={setmode}></Radionav>
                    <Die
                        devices={devices}
                        setdevices={setdevices}
                        importoptions={importoptions}
                        mode={mode}
                    ></Die>
                </div>
                <div className="right">
                    <Options
                        importoptions={importoptions}
                        setimportoptions={setimportoptions}
                    ></Options>
                </div>
            </div>
        </>
    );
}

export default App;
