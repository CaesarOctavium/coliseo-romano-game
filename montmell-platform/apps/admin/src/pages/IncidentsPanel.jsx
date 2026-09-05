import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import DemoModeButton from '../components/DemoModeButton';
import { useLicense } from '../hooks/useLicense';
import { api } from '../api/client';

export default function IncidentsPanel() {
  const { license, isPremium, isDemoActive, refresh } = useLicense();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadIncidents = () => {
    setLoading(true);
    api
      .listIncidents()
      .then(setIncidents)
      .finally(() => setLoading(false));
  };

  useEffect(loadIncidents, []);

  const handleSeen = async (id) => {
    await api.markSeen(id);
    loadIncidents();
  };

  const handleAssign = async (id) => {
    // In the real Panel IA this would open a picker; here we assign to the
    // first council member for demo purposes.
    await api.assignIncident(id, { assignedToId: null, estimatedTime: '2 horas' });
    loadIncidents();
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Montmell Gestiona</h1>
          <p className="text-sm text-gray-500">Panel de incidencias municipales</p>
        </div>
        <DemoModeButton
          license={license}
          isPremium={isPremium}
          isDemoActive={isDemoActive}
          onActivated={refresh}
        />
      </div>

      {!isPremium && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Plan FREE: solo puedes marcar incidencias como &ldquo;Visto&rdquo;. Activa el Plan PRO
          para asignar responsables, cambiar el estado y generar informes PDF con IA.
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Cargando incidencias...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {incidents.map((incident) => (
            <Card key={incident.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{incident.title}</CardTitle>
                <Badge variant={incident.seen_by_council ? 'default' : 'demo'}>
                  {incident.seen_by_council ? 'Visto' : 'Nuevo'}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p className="text-sm text-gray-600">{incident.description}</p>
                <p className="text-xs text-gray-400">Reportado por {incident.reported_by}</p>

                <div className="mt-2 flex gap-2">
                  <Button variant="outline" onClick={() => handleSeen(incident.id)}>
                    Marcar visto
                  </Button>
                  <Button
                    variant="default"
                    disabled={!isPremium}
                    title={!isPremium ? 'Funcionalidad Premium' : undefined}
                    onClick={() => handleAssign(incident.id)}
                  >
                    Asignar (1 clic)
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
