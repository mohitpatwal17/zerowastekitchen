Write-Host "Starting CrumbIQ Ecosystem..." -ForegroundColor Green

$root = $PSScriptRoot

# Start Backend
Write-Host "Launching Backend (FastAPI)..." -ForegroundColor Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/k backend\venv\Scripts\activate && uvicorn backend.main:app --reload --port 8000" -WorkingDirectory $root

# Wait a moment
Start-Sleep -Seconds 2

# Start Frontend
Write-Host "Launching Frontend (Next.js)..." -ForegroundColor Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd frontend && npm run dev" -WorkingDirectory $root

Write-Host "------------------------------------------------" -ForegroundColor Green
Write-Host "System Launch Initiated!"
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Backend API: http://localhost:8000" -ForegroundColor Yellow
Write-Host "------------------------------------------------" -ForegroundColor Green
