# Ride Booking System - Installation Script for Windows
# This script sets up the entire project

Write-Host "================================" -ForegroundColor Green
Write-Host "Ride Booking System Setup" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Colors for output
$success = "Green"
$error = "Red"
$info = "Cyan"

# Step 1: Check Node.js and npm
Write-Host "`n[1] Checking Node.js and npm..." -ForegroundColor $info
$nodeVersion = node --version
$npmVersion = npm --version

if ($nodeVersion -and $npmVersion) {
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor $success
    Write-Host "✓ npm $npmVersion found" -ForegroundColor $success
} else {
    Write-Host "✗ Node.js or npm not found. Please install Node.js first." -ForegroundColor $error
    exit 1
}

# Step 2: Setup Backend
Write-Host "`n[2] Setting up Backend..." -ForegroundColor $info

if (Test-Path "backend") {
    Push-Location backend
    
    Write-Host "Installing backend dependencies..." -ForegroundColor $info
    npm install
    
    if (Test-Path ".env") {
        Write-Host "✓ .env already exists" -ForegroundColor $success
    } else {
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Write-Host "✓ Created .env from .env.example" -ForegroundColor $success
            Write-Host "⚠ Please update .env with your MongoDB URI and Google Maps API key" -ForegroundColor "Yellow"
        }
    }
    
    Write-Host "✓ Backend setup complete" -ForegroundColor $success
    Pop-Location
} else {
    Write-Host "✗ backend directory not found" -ForegroundColor $error
    exit 1
}

# Step 3: Setup Frontend
Write-Host "`n[3] Setting up Frontend..." -ForegroundColor $info

if (Test-Path "frontend") {
    Push-Location frontend
    
    Write-Host "Installing frontend dependencies..." -ForegroundColor $info
    npm install
    
    Write-Host "✓ Frontend setup complete" -ForegroundColor $success
    Pop-Location
} else {
    Write-Host "✗ frontend directory not found" -ForegroundColor $error
    exit 1
}

# Step 4: Display startup instructions
Write-Host "`n[4] Setup Complete!" -ForegroundColor $success
Write-Host "`n================================" -ForegroundColor Green
Write-Host "Next Steps:" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

Write-Host "`n1. Make sure MongoDB is running on localhost:27017"
Write-Host "`n2. Update backend/.env with:`n   - MONGODB_URI`n   - GOOGLE_MAPS_API_KEY`n"

Write-Host "3. Start Backend (in terminal 1):"
Write-Host "   cd backend"
Write-Host "   npm run dev`n"

Write-Host "4. Start Frontend (in terminal 2):"
Write-Host "   cd frontend"
Write-Host "   npm run dev`n"

Write-Host "5. Open browser and go to: http://localhost:5173`n"

Write-Host "================================" -ForegroundColor Green
Write-Host "Happy Coding! 🚗" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
