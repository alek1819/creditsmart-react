export default function Card({ icon, titulo, descripcion, tasa, monto, plazo }) {
    return (
        <div className="credit-card">
            <div className="card-header">
                <span className="icon"><i className={icon}></i></span>
                <h3>{titulo}</h3>
            </div>

            <p>{descripcion}</p>

            <div className="details">
                <div className="detail-item">
                    <span className="label">Tasa de interés:</span>
                    <span className="value highlight">{tasa}</span>
                </div>
                <div className="detail-item">
                    <span className="label">Monto:</span>
                    <span className="value">{monto}</span>
                </div>
                <div className="detail-item">
                    <span className="label">Plazo:</span>
                    <span className="value">{plazo}</span>
                </div>
            </div>

            <button className="btn-primary">Solicitar Ahora</button>
        </div>
    );
}
