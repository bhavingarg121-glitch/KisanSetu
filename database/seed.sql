-- ============================================================================
-- KisanSetu: Seed Data for SIH Hackathon Demo
-- ============================================================================

-- Insert Mandi Centers
INSERT INTO procurement_centers (id, code, name, state, district, taluka_block, max_daily_capacity_qtl, current_booked_qtl, hourly_throughput_rate, active_weighbridges, total_weighbridges, contact_phone)
VALUES 
('11111111-1111-1111-1111-111111111111', 'PPC-RAMPUR-01', 'Rampur Main Krishi Mandi PPC', 'Uttar Pradesh', 'Rampur', 'Rampur Sadar', 3000.00, 2550.00, 18, 2, 2, '+91 595 2341001'),
('22222222-2222-2222-2222-222222222222', 'PPC-BILASPUR-02', 'Bilaspur Anaj Mandi PPC', 'Uttar Pradesh', 'Rampur', 'Bilaspur', 2500.00, 625.00, 15, 2, 2, '+91 595 2341002'),
('33333333-3333-3333-3333-333333333333', 'PPC-KALYANPUR-03', 'Kalyanpur Greenfield PPC (Buffer Center)', 'Uttar Pradesh', 'Rampur', 'Milak', 2000.00, 300.00, 12, 2, 2, '+91 595 2341003'),
('44444444-4444-4444-4444-444444444444', 'PPC-SHAHABAD-04', 'Shahabad Sub-Yard Procurement Depot', 'Uttar Pradesh', 'Rampur', 'Shahabad', 1800.00, 1620.00, 14, 1, 2, '+91 595 2341004')
ON CONFLICT (code) DO NOTHING;

-- Insert Slots for Rampur Main PPC for Today (2026-08-23)
INSERT INTO procurement_slots (id, center_id, slot_date, slot_time_window, max_vehicle_capacity, booked_count, is_active)
VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', CURRENT_DATE, '08:00 AM - 10:00 AM', 20, 20, TRUE), -- FULL
('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', CURRENT_DATE, '10:00 AM - 12:00 PM', 20, 18, TRUE), -- 2 left
('a3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', CURRENT_DATE, '12:00 PM - 02:00 PM', 20, 16, TRUE), -- 4 left
('a4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', CURRENT_DATE, '02:00 PM - 04:00 PM', 20, 8, TRUE),  -- 12 left
('a5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', CURRENT_DATE, '04:00 PM - 06:00 PM', 20, 5, TRUE)   -- 15 left
ON CONFLICT (center_id, slot_date, slot_time_window) DO NOTHING;

