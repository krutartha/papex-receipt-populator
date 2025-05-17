import ReceiptForm from '../components/ReceiptForm';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { logout, user } = useAuth();

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Signed in as {user?.email}
            </span>
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Out
            </button>
          </div>
        </div>
        <ReceiptForm />
      </div>
    </main>
  );
}
