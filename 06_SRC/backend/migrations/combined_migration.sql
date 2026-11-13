-- Migration 001: Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    university_uid TEXT UNIQUE,
    university_email TEXT NOT NULL,
    bio TEXT,
    avatar_path TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profiles_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to safely create profile upon Supabase auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, university_email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student User'),
        NEW.email
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

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

-- Migration 003: Create item_images table
CREATE TABLE IF NOT EXISTS public.item_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

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

-- Migration 007: Create admin_roles table
CREATE TABLE IF NOT EXISTS public.admin_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'moderator')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Helper function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_roles
        WHERE user_id = check_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Migration 008: Enable Row Level Security (RLS) on all exposed tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.borrow_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Migration 009: Create Row Level Security (RLS) Policies

-- ==========================================
-- PROFILES POLICIES
-- ==========================================
CREATE POLICY "Profiles are readable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ==========================================
-- ITEMS POLICIES
-- ==========================================
CREATE POLICY "Active items or owner items are viewable"
    ON public.items FOR SELECT
    TO authenticated
    USING (is_active = true OR owner_id = auth.uid());

CREATE POLICY "Users can create their own listings"
    ON public.items FOR INSERT
    TO authenticated
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update their own listings"
    ON public.items FOR UPDATE
    TO authenticated
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can delete their own listings"
    ON public.items FOR DELETE
    TO authenticated
    USING (owner_id = auth.uid());

-- ==========================================
-- ITEM IMAGES POLICIES
-- ==========================================
CREATE POLICY "Images of viewable items are readable"
    ON public.item_images FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.items
        WHERE items.id = item_images.item_id
          AND (items.is_active = true OR items.owner_id = auth.uid())
    ));

CREATE POLICY "Item owners can insert images"
    ON public.item_images FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.items
        WHERE items.id = item_images.item_id
          AND items.owner_id = auth.uid()
    ));

CREATE POLICY "Item owners can update item images"
    ON public.item_images FOR UPDATE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.items
        WHERE items.id = item_images.item_id
          AND items.owner_id = auth.uid()
    ));

CREATE POLICY "Item owners can delete item images"
    ON public.item_images FOR DELETE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.items
        WHERE items.id = item_images.item_id
          AND items.owner_id = auth.uid()
    ));

-- ==========================================
-- BORROW REQUESTS POLICIES
-- ==========================================
CREATE POLICY "Borrowers and owners can view requests"
    ON public.borrow_requests FOR SELECT
    TO authenticated
    USING (
        borrower_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.items
            WHERE items.id = borrow_requests.item_id
              AND items.owner_id = auth.uid()
        )
    );

CREATE POLICY "Borrowers can create borrow requests"
    ON public.borrow_requests FOR INSERT
    TO authenticated
    WITH CHECK (
        borrower_id = auth.uid()
        AND NOT EXISTS (
            SELECT 1 FROM public.items
            WHERE items.id = borrow_requests.item_id
              AND items.owner_id = auth.uid()
        )
    );

CREATE POLICY "Parties can update requests within permitted workflow"
    ON public.borrow_requests FOR UPDATE
    TO authenticated
    USING (
        borrower_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.items
            WHERE items.id = borrow_requests.item_id
              AND items.owner_id = auth.uid()
        )
    );

-- ==========================================
-- NOTIFICATIONS POLICIES
-- ==========================================
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can mark their own notifications as read"
    ON public.notifications FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own notifications"
    ON public.notifications FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- ==========================================
