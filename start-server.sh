#!/bin/bash

# Function to check if a port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# Function to kill process using a port
kill_port() {
    lsof -ti :$1 | xargs kill -9 2>/dev/null
}

# Check if port 5002 is in use
if check_port 5002; then
    echo "Port 5002 is in use. Attempting to free it..."
    kill_port 5002
    sleep 2
fi

# Start the server
echo "Starting BloodBridge server..."
npm run dev 