-- Migration 005: Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN (
        'request_received',
        'request_approved',
        'request_rejected',
        'request_cancelled',
        'return_initiated',
        'return_confirmed',
        'system'
    )),
    related_request_id UUID REFERENCES public.borrow_requests(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

