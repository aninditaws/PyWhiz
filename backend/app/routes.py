from flask import request, redirect, url_for, jsonify
from flask_login import login_user, login_required, logout_user, current_user
from .models import User
from . import db, bcrypt
from flask_dance.contrib.google import google
from flask import Blueprint

# Blueprint untuk route autentikasi
auth = Blueprint('auth', __name__)

@auth.route('/')
def home():
    return jsonify({"message": "Welcome to PyWhiz API!"})

# Rute untuk registrasi pengguna baru (sign up)
@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    # Validasi input
    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Please provide username, email, and password"}), 400

    # Cek apakah pengguna sudah ada berdasarkan email
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"message": "User already exists"}), 409

    # Hash password dan buat user baru
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# Rute untuk login manual (sign in)
@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    # Verifikasi password
    if user and bcrypt.check_password_hash(user.password, data['password']):
        login_user(user)
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"message": "Invalid email or password"}), 401

# Rute untuk logout
@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200

# Rute untuk login menggunakan Google OAuth
@auth.route('/google')
def google_login():
    if not google.authorized:
        return redirect(url_for("google.login"))

    # Mengambil informasi pengguna dari Google
    resp = google.get("/userinfo")
    google_info = resp.json()
    google_id = google_info["id"]
    email = google_info["email"]

    # Cek apakah pengguna sudah ada di database berdasarkan Google ID
    user = User.query.filter_by(google_id=google_id).first()
    if not user:
        # Jika pengguna belum ada, buat akun baru dengan Google ID dan email
        user = User(email=email, google_id=google_id)
        db.session.add(user)
        db.session.commit()

    # Login pengguna menggunakan Flask-Login
    login_user(user)
    return jsonify({"message": "Google login successful"}), 200
