import { useEffect, useState } from 'react';
import { api } from '../api/client';

const STATUS_LABELS = {
  pending: 'En revision',
  resolved: 'Resuelta',
  PENDING: 'Pendiente',
  IN_REVIEW: 'En revision',
  ASSIGNED: 'Asignada',
  RESOLVED: 'Resuelta',
};

export default function IncidentDetail({ incidentId }) {
  const [incident, setIncident] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getIncident(incidentId)
      .then(setIncident)
      .catch(setError);
  }, [incidentId]);

  if (error) return <p className="text-red-600">No se pudo cargar la incidencia.</p>;
  if (!incident) return <p className="text-gray-500">Cargando...</p>;

  const isDetailed = 'assigned_to' in incident;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{incident.title}</h2>
      <p className="mt-1 text-sm text-gray-600">
        Estado: <span className="font-medium">{STATUS_LABELS[incident.status] || incident.status}</span>
      </p>

      {isDetailed ? (
        <div className="mt-3 space-y-1 text-sm text-gray-700">
          <p>
            Atendido por:{' '}
            <span className="font-medium">{incident.assigned_to || 'Sin asignar'}</span>
          </p>
          {incident.estimated_time && (
            <p>
              Tiempo estimado: <span className="font-medium">{incident.estimated_time}</span>
            </p>
          )}
          {incident.last_comment && (
            <p className="italic text-gray-500">&ldquo;{incident.last_comment}&rdquo;</p>
          )}
        </div>
      ) : (
        <p className="mt-3 text-sm text-gray-500">
          Tu ayuntamiento aun no ha activado el seguimiento detallado de incidencias.
        </p>
      )}
    </div>
  );
}
