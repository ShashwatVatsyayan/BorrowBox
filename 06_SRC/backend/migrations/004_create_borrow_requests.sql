-- Migration 004: Create borrow_requests table
CREATE TABLE IF NOT EXISTS public.borrow_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    borrower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    message TEXT CHECK (char_length(message) <= 500),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',
        'approved',
        'rejected',
        'cancelled',
        'return_pending',
        'completed'
    )),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT check_date_order CHECK (start_date <= end_date)
);

CREATE TRIGGER on_borrow_requests_updated
    BEFORE UPDATE ON public.borrow_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Prevent owner from borrowing their own item at database level
CREATE OR REPLACE FUNCTION public.check_borrower_not_owner()
RETURNS TRIGGER AS $$
DECLARE
    item_owner UUID;
BEGIN
    SELECT owner_id INTO item_owner FROM public.items WHERE id = NEW.item_id;
    IF item_owner = NEW.borrower_id THEN
        RAISE EXCEPTION 'Item owners cannot submit a borrow request for their own item.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_borrower_not_owner
    BEFORE INSERT ON public.borrow_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.check_borrower_not_owner();

