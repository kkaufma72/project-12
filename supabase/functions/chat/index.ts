import { createClient } from 'npm:@supabase/supabase-js@2.39.8';
import OpenAI from 'npm:openai@4.28.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    console.log('Chat function called - checking environment variables');

    // Enhanced error handling for environment variables
    const missingVars = [];
    if (!openaiKey) missingVars.push('OPENAI_API_KEY');
    if (!supabaseUrl) missingVars.push('SUPABASE_URL');
    if (!supabaseKey) missingVars.push('SUPABASE_ANON_KEY');

    if (missingVars.length > 0) {
      console.error(`Missing environment variables: ${missingVars.join(', ')}`);
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    console.log('All required environment variables are set');

    // Initialize clients
    const supabase = createClient(supabaseUrl, supabaseKey);
    const openai = new OpenAI({ apiKey: openaiKey });

    // Parse request body
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid messages format received');
      throw new Error('Invalid messages format');
    }

    console.log(`Processing chat request with ${messages.length} messages`);

    // Fetch datasets for context
    const { data: datasets, error: datasetsError } = await supabase
      .from('datasets')
      .select('*');

    if (datasetsError) {
      console.error('Error fetching datasets:', datasetsError);
      throw new Error('Failed to fetch datasets');
    }

    console.log(`Retrieved ${datasets?.length || 0} datasets for context`);

    // Create context from datasets
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

    console.log('Making OpenAI API call');

    // Make OpenAI API call
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    console.log('Successfully received OpenAI response');

    return new Response(
      JSON.stringify(completion.choices[0].message),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Chat function error:', error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});