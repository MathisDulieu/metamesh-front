import { Link } from "react-router-dom";
import catImage from "../assets/img/funny-cat.png";
import "../assets/css/error.css";

function Error() {
    document.title = "Not Found - MetaMesh";
    return (
        <div className="error-container">
            <img src={catImage} alt="Funny Cat" className="error-image" />
            <div className="error-text-container">
                <h1 className="error-title">Are you lost?</h1>
                <p className="error-message">
                    Go back to the <Link to="/" className="error-link">Home Page</Link>.
                </p>
            </div>
        </div>
    );
}

export default Error;
