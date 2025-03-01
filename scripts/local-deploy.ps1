# PowerShell script for local deployment

# Function to show colored output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Check-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-ColorOutput Green "Checking prerequisites..."

if (-not (Check-Command docker)) {
    Write-ColorOutput Red "Docker is not installed. Please install Docker Desktop for Windows first."
    exit 1
}

if (-not (Check-Command node)) {
    Write-ColorOutput Red "Node.js is not installed. Please install Node.js first."
    exit 1
}

# Load environment variables
Write-ColorOutput Green "Loading environment variables..."
if (Test-Path .env.local) {
    Get-Content .env.local | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
}

# Install dependencies
Write-ColorOutput Green "Installing dependencies..."
npm install

# Build the application
Write-ColorOutput Green "Building the application..."
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Red "Build failed!"
    exit 1
}

# Start Docker containers
Write-ColorOutput Green "Starting Docker containers..."
docker-compose up -d

# Wait for services to be healthy
Write-ColorOutput Green "Waiting for services to be healthy..."
Start-Sleep -Seconds 10

# Run database migrations
Write-ColorOutput Green "Running database migrations..."
npm run migrate

# Run content verification
Write-ColorOutput Green "Running content verification..."
npm run verify-content

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Yellow "Content verification found some issues. Please review the output above."
}

# Start the application
Write-ColorOutput Green "Starting the application..."
Start-Process "http://localhost:3000"
npm run dev
