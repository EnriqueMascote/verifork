import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';

export default function Auth() {
  return (
    <div className="max-w-sm mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Iniciar Sesión
      </h2>
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{ 
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#2563eb',
                brandAccent: '#1d4ed8',
              },
            },
          },
          className: {
            container: 'auth-container',
            label: 'text-gray-700 dark:text-gray-300',
            button: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors',
            input: 'w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white',
          },
        }}
        localization={{
          variables: {
            sign_in: {
              email_label: 'Correo electrónico',
              password_label: 'Contraseña',
              button_label: 'Iniciar sesión',
              loading_button_label: 'Iniciando sesión...',
              email_input_placeholder: 'Tu correo electrónico',
              password_input_placeholder: 'Tu contraseña',
            },
            sign_up: {
              email_label: 'Correo electrónico',
              password_label: 'Contraseña',
              button_label: 'Registrarse',
              loading_button_label: 'Registrando...',
              email_input_placeholder: 'Tu correo electrónico',
              password_input_placeholder: 'Tu contraseña',
            },
          },
        }}
        providers={[]}
      />
    </div>
  );
}