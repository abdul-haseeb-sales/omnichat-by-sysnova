// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (authError || !user) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    const { contactId, channel, messageText } = await req.json();

    if (!contactId || !channel || !messageText) {
      return new Response("Missing required parameters", { status: 400, headers: corsHeaders });
    }

    // Lookup user's access token for this channel
    const { data: channelData } = await supabase
      .from('user_channels')
      .select('page_id, access_token')
      .eq('user_id', user.id)
      .eq('channel_type', channel)
      .single();

    if (!channelData) {
      return new Response(`No ${channel} account connected.`, { status: 400, headers: corsHeaders });
    }

    let url = "";
    let payload = {};

    if (channel === "whatsapp") {
      url = `https://graph.facebook.com/v19.0/${channelData.page_id}/messages`;
      payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: contactId,
        type: "text",
        text: { preview_url: false, body: messageText }
      };
    } else if (channel === "facebook" || channel === "instagram") {
      url = `https://graph.facebook.com/v19.0/${channelData.page_id}/messages`;
      payload = {
        recipient: { id: contactId },
        message: { text: messageText }
      };
    } else {
      return new Response("Unsupported channel", { status: 400, headers: corsHeaders });
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${channelData.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Meta API Error:", result);
      return new Response(JSON.stringify({ error: result }), { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true, result }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500, headers: corsHeaders });
  }
});
