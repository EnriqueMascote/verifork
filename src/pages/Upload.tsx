import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import Auth from '../components/Auth';

export default function Upload() {
  const [uploading, setUploading] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      
      if (!file) return;

      if (!formData.title || !formData.author) {
        toast.error('Por favor complete el título y autor de la campaña');
        return;
      }

      const uniqueId = crypto.randomUUID();
      const ext = file.name.split('.').pop();
      const path = `campaigns/${uniqueId}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('campaign-images')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('campaign_images')
        .insert([
          {
            id: uniqueId,
            filename: file.name,
            storage_path: path,
            upload_date: new Date().toISOString(),
            user_id: session?.user?.id,
            title: formData.title,
            description: formData.description,
            author: formData.author
          },
        ]);

      if (dbError) throw dbError;

      const verifyUrl = `${window.location.origin}/verify/${uniqueId}`;
      setVerificationUrl(verifyUrl);
      toast.success('Imagen cargada exitosamente');
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al cargar la imagen');
    } finally {
      setUploading(false);
    }
  };

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center">
          <img 
            src="https://ebfdrvrppabdeibgeefq.supabase.co/storage/v1/object/public/logos-bucket/ESCUDO/ESCUDO_Azul-Vertical.png"
            alt="Gobierno de Chihuahua"
            className="h-16 mx-auto mb-4"
          />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Cargar imagen de campaña
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Sube una imagen para generar un enlace de verificación único
          </p>
          <button
            onClick={() => setShowTutorial(!showTutorial)}
            className="mt-2 inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Info className="w-4 h-4 mr-1" />
            {showTutorial ? 'Ocultar tutorial' : 'Ver tutorial'}
          </button>
        </div>

        {showTutorial && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <h3 className="font-medium text-blue-800 dark:text-blue-300">Cómo usar el verificador:</h3>
            <ol className="mt-2 list-decimal list-inside space-y-2 text-sm text-blue-700 dark:text-blue-200">
              <li>Complete los datos de la campaña (título, descripción y autor)</li>
              <li>Seleccione la imagen de la campaña a verificar</li>
              <li>El sistema generará un enlace único y código QR</li>
              <li>Comparta el enlace o código QR con los destinatarios</li>
              <li>Los destinatarios podrán verificar la autenticidad de la campaña</li>
            </ol>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Título de la campaña *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Autor *
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>

          <div className="flex justify-center">
            <label className="relative cursor-pointer bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-md text-white transition-colors">
              <span>{uploading ? 'Cargando...' : 'Seleccionar imagen'}</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {verificationUrl && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Enlace de verificación:</p>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={verificationUrl}
                className="flex-1 p-2 text-sm border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(verificationUrl);
                  toast.success('Enlace copiado');
                }}
                className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md transition-colors"
              >
                Copiar
              </button>
            </div>
            <div className="mt-4 flex justify-center">
              <QRCodeSVG value={verificationUrl} size={200} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}