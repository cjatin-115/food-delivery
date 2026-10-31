-- Seed data for TastyTrail food delivery app
-- Prices are stored in paise (100 paise = ₹1)
-- Ratings are stored x10 (46 => 4.6)

TRUNCATE menu_items, restaurants, orders RESTART IDENTITY CASCADE;

INSERT INTO restaurants (id, name, slug, cuisine, tagline, emoji, image, rating, rating_count, delivery_minutes, price_for_two, gradient_from, gradient_to, is_open) VALUES
(1, 'Nonna''s Wood-Fired Pizza', 'nonnas-pizza', 'Italian', 'Authentic Neapolitan pies from a 400°C wood oven', '🍕', NULL, 46, 284, 32, 350, '#FFE9D6', '#FFC48C', true),
(2, 'Burger Bistro', 'burger-bistro', 'American', 'Smash burgers, loaded fries & thick shakes', '🍔', NULL, 44, 512, 25, 300, '#FFE7E4', '#F7B2A6', true),
(3, 'Sakura Sushi House', 'sakura-sushi', 'Japanese', 'Fresh sushi & sashimi crafted daily', '🍣', NULL, 48, 168, 40, 650, '#FFE4EC', '#F7AFCB', true),
(4, 'Spice Route Biryanis', 'spice-route', 'Indian', 'Dum-cooked biryanis & rich Mughlai curries', '🍛', NULL, 45, 934, 35, 400, '#FFF3D6', '#F5D68A', true),
(5, 'Green Bowl Co.', 'green-bowl', 'Healthy & Salads', 'Wholesome bowls, salads & cold-pressed juice', '🥗', NULL, 42, 276, 20, 280, '#E2F3E4', '#A8DDB0', true),
(6, 'Sugar & Steam', 'sugar-steam', 'Desserts', 'Baked fresh every morning, just for you', '🍰', NULL, 47, 389, 30, 220, '#EAE4FF', '#C6B8F5', true);

