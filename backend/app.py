# Flask backend for Kim's Texas Caffe.
# It exposes a small REST API used by the React frontend and the admin dashboard.
import hashlib
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
    {'id': 1, 'name': 'Cappuccino', 'category': 'Coffee & Hot Drinks', 'price': 'KSh 420', 'description': 'A rich espresso-based coffee with velvety foam and a smooth finish.', 'image': '/images/drinks-menu.jpeg', 'featured': 1},
    {'id': 2, 'name': 'Mango Burst', 'category': 'Fresh Juices & Cold Drinks', 'price': 'KSh 350', 'description': 'Fresh mango juice blended with a citrus twist for a vibrant, refreshing sip.', 'image': '/images/beverage-selection.jpeg', 'featured': 1},
    {'id': 3, 'name': 'Texas Burger', 'category': 'Burgers & Quick Bites', 'price': 'KSh 680', 'description': 'Juicy beef patty, crisp lettuce, tomato and signature sauce in a toasted bun.', 'image': '/images/pizza-burgers-shawarma.jpeg', 'featured': 1},
    {'id': 4, 'name': 'Chicken Shawarma', 'category': 'Main Meals', 'price': 'KSh 520', 'description': 'Loaded with grilled chicken, fresh veg and a creamy garlic sauce wrapped to perfection.', 'image': '/images/pizza-burgers-shawarma.jpeg', 'featured': 0},
    {'id': 5, 'name': 'Beef Pizza', 'category': 'Pizza & Grills', 'price': 'KSh 1,250', 'description': 'Stone-baked pizza with mozzarella, beef slices and a rich tomato base.', 'image': '/images/pizza-burgers-shawarma.jpeg', 'featured': 1},
    {'id': 6, 'name': 'Mixed Grill Platter', 'category': 'Pizza & Grills', 'price': 'KSh 1,700', 'description': 'A hearty platter with grilled chicken, beef, chips and a side of fresh salad.', 'image': '/images/main-dishes.jpeg', 'featured': 0},
    {'id': 7, 'name': 'Vanilla Cheesecake', 'category': 'Desserts & Treats', 'price': 'KSh 430', 'description': 'Smooth, creamy and indulgent with a wafer crumb base and silky vanilla finish.', 'image': '/images/food-platter.jpeg', 'featured': 0},
    {'id': 8, 'name': 'Lemonade Spritz', 'category': 'Fresh Juices & Cold Drinks', 'price': 'KSh 300', 'description': 'House-made lemonade with a bright citrus kick and a refreshing finish.', 'image': '/images/beverage-selection.jpeg', 'featured': 0},
]

offer_seed = [
    {'id': 1, 'title': 'Midweek Coffee Combo', 'description': 'Any cappuccino or latte with a slice of cake for KSh 700.', 'valid': 'Valid until 30 Nov 2026'},
    {'id': 2, 'title': 'Family Meal Deal', 'description': 'Two burgers, fries and two soft drinks for KSh 1,500.', 'valid': 'Valid until 15 Dec 2026'},
    {'id': 3, 'title': 'Fresh Juice Happy Hour', 'description': 'Buy two fruit blends and enjoy a 15% discount after 4 PM.', 'valid': 'Available weekdays only'},
]

gallery_images = [
    '/images/main-dishes.jpeg',
    '/images/drinks-menu.jpeg',
    '/images/pizza-burgers-shawarma.jpeg',
    '/images/beverage-selection.jpeg',
    '/images/food-platter.jpeg',
    '/images/grilled-bites.jpeg',
]


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def hash_password(password):
    return hashlib.sha256(str(password).encode('utf-8')).hexdigest()


def normalize_permissions(raw_permissions):
    if raw_permissions is None:
        return []

    if isinstance(raw_permissions, str):
        entries = raw_permissions.split(',')
    elif isinstance(raw_permissions, (list, tuple, set)):
        entries = raw_permissions
    else:
        entries = [raw_permissions]

    return [str(item).strip() for item in entries if str(item).strip()]


def get_admin_permissions(username):
    conn = get_db()
    row = conn.execute(
        'SELECT permissions FROM admins WHERE username = ?',
        (username,),
    ).fetchone()
    conn.close()

    if row is None:
        return []

    return normalize_permissions(row['permissions'])


