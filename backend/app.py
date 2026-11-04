# Flask backend for Kim's Texas Caffe.
# It exposes a small REST API used by the React frontend and the admin dashboard.
import os
import secrets
import sqlite3
from functools import wraps

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), 'cafe.db')
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'kimtexascafe123')

business = {
    'name': 'Kim’s Texas Caffe',
    'shortName': 'Texas Caffe',
    'phone': '+254 796 999547',
    'phoneHref': 'tel:+254796999547',
    'whatsappHref': 'https://wa.me/254796999547',
    'address': 'Next to Magunas, Ndenderu, Kiambu County, Kenya',
    'description': 'A casual neighbourhood café serving fresh coffee, iconic comfort meals and easy family-friendly dining in Ndenderu.',
    'hours': 'Mon - Sun • 8:00 AM - 11:00 PM',
}

hero_slides = [
    {
        'title': 'Good Food. Great Moments.',
        'subtitle': 'Fresh coffee, hearty meals and laid-back vibes in the heart of Ndenderu.',
        'image': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
    },
    {
        'title': 'Brewed for busy mornings.',
        'subtitle': 'Start strong with smooth espresso, creamy cappuccinos and breakfast favourites made for everyday routines.',
        'image': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    },
    {
        'title': 'Comfort food that feels like home.',
        'subtitle': 'From juicy burgers to loaded shawarma, every plate is crafted to satisfy cravings and spark conversations.',
        'image': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    },
]

categories = [
    'Coffee & Hot Drinks',
    'Fresh Juices & Cold Drinks',
    'Burgers & Quick Bites',
    'Main Meals',
    'Pizza & Grills',
    'Desserts & Treats',
]

