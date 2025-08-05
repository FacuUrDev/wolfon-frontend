// src/api/subscription.ts
export interface Subscription {
  tier: string;
  name?: string;
  display_name?: string;
  price?: number;
  currency?: string;
  features?: string[];
  state?: {
    active: boolean;
    valid_from: string;
    valid_to?: string;
    status: string;
  };
}

// Obtener todos los tiers de suscripción disponibles
export async function fetchSubscriptionTiers(): Promise<Subscription[]> {
  const response = await fetch('/subscriptions/list');
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
}

// Asignar/cambiar suscripción a un usuario
export async function subscribeUser(userId: string, tier: string, valid_from?: string, valid_to?: string) {
  const response = await fetch('/users/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, tier, valid_from, valid_to }),
  });
  if (!response.ok) throw new Error(await response.text());
}
