import { useState } from "react";
import "../css/solicitar.css";
import creditsData from "../data/creditsData";

export default function Solicitar() {
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
    const [solicitudes, setSolicitudes] = useState([]);

    const [mostrarResumen, setMostrarResumen] = useState(false); // <-- Nuevo modal
    const [resumen, setResumen] = useState(null);
    const [success, setSuccess] = useState(false);

   {/* Actualizar formulario */}
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

    {/* Validar campo individual */}
    const validarCampo = (campo, valor) => {
        let msg = "";

        if (!valor) msg = "Este campo es obligatorio";

        if (campo === "email" && valor && !/\S+@\S+\.\S+/.test(valor)) {
            msg = "Correo inválido";
        }

        if (campo === "telefono" && valor && valor.length < 10) {
            msg = "Debe tener mínimo 10 dígitos";
        }

        // Validación monto según tipo
        if (campo === "monto" && form.tipo) {
            const creditoSel = creditsData.find(
                (c) => c.titulo.toLowerCase().includes(form.tipo)
            );

            if (creditoSel) {
                const [minStr, maxStr] = creditoSel.monto
                    .replace(/\$|M| |-/g, "")
                    .split(" ");

                const min = parseInt(minStr) * 1000000;
                const max = parseInt(maxStr) * 1000000;

                if (valor < min || valor > max) {
                    msg = `Monto permitido: ${creditoSel.monto}`;
                }
            }
        }

        // Validación plazo según tipo
        if (campo === "plazo" && form.tipo) {
            const creditoSel = creditsData.find(
                (c) => c.titulo.toLowerCase().includes(form.tipo)
            );

            if (creditoSel) {
                const maxPlazo = parseInt(
                    creditoSel.plazo.replace(/\D/g, "")
                );

                if (valor > maxPlazo) {
                    msg = `Plazo máximo: ${maxPlazo} meses`;
                }
            }
        }

        setErrors((prev) => ({ ...prev, [campo]: msg }));
    };

    {/* Cálculo de cuota */}
    const calcularCuota = (monto, plazo) => {
        if (!monto || !plazo) return setCuota(null);

        const tasaMensual = 0.015; // ejemplo
        const n = parseInt(plazo);
        const M = parseFloat(monto);

        const c = (M * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -n));
        setCuota(Math.round(c));
    };

    // Enviar formulario (antes del modal)
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

    // Confirmar envío final
    const confirmarEnvio = () => {
        setSolicitudes([...solicitudes, resumen]);
        setSuccess(true);

        // limpiar
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
        setMostrarResumen(false);
    };

    return (
        <>
            <div className="form-container">
                <h1 className="form-title">Solicitar Crédito</h1>

                {success && (
                    <p className="success-message">✔️ Solicitud enviada con éxito</p>
                )}

                {/*Formulario*/}
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
                            <option value="">Seleccione un tipo</option>
                            <option value="libre inversión">Crédito Libre Inversión</option>
                            <option value="nómina">Crédito de Nómina</option>
                            <option value="educativo">Crédito Educativo</option>
                            <option value="vehicular">Crédito Vehicular</option>
                            <option value="remodelación">Crédito para Remodelación</option>
                            <option value="empresarial">Crédito Empresarial</option>
                        </select>
                        <p className="error">{errors.tipo}</p>

                        <label>Monto Solicitado</label>
                        <input id="monto" type="number" value={form.monto} onChange={handleChange} />
                        <p className="error">{errors.monto}</p>

                        <label>Plazo</label>
                        <input id="plazo" type="number" value={form.plazo} onChange={handleChange} />
                        <p className="error">{errors.plazo}</p>

                        {cuota && (
                            <p className="cuota-estimada">
                                💰 Cuota estimada: <strong>${cuota.toLocaleString()}</strong>
                            </p>
                        )}

                        <label>Destino</label>
                        <textarea id="destino" value={form.destino} onChange={handleChange}></textarea>
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

                    {/* BOTÓN */}
                    <div className="form-buttons">
                        <button type="submit" className="btn-enviar">Enviar Solicitud</button>
                    </div>
                </form>
            </div>

            {/*MODAL RESUMEN */}
            {mostrarResumen && (
                <div className="resumen-overlay">
                    <div className="resumen-modal">
                        <h2>Resumen de la Solicitud</h2>

                        <div className="resumen-item">
                            <strong>Nombre:</strong> {form.nombre}
                        </div>

                        <div className="resumen-item">
                            <strong>Cédula:</strong> {form.cedula}
                        </div>

                        <div className="resumen-item">
                            <strong>Monto:</strong> ${Number(form.monto).toLocaleString()}
                        </div>

                        <div className="resumen-item">
                            <strong>Plazo:</strong> {form.plazo} meses
                        </div>

                        <div className="resumen-item">
                            <strong>Cuota estimada:</strong> ${cuota?.toLocaleString()}
                        </div>

                        <div className="resumen-buttons">
                            <button className="btn-confirmar" onClick={confirmarEnvio}>Confirmar</button>

                            <button
                                className="btn-cancelar"
                                onClick={() => setMostrarResumen(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
