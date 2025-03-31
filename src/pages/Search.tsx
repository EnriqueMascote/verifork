import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Calendar, Hash } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Campaign {
  id: string;
  title: string;
  author: string;
  upload_date: string;
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'id' | 'date'>('id');
  const [results, setResults] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Initialize search from URL parameters
  useEffect(() => {
    const type = searchParams.get('type') as 'id' | 'date' || 'id';
    const term = searchParams.get('term') || '';
    setSearchType(type);
    setSearchTerm(term);
    if (term) {
      handleSearch(type, term);
    }
  }, [searchParams]);

  const handleSearch = async (type = searchType, term = searchTerm) => {
    try {
      if (!term) {
        setResults([]);
        return;
      }

      setLoading(true);
      let query = supabase.from('campaign_images').select('id, title, author, upload_date');

      if (type === 'id') {
        query = query.ilike('id', `%${term}%`);
      } else {
        // For date search, ensure we're using UTC dates for comparison
        const searchDate = new Date(term + 'T00:00:00Z');
        const nextDay = new Date(searchDate);
        nextDay.setUTCDate(nextDay.getUTCDate() + 1);

        query = query
          .gte('upload_date', searchDate.toISOString())
          .lt('upload_date', nextDay.toISOString());
      }

      const { data, error } = await query.order('upload_date', { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Error al buscar campañas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center mb-8">
          <SearchIcon className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            Buscar Campañas
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Encuentra campañas por ID o fecha de publicación
          </p>
        </div>

        <div className="flex gap-4 mb-6">
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
                setResults([]);
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
                setResults([]);
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
            onClick={() => handleSearch()}
            disabled={loading || !searchTerm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((campaign) => (
              <div
                key={campaign.id}
                onClick={() => navigate(`/verify/${campaign.id}`)}
                className="p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">{campaign.title || 'Sin título'}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Autor: {campaign.author || 'Anónimo'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Fecha: {format(new Date(campaign.upload_date), 'dd/MM/yyyy HH:mm')}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  ID: {campaign.id}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            {loading ? 'Buscando...' : searchTerm ? 'No se encontraron resultados' : 'Ingresa un término de búsqueda'}
          </p>
        )}
      </div>
    </div>
  );
}