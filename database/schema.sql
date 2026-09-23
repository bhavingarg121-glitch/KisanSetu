-- ============================================================================
-- KisanSetu: National MSP Dynamic Slotting & Mandi Queue Management Portal
-- Supabase / PostgreSQL Schema Definition
-- ============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types for status & commodities
CREATE TYPE user_role AS ENUM ('farmer', 'gate_operator', 'weighbridge_staff', 'mandi_admin');
CREATE TYPE token_status AS ENUM ('BOOKED', 'CHECKED_IN', 'WAITING_IN_YARD', 'AT_WEIGHBRIDGE', 'COMPLETED', 'CANCELLED', 'REJECTED_QC');
CREATE TYPE commodity_type AS ENUM ('Paddy (Common)', 'Paddy (Grade A)', 'Wheat (Sharbati)', 'Mustard (Standard)', 'Chana (Gram)', 'Soybean');
CREATE TYPE vehicle_type AS ENUM ('Tractor-Trolley', 'Mini-Truck (Pick-up)', 'Heavy Truck', 'Bullock Cart');
CREATE TYPE qc_status AS ENUM ('PENDING', 'PASSED', 'HIGH_MOISTURE', 'REJECTED');

-- 1. Procurement Centers (PPC / Mandis)
CREATE TABLE IF NOT EXISTS procurement_centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'PPC-RAMPUR-01'
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Uttar Pradesh',
    district VARCHAR(100) NOT NULL,
    taluka_block VARCHAR(100),
    max_daily_capacity_qtl NUMERIC(12, 2) NOT NULL DEFAULT 2500.00,
    current_booked_qtl NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    hourly_throughput_rate INT NOT NULL DEFAULT 15, -- vehicles processed per hour
    active_weighbridges INT NOT NULL DEFAULT 2,
    total_weighbridges INT NOT NULL DEFAULT 2,
    contact_phone VARCHAR(20),
    operating_status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Time Slots (Dynamic 2-Hour Window definitions per Center)
CREATE TABLE IF NOT EXISTS procurement_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_id UUID REFERENCES procurement_centers(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    slot_time_window VARCHAR(50) NOT NULL, -- e.g. '08:00 AM - 10:00 AM'
    max_vehicle_capacity INT NOT NULL DEFAULT 20,
    booked_count INT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(center_id, slot_date, slot_time_window)
);

-- 3. Farmers Master Record
CREATE TABLE IF NOT EXISTS farmers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kisan_id VARCHAR(100) UNIQUE NOT NULL, -- Farmer Registration / Land Record ID
    full_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    village VARCHAR(150) NOT NULL,
    bank_account_verified BOOLEAN DEFAULT TRUE,
    preferred_language VARCHAR(10) DEFAULT 'hi', -- 'hi', 'en', 'pa', etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Procurement Tokens (Core Transaction Record)
CREATE TABLE IF NOT EXISTS procurement_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'KS-2026-RAM-1042'
    farmer_id UUID REFERENCES farmers(id) ON DELETE SET NULL,
    farmer_name VARCHAR(255) NOT NULL,
    farmer_mobile VARCHAR(20) NOT NULL,
    kisan_reg_id VARCHAR(100) NOT NULL,
    village VARCHAR(150) NOT NULL,
    
    center_id UUID REFERENCES procurement_centers(id) ON DELETE RESTRICT,
    slot_id UUID REFERENCES procurement_slots(id) ON DELETE RESTRICT,
    slot_date DATE NOT NULL,
    slot_window VARCHAR(50) NOT NULL,
    
    commodity commodity_type NOT NULL,
    msp_rate_per_qtl NUMERIC(10, 2) NOT NULL,
    estimated_quantity_qtl NUMERIC(10, 2) NOT NULL,
    vehicle_type vehicle_type NOT NULL,
    vehicle_registration VARCHAR(50) NOT NULL,
    
    status token_status NOT NULL DEFAULT 'BOOKED',
    
    -- Quality Control
    moisture_percentage NUMERIC(5, 2),
    qc_result qc_status DEFAULT 'PENDING',
    qc_inspected_by VARCHAR(100),
    qc_inspected_at TIMESTAMPTZ,
    
    -- Weighbridge Logging
    gross_weight_qtl NUMERIC(10, 2),
    tare_weight_qtl NUMERIC(10, 2),
    net_weight_qtl NUMERIC(10, 2),
    total_msp_payout NUMERIC(14, 2),
    weighbridge_operator VARCHAR(100),
    completed_at TIMESTAMPTZ,
    
    -- Timestamps
    check_in_at TIMESTAMPTZ,
    called_to_weighbridge_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. WhatsApp & SMS Notification Logs (Meta Cloud API Tracking)
CREATE TABLE IF NOT EXISTS whatsapp_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_id UUID REFERENCES procurement_tokens(id) ON DELETE CASCADE,
    recipient_mobile VARCHAR(20) NOT NULL,
    template_name VARCHAR(100) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- 'SLOT_CONFIRMED', 'GATE_CHECKIN', 'WEIGHMENT_COMPLETE', 'CONGESTION_ALERT'
    meta_message_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'SENT', -- 'QUEUED', 'SENT', 'DELIVERED', 'READ', 'FAILED'
    message_body TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Offline Action Sync Queue (For local terminal offline buffer)
