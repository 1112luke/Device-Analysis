import { useEffect, useState } from "react";
import "./App.css";

import Die from "./Die";
import Options from "./Options";
import Radionav from "./Radionav";
import getRon, { getVbk } from "./functions/Calculations";

function App() {
    const WIDTH = 5;
    const HEIGHT = 5;

    var [devices, setdevices] = useState([]);

    //can be "I-V, Breakdown"
    var [mode, setmode] = useState("I-V");

    var [importoptions, setimportoptions] = useState({
        xpos: 24,
        ypos: 26,
        Vcol: 2,
        Icol: 1,
        datamin: 160,
        datamax: 320,
        datatype: "Breakdown",
        normalize: true,
        devicearea: 0.00017671458,
    });

    function calculateDeviceStats() {
        var tempdevices = [...devices];

        //for each device
        //keep track of nuber of stats
        var vbkcount = 0;
        var roncount = 0;
        var maxvbk = -Infinity;
        var maxron = -Infinity;
        var minvbk = Infinity;
        var minron = Infinity;
        for (var i = 0; i < tempdevices.length; i++) {
            for (var j = 0; j < tempdevices[0].length; j++) {
                var device = tempdevices[i][j];

                //if device has iv data
                if (device.data.iv.length > 0) {
                    //calculate linear regression to get x intercept of Ron
                    //calculate turn on voltage
                    var result = getRon(device.data.iv);
                    tempdevices[i][j].stats.ron = result.equation[1];

                    //gradient handling
                    roncount++;
                    if (result.equation[1] < minron) {
                        minron = result.equation[1];
                    }
                    if (result.equation[1] > maxron) {
                        maxron = result.equation[1];
                    }
                }
                //if device has breakdown data
                if (device.data.breakdown.length > 0) {
                    vbkcount++;
                    //get Vbk
                    var vbk = getVbk(device.data.breakdown);
                    console.log(i, j, vbk);
                    tempdevices[i][j].stats.vbk = vbk;

                    //gradient handling
                    vbkcount++;
                    if (vbk < minvbk) {
                        minvbk = vbk;
                    }
                    if (vbk > maxvbk) {
                        maxvbk = vbk;
                    }
                }
            }
        }
        //calculate gradients
        var ronrange = maxron - minron;
        var vbkrange = maxvbk - minvbk;
        console.log(minvbk, maxvbk);
        for (var i = 0; i < tempdevices.length; i++) {
            for (var j = 0; j < tempdevices[0].length; j++) {
                //gradients are values 0-1
                //iv stats
                if (tempdevices[i][j].data.iv.length > 0) {
                    tempdevices[i][j].stats.rongradient =
                        (tempdevices[i][j].stats.ron - minron) / ronrange;
                }

                //breakdown stats
                if (tempdevices[i][j].data.breakdown.length > 0) {
                    tempdevices[i][j].stats.vbkgradient =
                        (tempdevices[i][j].stats.vbk - minvbk) / vbkrange;
                }
            }
        }
    }

    useEffect(() => {
        console.log(mode);
    }, [mode]);

    useEffect(() => {
        if (devices.length > 0) {
            console.log(devices);
            calculateDeviceStats();
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
                    data: { iv: [], breakdown: [] },
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
