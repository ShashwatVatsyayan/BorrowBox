-- Migration 011: Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_items_owner_id ON public.items(owner_id);
CREATE INDEX IF NOT EXISTS idx_items_category_active ON public.items(category, is_active);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON public.items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_borrow_requests_item_status ON public.borrow_requests(item_id, status);
CREATE INDEX IF NOT EXISTS idx_borrow_requests_borrower_status ON public.borrow_requests(borrower_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_status_created ON public.reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_item_images_item_sort ON public.item_images(item_id, sort_order);

