export default function Navbutton({ name, mode, setmode }) {
    return (
        <a
            className="navbutton"
            onClick={() => {
                setmode(name);
            }}
            style={{
                display: "flex",
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                fontSize: name == mode ? "25px" : "15px",
                cursor: "pointer",
                borderRight: "20px",
                backgroundColor: name == mode ? "lightgrey" : "antiquewhite",
            }}
        >
            <p
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {name}
            </p>
        </a>
    );
}
