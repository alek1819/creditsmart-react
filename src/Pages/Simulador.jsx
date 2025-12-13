import "../css/simulador.css";
import Card from "../components/Card";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";

// Firebase
import { db } from "../firebase/firebaseConfiguracion";
import { collection, getDocs } from "firebase/firestore";

export default function Simulador() {
    const [busqueda, setBusqueda] = useState("");
    const [rango, setRango] = useState("");
    const [credits, setCredits] = useState([]);

    
    // Cargar créditos desde Firebase
    
    const fetchCredits = async () => {
        const snapshot = await getDocs(collection(db, "creditos"));
        const data = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
        }));
        setCredits(data);
    };

    useEffect(() => {
        fetchCredits();
    }, []);

    
    // Normalizar montos
    
    const normalizar = credits.map((credit) => {
        const [minStr, maxStr] = credit.monto.split("-");

        const min = parseInt(minStr.replace(/\D/g, "")) * 1000000;
        const max = parseInt(maxStr.replace(/\D/g, "")) * 1000000;

        return {
            ...credit,
            montoMin: min,
            montoMax: max,
        };
    });

    
    // Filtro de búsqueda + rango
    
    const filtrarCreditos = () => {
        return normalizar
            .filter((credit) => {
                // Texto
                const matchText = credit.titulo
                    .toLowerCase()
                    .includes(busqueda.toLowerCase());

                if (!rango) return matchText;

                // Caso: 50M+
                if (rango.endsWith("+")) {
                    const min = parseInt(rango.replace("+", ""));
                    return matchText && credit.montoMax >= min;
                }

                // Rango normal
                const [min, max] = rango.split("-");
                const minR = parseInt(min);
                const maxR = parseInt(max);

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
                {/* === BÚSQUEDA Y FILTROS === */}
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

                {/* === TARJETAS === */}
                <section className="credits-section">
                    {resultados.length === 0 && (
                        <p className="no-result">No se encontraron resultados</p>
                    )}

                    {resultados.map((credit) => (
                        <Card
                            key={credit.id}
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