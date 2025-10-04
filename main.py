# Main entry point for Railway
import subprocess
import sys
import os

# Change to backend directory
os.chdir('backend')

# Create virtual environment
subprocess.run([sys.executable, '-m', 'venv', 'venv'], check=True)

# Activate venv and install requirements
if os.name == 'nt':  # Windows
    activate_script = 'venv\\Scripts\\activate.bat'
    pip_cmd = 'venv\\Scripts\\pip.exe'
else:  # Unix/Linux
    activate_script = 'source venv/bin/activate'
    pip_cmd = 'venv/bin/pip'

# Install requirements
subprocess.run([pip_cmd, 'install', '-r', 'requirements.txt'], check=True)

# Start the application
subprocess.run([f'venv/bin/uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', os.getenv('PORT', '8000')], check=True)
