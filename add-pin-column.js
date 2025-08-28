import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addPinColumn() {
  try {
    console.log('Adding PIN column to drivers table...');
    
    // Add PIN column to drivers table
    const { error } = await supabase.rpc('add_pin_column_to_drivers');
    
    if (error) {
      console.error('Error adding PIN column:', error);
    } else {
      console.log('Successfully added PIN column to drivers table');
    }
  } catch (err) {
    console.error('Script error:', err);
  }
}

addPinColumn();