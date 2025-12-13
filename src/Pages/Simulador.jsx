import "../css/simulador.css";
import creditsData from "../data/creditsData";
import Card from "../components/Card";
import { useState } from "react";
import Footer from "../components/Footer";

export default function Simulador() {
    const [busqueda, setBusqueda] = useState("");
    const [rango, setRango] = useState("");

    // ---- Normalizar montos para poder filtrarlos bien ----
    const normalizarCreditos = creditsData.map((credit) => {
        const [minStr, maxStr] = credit.monto.split("-");

        const min = parseInt(minStr.replace(/\D/g, "")) * 1000000;
        const max = parseInt(maxStr.replace(/\D/g, "")) * 1000000;

        return {
            ...credit,
            montoMin: min,
            montoMax: max,
        };
    });

    // ---- Filtro de búsqueda + rango ----
    const filtrarCreditos = () => {
        return normalizarCreditos
            .filter((credit) => {
                const matchText = credit.titulo
                    .toLowerCase()
                    .includes(busqueda.toLowerCase());

                if (!rango) return matchText;

                // Filtro por rango
                const [min, max] = rango.split("-");
                const minR = parseInt(min); // Ya viene en pesos
                const maxR = max ? parseInt(max) : null;

                if (maxR === null) {
                    // Caso: 50000000+ (más de 50M)
                    return matchText && credit.montoMax >= minR;
                }

                return (
                    matchText &&
                    credit.montoMin >= minR &&
                    credit.montoMax <= maxR
                );
            })
            .sort((a, b) => a.montoMin - b.montoMin);
    };

    const resultados = filtrarCreditos();

    return (
        <>
            <header className="header">
                <h1>Simulador de Crédito</h1>
            </header>

            <main className="contenedor">
                {/* --- BÚSQUEDA Y FILTROS --- */}
                <section className="busqueda">
                    <h2>Buscar Crédito</h2>

                    <div className="filtros">
                        <input
                            type="text"
                            placeholder="Buscar por nombre del producto..."
                            className="input-busqueda"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />

                        <select
                            className="select-rango"
                            value={rango}
                            onChange={(e) => setRango(e.target.value)}
                        >
                            <option value="">Filtrar por monto</option>

                            <option value="0-5000000">Hasta $5.000.000</option>
                            <option value="5000000-20000000">$5M – $20M</option>
                            <option value="20000000-50000000">$20M – $50M</option>
                            <option value="50000000+">Más de $50M</option>
                        </select>

                        <button className="btn-filtrar">Filtrar</button>
                    </div>
                </section>

                {/* --- TARJETAS --- */}
                <section className="credits-section">
                    {resultados.length === 0 && (
                        <p className="no-result">No se encontraron resultados</p>
                    )}

                    {resultados.map((credit, index) => (
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