def ensure_default_admin_account(conn):
    permission_string = 'menu,prices,images,offers,accounts'
    row = conn.execute('SELECT username FROM admins WHERE username = ?', (ADMIN_USERNAME,)).fetchone()
    if row is None:
        conn.execute(
            'INSERT INTO admins (username, password_hash, permissions) VALUES (?, ?, ?)',
            (ADMIN_USERNAME, hash_password(ADMIN_PASSWORD), permission_string),
        )
    else:
        conn.execute(
            'UPDATE admins SET password_hash = ?, permissions = ? WHERE username = ?',
            (hash_password(ADMIN_PASSWORD), permission_string, ADMIN_USERNAME),
        )


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
        CREATE TABLE IF NOT EXISTS admins (
            username TEXT PRIMARY KEY,
            password_hash TEXT NOT NULL,
            permissions TEXT DEFAULT 'menu,prices,images,offers'
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS admin_sessions (
            token TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    ensure_default_admin_account(conn)

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


def fetch_all_admins():
    conn = get_db()
    rows = conn.execute('SELECT username, permissions FROM admins ORDER BY username ASC').fetchall()
    conn.close()

    admins = []
    for row in rows:
        admins.append({
            'username': row['username'],
            'permissions': normalize_permissions(row['permissions']),
        })
    return admins


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


def require_admin_permission(*permissions):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user = get_authenticated_user()
            if user is None:
                return jsonify({'error': 'Authentication required'}), 401

            user_permissions = set(get_admin_permissions(user))
            allowed = set(permissions)
            if not user_permissions.intersection(allowed):
                joined = ', '.join(permissions) if permissions else 'admin access'
                return jsonify({'error': f'Permission required: {joined}'}), 403

            return func(*args, **kwargs)

        return wrapper

    return decorator


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

    conn = get_db()
    row = conn.execute(
        'SELECT username, password_hash, permissions FROM admins WHERE username = ?',
        (username,),
    ).fetchone()
    is_valid = bool(row) and row['password_hash'] == hash_password(password)
    conn.close()

    if not is_valid:
        return jsonify({'error': 'Invalid credentials'}), 401

    token = secrets.token_urlsafe(32)
    conn = get_db()
    conn.execute(
        'INSERT OR REPLACE INTO admin_sessions (token, username) VALUES (?, ?)',
        (token, username),
    )
    conn.commit()
    conn.close()

    return jsonify({
        'token': token,
        'username': username,
        'permissions': get_admin_permissions(username),
    })


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
    username = get_authenticated_user()
    return jsonify({'username': username, 'permissions': get_admin_permissions(username)})


@app.get('/api/admin/accounts')
@require_admin_permission('accounts')
def get_admin_accounts():
    return jsonify(fetch_all_admins())


@app.post('/api/admin/accounts')
@require_admin_permission('accounts')
def create_admin_account():
    payload = request.get_json(silent=True) or {}
    username = str(payload.get('username', '')).strip()
    password = str(payload.get('password', '')).strip()
    permissions = normalize_permissions(payload.get('permissions', ['menu', 'prices', 'images', 'offers']))

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    conn = get_db()
    existing = conn.execute('SELECT username FROM admins WHERE username = ?', (username,)).fetchone()
    if existing is not None:
        conn.close()
        return jsonify({'error': 'Admin account already exists'}), 409

    conn.execute(
        'INSERT INTO admins (username, password_hash, permissions) VALUES (?, ?, ?)',
        (username, hash_password(password), ','.join(permissions)),
    )
    conn.commit()
    conn.close()

    return jsonify({'username': username, 'permissions': permissions})


@app.put('/api/admin/accounts/<username>')
@require_admin_permission('accounts')
def update_admin_account(username):
    payload = request.get_json(silent=True) or {}
    permissions = normalize_permissions(payload.get('permissions', []))
    password = str(payload.get('password', '')).strip()

    if not permissions:
        return jsonify({'error': 'At least one permission is required'}), 400

    conn = get_db()
    if username == ADMIN_USERNAME:
        if password:
            conn.execute(
                'UPDATE admins SET password_hash = ?, permissions = ? WHERE username = ?',
                (hash_password(password), ','.join(permissions), username),
            )
        else:
            conn.execute(
                'UPDATE admins SET permissions = ? WHERE username = ?',
                (','.join(permissions), username),
            )
    else:
        if password:
            conn.execute(
                'UPDATE admins SET password_hash = ?, permissions = ? WHERE username = ?',
                (hash_password(password), ','.join(permissions), username),
            )
        else:
            conn.execute(
                'UPDATE admins SET permissions = ? WHERE username = ?',
                (','.join(permissions), username),
            )
    conn.commit()
    conn.close()
    return jsonify({'username': username, 'permissions': permissions})


@app.delete('/api/admin/accounts/<username>')
@require_admin_permission('accounts')
def delete_admin_account(username):
    if username == ADMIN_USERNAME:
        return jsonify({'error': 'The default admin account cannot be deleted'}), 400

    conn = get_db()
    conn.execute('DELETE FROM admin_sessions WHERE username = ?', (username,))
    conn.execute('DELETE FROM admins WHERE username = ?', (username,))
    conn.commit()
    conn.close()
    return jsonify({'deleted': username})


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
@require_admin_permission('menu', 'prices', 'images')
def get_admin_menu():
    return jsonify(fetch_all_menu())


@app.get('/api/admin/offers')
@require_admin_permission('offers')
def get_admin_offers():
    return jsonify(fetch_all_offers())


@app.get('/api/admin/inquiries')
@require_admin_auth
def get_admin_inquiries():
    return jsonify(fetch_all_inquiries())


@app.post('/api/admin/menu')
@require_admin_permission('menu', 'prices', 'images')
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
@require_admin_permission('menu', 'prices', 'images')
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
@require_admin_permission('menu', 'prices', 'images')
def delete_admin_menu_item(item_id):
    conn = get_db()
    conn.execute('DELETE FROM menu WHERE id = ?', (item_id,))
    conn.commit()
    conn.close()
    return jsonify({'deleted': item_id})


@app.post('/api/admin/offers')
@require_admin_permission('offers')
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
@require_admin_permission('offers')
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
@require_admin_permission('offers')
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