CREATE TABLE IF NOT EXISTS offline_sync_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action_type VARCHAR(50) NOT NULL, -- 'CHECK_IN', 'QC_UPDATE', 'WEIGHMENT_COMPLETE'
    payload JSONB NOT NULL,
    synced_at TIMESTAMPTZ DEFAULT NOW(),
    terminal_id VARCHAR(100) NOT NULL
);

-- Indexes for lightning fast lookups during Mandi Operations
CREATE INDEX idx_tokens_token_number ON procurement_tokens(token_number);
CREATE INDEX idx_tokens_status ON procurement_tokens(status);
CREATE INDEX idx_tokens_center_slot ON procurement_tokens(center_id, slot_date);
CREATE INDEX idx_slots_center_date ON procurement_slots(center_id, slot_date);
CREATE INDEX idx_whatsapp_token_id ON whatsapp_notifications(token_id);

-- Auto updated_at triggers
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_procurement_centers_timestamp
BEFORE UPDATE ON procurement_centers
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_procurement_tokens_timestamp
BEFORE UPDATE ON procurement_tokens
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- ----------------------------------------------------------------------------
-- 7. Agri-Inputs & Fertilizer Procurement Orders Table (PMKSK DBT Scheme)
-- ----------------------------------------------------------------------------
DO  BEGIN
    CREATE TYPE agri_order_status AS ENUM ('PENDING_PAYMENT', 'PAID_CONFIRMED', 'ALLOCATED_DEPOT', 'IN_TRANSIT', 'READY_FOR_PICKUP', 'DELIVERED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END ;

DO  BEGIN
    CREATE TYPE agri_payment_mode AS ENUM ('UPI_QR', 'KISAN_CREDIT_CARD', 'DBT_ERUPI_VOUCHER', 'NET_BANKING', 'CASH_AT_DEPOT');
EXCEPTION
    WHEN duplicate_object THEN null;
END ;

DO  BEGIN
    CREATE TYPE agri_payment_status AS ENUM ('PENDING', 'PROCESSING', 'PAID_ESCROW', 'SUCCESS', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END ;

CREATE TABLE IF NOT EXISTS agri_input_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    permit_number VARCHAR(100) UNIQUE NOT NULL,
    farmer_name VARCHAR(255) NOT NULL,
    farmer_mobile VARCHAR(20) NOT NULL,
    kisan_reg_id VARCHAR(100) NOT NULL,
    village VARCHAR(150) NOT NULL,
    district VARCHAR(100) NOT NULL DEFAULT 'Rampur',
    depot_id VARCHAR(100) NOT NULL,
    depot_name VARCHAR(255) NOT NULL,
    items JSONB NOT NULL,
    total_mrp NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_farmer_pay NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_govt_subsidy NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status agri_order_status NOT NULL DEFAULT 'PENDING_PAYMENT',
    payment_method agri_payment_mode NOT NULL DEFAULT 'UPI_QR',
    payment_status agri_payment_status NOT NULL DEFAULT 'PENDING',
    delivery_mode VARCHAR(50) NOT NULL DEFAULT 'HOME_DELIVERY',
    delivery_driver_name VARCHAR(150),
    delivery_driver_phone VARCHAR(20),
    delivery_vehicle_no VARCHAR(50),
    delivery_eta VARCHAR(100),
    delivery_current_lat NUMERIC(9, 6),
    delivery_current_lng NUMERIC(9, 6),
    delivery_otp VARCHAR(10),
    valid_until VARCHAR(50) DEFAULT '30-Aug-2026',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. Payment & Direct Benefit Transfer (DBT) Transactions Ledger
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES agri_input_orders(id) ON DELETE SET NULL,
    permit_number VARCHAR(100),
    transaction_type VARCHAR(50) NOT NULL DEFAULT 'AGRI_INPUT_PURCHASE',
    amount NUMERIC(12, 2) NOT NULL,
    govt_subsidy_amount NUMERIC(12, 2) DEFAULT 0.00,
    payment_method agri_payment_mode NOT NULL,
    payment_status agri_payment_status NOT NULL DEFAULT 'SUCCESS',
    utr_number VARCHAR(100),
    gateway_txn_id VARCHAR(100),
    pfms_reference VARCHAR(100),
    paid_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agri_orders_permit ON agri_input_orders(permit_number);
CREATE INDEX IF NOT EXISTS idx_agri_orders_farmer_mobile ON agri_input_orders(farmer_mobile);
CREATE INDEX IF NOT EXISTS idx_agri_orders_status ON agri_input_orders(status);
CREATE INDEX IF NOT EXISTS idx_agri_orders_payment_status ON agri_input_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_utr ON payment_transactions(utr_number);

DROP TRIGGER IF EXISTS update_agri_input_orders_timestamp ON agri_input_orders;
CREATE TRIGGER update_agri_input_orders_timestamp
BEFORE UPDATE ON agri_input_orders
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