-- Insert Pre-seeded Procurement Tokens for Realistic Demo
INSERT INTO procurement_tokens (
    token_number, farmer_name, farmer_mobile, kisan_reg_id, village,
    center_id, slot_id, slot_date, slot_window,
    commodity, msp_rate_per_qtl, estimated_quantity_qtl, vehicle_type, vehicle_registration,
    status, moisture_percentage, qc_result, gross_weight_qtl, tare_weight_qtl, net_weight_qtl, total_msp_payout
) VALUES
(
    'KS-2026-RAM-1001', 'Ramesh Chandra Verma', '+91 98765 43210', 'UP-RAM-2024-88912', 'Dhamora',
    '11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE, '08:00 AM - 10:00 AM',
    'Paddy (Grade A)', 2320.00, 65.00, 'Tractor-Trolley', 'UP 22 AB 4591',
    'COMPLETED', 14.8, 'PASSED', 115.40, 50.20, 65.20, 151264.00
),
(
    'KS-2026-RAM-1002', 'Sardar Gurpreet Singh', '+91 94120 56789', 'UP-RAM-2024-91204', 'Milak Khanam',
    '11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', CURRENT_DATE, '08:00 AM - 10:00 AM',
    'Paddy (Common)', 2300.00, 80.00, 'Tractor-Trolley', 'UP 22 X 7821',
    'AT_WEIGHBRIDGE', 15.6, 'PASSED', 142.00, 52.00, 90.00, 207000.00
),
(
    'KS-2026-RAM-1003', 'Harish Kumar Saini', '+91 98371 11223', 'UP-RAM-2024-77419', 'Saidnagar',
    '11111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', CURRENT_DATE, '10:00 AM - 12:00 PM',
    'Mustard (Standard)', 5650.00, 35.00, 'Mini-Truck (Pick-up)', 'UP 22 T 3319',
    'WAITING_IN_YARD', 8.2, 'PASSED', NULL, NULL, NULL, NULL
),
(
    'KS-2026-RAM-1004', 'Baldev Yadav', '+91 97590 99881', 'UP-RAM-2024-65102', 'Chamraua',
    '11111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', CURRENT_DATE, '10:00 AM - 12:00 PM',
    'Paddy (Common)', 2300.00, 50.00, 'Tractor-Trolley', 'UP 22 K 6140',
    'WAITING_IN_YARD', 16.4, 'PASSED', NULL, NULL, NULL, NULL
),
(
    'KS-2026-RAM-1005', 'Rajendra Prasad Sharma', '+91 96340 77120', 'UP-RAM-2024-44391', 'Bhot',
    '11111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', CURRENT_DATE, '12:00 PM - 02:00 PM',
    'Wheat (Sharbati)', 2425.00, 45.00, 'Tractor-Trolley', 'UP 22 M 9087',
    'BOOKED', NULL, 'PENDING', NULL, NULL, NULL, NULL
)
ON CONFLICT (token_number) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Seed Data for Agri-Input Orders (Fertilizer Purchases & Subsidies)
-- ----------------------------------------------------------------------------
INSERT INTO agri_input_orders (
    id, permit_number, farmer_name, farmer_mobile, kisan_reg_id, village, district,
    depot_id, depot_name, items, total_mrp, total_farmer_pay, total_govt_subsidy,
    status, payment_method, payment_status, delivery_mode,
    delivery_driver_name, delivery_driver_phone, delivery_vehicle_no, delivery_eta,
    delivery_current_lat, delivery_current_lng, delivery_otp, valid_until
) VALUES 
(
    '77777777-1111-1111-1111-111111111111',
    'AGRI/UP-RAM/2026/0482',
    'Balwant Singh Chauhan',
    '+91 98765 43210',
    'UP-KHA-2026-55421',
    'Rampur Kalan',
    'Rampur',
    'depot-rampur-pacs',
    'Rampur Primary PACS Agri-Input Depot',
    '[
        {id: fert-urea-01, name: Neem Coated Urea (45 kg), brand: IFFCO, quantity: 2, mrpPrice: 2450.00, subsidizedPrice: 266.50, subsidyAmount: 2183.50, itemPayTotal: 533.00, itemSubsidyTotal: 4367.00},
        {id: fert-nano-03, name: IFFCO Nano Urea Liquid (500 ml), brand: IFFCO NanoTech, quantity: 1, mrpPrice: 225.00, subsidizedPrice: 225.00, subsidyAmount: 0.00, itemPayTotal: 225.00, itemSubsidyTotal: 0.00}
    ]'::jsonb,
    5125.00, 758.00, 4367.00,
    'DELIVERED', 'UPI_QR', 'SUCCESS', 'HOME_DELIVERY',
    'Mahesh Yadav', '+91 98971 22334', 'UP 22 T 8891', 'Delivered Today',
    28.8152, 79.0276, '4912', '30-Aug-2026'
),
(
    '77777777-2222-2222-2222-222222222222',
    'AGRI/UP-RAM/2026/0519',
    'Sardar Gurpreet Singh',
    '+91 94120 56789',
    'UP-RAM-2024-91204',
    'Milak Khanam',
    'Rampur',
    'depot-iffco-center',
    'IFFCO Farmer Service Center (Bilaspur Rd)',
    '[
        {id: fert-dap-02, name: Di-Ammonium Phosphate (DAP 50 kg), brand: KRIBHCO, quantity: 3, mrpPrice: 4050.00, subsidizedPrice: 1350.00, subsidyAmount: 2700.00, itemPayTotal: 4050.00, itemSubsidyTotal: 8100.00},
        {id: fert-mop-04, name: Muriate of Potash (MOP 50 kg), brand: IPL, quantity: 1, mrpPrice: 2800.00, subsidizedPrice: 1650.00, subsidyAmount: 1150.00, itemPayTotal: 1650.00, itemSubsidyTotal: 1150.00}
    ]'::jsonb,
    14950.00, 5700.00, 9250.00,
    'IN_TRANSIT', 'KISAN_CREDIT_CARD', 'SUCCESS', 'HOME_DELIVERY',
    'Rajesh Kumar Sharma', '+91 98370 44556', 'UP 22 E 5510', '25 mins (approx 6.4 km away)',
    28.8021, 79.0512, '7731', '30-Aug-2026'
),
(
    '77777777-3333-3333-3333-333333333333',
    'AGRI/UP-RAM/2026/0631',
    'Ramesh Kumar',
    '+91 98765 43210',
    'UP-RAM-2024-88912',
    'Dhamora',
    'Rampur',
    'depot-rampur-pacs',
    'Rampur Primary PACS Agri-Input Depot',
    '[
        {id: fert-urea-01, name: Neem Coated Urea (45 kg), brand: IFFCO, quantity: 4, mrpPrice: 2450.00, subsidizedPrice: 266.50, subsidyAmount: 2183.50, itemPayTotal: 1066.00, itemSubsidyTotal: 8734.00},
        {id: bio-npk-07, name: Liquid Bio-NPK Consortium (1 Ltr), brand: National Bio-Fertilizers, quantity: 2, mrpPrice: 350.00, subsidizedPrice: 180.00, subsidyAmount: 170.00, itemPayTotal: 360.00, itemSubsidyTotal: 340.00}
    ]'::jsonb,
    10500.00, 1426.00, 9074.00,
    'PENDING_PAYMENT', 'UPI_QR', 'PENDING', 'DEPOT_PICKUP',
    NULL, NULL, NULL, 'Awaiting Payment',
    NULL, NULL, '8024', '30-Aug-2026'
)
ON CONFLICT (permit_number) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Seed Data for Payment Transactions Ledger
-- ----------------------------------------------------------------------------
INSERT INTO payment_transactions (
    id, order_id, permit_number, transaction_type, amount, govt_subsidy_amount,
    payment_method, payment_status, utr_number, gateway_txn_id, pfms_reference, paid_at
) VALUES
(
    '88888888-1111-1111-1111-111111111111',
    '77777777-1111-1111-1111-111111111111',
    'AGRI/UP-RAM/2026/0482',
    'AGRI_INPUT_PURCHASE',
    758.00, 4367.00,
    'UPI_QR', 'SUCCESS',
    'UPI/20260908/9482710492', 'TXN_NPCI_9981273', 'PFMS-DBT-2026-UP-881920', NOW() - INTERVAL '4 hours'
),
(
    '88888888-2222-2222-2222-222222222222',
    '77777777-2222-2222-2222-222222222222',
    'AGRI/UP-RAM/2026/0519',
    'AGRI_INPUT_PURCHASE',
    5700.00, 9250.00,
    'KISAN_CREDIT_CARD', 'SUCCESS',
    'KCC-RUPAY-88129034', 'TXN_NABARD_1092837', 'PFMS-DBT-2026-UP-993847', NOW() - INTERVAL '1 hour'
);
