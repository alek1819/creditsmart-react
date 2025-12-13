import { useState, useEffect } from "react";
import "../css/solicitar.css";

// Firebase
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";

// Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Solicitar() {
    const [credits, setCredits] = useState([]);

    const [form, setForm] = useState({
        nombre: "",
        cedula: "",
        email: "",
        telefono: "",
        tipo: "",
        monto: "",
        plazo: "",
        destino: "",
        empresa: "",
        cargo: "",
        ingresos: "",
    });

    const [errors, setErrors] = useState({});
    const [cuota, setCuota] = useState(null);
    const [mostrarResumen, setMostrarResumen] = useState(false);
    const [resumen, setResumen] = useState(null);
    const [success, setSuccess] = useState(false);

    
    // Cargar créditos desde Firebase
    
    useEffect(() => {
        const fetchCredits = async () => {
            const snapshot = await getDocs(collection(db, "creditos"));
            const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
            setCredits(data);
        };

        fetchCredits();
    }, []);

    
    // Actualizar formulario
    
    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm({ ...form, [id]: value });

        validarCampo(id, value);

        if (id === "monto" || id === "plazo") {
            calcularCuota(
                id === "monto" ? value : form.monto,
                id === "plazo" ? value : form.plazo
            );
        }
    };


    // Validar campos
    
    const validarCampo = (campo, valor) => {
        let msg = "";

        if (!valor) msg = "Este campo es obligatorio";
        if (campo === "email" && valor && !/\S+@\S+\.\S+/.test(valor)) msg = "Correo inválido";
        if (campo === "telefono" && valor.length < 10) msg = "Debe tener mínimo 10 dígitos";

        const creditoSel = credits.find((c) => c.titulo.toLowerCase().includes(form.tipo));

        // Validar monto
        if (campo === "monto" && creditoSel) {
            const [min, max] = creditoSel.monto.match(/\d+/g).map(Number);
            if (valor < min * 1_000_000 || valor > max * 1_000_000) {
                msg = `Monto permitido: ${creditoSel.monto}`;
            }
        }

        // Validar plazo
        if (campo === "plazo" && creditoSel) {
            const maxPlazo = creditoSel.plazo.match(/\d+/)[0];
            if (valor > parseInt(maxPlazo)) {
                msg = `Plazo máximo: ${maxPlazo} meses`;
            }
        }

        setErrors((prev) => ({ ...prev, [campo]: msg }));
    };

    
    // Cálculo de cuota estimada
    
    const calcularCuota = (monto, plazo) => {
        if (!monto || !plazo) return setCuota(null);

        const tasaMensual = 0.015;
        const n = parseInt(plazo);
        const M = parseFloat(monto);

        const c = (M * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -n));
        setCuota(Math.round(c));
    };

    
    // Mostrar resumen antes de enviar
    
    const handleSubmit = (e) => {
        e.preventDefault();

        let hayErrores = false;
        Object.keys(form).forEach((campo) => {
            validarCampo(campo, form[campo]);
            if (!form[campo]) hayErrores = true;
        });

        if (hayErrores) return;

        setResumen({ ...form, cuota });
        setMostrarResumen(true);
        setSuccess(false);
    };

    
    // Confirmar y guardar en Firebase
    const confirmarEnvio = async () => {
        try {
            await addDoc(collection(db, "solicitudes"), resumen);

            setSuccess(true);
            setMostrarResumen(false);

            //TOAST DE ÉXITO
            toast.success("Solicitud enviada con éxito", {
                position: "top-right",
                autoClose: 3000,
            });

            setForm({
                nombre: "",
                cedula: "",
                email: "",
                telefono: "",
                tipo: "",
                monto: "",
                plazo: "",
                destino: "",
                empresa: "",
                cargo: "",
                ingresos: "",
            });

            setCuota(null);
            setResumen(null);
        } catch (err) {
            console.error("Error al guardar en Firebase:", err);

            toast.error("❌ Error al enviar la solicitud", {
                position: "top-right",
            });
        }
    };

    return (
        <>
            <div className="form-container">
                <h1 className="form-title">Solicitar Crédito</h1>

                <form className="credit-form" onSubmit={handleSubmit}>

                    {/* DATOS PERSONALES */}
                    <section className="form-section">
                        <h2>Datos Personales</h2>

                        <label>Nombre Completo</label>
                        <input id="nombre" value={form.nombre} onChange={handleChange} />
                        <p className="error">{errors.nombre}</p>

                        <label>Cédula</label>
                        <input id="cedula" type="number" value={form.cedula} onChange={handleChange} />
                        <p className="error">{errors.cedula}</p>

                        <label>Email</label>
                        <input id="email" type="email" value={form.email} onChange={handleChange} />
                        <p className="error">{errors.email}</p>

                        <label>Teléfono</label>
                        <input id="telefono" type="tel" value={form.telefono} onChange={handleChange} />
                        <p className="error">{errors.telefono}</p>
                    </section>

                    {/* DATOS DEL CRÉDITO */}
                    <section className="form-section">
                        <h2>Datos del Crédito</h2>

                        <label>Tipo de Crédito</label>
                        <select id="tipo" value={form.tipo} onChange={handleChange}>
                            <option value="">Seleccione</option>
                            {credits.map((c) => (
                                <option key={c.id} value={c.titulo.toLowerCase()}>
                                    {c.titulo}
                                </option>
                            ))}
                        </select>

                        <p className="error">{errors.tipo}</p>

                        <label>Monto</label>
                        <input id="monto" type="number" value={form.monto} onChange={handleChange} />
                        <p className="error">{errors.monto}</p>

                        <label>Plazo (meses)</label>
                        <input id="plazo" type="number" value={form.plazo} onChange={handleChange} />
                        <p className="error">{errors.plazo}</p>

                        {cuota && (
                            <p className="cuota-estimada">
                                💰 Cuota estimada: <b>${cuota.toLocaleString()}</b>
                            </p>
                        )}

                        <label>Destino</label>
                        <textarea id="destino" value={form.destino} onChange={handleChange} />
                        <p className="error">{errors.destino}</p>
                    </section>

                    {/* DATOS LABORALES */}
                    <section className="form-section">
                        <h2>Datos Laborales</h2>

                        <label>Empresa</label>
                        <input id="empresa" value={form.empresa} onChange={handleChange} />
                        <p className="error">{errors.empresa}</p>

                        <label>Cargo</label>
                        <input id="cargo" value={form.cargo} onChange={handleChange} />
                        <p className="error">{errors.cargo}</p>

                        <label>Ingresos Mensuales</label>
                        <input id="ingresos" type="number" value={form.ingresos} onChange={handleChange} />
                        <p className="error">{errors.ingresos}</p>
                    </section>

                    <div className="form-buttons">
                        <button className="btn-enviar">Enviar Solicitud</button>
                    </div>
                </form>
            </div>

            {/* MODAL */}
            {mostrarResumen && (
                <div className="resumen-overlay">
                    <div className="resumen-modal">
                        <h2>Confirmar Solicitud</h2>

                        <p><b>Nombre:</b> {form.nombre}</p>
                        <p><b>Cédula:</b> {form.cedula}</p>
                        <p><b>Monto:</b> ${Number(form.monto).toLocaleString()}</p>
                        <p><b>Plazo:</b> {form.plazo} meses</p>
                        <p><b>Cuota:</b> ${cuota?.toLocaleString()}</p>

                        <div className="resumen-buttons">
                            <button className="btn-confirmar" onClick={confirmarEnvio}>Confirmar</button>
                            <button className="btn-cancelar" onClick={() => setMostrarResumen(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST CONTAINER */}
            <ToastContainer />
        </>
    );
}
