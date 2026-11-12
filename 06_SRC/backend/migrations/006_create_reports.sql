-- Migration 006: Create reports table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
    reason TEXT NOT NULL CHECK (reason IN (
        'Inappropriate Content',
        'Item Never Returned',
        'Item Damaged',
        'Misleading Description',
        'Harassment or Spam',
        'Other'
    )),
    description TEXT CHECK (char_length(description) <= 1000),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN (
        'open',
        'reviewing',
        'resolved',
        'dismissed'
    )),
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    reviewed_at TIMESTAMPTZ
);

