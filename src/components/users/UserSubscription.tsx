import { useEffect, useState } from 'react';
import { fetchSubscriptionTiers, subscribeUser, Subscription } from '../../api/subscription';

interface UserSubscriptionProps {
  userId: string;
  currentTier?: string;
  onSubscribed?: () => void;
}

export default function UserSubscription({ userId, currentTier, onSubscribed }: UserSubscriptionProps) {
  const [tiers, setTiers] = useState<Subscription[]>([]);
  const [selectedTier, setSelectedTier] = useState(currentTier || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionTiers()
      .then(setTiers)
      .catch(err => setError('No se pudieron cargar los tiers de suscripción.'));
  }, []);

  const handleSubscribe = async () => {
    if (!selectedTier) return;
    setLoading(true);
    setError(null);
    try {
      await subscribeUser(userId, selectedTier);
      if (onSubscribed) onSubscribed();
    } catch (err: any) {
      setError(err.message || 'Error al suscribir usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: '16px 0' }}>
      <label>Suscripción:
        <select
          value={selectedTier}
          onChange={e => setSelectedTier(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          <option value="">Selecciona un tier</option>
          {tiers.map(tier => (
            <option key={tier.tier} value={tier.tier}>
              {tier.display_name || tier.tier}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleSubscribe} disabled={loading || !selectedTier} style={{ marginLeft: 8 }}>
        {loading ? 'Actualizando...' : 'Actualizar suscripción'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}
