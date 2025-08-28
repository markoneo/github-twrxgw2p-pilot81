/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - created_at (timestamp)
    
    - companies
      - id (uuid, primary key)
      - name (text)
      - address (text)
      - phone (text)
      - created_at (timestamp)
    
    - car_types
      - id (uuid, primary key)
      - name (text)
      - capacity (integer)
      - luggage_capacity (integer)
      - description (text)
      - created_at (timestamp)
    
    - drivers
      - id (uuid, primary key)
      - name (text)
      - phone (text)
      - license (text)
      - status (text)
      - created_at (timestamp)
    
    - projects
      - id (uuid, primary key)
      - company_id (uuid, foreign key)
      - driver_id (uuid, foreign key)
      - car_type_id (uuid, foreign key)
      - client_name (text)
      - client_phone (text)
      - pickup_location (text)
      - dropoff_location (text)
      - date (date)
      - time (time)
      - passengers (integer)
      - price (decimal)
      - status (text)
      - payment_status (text)
      - description (text)
      - booking_id (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address text,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Create car_types table
CREATE TABLE IF NOT EXISTS car_types (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  capacity integer NOT NULL DEFAULT 4,
  luggage_capacity integer NOT NULL DEFAULT 2,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  phone text,
  license text,
  status text DEFAULT 'available',
  created_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid REFERENCES companies(id),
  driver_id uuid REFERENCES drivers(id),
  car_type_id uuid REFERENCES car_types(id),
  client_name text NOT NULL,
  client_phone text,
  pickup_location text NOT NULL,
  dropoff_location text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  passengers integer NOT NULL DEFAULT 1,
  price decimal(10,2) NOT NULL DEFAULT 0,
  status text DEFAULT 'active',
  payment_status text DEFAULT 'charge',
  description text,
  booking_id text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Allow authenticated users to read companies"
  ON companies
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage companies"
  ON companies
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read car types"
  ON car_types
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage car types"
  ON car_types
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read drivers"
  ON drivers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage drivers"
  ON drivers
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (true);