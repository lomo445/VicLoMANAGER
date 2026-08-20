-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: locations
CREATE TABLE public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    electricity_cost_kwh NUMERIC(10, 4) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Table: printers
CREATE TABLE public.printers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES public.locations(id) ON DELETE RESTRICT,
    model_name TEXT NOT NULL,
    power_consumption_w NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Table: materials
CREATE TABLE public.materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand TEXT NOT NULL,
    material_type TEXT NOT NULL,
    color_name TEXT NOT NULL,
    hex_code TEXT,
    spool_weight_g NUMERIC(10, 2) NOT NULL DEFAULT 1000,
    cost_per_kg NUMERIC(10, 2) NOT NULL DEFAULT 0,
    current_stock_g NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Table: products
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('standard', 'custom')),
    base_weight_g NUMERIC(10, 2) NOT NULL DEFAULT 0,
    base_print_time_minutes NUMERIC(10, 2) NOT NULL DEFAULT 0,
    printer_id UUID REFERENCES public.printers(id) ON DELETE SET NULL,
    material_id UUID REFERENCES public.materials(id) ON DELETE SET NULL,
    base_selling_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Table: extras_catalog
CREATE TABLE public.extras_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    default_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    default_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Table: orders
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    client_contact TEXT,
    product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT,
    custom_notes TEXT,
    commission_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    status TEXT NOT NULL CHECK (status IN ('da_stampare', 'in_stampa', 'post_produzione', 'pronto', 'consegnato')),
    final_selling_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    calculated_production_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Table: order_extras
CREATE TABLE public.order_extras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    unit_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Table: expenses
CREATE TABLE public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL CHECK (category IN ('filamento', 'ricambi_hardware', 'accessori_extra', 'packaging', 'utenze', 'altro')),
    title TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
