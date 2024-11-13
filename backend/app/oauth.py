from flask_dance.contrib.google import make_google_blueprint
import os

google_bp = make_google_blueprint(
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    redirect_to="auth.google_login"  # Mengarahkan ke rute setelah login Google berhasil
)
