import "./Loader.scss";


const Loader = () => {
    return (
        <>
            <div className="loader" style={{ marginTop: "50px", display: "flex" }}>
                <img
                    src="https://res.cloudinary.com/dxerpx7nt/image/upload/v1755161171/NRI0_bexqnq.gif"
                    alt="Loading..."
                    style={{ width: "200px", height: "200px", margin: "0 auto" }}
                />
            </div>
        </>
    );
};

export default Loader;
