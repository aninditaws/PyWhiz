from flask import Flask
from flask_cors import CORS
from instance.config import Config
from supabase import create_client, Client

supabase: Client = None

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize Supabase
    global supabase
    supabase = create_client(app.config['SUPABASE_URL'], app.config['SUPABASE_KEY'])

    # Add Supabase to Ap
    app.supabase = supabase

    # Register Blueprint
    from .routes import auth
    app.register_blueprint(auth)

    CORS(app, resources={r"/*": {"origins": "https://py-whiz.vercel.app"}})
    return app
