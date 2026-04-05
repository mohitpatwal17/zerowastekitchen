@echo off
echo Starting CrumbIQ Ecosystem...

echo Stopping any existing processes on port 8000 and 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr "0.0:8000"') do ( taskkill /F /PID %%a 2>nul )
for /f "tokens=5" %%a in ('netstat -aon ^| findstr "0.0:3000"') do ( taskkill /F /PID %%a 2>nul )

echo Starting Backend (FastAPI)...
start "CrumbIQ Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload --port 8000"

echo Starting Frontend (Next.js)...
start "CrumbIQ Frontend" cmd /k "cd frontend && npm run dev"

echo System Online. Access the app at http://localhost:3000
echo Backend API is running at http://localhost:8000
pause
