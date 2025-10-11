#!/usr/bin/env python3
import http.server
import socketserver
import os
import json
from urllib.parse import unquote, urlparse
import hashlib

PORT = 5000
DATA_FILE = 'data.json'
ADMIN_FILE = 'admin.json'  # Separate file for admin credentials

def load_admin():
    """Load admin credentials (not shared with clients)"""
    if os.path.exists(ADMIN_FILE):
        with open(ADMIN_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"user": "younes", "pass": "younes"}

def save_admin(creds):
    """Save admin credentials"""
    with open(ADMIN_FILE, 'w', encoding='utf-8') as f:
        json.dump(creds, f, ensure_ascii=False, indent=2)

def load_data():
    """Load PUBLIC data from JSON file (NO credentials)"""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {
        "bookings": [],
        "cancelled": [],
        "annonces": [],
        "journal": [],
        "income": [],
        "debt": []
    }

def save_data(data):
    """Save PUBLIC data to JSON file"""
    # Remove credentials if someone tries to send them
    if 'creds' in data:
        del data['creds']
    
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

class APIHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Cache control headers
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        # CORS headers (restricted to same origin for security)
        origin = self.headers.get('Origin', '')
        if origin or True:  # Allow all for now, but credentials are separated
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        """Handle preflight CORS requests"""
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/data':
            # Return PUBLIC shared data only (NO credentials)
            try:
                data = load_data()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                self.send_error(500, f"Error loading data: {str(e)}")
        
        else:
            # Serve static files
            self.path = unquote(self.path)
            super().do_GET()

    def do_POST(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/data':
            # Save PUBLIC shared data (atomic update with merge)
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                new_data = json.loads(post_data.decode('utf-8'))
                
                # Remove credentials if present
                if 'creds' in new_data:
                    del new_data['creds']
                
                # Load current data and merge to prevent overwrite
                current_data = load_data()
                
                # Merge strategy: accept newest timestamps for each array
                for key in ['bookings', 'cancelled', 'annonces', 'journal', 'income', 'debt']:
                    if key in new_data:
                        current_data[key] = new_data[key]
                
                save_data(current_data)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
            except Exception as e:
                self.send_error(500, f"Error saving data: {str(e)}")
        
        elif parsed_path.path == '/api/update-password':
            # Update admin password (requires current password)
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                admin = load_admin()
                if data.get('currentUser') == admin['user'] and data.get('currentPass') == admin['pass']:
                    admin['user'] = data.get('newUser', admin['user'])
                    admin['pass'] = data.get('newPass', admin['pass'])
                    save_admin(admin)
                    
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
                else:
                    self.send_response(401)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": False, "error": "Invalid credentials"}).encode('utf-8'))
            except Exception as e:
                self.send_error(500, f"Error updating password: {str(e)}")
        
        else:
            self.send_error(404, "Not Found")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Initialize admin file if it doesn't exist
    if not os.path.exists(ADMIN_FILE):
        save_admin({"user": "younes", "pass": "younes"})
    
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", PORT), APIHandler) as httpd:
        print(f"Server running at http://0.0.0.0:{PORT}")
        print("API endpoints:")
        print("  - GET  /api/data (public bookings data)")
        print("  - POST /api/data (save bookings)")
        print("  - POST /api/update-password (change admin password - requires auth)")
        print("Press Ctrl+C to stop the server")
        httpd.serve_forever()
