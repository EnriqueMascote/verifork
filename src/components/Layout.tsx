import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Search, LogIn, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';

export default function Layout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className={`min-h-screen relative ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Watermark */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5 bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${
            theme === 'dark' 
              ? 'https://ebfdrvrppabdeibgeefq.supabase.co/storage/v1/object/public/logos-bucket/MARCA%20DE%20GOBIERNO/MARCA%20DE%20GOBIERNO%20CON%20ESCUDO%20Y%20MARCA%20SOCIAL_Blanco%20y%20color.png'
              : 'https://ebfdrvrppabdeibgeefq.supabase.co/storage/v1/object/public/logos-bucket/MARCA%20SOCIAL/MARCA%20SOCIAL_Grises.png'
          })`,
          backgroundSize: '500px'
        }}
      />
      
      <header className={`relative ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90'} shadow-sm border-b backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src={theme === 'dark' 
                  ? "https://ebfdrvrppabdeibgeefq.supabase.co/storage/v1/object/public/logos-bucket/LOGO%20COORDINACION%20ESCUDO%20Y%20MARCA%20DE%20GOBIERNO/LS_2025_CPD_GRIS.png"
                  : "https://ebfdrvrppabdeibgeefq.supabase.co/storage/v1/object/public/logos-bucket/LOGO%20COORDINACION%20ESCUDO%20Y%20MARCA%20DE%20GOBIERNO/LS_2025_CPD_RGB.png"
                }
                alt="Gobierno de Chihuahua"
                className="h-12 w-auto"
              />
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Verificador de Campañas
              </h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/search"
                className={`group relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${
                  location.pathname === '/search' ? 'bg-gray-200 dark:bg-gray-700' : ''
                }`}
                aria-label="Buscar campañas"
              >
                <Search className={theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} />
                <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Buscar campañas
                </span>
              </Link>
              {session && (
                <Link
                  to="/dashboard"
                  className={`group relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${
                    location.pathname === '/dashboard' ? 'bg-gray-200 dark:bg-gray-700' : ''
                  }`}
                  aria-label="Dashboard"
                >
                  <LayoutDashboard className={theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} />
                  <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Dashboard
                  </span>
                </Link>
              )}
              <button
                onClick={toggleTheme}
                className="group relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Cambiar tema"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="text-gray-200" />
                    <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Modo claro
                    </span>
                  </>
                ) : (
                  <>
                    <Moon className="text-gray-600" />
                    <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Modo oscuro
                    </span>
                  </>
                )}
              </button>
              {session ? (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/upload"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Nueva Campaña
                  </Link>
                  <button
                    onClick={() => supabase.auth.signOut()}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Link
                  to="/upload"
                  className="group relative px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="relative max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}