INSERT INTO menu_items (restaurant_id, name, description, price, category, emoji, is_veg, is_bestseller) VALUES
-- Nonna's Wood-Fired Pizza
(1, 'Margherita Pizza', 'Classic delight with 100% real mozzarella cheese', 24900, 'Recommended', '🍕', true, true),
(1, 'Farmhouse Pizza', 'Onion, capsicum, tomato & mushroom', 32900, 'Recommended', '🍕', true, true),
(1, 'Chicken Pepperoni Pizza', 'Loaded with spicy pepperoni & extra cheese', 39900, 'Recommended', '🍕', false, false),
(1, 'Garlic Bread Sticks', 'Baked to perfection with garlic butter', 12900, 'Starters', '🥖', true, false),
(1, 'Bruschetta', 'Toasted ciabatta, tomato & fresh basil', 14900, 'Starters', '🍅', true, false),
(1, 'Pasta Alfredo', 'Creamy white sauce penne pasta', 21900, 'Mains', '🍝', true, false),
(1, 'Tiramisu', 'Classic Italian coffee-soaked dessert', 17900, 'Desserts', '🍮', true, false),
(1, 'Fresh Lime Soda', 'Refreshing sparkling lime drink', 7900, 'Drinks', '🥤', true, false),
-- Burger Bistro
(2, 'Classic Cheeseburger', 'Juicy smash patty with melted cheddar', 19900, 'Recommended', '🍔', false, true),
(2, 'Crispy Chicken Burger', 'Buttermilk fried chicken with slaw', 22900, 'Recommended', '🍔', false, true),
(2, 'Veggie Supreme Burger', 'Spiced potato & pea patty with mint mayo', 16900, 'Recommended', '🍔', true, false),
(2, 'Loaded Fries', 'Cheese sauce, jalapeño & chipotle', 13900, 'Sides', '🍟', true, false),
(2, 'BBQ Chicken Wings (6 pcs)', 'Sticky smoky BBQ glaze', 24900, 'Starters', '🍗', false, false),
(2, 'Chocolate Milkshake', 'Thick, creamy & indulgent', 12900, 'Drinks', '🥛', true, false),
(2, 'Onion Rings', 'Crispy golden battered rings', 9900, 'Sides', '🧅', true, false),
-- Sakura Sushi House
(3, 'California Roll (8 pcs)', 'Crab stick, avocado & cucumber', 44900, 'Recommended', '🍣', false, true),
(3, 'Salmon Nigiri (4 pcs)', 'Fresh salmon over seasoned rice', 52900, 'Recommended', '🍣', false, true),
(3, 'Vegetable Tempura', 'Lightly battered seasonal vegetables', 32900, 'Starters', '🍤', true, false),
(3, 'Chicken Gyoza (5 pcs)', 'Pan-searched dumplings with ponzu', 29900, 'Starters', '🥟', false, false),
(3, 'Spicy Tuna Roll', 'Tuna, sriracha mayo & scallion', 47900, 'Rolls', '🍣', false, false),
(3, 'Miso Soup', 'Tofu, seaweed & white miso', 14900, 'Sides', '🍜', true, false),
(3, 'Matcha Cheesecake', 'Japanese green tea cheesecake', 25900, 'Desserts', '🍰', true, false),
(3, 'Ramune Soda', 'Japanese marble soda', 15900, 'Drinks', '🥤', true, false),
-- Spice Route Biryanis
(4, 'Hyderabadi Chicken Dum Biryani', 'Slow-cooked aromatic basmati & chicken', 32900, 'Recommended', '🍛', false, true),
(4, 'Mutton Gosht Biryani', 'Tender mutton with signature spices', 42900, 'Recommended', '🍛', false, true),
(4, 'Paneer Tikka Biryani', 'Smoky paneer & saffron rice', 28900, 'Recommended', '🍛', true, false),
(4, 'Butter Chicken', 'Creamy tomato gravy with tandoori chicken', 34900, 'Mains', '🍗', false, false),
(4, 'Dal Makhani', 'Slow-cooked black lentils & butter', 19900, 'Mains', '🥘', true, false),
(4, 'Garlic Naan', 'Tandoor-baked with garlic & butter', 4900, 'Breads', '🫓', true, false),
(4, 'Gulab Jamun (2 pcs)', 'Warm milk dumplings in syrup', 9900, 'Desserts', '🍡', true, false),
(4, 'Masala Chaas', 'Spiced chilled buttermilk', 5900, 'Drinks', '🥛', true, false),
-- Green Bowl Co.
(5, 'Caesar Salad Bowl', 'Romaine, parmesan & sourdough croutons', 22900, 'Recommended', '🥗', true, true),
(5, 'Quinoa Power Bowl', 'Quinoa, chickpea, avocado & tahini', 27900, 'Recommended', '🥙', true, true),
(5, 'Grilled Chicken Bowl', 'Herb chicken, brown rice & greens', 31900, 'Bowls', '🍱', false, false),
(5, 'Peanut Butter Smoothie', 'Banana, oats & peanut butter', 16900, 'Smoothies', '🥤', true, false),
(5, 'Berry Yogurt Parfait', 'Greek yogurt, granola & mixed berries', 18900, 'Smoothies', '🫐', true, false),
(5, 'Hummus & Pita', 'Classic chickpea dip with warm pita', 17900, 'Sides', '🥙', true, false),
(5, 'Cold-Pressed Green Juice', 'Spinach, apple, cucumber & ginger', 14900, 'Drinks', '🥬', true, false),
-- Sugar & Steam
(6, 'Molten Lava Cake', 'Warm flowing chocolate centre', 15900, 'Recommended', '🍫', true, true),
(6, 'New York Cheesecake', 'Classic baked vanilla cheesecake', 19900, 'Recommended', '🍰', true, true),
(6, 'Cinnamon Rolls (2 pcs)', 'Soft rolls with cream cheese frosting', 17900, 'Bakery', '🥮', true, false),
(6, 'Belgian Waffle', 'Berries, cream & maple syrup', 18900, 'Waffles', '🧇', true, false),
(6, 'Cold Coffee Frappe', 'Blended coffee, milk & cream', 13900, 'Drinks', '🧋', true, false),
(6, 'Choco Chip Cookies (4 pcs)', 'Freshly baked, gooey centre', 11900, 'Bakery', '🍪', true, false),
(6, 'Ice Cream Sundae', 'Vanilla scoops with hot fudge', 14900, 'Desserts', '🍨', true, false);

SELECT setval('restaurants_id_seq', (SELECT MAX(id) FROM restaurants));
SELECT setval('menu_items_id_seq', (SELECT MAX(id) FROM menu_items));
