#!/bin/bash

# Setup GitHub Repository for RidePilot
# This script helps initialize and push your code to GitHub

echo "🚀 Setting up GitHub repository for RidePilot..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
else
    echo "✅ Git repository already initialized"
fi

# Add all files to staging
echo "📁 Adding files to Git staging area..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: RidePilot Transportation Management System

- Complete React + TypeScript frontend with enhanced UI
- Express.js backend with Supabase integration
- Date-organized list view with expand/collapse functionality
- Driver portal with PIN authentication
- Multi-company support with custom theming
- Financial tracking and reporting
- Interactive maps and analytics
- Responsive design for mobile and desktop"

# Instructions for user
echo ""
echo "🎉 Git repository initialized successfully!"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub:"
echo "   - Go to https://github.com/new"
echo "   - Repository name: ridepilot-transport-management"
echo "   - Description: Transportation scheduling and management system"
echo "   - Choose Public or Private"
echo "   - DO NOT initialize with README (we already have one)"
echo ""
echo "2. After creating the repository, run these commands:"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/YOUR_USERNAME/ridepilot-transport-management.git"
echo "   git push -u origin main"
echo ""
echo "3. Replace YOUR_USERNAME with your actual GitHub username"
echo ""
echo "📋 Repository structure:"
echo "   ├── client/          # React frontend"
echo "   ├── server/          # Express backend"
echo "   ├── shared/          # Shared TypeScript types"
echo "   ├── supabase/        # Database migrations"
echo "   ├── README.md        # Project documentation"
echo "   └── package.json     # Dependencies and scripts"
echo ""
echo "🔒 Remember to keep your environment variables secure!"
echo "   - Never commit .env files"
echo "   - Use GitHub Secrets for deployment"
echo "   - Supabase keys are already in .gitignore"