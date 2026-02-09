#!/bin/bash

# VayuKavach Team Images - Quick Setup Script
# This script helps you prepare and add team member photos

echo "🎨 VayuKavach Team Images Setup"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -d "public/team" ]; then
    echo "❌ Error: Please run this script from the vercel-dashboard directory"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo ""

# Function to check if image exists
check_image() {
    local filename=$1
    local member=$2
    
    if [ -f "public/team/$filename.jpg" ] || [ -f "public/team/$filename.png" ]; then
        echo "✅ $member: Found"
        return 0
    else
        echo "⚠️  $member: Missing (using gradient fallback)"
        return 1
    fi
}

# Check all team member images
echo "🔍 Checking for team member photos..."
echo ""

# Mentors
echo "📚 MENTORS:"
check_image "dr-aftab" "Dr. Aftab Ahmed Ansari"
check_image "dr-praveen" "Dr. Praveen Bansal"

echo ""
echo "👥 STUDENT TEAM:"
check_image "aryan" "Aryan Kumar Bhargava"
check_image "tejaswa" "Tejaswa Singh Rana"
check_image "vansh-s" "Vansh Shrivastava"
check_image "yuvraj" "Yuvraj Yadav"
check_image "vansh-t" "Vansh Trivedi"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Count missing images
missing=0
for img in dr-aftab dr-praveen aryan tejaswa vansh-s yuvraj vansh-t; do
    if [ ! -f "public/team/$img.jpg" ] && [ ! -f "public/team/$img.png" ]; then
        ((missing++))
    fi
done

if [ $missing -eq 0 ]; then
    echo "🎉 All team photos are ready!"
    echo "   The website will display real images."
else
    echo "📸 Missing $missing team photo(s)"
    echo ""
    echo "ℹ️  Don't worry! The website will show beautiful gradient"
    echo "   placeholders until you add the photos."
    echo ""
    echo "To add photos:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Option 1: Manual Copy"
    echo "  1. Prepare your team photos (512x512px, JPG/PNG)"
    echo "  2. Rename them exactly as:"
    echo "     Mentors:"
    echo "     - dr-aftab.jpg"
    echo "     - dr-praveen.jpg"
    echo "     Student Team:"
    echo "     - aryan.jpg"
    echo "     - tejaswa.jpg"
    echo "     - vansh-s.jpg"
    echo "     - yuvraj.jpg"
    echo "     - vansh-t.jpg"
    echo "  3. Copy to: $(pwd)/public/team/"
    echo ""
    echo "Option 2: Use This Script"
    echo "  ./setup-team-images.sh /path/to/your/photos/"
    echo ""
    echo "Option 3: Generate Placeholders"
    echo "  Open public/team/avatar-generator.html in browser"
    echo "  Download generated avatars with initials"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# If a source directory is provided, offer to copy images
if [ -n "$1" ]; then
    if [ -d "$1" ]; then
        echo "📂 Source directory: $1"
        echo ""
        echo "Looking for images to copy..."
        echo ""
        
        # Try to intelligently match and copy images
        copied=0
        
        # Helper function to copy if found
        copy_if_found() {
            local source_dir=$1
            local patterns=$2
            local target=$3
            local member=$4
            
            for pattern in $patterns; do
                for ext in jpg jpeg png JPG JPEG PNG; do
                    if [ -f "$source_dir/$pattern.$ext" ]; then
                        echo "  Copying $pattern.$ext → $target.jpg"
                        cp "$source_dir/$pattern.$ext" "public/team/$target.jpg"
                        ((copied++))
                        return 0
                    fi
                done
            done
            return 1
        }
        
        # Try to find and copy images
        copy_if_found "$1" "dr_aftab dr-aftab aftab Aftab DR_AFTAB" "dr-aftab" "Dr. Aftab"
        copy_if_found "$1" "dr_praveen dr-praveen praveen Praveen DR_PRAVEEN" "dr-praveen" "Dr. Praveen"
        copy_if_found "$1" "aryan Aryan ARYAN aryan_kumar" "aryan" "Aryan"
        copy_if_found "$1" "tejaswa Tejaswa TEJASWA tejaswa_singh" "tejaswa" "Tejaswa"
        copy_if_found "$1" "vansh_s vansh-s vansh_shrivastava Vansh_S" "vansh-s" "Vansh S"
        copy_if_found "$1" "yuvraj Yuvraj YUVRAJ yuvraj_yadav" "yuvraj" "Yuvraj"
        copy_if_found "$1" "vansh_t vansh-t vansh_trivedi Vansh_T" "vansh-t" "Vansh T"
        
        echo ""
        if [ $copied -gt 0 ]; then
            echo "✅ Copied $copied image(s) successfully!"
        else
            echo "⚠️  No matching images found in $1"
            echo "   Please rename your images and try again."
        fi
    else
        echo "❌ Directory not found: $1"
    fi
fi

echo ""
echo "🚀 Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Start dev server: npm run dev"
echo "2. Open: http://localhost:3000"
echo "3. Scroll to Team section"
echo "4. Verify images load correctly"
echo ""
echo "📚 Documentation:"
echo "  - Full guide: TEAM_SECTION_DOCS.md"
echo "  - Quick ref: TEAM_QUICK_REFERENCE.md"
echo "  - Testing: TEAM_TESTING_GUIDE.md"
echo ""
echo "✨ Features included:"
echo "  ✅ Lazy loading"
echo "  ✅ Scroll animations"
echo "  ✅ Hover effects with glow"
echo "  ✅ Social media overlay"
echo "  ✅ Responsive design"
echo "  ✅ Gradient fallbacks"
echo ""
echo "Happy coding! 🎉"
