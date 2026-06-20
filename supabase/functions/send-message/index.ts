// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const META_ACCESS_TOKEN = Deno.env.get("META_ACCESS_TOKEN")!;
const WHATSAPP_PHONE_ID = Deno.env.get("WHATSAPP_PHONE_ID")!;
const FACEBOOK_PAGE_ID = Deno.env.get("FACEBOOK_PAGE_ID")!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { contactId, channel, messageText } = await req.json();

    if (!contactId || !channel || !messageText) {
      return new Response("Missing required parameters", { status: 400, headers: corsHeaders });
    }

    let url = "";
    let payload = {};

    if (channel === "whatsapp") {
      url = `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages`;
      payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: contactId,
        type: "text",
        text: { preview_url: false, body: messageText }
      };
    } else if (channel === "facebook" || channel === "instagram") {
      url = `https://graph.facebook.com/v19.0/${FACEBOOK_PAGE_ID}/messages`;
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
        "Authorization": `Bearer ${META_ACCESS_TOKEN}`,
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
