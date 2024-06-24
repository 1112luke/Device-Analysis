import { useEffect, useState } from "react";
import "./App.css";

import Die from "./Die";
import Options from "./Options";

function App() {
    const WIDTH = 5;
    const HEIGHT = 5;

    var [devices, setdevices] = useState([]);

    var [importoptions, setimportoptions] = useState({
        xpos: 25,
        ypos: 27,
        Vcol: 1,
        Icol: 2,
        datamin: 255,
        datamax: 800,
        datatype: "I-V",
    });

    function calculateDeviceStats() {
        var tempdevices = [...devices];

        for (var i = 0; i < tempdevices.length; i++) {
            for (var j = 0; j < tempdevices[0].length; j++) {
                var device = tempdevices[i][j];

                //if device has iv data
                if (device.data.iv) {
                    //calculate turn on voltage
                    //calculate Ron
                }
                //if device has breakdown data
                if (device.data.breakdown) {
                }
            }
        }
    }

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
                    <Die
                        devices={devices}
                        setdevices={setdevices}
                        importoptions={importoptions}
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
