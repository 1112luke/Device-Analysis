import Navbutton from "./Navbutton";

export default function Radionav({ mode, setmode }) {
    return (
        <div className="radionav">
            <Navbutton name="I-V" mode={mode} setmode={setmode}>
                I-V
            </Navbutton>
            <Navbutton name="Breakdown" mode={mode} setmode={setmode}>
                I-V
            </Navbutton>
        </div>
    );
}
