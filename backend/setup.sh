#!/bin/bash

# Setup script for the MIC Service Laser backend
echo "Setting up MIC Service Laser backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js before continuing."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "Node.js version 16 or higher is required. You have version $NODE_VERSION."
    exit 1
fi

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Please edit the .env file with your MongoDB connection string and other settings."
fi

# Create uploads directory if it doesn't exist
if [ ! -d uploads ]; then
    echo "Creating uploads directory..."
    mkdir -p uploads
fi

# Seed the database with initial data
echo "Would you like to seed the database with initial data? (y/n)"
read -r SEED_DB

if [ "$SEED_DB" = "y" ] || [ "$SEED_DB" = "Y" ]; then
    echo "Seeding database..."
    node utils/seeder -i
fi

echo "Setup complete!"
echo ""
echo "You can now start the backend server with: npm run dev"
echo ""
echo "Default admin credentials:"
echo "Email: admin@example.com"
echo "Password: Admin123!"
echo ""
echo "Make sure your frontend has the VITE_API_URL environment variable set to: http://localhost:5000/api"
