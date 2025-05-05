import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'automl-platform'
    }
  }
});

export const initializeSupabase = async () => {
  try {
    for (let i = 0; i < 3; i++) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id')
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Supabase connection error attempt', i + 1, ':', error);
          if (i === 2) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          continue;
        }

        return true;
      } catch (err) {
        console.error('Connection attempt', i + 1, 'failed:', err);
        if (i === 2) throw err;
        continue;
      }
    }

    return false;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};

export const checkSupabaseHealth = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('count')
      .limit(1)
      .single();
    
    if (error) {
      console.error('Health check failed:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Health check error:', err);
    return false;
  }
};

export const handleSupabaseError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};