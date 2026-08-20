const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:4dtQtaxoyW7hqO3n@db.hmpsakeqoduummvxoxrp.supabase.co:5432/postgres'
});

async function migrate() {
  try {
    await client.connect();
    
    const sql = `
      CREATE TABLE IF NOT EXISTS order_items (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
          product_id UUID REFERENCES products(id) ON DELETE SET NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          unit_price DECIMAL(10,2) NOT NULL,
          unit_cost DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
      );

      -- Migrate existing data safely
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'product_id') THEN
          INSERT INTO order_items (order_id, product_id, quantity, unit_price, unit_cost)
          SELECT id, product_id, 1, final_selling_price, calculated_production_cost
          FROM orders
          WHERE product_id IS NOT NULL;
          
          ALTER TABLE orders DROP COLUMN product_id;
        END IF;
      END $$;
    `;
    
    await client.query(sql);
    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

migrate();
