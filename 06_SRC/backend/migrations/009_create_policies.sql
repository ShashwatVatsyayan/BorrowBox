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