menu_seed = [
    {'id': 1, 'name': 'Cappuccino', 'category': 'Coffee & Hot Drinks', 'price': 'KSh 420', 'description': 'A rich espresso-based coffee with velvety foam and a smooth finish.', 'image': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80', 'featured': 1},
    {'id': 2, 'name': 'Mango Burst', 'category': 'Fresh Juices & Cold Drinks', 'price': 'KSh 350', 'description': 'Fresh mango juice blended with a citrus twist for a vibrant, refreshing sip.', 'image': 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80', 'featured': 1},
    {'id': 3, 'name': 'Texas Burger', 'category': 'Burgers & Quick Bites', 'price': 'KSh 680', 'description': 'Juicy beef patty, crisp lettuce, tomato and signature sauce in a toasted bun.', 'image': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80', 'featured': 1},
    {'id': 4, 'name': 'Chicken Shawarma', 'category': 'Main Meals', 'price': 'KSh 520', 'description': 'Loaded with grilled chicken, fresh veg and a creamy garlic sauce wrapped to perfection.', 'image': 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=80', 'featured': 0},
    {'id': 5, 'name': 'Beef Pizza', 'category': 'Pizza & Grills', 'price': 'KSh 1,250', 'description': 'Stone-baked pizza with mozzarella, beef slices and a rich tomato base.', 'image': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80', 'featured': 1},
    {'id': 6, 'name': 'Mixed Grill Platter', 'category': 'Pizza & Grills', 'price': 'KSh 1,700', 'description': 'A hearty platter with grilled chicken, beef, chips and a side of fresh salad.', 'image': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80', 'featured': 0},
    {'id': 7, 'name': 'Vanilla Cheesecake', 'category': 'Desserts & Treats', 'price': 'KSh 430', 'description': 'Smooth, creamy and indulgent with a wafer crumb base and silky vanilla finish.', 'image': 'https://images.unsplash.com/photo-1533134242443-d6adb086179d?auto=format&fit=crop&w=900&q=80', 'featured': 0},
    {'id': 8, 'name': 'Lemonade Spritz', 'category': 'Fresh Juices & Cold Drinks', 'price': 'KSh 300', 'description': 'House-made lemonade with a bright citrus kick and a refreshing finish.', 'image': 'https://images.unsplash.com/photo-1622483767028-3f66f2b0c1d4?auto=format&fit=crop&w=900&q=80', 'featured': 0},
]

offer_seed = [
    {'id': 1, 'title': 'Midweek Coffee Combo', 'description': 'Any cappuccino or latte with a slice of cake for KSh 700.', 'valid': 'Valid until 30 Nov 2026'},
    {'id': 2, 'title': 'Family Meal Deal', 'description': 'Two burgers, fries and two soft drinks for KSh 1,500.', 'valid': 'Valid until 15 Dec 2026'},
    {'id': 3, 'title': 'Fresh Juice Happy Hour', 'description': 'Buy two fruit blends and enjoy a 15% discount after 4 PM.', 'valid': 'Available weekdays only'},
]

gallery_images = [
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
]


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS menu (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price TEXT NOT NULL,
            description TEXT,
            image TEXT,
            featured INTEGER DEFAULT 0
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS offers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            valid TEXT
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS inquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            phone TEXT,
            message TEXT,
            status TEXT DEFAULT 'New'
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS admin_sessions (
            token TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    menu_count = conn.execute('SELECT COUNT(*) AS total FROM menu').fetchone()['total']
    if menu_count == 0:
        conn.executemany(
            'INSERT INTO menu (id, name, category, price, description, image, featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [(
                item['id'], item['name'], item['category'], item['price'], item['description'], item['image'], int(item['featured'])
            ) for item in menu_seed]
        )

    offers_count = conn.execute('SELECT COUNT(*) AS total FROM offers').fetchone()['total']
    if offers_count == 0:
        conn.executemany(
            'INSERT INTO offers (id, title, description, valid) VALUES (?, ?, ?, ?)',
            [(item['id'], item['title'], item['description'], item['valid']) for item in offer_seed]
        )

    inquiry_count = conn.execute('SELECT COUNT(*) AS total FROM inquiries').fetchone()['total']
    if inquiry_count == 0:
        conn.executemany(
            'INSERT INTO inquiries (id, name, phone, message, status) VALUES (?, ?, ?, ?, ?)',
            [
                (1, 'Njeri', '+254 700 000 001', 'I would like to reserve a table for Friday evening.', 'New'),
                (2, 'Samuel', '+254 712 345 678', 'Can I order a family meal deal for takeaway?', 'Pending'),
                (3, 'Asha', '+254 722 111 222', 'Do you offer delivery for burgers after 8 PM?', 'Responded'),
            ]
        )

    conn.commit()
    conn.close()


def to_bool(value):
    return bool(value) if not isinstance(value, bool) else value


def fetch_all_menu():
    conn = get_db()
    rows = conn.execute('SELECT * FROM menu ORDER BY id DESC').fetchall()
    conn.close()
    return [dict(row) for row in rows]


def fetch_all_offers():
    conn = get_db()
    rows = conn.execute('SELECT * FROM offers ORDER BY id DESC').fetchall()
    conn.close()
    return [dict(row) for row in rows]


def fetch_all_inquiries():
    conn = get_db()
    rows = conn.execute('SELECT * FROM inquiries ORDER BY id DESC').fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_authenticated_user():
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None

    token = auth_header.replace('Bearer ', '', 1).strip()
    conn = get_db()
    row = conn.execute('SELECT username FROM admin_sessions WHERE token = ?', (token,)).fetchone()
    conn.close()
    return row['username'] if row else None


def require_admin_auth(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user = get_authenticated_user()
        if user is None:
            return jsonify({'error': 'Authentication required'}), 401
        return func(*args, **kwargs)

    return wrapper


init_db()


@app.get('/health')
def health():
    return jsonify({'status': 'ok', 'service': "Kim's Texas Caffe API"})


@app.get('/api/business')
def get_business():
    return jsonify(business)


@app.get('/api/categories')
def get_categories():
    return jsonify(categories)


@app.get('/api/hero')
def get_hero():
    return jsonify(hero_slides)


@app.get('/api/menu')
def get_menu():
    return jsonify(fetch_all_menu())


@app.get('/api/offers')
def get_offers():
    return jsonify(fetch_all_offers())


@app.get('/api/gallery')
def get_gallery():
    return jsonify(gallery_images)


@app.post('/api/admin/login')
def admin_login():
    payload = request.get_json(silent=True) or {}
    username = payload.get('username', '')
    password = payload.get('password', '')

    if username != ADMIN_USERNAME or password != ADMIN_PASSWORD:
        return jsonify({'error': 'Invalid credentials'}), 401

    token = secrets.token_urlsafe(32)
    conn = get_db()
    conn.execute('INSERT INTO admin_sessions (token, username) VALUES (?, ?)', (token, username))
    conn.commit()
    conn.close()

    return jsonify({'token': token, 'username': username})


@app.post('/api/admin/logout')
@require_admin_auth
def admin_logout():
    token = request.headers.get('Authorization', '').replace('Bearer ', '', 1).strip()
    conn = get_db()
    conn.execute('DELETE FROM admin_sessions WHERE token = ?', (token,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'logged_out'})


@app.get('/api/admin/me')
@require_admin_auth
def admin_me():
    return jsonify({'username': get_authenticated_user()})


@app.get('/api/admin/summary')
@require_admin_auth
def get_admin_summary():
    return jsonify({
        'totalMenuItems': len(fetch_all_menu()),
        'activeOffers': len(fetch_all_offers()),
        'newInquiries': len(fetch_all_inquiries()),
        'dailyRevenue': 'KSh 34,500',
    })


@app.get('/api/admin/menu')
@require_admin_auth
def get_admin_menu():
    return jsonify(fetch_all_menu())


@app.get('/api/admin/offers')
@require_admin_auth
def get_admin_offers():
    return jsonify(fetch_all_offers())


@app.get('/api/admin/inquiries')
@require_admin_auth
def get_admin_inquiries():
    return jsonify(fetch_all_inquiries())


@app.post('/api/admin/menu')
@require_admin_auth
def add_admin_menu_item():
    payload = request.get_json(silent=True) or {}
    conn = get_db()
    cursor = conn.execute(
        'INSERT INTO menu (name, category, price, description, image, featured) VALUES (?, ?, ?, ?, ?, ?)',
        (
            payload.get('name', 'New Item'),
            payload.get('category', 'Coffee & Hot Drinks'),
            payload.get('price', 'KSh 0'),
            payload.get('description', ''),
            payload.get('image', ''),
            1 if payload.get('featured', False) else 0,
        )
    )
    conn.commit()
    new_id = cursor.lastrowid
    row = conn.execute('SELECT * FROM menu WHERE id = ?', (new_id,)).fetchone()
    conn.close()
    return jsonify([dict(row)])


@app.put('/api/admin/menu/<int:item_id>')
@require_admin_auth
def update_admin_menu_item(item_id):
    payload = request.get_json(silent=True) or {}
    conn = get_db()
    conn.execute(
        'UPDATE menu SET name = ?, category = ?, price = ?, description = ?, image = ?, featured = ? WHERE id = ?',
        (
            payload.get('name', ''),
            payload.get('category', 'Coffee & Hot Drinks'),
            payload.get('price', 'KSh 0'),
            payload.get('description', ''),
            payload.get('image', ''),
            1 if payload.get('featured', False) else 0,
            item_id,
        )
    )
    row = conn.execute('SELECT * FROM menu WHERE id = ?', (item_id,)).fetchone()
    conn.commit()
    conn.close()

    if row is None:
        return jsonify({'error': 'Menu item not found'}), 404
    return jsonify([dict(row)])


@app.delete('/api/admin/menu/<int:item_id>')
@require_admin_auth
def delete_admin_menu_item(item_id):
    conn = get_db()
    conn.execute('DELETE FROM menu WHERE id = ?', (item_id,))
    conn.commit()
    conn.close()
    return jsonify({'deleted': item_id})


@app.post('/api/admin/offers')
@require_admin_auth
def add_admin_offer():
    payload = request.get_json(silent=True) or {}
    conn = get_db()
    cursor = conn.execute(
        'INSERT INTO offers (title, description, valid) VALUES (?, ?, ?)',
        (
            payload.get('title', 'New Offer'),
            payload.get('description', ''),
            payload.get('valid', 'Available this week'),
        )
    )
    conn.commit()
    row = conn.execute('SELECT * FROM offers WHERE id = ?', (cursor.lastrowid,)).fetchone()
    conn.close()
    return jsonify([dict(row)])


@app.put('/api/admin/offers/<int:offer_id>')
@require_admin_auth
def update_admin_offer(offer_id):
    payload = request.get_json(silent=True) or {}
    conn = get_db()
    conn.execute(
        'UPDATE offers SET title = ?, description = ?, valid = ? WHERE id = ?',
        (
            payload.get('title', ''),
            payload.get('description', ''),
            payload.get('valid', 'Available this week'),
            offer_id,
        )
    )
    row = conn.execute('SELECT * FROM offers WHERE id = ?', (offer_id,)).fetchone()
    conn.commit()
    conn.close()

    if row is None:
        return jsonify({'error': 'Offer not found'}), 404
    return jsonify([dict(row)])


@app.delete('/api/admin/offers/<int:offer_id>')
@require_admin_auth
def delete_admin_offer(offer_id):
    conn = get_db()
    conn.execute('DELETE FROM offers WHERE id = ?', (offer_id,))
    conn.commit()
    conn.close()
    return jsonify({'deleted': offer_id})


@app.post('/api/contact')
def post_contact():
    payload = request.get_json(silent=True) or {}
    name = payload.get('name', '')
    phone = payload.get('phone', '')
    message = payload.get('message', '')

    conn = get_db()
    conn.execute(
        'INSERT INTO inquiries (name, phone, message, status) VALUES (?, ?, ?, ?)',
        (name, phone, message, 'New')
    )
    conn.commit()
    conn.close()

    return jsonify({
        'status': 'queued',
        'message': f'Thanks {name or "guest"}! Your enquiry has been captured for follow-up via phone or WhatsApp.',
        'phone': phone,
        'details': message,
    })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
