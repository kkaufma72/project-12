import { Handler } from '@netlify/functions';
import { createServerSupabaseClient } from '@supabase/auth-helpers-netlify';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../types/supabase';
import { OpenAIError } from 'openai/dist/core/OpenAIError';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler: Handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: 'ok',
    };
      headers: corsHeaders,
      body: 'ok',
    };
  }

  try {
    // Get environment variables
    const openaiKey = process.env.OPENAI_API_KEY;
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    const missingVars = [];
    if (!openaiKey) missingVars.push('OPENAI_API_KEY');
    if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL or SUPABASE_URL');
    if (!supabaseKey) missingVars.push('VITE_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY');
    if (missingVars.length > 0) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: `Missing required environment variables: ${missingVars.join(', ')}` }),
      };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const openai = new OpenAI({ apiKey: openaiKey });

    const { messages } = JSON.parse(event.body || '{}');
    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid messages format' }),
      };
    }

    // Fetch datasets for context
    const { data: datasets, error: datasetsError } = await supabase
      .from('datasets')
      .select('*');

    if (datasetsError) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Failed to fetch datasets' }),
      };
    }

    const datasetContext = datasets?.map(dataset => {
      return `Dataset: ${dataset.name}
Description: ${dataset.description || 'No description'}
Columns: ${dataset.preview_data?.columns?.join(', ') || 'No columns'}
Sample Data: ${JSON.stringify(dataset.preview_data?.rows?.slice(0, 3) || [])}
---`;
    }).join('\n') || 'No datasets available';

    const systemPrompt = `You are an AI assistant with knowledge of the following datasets:

${datasetContext}

Use this information to answer questions about the data. Be specific and reference actual values from the datasets when possible.
If you're not sure about something, say so rather than making assumptions.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(completion.choices[0].message),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error instanceof Error ? error.stack : undefined,
      }),
    };
  }
};

export { handler as default };