import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createCard } from '../../api';
import { cardTemplates } from './cardTemplates';
import './CreateCard.css';

function CreateCard() {
  const { _id: userId } = useParams<{ _id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  // Campos dinámicos: key, value, type, label
  const [fields, setFields] = useState<{ key: string, value: string, type?: string, label?: string }[]>([{ key: '', value: '', type: 'text' }]);

  // Cambiar plantilla
  const handleTemplateChange = (templateName: string) => {
    setSelectedTemplate(templateName);
    const template = cardTemplates.find(t => t.name === templateName);
    if (template) {
      setFields(template.fields.map(f => ({ ...f, value: '' })));
    } else {
      setFields([{ key: '', value: '', type: 'text' }]);
    }
  };

  // Agregar un nuevo campo dinámico
  const addField = () => setFields([...fields, { key: '', value: '', type: 'text' }]);

  // Editar un campo dinámico
  const handleFieldChange = (i: number, key: string, value: string) => {
    const newFields = [...fields];
    (newFields[i] as any)[key] = value;
    setFields(newFields);
  };

  // Eliminar un campo dinámico
  const removeField = (i: number) => {
    setFields(fields.filter((_, idx) => idx !== i));
  };
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userId) {
      setError('No se ha especificado un ID de usuario.');
      return;
    }
    if (!title.trim()) {
      setError('El título es obligatorio.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Construir objeto con campos base y dinámicos y validar tipos
      const extra: Record<string, any> = {};
      for (const f of fields) {
        if (f.key) {
          if (f.type === 'number') {
            const num = Number(f.value);
            if (isNaN(num)) {
              setError(`El campo ${f.label || f.key} debe ser un número`);
              setLoading(false);
              return;
            }
            extra[f.key] = num;
          } else if (f.type === 'date') {
            // Validación básica de fecha
            if (!/^\d{4}-\d{2}-\d{2}/.test(f.value)) {
              setError(`El campo ${f.label || f.key} debe ser una fecha válida (YYYY-MM-DD)`);
              setLoading(false);
              return;
            }
            extra[f.key] = f.value;
          } else {
            extra[f.key] = f.value;
          }
        }
      }
      await createCard({
        title,
        description,
        user_id: userId,
        ...extra,
      });
      // Redirige a la lista de tarjetas del usuario si la creación es exitosa
      navigate(`/users/${userId}/cards`);
    } catch (err: any) {
      // Este bloque se ejecuta si la API devuelve un error o si hay un problema al procesar la respuesta.
      console.error('Detalles del error:', err);
      if (err instanceof SyntaxError) {
        // Este error ocurre si el backend devuelve una respuesta vacía o no-JSON.
        setError('La creación fue exitosa, pero hubo un error al procesar la respuesta del servidor.');
      } else {
        setError('Error al crear la tarjeta. Por favor, inténtalo de nuevo.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-card-container">
      <form onSubmit={handleSubmit} className="create-card-form">
        <h2>Crear Nueva Tarjeta</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>
        {/* Plantilla de atributos frecuentes */}
        <div className="form-group">
          <label>Plantilla de atributos frecuentes</label>
          <select value={selectedTemplate} onChange={e => handleTemplateChange(e.target.value)} disabled={loading} style={{ marginLeft: 8 }}>
            <option value="">Sin plantilla</option>
            {cardTemplates.map(t => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>
        {/* Campos dinámicos mejorados */}
        <div className="form-group">
          <label>Atributos personalizados</label>
          {fields.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Nombre del atributo (ej: kg, precio, vencimiento)"
                value={f.key}
                onChange={e => handleFieldChange(i, 'key', e.target.value)}
                required
                disabled={loading || (!!selectedTemplate && !!cardTemplates.find(t => t.name === selectedTemplate)?.fields[i])}
                style={f.type ? { fontWeight: 'bold' } : {}}
              />
              <input
                type={f.type || 'text'}
                placeholder={f.label || 'Valor'}
                value={f.value}
                onChange={e => handleFieldChange(i, 'value', e.target.value)}
                required
                disabled={loading}
              />
              {/* Solo permite eliminar si no es de plantilla */}
              {(!selectedTemplate || !cardTemplates.find(t => t.name === selectedTemplate)?.fields[i]) && (
                <button type="button" onClick={() => removeField(i)} disabled={loading} style={{ color: 'red', fontWeight: 'bold' }}>X</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addField} disabled={loading} style={{ marginTop: 4 }}>
            Agregar atributo
          </button>
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creando...' : 'Crear'}
        </button>
        <Link to={`/users/${userId}/cards`} className="back-link">Volver a las tarjetas</Link>
      </form>
    </div>
  );
}

export default CreateCard;
// ...mueve el contenido de CreateCard.tsx aquí...
