# Script to automatically separate project into frontend and backend folders

Write-Host "Starting project separation..." -ForegroundColor Green
Write-Host ""

# Check current folder
$currentPath = Get-Location
Write-Host "Current folder: $currentPath" -ForegroundColor Blue

# Create folders if they don't exist
if (-not (Test-Path "frontend")) {
    New-Item -ItemType Directory -Name "frontend" | Out-Null
    Write-Host "Created frontend/ folder" -ForegroundColor Green
}

if (-not (Test-Path "frontend/src")) {
    New-Item -ItemType Directory -Path "frontend/src" | Out-Null
    Write-Host "Created frontend/src/ folder" -ForegroundColor Green
}

if (-not (Test-Path "frontend/public")) {
    New-Item -ItemType Directory -Path "frontend/public" | Out-Null
    Write-Host "Created frontend/public/ folder" -ForegroundColor Green
}

if (-not (Test-Path "backend")) {
    New-Item -ItemType Directory -Name "backend" | Out-Null
    Write-Host "Created backend/ folder" -ForegroundColor Green
}

if (-not (Test-Path "backend/data")) {
    New-Item -ItemType Directory -Path "backend/data" | Out-Null
    Write-Host "Created backend/data/ folder" -ForegroundColor Green
}

Write-Host ""
Write-Host "Copying frontend files..." -ForegroundColor Blue

# Copy frontend files
$frontendFiles = @(
    "src",
    "public",
    "index.html",
    "vite.config.ts",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "eslint.config.js"
)

foreach ($file in $frontendFiles) {
    if (Test-Path $file) {
        if ((Get-Item $file).PSIsContainer) {
            Copy-Item -Path $file -Destination "frontend/$file" -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "  OK: $file/" -ForegroundColor Green
        } else {
            Copy-Item -Path $file -Destination "frontend/$file" -Force -ErrorAction SilentlyContinue
            Write-Host "  OK: $file" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "Setting up environment variables..." -ForegroundColor Blue

# Copy .env.local to frontend if it exists
if (Test-Path ".env.local") {
    Copy-Item -Path ".env.local" -Destination "frontend/.env.local" -Force
    Write-Host "  OK: .env.local copied to frontend/" -ForegroundColor Green
}

# Copy .env.example to frontend if it exists
if (Test-Path ".env.example") {
    Copy-Item -Path ".env.example" -Destination "frontend/.env.example" -Force
    Write-Host "  OK: .env.example copied to frontend/" -ForegroundColor Green
}

# Copy package.json if it exists
if (Test-Path "package.json") {
    Copy-Item -Path "package.json" -Destination "frontend/package.json" -Force
    Write-Host "  OK: package.json copied to frontend/" -ForegroundColor Green
}

# Copy package-lock.json if it exists
if (Test-Path "package-lock.json") {
    Copy-Item -Path "package-lock.json" -Destination "frontend/package-lock.json" -Force
    Write-Host "  OK: package-lock.json copied to frontend/" -ForegroundColor Green
}

Write-Host ""
Write-Host "Project separation completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. cd frontend && npm install" -ForegroundColor White
Write-Host "  2. cd ../backend && npm install" -ForegroundColor White
Write-Host "  3. Start backend: npm start" -ForegroundColor White
Write-Host "  4. Start frontend: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Documentation: see SETUP_MIGRATION.md" -ForegroundColor Cyan
Write-Host ""
