export default function Options({ importoptions, setimportoptions }) {
    return (
        <>
            <h3>Import Options</h3>
            <hr></hr>
            <div>Data Type</div>
            <select
                value={importoptions.datatype}
                onChange={(e) => {
                    setimportoptions({
                        ...importoptions,
                        datatype: e.target.value,
                    });
                }}
            >
                <option value="I-V">I-V</option>
                <option value="Breakdown">Breakdown</option>
            </select>
            <div>x position</div>
            <input
                value={importoptions.xpos}
                onChange={(e) => {
                    setimportoptions({
                        ...importoptions,
                        xpos: e.target.value,
                    });
                }}
            ></input>

            <div>y position</div>
            <input
                value={importoptions.ypos}
                onChange={(e) => {
                    setimportoptions({
                        ...importoptions,
                        ypos: e.target.value,
                    });
                }}
            ></input>

            <div>Voltage Column</div>
            <input
                value={importoptions.Vcol}
                onChange={(e) => {
                    setimportoptions({
                        ...importoptions,
                        Vcol: e.target.value,
                    });
                }}
            ></input>

            <div>Current Column</div>
            <input
                value={importoptions.Icol}
                onChange={(e) => {
                    setimportoptions({
                        ...importoptions,
                        Icol: e.target.value,
                    });
                }}
            ></input>
            <div></div>

            <div>data min</div>
            <input
                value={importoptions.datamin}
                onChange={(e) => {
                    setimportoptions({
                        ...importoptions,
                        datamin: e.target.value,
                    });
                }}
            ></input>

            <div>data max</div>
            <input
                value={importoptions.datamax}
                onChange={(e) => {
                    setimportoptions({
                        ...importoptions,
                        datamax: e.target.value,
                    });
                }}
            ></input>
            <div></div>
        </>
    );
}
