import React, { useState } from 'react';
import { cardTemplates } from './cardTemplates';
import type { CardTemplate, CardTemplateField } from './cardTemplates';
import './CardTemplateManager.css';

// Utilidad para clonar el array y evitar mutaciones directas
function cloneTemplates(templates: CardTemplate[]): CardTemplate[] {
  return templates.map(t => ({
    ...t,
    fields: t.fields.map(f => ({ ...f }))
  }));
}

const defaultField: CardTemplateField = { key: '', type: 'text', label: '' };

export default function CardTemplateManager() {
  const [templates, setTemplates] = useState<CardTemplate[]>(cloneTemplates(cardTemplates));
  // Eliminados selectedIdx y editingFieldIdx porque no se usan
  const [newTemplate, setNewTemplate] = useState<CardTemplate>({ name: '', fields: [ { ...defaultField } ] });

  // Editar nombre de plantilla
  const handleNameChange = (idx: number, name: string) => {
    const updated = cloneTemplates(templates);
    updated[idx].name = name;
    setTemplates(updated);
  };

  // Editar campo de plantilla
  const handleFieldChange = (tIdx: number, fIdx: number, key: keyof CardTemplateField, value: string) => {
    const updated = cloneTemplates(templates);
    if (key === 'type') {
      updated[tIdx].fields[fIdx].type = value as 'text' | 'number' | 'date';
    } else {
      updated[tIdx].fields[fIdx][key] = value;
    }
    setTemplates(updated);
  };

  // Agregar campo a plantilla
  const addField = (tIdx: number) => {
    const updated = cloneTemplates(templates);
    updated[tIdx].fields.push({ ...defaultField });
    setTemplates(updated);
  };

  // Eliminar campo de plantilla
  const removeField = (tIdx: number, fIdx: number) => {
    const updated = cloneTemplates(templates);
    updated[tIdx].fields.splice(fIdx, 1);
    setTemplates(updated);
  };

  // Eliminar plantilla
  const removeTemplate = (idx: number) => {
    setTemplates(templates.filter((_, i) => i !== idx));
  };

  // Agregar nueva plantilla
  const addTemplate = () => {
    if (!newTemplate.name.trim()) return;
    setTemplates([...templates, { ...newTemplate, fields: newTemplate.fields.filter(f => f.key) }]);
    setNewTemplate({ name: '', fields: [ { ...defaultField } ] });
  };

  return (
    <div className="template-manager-container">
      <h2>Gestión de plantillas de tarjetas</h2>
      <div className="add-template-section">
        <h3>Agregar nueva plantilla</h3>
        <div className="add-template-fields">
          <input
            type="text"
            placeholder="Nombre de la plantilla"
            value={newTemplate.name}
            onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })}
            style={{ marginRight: 8 }}
          />
          {newTemplate.fields.map((f, i) => (
            <span key={i} className="add-template-fields">
              <input
                type="text"
                placeholder="Clave"
                value={f.key}
                onChange={e => {
                  const fields = [...newTemplate.fields];
                  fields[i].key = e.target.value;
                  setNewTemplate({ ...newTemplate, fields });
                }}
                style={{ width: 80 }}
              />
              <select
                value={f.type}
                onChange={e => {
                  const fields = [...newTemplate.fields];
                  fields[i].type = e.target.value as any;
                  setNewTemplate({ ...newTemplate, fields });
                }}
              >
                <option value="text">Texto</option>
                <option value="number">Número</option>
                <option value="date">Fecha</option>
              </select>
              <input
                type="text"
                placeholder="Etiqueta"
                value={f.label}
                onChange={e => {
                  const fields = [...newTemplate.fields];
                  fields[i].label = e.target.value;
                  setNewTemplate({ ...newTemplate, fields });
                }}
                style={{ width: 120 }}
              />
              <button type="button" onClick={() => {
                setNewTemplate({ ...newTemplate, fields: newTemplate.fields.filter((_, idx) => idx !== i) });
              }}>X</button>
            </span>
          ))}
          <button type="button" className="add-field-btn" onClick={() => setNewTemplate({ ...newTemplate, fields: [...newTemplate.fields, { ...defaultField }] })}>
            + Campo
          </button>
          <button type="button" className="save-template-btn" onClick={addTemplate} style={{ marginLeft: 12 }}>
            Guardar plantilla
          </button>
        </div>
      </div>
      <h3>Plantillas existentes</h3>
      <div className="templates-list">
        {templates.length === 0 && <p>No hay plantillas.</p>}
        {templates.map((t, idx) => (
          <div key={idx} className="template-card">
            <input
              type="text"
              value={t.name}
              onChange={e => handleNameChange(idx, e.target.value)}
            />
            <table className="template-fields-table">
              <thead>
                <tr>
                  <th>Clave</th>
                  <th>Tipo</th>
                  <th>Etiqueta</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {t.fields.map((f, fIdx) => (
                  <tr key={fIdx}>
                    <td>
                      <input
                        type="text"
                        value={f.key}
                        onChange={e => handleFieldChange(idx, fIdx, 'key', e.target.value)}
                        placeholder="Clave"
                        style={{ width: 80 }}
                      />
                    </td>
                    <td>
                      <select
                        value={f.type}
                        onChange={e => handleFieldChange(idx, fIdx, 'type', e.target.value)}
                      >
                        <option value="text">Texto</option>
                        <option value="number">Número</option>
                        <option value="date">Fecha</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={f.label}
                        onChange={e => handleFieldChange(idx, fIdx, 'label', e.target.value)}
                        placeholder="Etiqueta"
                        style={{ width: 120 }}
                      />
                    </td>
                    <td>
                      <button type="button" className="remove-field-btn" onClick={() => removeField(idx, fIdx)}>X</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="add-field-btn" onClick={() => addField(idx)}>
              + Campo
            </button>
            <button type="button" className="remove-template-btn" onClick={() => removeTemplate(idx)}>
              Eliminar plantilla
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
