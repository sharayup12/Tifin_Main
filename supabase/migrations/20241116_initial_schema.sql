-- Tiffin Finder Database Schema
-- Creating tables for the warm cultural food discovery platform

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT CHECK (role IN ('food_seeker', 'home_kitchen', 'admin')) DEFAULT 'food_seeker',
  address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kitchens table (home cooks sharing their love)
CREATE TABLE kitchens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  story TEXT NOT NULL,
  cuisine_type TEXT NOT NULL,
  description TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  opening_time TIME,
  closing_time TIME,
  rating DECIMAL(2,1) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  cover_image TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu items table (the heart of each kitchen)
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kitchen_id UUID REFERENCES kitchens(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  category TEXT CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack', 'beverage')) DEFAULT 'lunch',
  is_available BOOLEAN DEFAULT true,
  dietary_info JSONB DEFAULT '{"is_veg": true, "is_vegan": false, "is_gluten_free": false, "is_spicy": false, "allergens": []}',
  image_url TEXT,
  preparation_time INTEGER DEFAULT 30, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table (connecting hungry hearts with loving kitchens)
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  kitchen_id UUID REFERENCES kitchens(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount > 0),
  delivery_address JSONB NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  delivery_time TIMESTAMP WITH TIME ZONE,
  special_instructions TEXT,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
  payment_method TEXT CHECK (payment_method IN ('cod', 'online')) DEFAULT 'cod',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table (the delicious details)
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table (sharing the love and feedback)
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  kitchen_id UUID REFERENCES kitchens(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, order_id) -- One review per order
);

-- Favorites table (kitchens that stole our hearts)
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  kitchen_id UUID REFERENCES kitchens(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, kitchen_id)
);

-- Notifications table (keeping everyone connected)
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('order_status', 'kitchen_update', 'review', 'system')) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_id UUID, -- Can reference order_id, kitchen_id, etc.
  related_type TEXT, -- 'order', 'kitchen', 'review'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_kitchens_user_id ON kitchens(user_id);
CREATE INDEX idx_kitchens_status ON kitchens(status);
CREATE INDEX idx_kitchens_is_active ON kitchens(is_active);
CREATE INDEX idx_kitchens_rating ON kitchens(rating DESC);
CREATE INDEX idx_menu_items_kitchen_id ON menu_items(kitchen_id);
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_is_available ON menu_items(is_available);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_kitchen_id ON orders(kitchen_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON order_items(menu_item_id);
CREATE INDEX idx_reviews_kitchen_id ON reviews(kitchen_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_order_id ON reviews(order_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Row Level Security (RLS) Policies

-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Kitchens table policies
ALTER TABLE kitchens ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved kitchens
CREATE POLICY "Anyone can view approved kitchens" ON kitchens
  FOR SELECT USING (status = 'approved' AND is_active = true);

-- Kitchen owners can manage their own kitchens
CREATE POLICY "Kitchen owners can manage own kitchens" ON kitchens
  FOR ALL USING (auth.uid() = user_id);

-- Menu items table policies
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Anyone can view menu items from approved kitchens
CREATE POLICY "Anyone can view menu items" ON menu_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM kitchens 
      WHERE kitchens.id = menu_items.kitchen_id 
      AND kitchens.status = 'approved' 
      AND kitchens.is_active = true
    )
  );

-- Kitchen owners can manage their own menu items
CREATE POLICY "Kitchen owners can manage own menu items" ON menu_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM kitchens 
      WHERE kitchens.id = menu_items.kitchen_id 
      AND kitchens.user_id = auth.uid()
    )
  );

-- Orders table policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Kitchen owners can view orders for their kitchens
CREATE POLICY "Kitchen owners can view own kitchen orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM kitchens 
      WHERE kitchens.id = orders.kitchen_id 
      AND kitchens.user_id = auth.uid()
    )
  );

-- Users can create their own orders
CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Kitchen owners can update orders for their kitchens
CREATE POLICY "Kitchen owners can update own kitchen orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM kitchens 
      WHERE kitchens.id = orders.kitchen_id 
      AND kitchens.user_id = auth.uid()
    )
  );

-- Order items table policies
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can view order items for their orders
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Kitchen owners can view order items for their kitchen orders
CREATE POLICY "Kitchen owners can view own kitchen order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      JOIN kitchens ON kitchens.id = orders.kitchen_id
      WHERE orders.id = order_items.order_id 
      AND kitchens.user_id = auth.uid()
    )
  );

-- Reviews table policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews for approved kitchens
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM kitchens 
      WHERE kitchens.id = reviews.kitchen_id 
      AND kitchens.status = 'approved'
    )
  );

-- Users can create reviews for their completed orders
CREATE POLICY "Users can create own reviews" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = reviews.order_id 
      AND orders.user_id = auth.uid()
      AND orders.status = 'delivered'
    )
  );

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Favorites table policies
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorites
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own favorites
CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- Notifications table policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Functions

