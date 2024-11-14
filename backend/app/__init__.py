from flask import Flask
from flask_cors import CORS
from instance.config import Config  # Gunakan import absolut
from supabase import create_client, Client

supabase: Client = None

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inisialisasi Supabase
    global supabase
    supabase = create_client(app.config['SUPABASE_URL'], app.config['SUPABASE_KEY'])

    # Tambahkan supabase ke atribut app
    app.supabase = supabase

    # Register blueprint atau rute lainnya
    from .routes import auth
    app.register_blueprint(auth)

    CORS(app)
    return app
