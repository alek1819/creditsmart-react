import { Link } from "react-router-dom";
import "../css/style.css";
import logo from "../assets/images/creditsmart.svg";

export default function Navbar() {
    return (
        <nav className="nav">
            <div className="container">
                <div className="logo">
                    <img src={logo} alt="CreditSmart Logo" />
                    <span>CreditSmart</span>
                </div>

                <ul className="nav-links">
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/simulador">Buscar crédito</Link></li>
                    <li><Link to="/solicitar">Solicitar crédito</Link></li>
                </ul>
            </div>
        </nav>
    );
}