-- REPORTS POLICIES
-- ==========================================
CREATE POLICY "Reporters and admins can view reports"
    ON public.reports FOR SELECT
    TO authenticated
    USING (reporter_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Authenticated users can submit reports"
    ON public.reports FOR INSERT
    TO authenticated
    WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Admins can update reports"
    ON public.reports FOR UPDATE
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- ==========================================
-- ADMIN ROLES POLICIES
-- ==========================================
CREATE POLICY "Admins can read admin roles"
    ON public.admin_roles FOR SELECT
    TO authenticated
    USING (public.is_admin(auth.uid()));

-- Migration 010: Atomic Database Functions for State Transitions and Conflict Prevention

-- 1. Function: approve_borrow_request
CREATE OR REPLACE FUNCTION public.approve_borrow_request(req_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_req RECORD;
    v_item RECORD;
    v_conflict_count INTEGER;
BEGIN
    -- Retrieve request and verify existence
    SELECT * INTO v_req FROM public.borrow_requests WHERE id = req_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Request not found';
    END IF;

    -- Verify request status is currently pending
    IF v_req.status <> 'pending' THEN
        RAISE EXCEPTION 'Only pending requests can be approved. Current status: %', v_req.status;
    END IF;

    -- Lock and verify item ownership
    SELECT * INTO v_item FROM public.items WHERE id = v_req.item_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Item not found';
    END IF;

    IF v_item.owner_id <> auth.uid() THEN
        RAISE EXCEPTION 'Unauthorized: Only the item owner can approve this request';
    END IF;

    -- Check for overlapping approved bookings
    SELECT COUNT(*) INTO v_conflict_count
    FROM public.borrow_requests
    WHERE item_id = v_req.item_id
      AND status = 'approved'
      AND id <> req_id
      AND start_date <= v_req.end_date
      AND end_date >= v_req.start_date;

    IF v_conflict_count > 0 THEN
        RAISE EXCEPTION 'Conflict: Item is already approved for overlapping dates (% to %)', v_req.start_date, v_req.end_date;
    END IF;

    -- Update request status
    UPDATE public.borrow_requests
    SET status = 'approved', updated_at = timezone('utc'::text, now())
    WHERE id = req_id;

    -- Insert notification for borrower
    INSERT INTO public.notifications (user_id, title, message, type, related_request_id)
    VALUES (
        v_req.borrower_id,
        'Borrow Request Approved',
        format('Your request for "%s" has been approved for %s to %s.', v_item.title, v_req.start_date, v_req.end_date),
        'request_approved',
        req_id
    );

    RETURN jsonb_build_object(
        'success', true,
        'request_id', req_id,
        'status', 'approved',
        'message', 'Request approved successfully'
    );
END;
$$;

-- 2. Function: reject_borrow_request
CREATE OR REPLACE FUNCTION public.reject_borrow_request(req_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_req RECORD;
    v_item RECORD;
BEGIN
    SELECT * INTO v_req FROM public.borrow_requests WHERE id = req_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Request not found';
    END IF;

    IF v_req.status <> 'pending' THEN
        RAISE EXCEPTION 'Only pending requests can be rejected. Current status: %', v_req.status;
    END IF;

    SELECT * INTO v_item FROM public.items WHERE id = v_req.item_id;
    IF v_item.owner_id <> auth.uid() THEN
        RAISE EXCEPTION 'Unauthorized: Only the item owner can reject this request';
    END IF;

    UPDATE public.borrow_requests
    SET status = 'rejected', updated_at = timezone('utc'::text, now())
    WHERE id = req_id;

    INSERT INTO public.notifications (user_id, title, message, type, related_request_id)
    VALUES (
        v_req.borrower_id,
        'Borrow Request Declined',
        format('Your request for "%s" was declined by the owner.', v_item.title),
        'request_rejected',
        req_id
    );

    RETURN jsonb_build_object(
        'success', true,
        'request_id', req_id,
        'status', 'rejected',
        'message', 'Request rejected'
    );
END;
$$;

-- 3. Function: cancel_borrow_request
CREATE OR REPLACE FUNCTION public.cancel_borrow_request(req_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_req RECORD;
    v_item RECORD;
BEGIN
    SELECT * INTO v_req FROM public.borrow_requests WHERE id = req_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Request not found';
    END IF;

    IF v_req.borrower_id <> auth.uid() THEN
        RAISE EXCEPTION 'Unauthorized: Only the borrower can cancel their request';
    END IF;

    IF v_req.status <> 'pending' THEN
        RAISE EXCEPTION 'Only pending requests can be cancelled. Current status: %', v_req.status;
    END IF;

    SELECT * INTO v_item FROM public.items WHERE id = v_req.item_id;

    UPDATE public.borrow_requests
    SET status = 'cancelled', updated_at = timezone('utc'::text, now())
    WHERE id = req_id;

    INSERT INTO public.notifications (user_id, title, message, type, related_request_id)
    VALUES (
        v_item.owner_id,
        'Borrow Request Cancelled',
        format('A pending request for "%s" was cancelled by the requester.', v_item.title),
        'request_cancelled',
        req_id
    );

    RETURN jsonb_build_object(
        'success', true,
        'request_id', req_id,
        'status', 'cancelled',
        'message', 'Request cancelled'
    );
END;
$$;

-- 4. Function: mark_return_pending
CREATE OR REPLACE FUNCTION public.mark_return_pending(req_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_req RECORD;
    v_item RECORD;
BEGIN
    SELECT * INTO v_req FROM public.borrow_requests WHERE id = req_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Request not found';
    END IF;

    IF v_req.borrower_id <> auth.uid() THEN
        RAISE EXCEPTION 'Unauthorized: Only the borrower can initiate return';
    END IF;

    IF v_req.status <> 'approved' THEN
        RAISE EXCEPTION 'Return can only be initiated for an active approved borrowing. Current status: %', v_req.status;
    END IF;

    SELECT * INTO v_item FROM public.items WHERE id = v_req.item_id;

    UPDATE public.borrow_requests
    SET status = 'return_pending', updated_at = timezone('utc'::text, now())
    WHERE id = req_id;

    INSERT INTO public.notifications (user_id, title, message, type, related_request_id)
    VALUES (
        v_item.owner_id,
        'Item Return Initiated',
        format('The borrower has marked "%s" as returned. Please inspect and confirm receipt.', v_item.title),
        'return_initiated',
        req_id
    );

    RETURN jsonb_build_object(
        'success', true,
        'request_id', req_id,
        'status', 'return_pending',
        'message', 'Return initiated. Awaiting owner confirmation.'
    );
END;
$$;

-- 5. Function: confirm_return
CREATE OR REPLACE FUNCTION public.confirm_return(req_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_req RECORD;
    v_item RECORD;
BEGIN
    SELECT * INTO v_req FROM public.borrow_requests WHERE id = req_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Request not found';
    END IF;

    SELECT * INTO v_item FROM public.items WHERE id = v_req.item_id;
    IF v_item.owner_id <> auth.uid() THEN
        RAISE EXCEPTION 'Unauthorized: Only the item owner can confirm receipt and complete return';
    END IF;

    IF v_req.status <> 'return_pending' THEN
        RAISE EXCEPTION 'Return must be in return_pending status before confirmation. Current status: %', v_req.status;
    END IF;

    UPDATE public.borrow_requests
    SET status = 'completed', updated_at = timezone('utc'::text, now())
    WHERE id = req_id;

    INSERT INTO public.notifications (user_id, title, message, type, related_request_id)
    VALUES (
        v_req.borrower_id,
        'Return Confirmed',
        format('Owner confirmed the return of "%s". The transaction is completed.', v_item.title),
        'return_confirmed',
        req_id
    );

    RETURN jsonb_build_object(
        'success', true,
        'request_id', req_id,
        'status', 'completed',
        'message', 'Return confirmed. Transaction completed successfully.'
    );
END;
$$;

-- Migration 011: Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_items_owner_id ON public.items(owner_id);
CREATE INDEX IF NOT EXISTS idx_items_category_active ON public.items(category, is_active);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON public.items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_borrow_requests_item_status ON public.borrow_requests(item_id, status);
CREATE INDEX IF NOT EXISTS idx_borrow_requests_borrower_status ON public.borrow_requests(borrower_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_status_created ON public.reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_item_images_item_sort ON public.item_images(item_id, sort_order);

