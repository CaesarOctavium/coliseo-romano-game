import { useLicense } from '../hooks/useLicense';
import UpgradeBanner from '../components/UpgradeBanner';

export default function Profile({ user }) {
  const { isPremium, loading } = useLicense();

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <h1 className="text-xl font-bold text-gray-900">Mi perfil</h1>

      {!loading && <UpgradeBanner isPremium={isPremium} />}

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-500">Nombre</p>
        <p className="font-medium text-gray-900">{user?.name}</p>
        <p className="mt-2 text-sm text-gray-500">Correo</p>
        <p className="font-medium text-gray-900">{user?.email}</p>
      </div>
    </div>
  );
}
