import React, { useState } from 'react';
import { Shield, Search as SearchIcon, QrCode, Calendar, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'id' | 'date'>('id');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchTerm) return;
    navigate(`/search?type=${searchType}&term=${searchTerm}`);
  };

  const features = [
    {
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      title: 'Protección Avanzada',
      description: 'Protege a tus destinatarios contra el phishing y garantiza la autenticidad de tus comunicaciones por correo electrónico.'
    },
    {
      icon: <SearchIcon className="h-6 w-6 text-green-600" />,
      title: 'Verificación Simple',
      description: 'Proceso de verificación sencillo y rápido para tus destinatarios. Un clic para confirmar la autenticidad.'
    },
    {
      icon: <QrCode className="h-6 w-6 text-purple-600" />,
      title: 'Códigos QR',
      description: 'Genera códigos QR únicos para cada campaña, facilitando la verificación desde dispositivos móviles.'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
          Verificador de Campañas
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Sistema de verificación de autenticidad para campañas por correo electrónico de Gobierno del Estado de Chihuahua
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            onClick={() => document.getElementById('tutorial')?.scrollIntoView({ behavior: 'smooth' })}
            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Ver Tutorial
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Verificar una campaña
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Ingresa el ID o la fecha de la campaña que deseas verificar
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              {searchType === 'date' ? (
                <input
                  type="date"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              ) : (
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por ID..."
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              )}
            </div>
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => {
                  setSearchType('id');
                  setSearchTerm('');
                }}
                className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                  searchType === 'id'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <Hash className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setSearchType('date');
                  setSearchTerm('');
                }}
                className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                  searchType === 'date'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleSearch}
              disabled={!searchTerm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="absolute top-6 left-6">{feature.icon}</div>
              <h3 className="mt-8 text-xl font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tutorial Section */}
      <div id="tutorial" className="py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            ¿Cómo funciona?
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Inicia sesión
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Accede a tu cuenta para comenzar a crear y gestionar campañas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Crea una campaña
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Sube la imagen de tu campaña y proporciona los detalles necesarios.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Comparte el enlace
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Obtén un enlace único y código QR para compartir con tus destinatarios.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Verifica la autenticidad
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Los destinatarios pueden verificar fácilmente la autenticidad de la campaña.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}