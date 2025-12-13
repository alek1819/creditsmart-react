import "../css/style.css";
import logo from "../assets/images/creditsmart.svg";
import Card from "../components/Card";
import creditsData from "../data/creditsData";
import Footer from "../components/Footer";

export default function Home() {
    return (
        <>
            {/* Hero */}
            <header className="hero">
                <div className="container">
                    <h1>Bienvenido a CreditSmart</h1>
                    <p>Tu solución para encontrar y solicitar créditos de manera fácil y rápida.</p>
                    <a href="/solicitar" className="btn">Comienza ahora</a>
                </div>
            </header>

            <main className="container">
                <section className="credits-section">
                    <h3>Productos Crediticios</h3>

                    {creditsData.map((credit, index) => (
                        <Card
                            key={index}
                            icon={credit.icon}
                            titulo={credit.titulo}
                            descripcion={credit.descripcion}
                            tasa={credit.tasa}
                            monto={credit.monto}
                            plazo={credit.plazo}
                        />
                    ))}

                </section>
            </main>

            <Footer />
        </>
    );
}
