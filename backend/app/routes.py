from flask import Blueprint, request, jsonify, current_app
import jwt
from functools import wraps
from datetime import datetime, timedelta

auth = Blueprint('auth', __name__)

# Helper for Supabase client
def get_supabase():
    return current_app.supabase

# Decorator to require login
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"message": "Token is missing!"}), 403
        try:
            token = token.split(" ")[1]  # Extract the actual token part after "Bearer"
            decoded = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            request.email = decoded['user']  # Set the email in request context
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired!"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token!"}), 403
        return f(*args, **kwargs)
    return decorated

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data['email']
    password = data['password']

    supabase = get_supabase()
    check_response = supabase.table('users').select("id").eq("username", email).execute()

    if check_response.data:
        return jsonify({"message": "Email already registered"}), 400

    response = supabase.table('users').insert({"username": email, "password": password}).execute()

    return jsonify({"message": "User registered successfully"}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    supabase = get_supabase()
    response = supabase.table('users').select("*").eq("username", email).eq("password", password).execute()

    if len(response.data) == 0:
        return jsonify({"message": "Invalid email or password"}), 401

    # Generate JWT token with the user's email
    token = jwt.encode({
        'user': email,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, current_app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({"message": "Login successful", "token": token}), 200

@auth.route('/profile', methods=['GET'])
@token_required
def get_profile():
    email = request.email  # Retrieve the email from the token

    supabase = get_supabase()
    # Fetch both "username", "name", and "points"
    response = supabase.table('users').select("username, name, points").eq("username", email).execute()

    if response.data:
        user_data = response.data[0]  # Get the first user data object
        return jsonify({
            "email": email,
            "username": user_data['username'],
            "name": user_data.get('name', "User"),
            "points": user_data.get('points', 0)  # Ensure points default to 0 if missing
        }), 200
    else:
        return jsonify({"message": "User not found"}), 404


@auth.route('/update-name', methods=['PUT'])
@token_required
def update_name():
    data = request.get_json()
    new_name = data.get("name")

    if not new_name:
        return jsonify({"message": "Name is required"}), 400

    # Update the user's name in the database
    email = request.email  # Use the email from the token
    supabase = get_supabase()
    response = supabase.table("users").update({"name": new_name}).eq("username", email).execute()

    return jsonify({"message": "Name updated successfully"}), 200

@auth.route('/update-points', methods=['POST'])
@token_required
def update_points():
    data = request.get_json()
    points = data.get("points")

    if points is None:
        return jsonify({"message": "Points value is required"}), 400

    email = request.email  # Use email from the token
    supabase = get_supabase()

    # Fetch current points
    response = supabase.table("users").select("points").eq("username", email).execute()
    if response.data:
        current_points = response.data[0].get("points", 0)  # Default to 0 if no points
        new_points = current_points + points

        # Update points in the database
        update_response = supabase.table("users").update({"points": new_points}).eq("username", email).execute()

        if update_response.data:
            return jsonify({"message": "Points updated successfully", "new_points": new_points}), 200
        else:
            return jsonify({"message": "Failed to update points"}), 500
    else:
        return jsonify({"message": "User not found"}), 404
