// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Meta verification token (You set this in Meta Developer Portal)
const VERIFY_TOKEN = Deno.env.get("META_VERIFY_TOKEN") || "omnichat_secure_token";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req: Request) => {
  const url = new URL(req.url);

  // 1. Webhook Verification (GET)
  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      return new Response(challenge, { status: 200 });
    } else {
      return new Response("Forbidden", { status: 403 });
    }
  }

  // 2. Receiving Messages (POST)
  if (req.method === "POST") {
    try {
      const body = await req.json();

      // Ensure this is a message event from page/whatsapp
      if (body.object === "page" || body.object === "whatsapp_business_account" || body.object === "instagram") {
        
        for (const entry of body.entry) {
          // Handle Messenger & Instagram
          if (entry.messaging) {
            for (const event of entry.messaging) {
              if (event.message && !event.message.is_echo) {
                await processMessage(event.sender.id, event.message.text, event.message.mid, body.object === 'instagram' ? 'instagram' : 'facebook');
              }
            }
          }
          // Handle WhatsApp
          if (entry.changes) {
            for (const change of entry.changes) {
              if (change.value && change.value.messages) {
                for (const msg of change.value.messages) {
                  const contactId = change.value.contacts?.[0]?.wa_id || msg.from;
                  const contactName = change.value.contacts?.[0]?.profile?.name || "WhatsApp User";
                  await processMessage(contactId, msg.text?.body, msg.id, 'whatsapp', contactName);
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

async function processMessage(contactId: string, text: string, messageId: string, channel: string, contactName: string = "User") {
  if (!text) return; // Ignore non-text messages for now

  // 1. Find or create the conversation
  let { data: conversation } = await supabase
    .from("conversations")
    .select("*")
    .eq("contact_id", contactId)
    .eq("channel", channel)
    .single();

  if (!conversation) {
    const { data: newConv } = await supabase
      .from("conversations")
      .insert({
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
    // Update conversation
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

  // 2. Insert the message
  // First check if it exists (deduplication)
  const { data: existingMsg } = await supabase
    .from("messages")
    .select("id")
    .eq("message_id", messageId)
    .single();

  if (!existingMsg) {
    await supabase
      .from("messages")
      .insert({
        conversation_id: conversation.id,
        sender_type: "customer",
        content: text,
        message_id: messageId
      });
  }
}
