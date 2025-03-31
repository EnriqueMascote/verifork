import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart, Users, Image, Calendar, X, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { QRCodeSVG } from 'qrcode.react';

interface CampaignStats {
  total: number;
  thisMonth: number;
  thisWeek: number;
  today: number;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  author: string;
  upload_date: string;
  filename: string;
  storage_path: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<CampaignStats>({
    total: 0,
    thisMonth: 0,
    thisWeek: 0,
    today: 0
  });
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        // Fetch total campaigns
        const { count: total } = await supabase
          .from('campaign_images')
          .select('*', { count: 'exact', head: true });

        // Fetch this month's campaigns
        const { count: thisMonth } = await supabase
          .from('campaign_images')
          .select('*', { count: 'exact', head: true })
          .gte('upload_date', startOfMonth);

        // Fetch this week's campaigns
        const { count: thisWeek } = await supabase
          .from('campaign_images')
          .select('*', { count: 'exact', head: true })
          .gte('upload_date', startOfWeek);

        // Fetch today's campaigns
        const { count: today } = await supabase
          .from('campaign_images')
          .select('*', { count: 'exact', head: true })
          .gte('upload_date', startOfDay);

        // Fetch recent campaigns
        const { data: recent } = await supabase
          .from('campaign_images')
          .select('*')
          .order('upload_date', { ascending: false })
          .limit(5);

        setStats({
          total: total || 0,
          thisMonth: thisMonth || 0,
          thisWeek: thisWeek || 0,
          today: today || 0
        });

        setRecentCampaigns(recent || []);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const stats_cards = [
    {
      title: 'Total de Campañas',
      value: stats.total,
      icon: <Image className="h-6 w-6 text-blue-600" />,
      description: 'Campañas totales registradas'
    },
    {
      title: 'Este Mes',
      value: stats.thisMonth,
      icon: <Calendar className="h-6 w-6 text-green-600" />,
      description: 'Campañas creadas este mes'
    },
    {
      title: 'Esta Semana',
      value: stats.thisWeek,
      icon: <BarChart className="h-6 w-6 text-purple-600" />,
      description: 'Campañas creadas esta semana'
    },
    {
      title: 'Hoy',
      value: stats.today,
      icon: <Users className="h-6 w-6 text-orange-600" />,
      description: 'Campañas creadas hoy'
    }
  ];

  const openModal = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCampaign(null);
    setModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats_cards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">{card.icon}</div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {card.title}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {card.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
              <div className="text-sm text-gray-500 dark:text-gray-300">
                {card.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Campañas Recientes
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentCampaigns.map((campaign) => (
            <div 
              key={campaign.id} 
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => openModal(campaign)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {campaign.title || 'Sin título'}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {campaign.description || 'Sin descripción'}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Por: {campaign.author || 'Anónimo'}</span>
                    <span>•</span>
                    <span>{format(new Date(campaign.upload_date), "d 'de' MMMM, yyyy", { locale: es })}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 font-mono">
                    ID: {campaign.id}
                  </div>
                </div>
                <div className="ml-4">
                  <QRCodeSVG 
                    value={`${window.location.origin}/verify/${campaign.id}`}
                    size={80}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedCampaign && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={closeModal}
            ></div>

            <div className="inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="px-6 pt-6 pb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {selectedCampaign.title || 'Sin título'}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      {selectedCampaign.description || 'Sin descripción'}
                    </p>
                  </div>
                  <QRCodeSVG 
                    value={`${window.location.origin}/verify/${selectedCampaign.id}`}
                    size={120}
                  />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Autor</h4>
                    <p className="mt-1 text-gray-900 dark:text-white">{selectedCampaign.author || 'Anónimo'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de creación</h4>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {format(new Date(selectedCampaign.upload_date), "d 'de' MMMM, yyyy HH:mm", { locale: es })}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre del archivo</h4>
                    <p className="mt-1 text-gray-900 dark:text-white">{selectedCampaign.filename}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">ID de la campaña</h4>
                    <p className="mt-1 font-mono text-sm text-gray-900 dark:text-white">{selectedCampaign.id}</p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <a
                    href={`/verify/${selectedCampaign.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Ver página de verificación
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}