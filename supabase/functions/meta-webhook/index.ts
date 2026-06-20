// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const VERIFY_TOKEN = Deno.env.get("META_VERIFY_TOKEN") || "omnichat_secure_token";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req: Request) => {
  const url = new URL(req.url);

  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return new Response(challenge, { status: 200 });
    } else {
      return new Response("Forbidden", { status: 403 });
    }
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();

      if (body.object === "page" || body.object === "whatsapp_business_account" || body.object === "instagram") {
        for (const entry of body.entry) {
          
          // Facebook & Instagram
          if (entry.messaging) {
            const pageId = entry.id; // This is the Facebook Page ID
            
            // Look up the user who owns this page
            const { data: channelData } = await supabase
              .from('user_channels')
              .select('user_id')
              .eq('page_id', pageId)
              .single();
              
            if (!channelData) continue; // Unrecognized page

            for (const event of entry.messaging) {
              if (event.message && !event.message.is_echo) {
                await processMessage(
                  channelData.user_id, 
                  event.sender.id, 
                  event.message.text, 
                  event.message.mid, 
                  body.object === 'instagram' ? 'instagram' : 'facebook'
                );
              }
            }
          }

          // WhatsApp
          if (entry.changes) {
            for (const change of entry.changes) {
              const phoneId = change.value.metadata?.phone_number_id;
              
              if (phoneId) {
                const { data: channelData } = await supabase
                  .from('user_channels')
                  .select('user_id')
                  .eq('page_id', phoneId)
                  .single();

                if (!channelData) continue;

                if (change.value && change.value.messages) {
                  for (const msg of change.value.messages) {
                    const contactId = change.value.contacts?.[0]?.wa_id || msg.from;
                    const contactName = change.value.contacts?.[0]?.profile?.name || "WhatsApp User";
                    await processMessage(channelData.user_id, contactId, msg.text?.body, msg.id, 'whatsapp', contactName);
                  }
                }
              }
            }
          }
        }
        return new Response("EVENT_RECEIVED", { status: 200 });
      }

      return new Response("Not Found", { status: 404 });
    } catch (error) {
      console.error(error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
});

async function processMessage(userId: string, contactId: string, text: string, messageId: string, channel: string, contactName: string = "User") {
  if (!text) return; 

  let { data: conversation } = await supabase
    .from("conversations")
    .select("*")
    .eq("contact_id", contactId)
    .eq("channel", channel)
    .eq("user_id", userId)
    .single();

  if (!conversation) {
    const { data: newConv } = await supabase
      .from("conversations")
      .insert({
        user_id: userId,
        contact_id: contactId,
        contact_name: contactName,
        channel: channel,
        status: 'open',
        unread_count: 1,
        last_message: text,
        last_message_at: new Date().toISOString()
      })
      .select()
      .single();
    conversation = newConv;
  } else {
    await supabase
      .from("conversations")
      .update({
        last_message: text,
        last_message_at: new Date().toISOString(),
        unread_count: conversation.unread_count + 1,
        status: 'open'
      })
      .eq("id", conversation.id);
  }

  const { data: existingMsg } = await supabase
    .from("messages")
    .select("id")
    .eq("message_id", messageId)
    .single();

  if (!existingMsg) {
    await supabase
      .from("messages")
      .insert({
        user_id: userId,
        conversation_id: conversation.id,
        sender_type: "customer",
        content: text,
        message_id: messageId
      });
  }
}
