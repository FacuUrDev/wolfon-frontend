import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCardById, type Card } from '../../api';
import './CardDetail.css';

function CardDetail() {
  const { id } = useParams();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!id) return;
        const dataFromApi: any = await fetchCardById(id);
        console.log('Datos de la tarjeta recibidos:', dataFromApi);
        setCard({ ...dataFromApi, id: dataFromApi.id || dataFromApi._id });
      } catch (err: any) {
        setError('No se pudo cargar la tarjeta');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="card-detail-container">Cargando...</div>;
  if (error) return <div className="card-detail-container">{error}</div>;
  if (!card) return <div className="card-detail-container">Tarjeta no encontrada</div>;

  return (
    <div className="card-detail-container">
      <div className="card-detail-card">
        <h1>{card.title}</h1>
        <p>{card.description}</p>
        <p><strong>Usuario:</strong> {card.user_id}</p>
        <Link to={"/users/" + card.user_id + "/cards"} className="back-link">Volver a las tarjetas</Link>
      </div>
    </div>
  );
}

export default CardDetail;
// ...mueve el contenido de CardDetail.tsx aquí...
