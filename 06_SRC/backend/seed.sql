-- Seed Data for Demo and Verification
-- Note: User UUIDs correspond to demo accounts Student A and Student B

-- Demo Student A (Owner)
-- Email: student.a@cuchd.in
-- ID: 11111111-1111-1111-1111-111111111111

-- Demo Student B (Borrower)
-- Email: student.b@cuchd.in
-- ID: 22222222-2222-2222-2222-222222222222

-- Demo Admin
-- Email: admin@cuchd.in
-- ID: 33333333-3333-3333-3333-333333333333

INSERT INTO public.profiles (id, full_name, university_uid, university_email, bio)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Aarav Sharma', '21BCS1001', 'aarav.sharma@cuchd.in', 'Computer Science student, 3rd year. Happy to lend lab kits and calculators.'),
    ('22222222-2222-2222-2222-222222222222', 'Priya Verma', '21BCS1002', 'priya.verma@cuchd.in', 'Mechanical Engineering student. Avid reader and badminton player.'),
    ('33333333-3333-3333-3333-333333333333', 'Campus Admin', 'ADMIN01', 'admin@cuchd.in', 'BorrowBox Campus Moderation Team')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.admin_roles (user_id, role)
VALUES ('33333333-3333-3333-3333-333333333333', 'admin')
ON CONFLICT (user_id) DO NOTHING;

-- Items owned by Student A
INSERT INTO public.items (id, owner_id, title, description, category, condition, location_label, is_active)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Casio fx-991EX ClassWiz Calculator', 'Genuine scientific calculator with high-resolution LCD. Perfect for engineering mathematics and exams.', 'Electronics & Calculators', 'Like New', 'Block B-3, Academic Block', true),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'White Chemistry Lab Coat (Size M)', 'Clean 100% cotton lab coat required for Chemistry and Biotechnology lab sessions.', 'Lab & Safety Equipment', 'Good', 'North Campus Library Entrance', true),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'Engineering Mechanics Textbook (Hibbeler)', '14th edition, standard reference book for first-year engineering mechanics with practice questions.', 'Textbooks & Notes', 'Good', 'Student Center Cafe', true),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'Yonex Carbonex Badminton Racket with Cover', 'Strung with BG65 at 24lbs. In great shape for hostel or sports complex sessions.', 'Sports & Fitness', 'Good', 'Hostel Block H1 Ground Floor', true),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'Arduino Uno R3 Starter Kit with Sensors', 'Includes breadboard, jumper wires, ultrasonic sensor, LED pack and servo motor.', 'Tools & Hardware', 'Like New', 'Engineering Workshop Building', true)
ON CONFLICT (id) DO NOTHING;

