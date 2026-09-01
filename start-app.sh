#!/usr/bin/env bash
echo "==================================================="
echo "  WCB Manitoba - Dynamic PDF Generation Suite"
echo "==================================================="

if command -v python3 &>/dev/null; then
    echo "Starting Python 3 Server on http://localhost:8000"
    (sleep 1 && open http://localhost:8000 || xdg-open http://localhost:8000) &
    python3 -m http.server 8000
elif command -v npx &>/dev/null; then
    echo "Starting NPX Serve on http://localhost:3000"
    (sleep 1 && open http://localhost:3000 || xdg-open http://localhost:3000) &
    npx -y serve -l 3000 .
else
    echo "Opening index.html in default browser..."
    open index.html || xdg-open index.html
fi
