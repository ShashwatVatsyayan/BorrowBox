-- Migration 002: Create items table
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 120),
    description TEXT NOT NULL CHECK (char_length(description) >= 10 AND char_length(description) <= 2000),
    category TEXT NOT NULL CHECK (category IN (
        'Textbooks & Notes',
        'Electronics & Calculators',
        'Lab & Safety Equipment',
        'Sports & Fitness',
        'Tools & Hardware',
        'Stationery & Drafting',
        'Other'
    )),
    condition TEXT NOT NULL CHECK (condition IN (
        'Like New',
        'Good',
        'Fair',
        'Well Used'
    )),
    location_label TEXT NOT NULL CHECK (char_length(location_label) >= 2 AND char_length(location_label) <= 100),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER on_items_updated
    BEFORE UPDATE ON public.items
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

