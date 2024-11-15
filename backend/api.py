import os
from app import create_app
from supabase import create_client, Client

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

app = create_app()

app.supabase = supabase

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
