#!/usr/bin/env python3
# Simple Railway start script
import os
import subprocess

# Change to backend directory
os.chdir('backend')

# Start the FastAPI application
port = os.getenv('PORT', '8000')
subprocess.run(['uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', port])
