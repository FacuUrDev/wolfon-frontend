// Plantillas de atributos frecuentes para cards
// Puedes agregar, editar o eliminar plantillas fácilmente
export interface CardTemplateField {
  key: string;
  type: 'text' | 'number' | 'date';
  label: string;
}

export interface CardTemplate {
  name: string;
  fields: CardTemplateField[];
}

export const cardTemplates: CardTemplate[] = [
  {
    name: 'Carne',
    fields: [
      { key: 'kg', type: 'number', label: 'Kilos' },
      { key: 'precio', type: 'number', label: 'Precio' },
      { key: 'temperatura', type: 'number', label: 'Temperatura de refrigeración' },
      { key: 'vencimiento', type: 'date', label: 'Fecha de vencimiento' }
    ]
  },
  {
    name: 'Fruta',
    fields: [
      { key: 'kg', type: 'number', label: 'Kilos' },
      { key: 'precio', type: 'number', label: 'Precio' },
      { key: 'madurez', type: 'text', label: 'Estado de madurez' }
    ]
  }
  // Puedes agregar más plantillas aquí
];
