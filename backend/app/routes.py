from flask import Blueprint, request, jsonify, current_app

auth = Blueprint('auth', __name__)

# Helper untuk mendapatkan client Supabase
def get_supabase():
    return current_app.supabase

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data['email']
    password = data['password']

    # Akses Supabase dan periksa apakah username/email sudah ada
    supabase = get_supabase()
    check_response = supabase.table('users').select("id").eq("username", email).execute()

    # Jika username sudah ada, kembalikan pesan error
    if check_response.data:
        return jsonify({"message": "Email already registered"}), 400

    # Jika username belum ada, lanjutkan untuk menyimpan data
    response = supabase.table('users').insert({"username": email, "password": password}).execute()

    return jsonify({"message": "User registered successfully"}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    # Query untuk mendapatkan pengguna dengan email dan password yang sesuai
    supabase = get_supabase()
    response = supabase.table('users').select("*").eq("username", email).eq("password", password).execute()

    # Jika tidak ada data yang ditemukan, berarti login gagal
    if len(response.data) == 0:
        return jsonify({"message": "Invalid email or password"}), 401

    return jsonify({"message": "Login successful"}), 200
