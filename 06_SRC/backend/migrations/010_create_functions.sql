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

