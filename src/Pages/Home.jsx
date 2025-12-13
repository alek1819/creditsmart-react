import "../css/style.css";
import logo from "../assets/images/creditsmart.svg";
import Card from "../components/Card";
import Footer from "../components/Footer";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfiguracion";

export default function Home() {

    const [credits, setCredits] = useState([]);

    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "creditos"));
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCredits(data);
            } catch (error) {
                console.error("Error obteniendo créditos:", error);
            }
        };

        fetchCredits();
    }, []);

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

                    {credits.length === 0 ? (
                        <p>Cargando productos...</p>
                    ) : (
                        credits.map((credit) => (
                            <Card
                                key={credit.id}
                                icon={credit.icon}
                                titulo={credit.titulo}
                                descripcion={credit.descripcion}
                                tasa={credit.tasa}
                                monto={credit.monto}
                                plazo={credit.plazo}
                            />
                        ))
                    )}
                </section>
            </main>

            <Footer />
        </>
    );
}

