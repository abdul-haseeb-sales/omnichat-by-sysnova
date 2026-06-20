-- Create Conversations Table
CREATE TABLE public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contact_name TEXT NOT NULL,
    contact_id TEXT NOT NULL, -- Phone number or Facebook ID
    channel TEXT NOT NULL, -- 'whatsapp', 'facebook', 'instagram', 'threads'
    status TEXT DEFAULT 'open', -- 'open' or 'resolved'
    unread_count INTEGER DEFAULT 0,
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Messages Table
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL, -- 'customer' or 'agent'
    content TEXT NOT NULL,
    message_id TEXT, -- Original Meta message ID to avoid duplicates
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create Policies (For this demo, we allow authenticated users to read/write all)
CREATE POLICY "Allow authenticated full access to conversations" 
ON public.conversations FOR ALL 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated full access to messages" 
ON public.messages FOR ALL 
TO authenticated 
USING (true);

-- Allow Edge Functions (Service Role) to insert messages without user auth
CREATE POLICY "Allow service role full access to conversations" 
ON public.conversations FOR ALL 
TO service_role 
USING (true);

CREATE POLICY "Allow service role full access to messages" 
ON public.messages FOR ALL 
TO service_role 
USING (true);

-- Create Realtime publications
BEGIN;
  -- Remove the supabase_realtime publication if it exists
  DROP PUBLICATION IF EXISTS supabase_realtime;
  -- Re-create it with our tables
  CREATE PUBLICATION supabase_realtime FOR TABLE public.conversations, public.messages;
COMMIT;
