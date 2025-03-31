import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Calendar, User, FileText, Hash, QrCode } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { QRCodeSVG } from 'qrcode.react';

interface CampaignImage {
  id: string;
  filename: string;
  storage_path: string;
  upload_date: string;
  title: string;
  description: string;
  author: string;
}

export default function Verify() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<CampaignImage | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadImage() {
      try {
        if (!id) return;
        
        // Get image metadata from Supabase
        const { data: imageData, error: dbError } = await supabase
          .from('campaign_images')
          .select('*')
          .eq('id', id)
          .single();

        if (dbError || !imageData) {
          toast.error('Imagen no encontrada');
          return;
        }

        setImage(imageData);

        // Get the image URL from storage
        const { data: { publicUrl }, error: storageError } = supabase
          .storage
          .from('campaign-images')
          .getPublicUrl(imageData.storage_path);

        if (storageError) {
          toast.error('Error al cargar la imagen');
          return;
        }

        setImageUrl(publicUrl);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al cargar la imagen');
      } finally {
        setLoading(false);
      }
    }

    loadImage();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando campaña...</p>
        </div>
      </div>
    );
  }

  if (!image || !imageUrl) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Campaña no encontrada</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            La campaña que intentas verificar no existe o ha sido eliminada
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Campaña verificada
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Esta campaña es auténtica y fue registrada en nuestra plataforma
                </p>
              </div>
            </div>
            <QRCodeSVG 
              value={window.location.href}
              size={100}
              className="bg-white p-2 rounded-lg"
            />
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {image.title || 'Sin título'}
            </h3>
            {image.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {image.description}
              </p>
            )}
            <img
              src={imageUrl}
              alt={image.title || 'Campaña'}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Autor</p>
                <p className="text-gray-900 dark:text-white">{image.author || 'Anónimo'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de publicación</p>
                <p className="text-gray-900 dark:text-white">
                  {format(new Date(image.upload_date), "d 'de' MMMM, yyyy HH:mm", { locale: es })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre del archivo</p>
                <p className="text-gray-900 dark:text-white">{image.filename}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Hash className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ID de la campaña</p>
                <p className="font-mono text-sm text-gray-900 dark:text-white">{image.id}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <QrCode className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Escanea el código QR para verificar esta campaña
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Enlace copiado al portapapeles');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Copiar enlace
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}