-- Function to automatically create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'food_seeker')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile after signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update kitchen rating when new review is added
CREATE OR REPLACE FUNCTION public.update_kitchen_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE kitchens 
  SET 
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 1) 
      FROM reviews 
      WHERE kitchen_id = NEW.kitchen_id
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE kitchen_id = NEW.kitchen_id
    ),
    updated_at = NOW()
  WHERE id = NEW.kitchen_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update kitchen rating when review is added/updated
CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_kitchen_rating();

-- Function to create notification when order status changes
CREATE OR REPLACE FUNCTION public.create_order_notification()
RETURNS TRIGGER AS $$
DECLARE
  notification_title TEXT;
  notification_message TEXT;
BEGIN
  -- Create notification for customer
  IF NEW.status != OLD.status THEN
    CASE NEW.status
      WHEN 'confirmed' THEN
        notification_title := 'Order Confirmed! 🎉';
        notification_message := 'Your order has been confirmed and the kitchen is preparing your meal with love.';
      WHEN 'preparing' THEN
        notification_title := 'Meal Being Prepared! 👨‍🍳';
        notification_message := 'Your delicious meal is being prepared fresh in the kitchen.';
      WHEN 'ready' THEN
        notification_title := 'Order Ready! 📦';
        notification_message := 'Your order is ready for delivery/pickup. Enjoy your home-cooked meal!';
      WHEN 'delivered' THEN
        notification_title := 'Order Delivered! 🚚';
        notification_message := 'Your order has been delivered. We hope you enjoy your meal!';
      WHEN 'cancelled' THEN
        notification_title := 'Order Cancelled';
        notification_message := 'Your order has been cancelled. Any payment will be refunded.';
    END CASE;
    
    INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
    VALUES (NEW.user_id, 'order_status', notification_title, notification_message, NEW.id, 'order');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create notifications on order status change
CREATE TRIGGER on_order_status_change
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION public.create_order_notification();

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON users TO anon, authenticated;
GRANT INSERT ON users TO anon, authenticated;
GRANT UPDATE ON users TO authenticated;

GRANT SELECT ON kitchens TO anon, authenticated;
GRANT INSERT ON kitchens TO authenticated;
GRANT UPDATE ON kitchens TO authenticated;

GRANT SELECT ON menu_items TO anon, authenticated;
GRANT INSERT ON menu_items TO authenticated;
GRANT UPDATE ON menu_items TO authenticated;

GRANT SELECT ON orders TO anon, authenticated;
GRANT INSERT ON orders TO authenticated;
GRANT UPDATE ON orders TO authenticated;

GRANT SELECT ON order_items TO anon, authenticated;
GRANT INSERT ON order_items TO authenticated;

GRANT SELECT ON reviews TO anon, authenticated;
GRANT INSERT ON reviews TO authenticated;
GRANT UPDATE ON reviews TO authenticated;
GRANT DELETE ON reviews TO authenticated;

GRANT SELECT ON favorites TO authenticated;
GRANT INSERT ON favorites TO authenticated;
GRANT DELETE ON favorites TO authenticated;

GRANT SELECT ON notifications TO authenticated;
GRANT UPDATE ON notifications TO authenticated;

-- Insert sample data for testing
INSERT INTO kitchens (
  user_id, name, owner_name, story, cuisine_type, description, 
  phone, email, address, is_active, status, opening_time, closing_time, 
  rating, cover_image
) VALUES (
  (SELECT id FROM users LIMIT 1),
  'Maa ki Rasoi',
  'Sunita Sharma',
  'I started cooking for my family 20 years ago, and now I want to share the same love and warmth with my neighborhood. Every dish is prepared with the same care I give my own children.',
  'North Indian',
  'Authentic North Indian home cooking with love and traditional recipes passed down through generations.',
  '+91 98765 43210',
  'sunita@maakirasoi.com',
  '{
    "street": "123 Gali No. 5, Krishna Nagar",
    "city": "Delhi",
    "state": "Delhi",
    "zipCode": "110051",
    "coordinates": {"lat": 28.6139, "lng": 77.2090}
  }',
  true,
  'approved',
  '08:00:00',
  '20:00:00',
  4.8,
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
);

INSERT INTO menu_items (
  kitchen_id, name, description, price, category, 
  dietary_info, preparation_time, image_url
) VALUES (
  (SELECT id FROM kitchens WHERE name = 'Maa ki Rasoi' LIMIT 1),
  'Rajma Chawal',
  'Creamy kidney beans curry served with fragrant basmati rice. My grandmother''s recipe that brings comfort to every soul.',
  120.00,
  'lunch',
  '{"is_veg": true, "is_vegan": false, "is_gluten_free": true, "is_spicy": false, "allergens": []}',
  45,
  'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
);