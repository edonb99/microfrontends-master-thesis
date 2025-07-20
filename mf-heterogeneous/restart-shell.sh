#!/bin/bash

echo "🔄 Restarting Shell Application Only..."

# Kill existing shell process on port 4000
echo "Stopping shell on port 4000..."
if command -v lsof &> /dev/null; then
    lsof -ti:4000 | xargs kill -9 2>/dev/null || echo "No process found on port 4000 (lsof)"
elif command -v netstat &> /dev/null; then
    # Alternative for systems without lsof
    netstat -ano | findstr :4000 | awk '{print $5}' | xargs kill -9 2>/dev/null || echo "No process found on port 4000 (netstat)"
else
    echo "⚠️  Cannot check port 4000 automatically, please stop manually if needed"
fi

sleep 2

echo "🔧 Clearing shell cache..."
cd mf-shell
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf build 2>/dev/null || true

echo "🚀 Starting shell on port 4000..."
npm start &
SHELL_PID=$!

cd ..

echo ""
echo "✅ Shell restarted!"
echo "🏪 Shell: http://localhost:4000"
echo ""
echo "🧪 Test the following:"
echo "1. 🎨 TailwindCSS - Check if you see green test message and proper styling"
echo "2. 🛒 Svelte Cart - Navigate to http://localhost:4000/cart"
echo "3. 🔍 Browser Console - Check for emoji logs (🔄, ✅, ❌)"
echo "4. 📡 Network Tab - Verify remoteEntry.js loads (Status 200)"
echo ""
echo "💡 If TailwindCSS still not working:"
echo "   • Check if fallback CSS is applied (basic blue/gray styling)"
echo "   • Look for PostCSS errors in terminal"
echo ""
echo "💡 If Svelte cart still not loading:"  
echo "   • Check container element gets created (green success message)"
echo "   • Verify detailed console logs with emoji markers"
echo ""
echo "🛑 Press Ctrl+C to stop shell"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping shell..."
    kill $SHELL_PID 2>/dev/null
    echo "✅ Shell stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

wait $SHELL_PID
