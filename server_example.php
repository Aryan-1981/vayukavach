<?php
/**
 * Simple PHP Server Example for Receiving ESP32 Data
 * 
 * This is a basic example of a server endpoint that can receive
 * air quality data from your ESP32.
 * 
 * Requirements:
 * - PHP 7.0 or higher
 * - MySQL database (optional, for data storage)
 * 
 * Setup:
 * 1. Upload this file to your web server
 * 2. Create a database and table (see SQL below)
 * 3. Update database credentials
 * 4. Update ESP32 code with this file's URL
 */

// Enable CORS (for web dashboard access)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Database configuration (update with your credentials)
define('DB_HOST', 'localhost');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_NAME', 'air_quality');

/**
 * Database Setup SQL:
 * 
 * CREATE DATABASE air_quality;
 * 
 * USE air_quality;
 * 
 * CREATE TABLE sensor_data (
 *     id INT AUTO_INCREMENT PRIMARY KEY,
 *     pm1_0 FLOAT NOT NULL,
 *     pm2_5 FLOAT NOT NULL,
 *     pm10 FLOAT NOT NULL,
 *     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *     INDEX idx_timestamp (timestamp)
 * );
 */

// Handle POST request (data upload from ESP32)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData, true);
    
    if ($data && isset($data['pm1_0']) && isset($data['pm2_5']) && isset($data['pm10'])) {
        // Validate data
        $pm1_0 = floatval($data['pm1_0']);
        $pm2_5 = floatval($data['pm2_5']);
        $pm10 = floatval($data['pm10']);
        
        // Connect to database
        try {
            $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Insert data
            $stmt = $conn->prepare("INSERT INTO sensor_data (pm1_0, pm2_5, pm10) VALUES (:pm1_0, :pm2_5, :pm10)");
            $stmt->bindParam(':pm1_0', $pm1_0);
            $stmt->bindParam(':pm2_5', $pm2_5);
            $stmt->bindParam(':pm10', $pm10);
            $stmt->execute();
            
            // Return success
            echo json_encode([
                'status' => 'success',
                'message' => 'Data saved successfully',
                'id' => $conn->lastInsertId()
            ]);
            
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Database error: ' . $e->getMessage()
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid data format'
        ]);
    }
}

// Handle GET request (retrieve latest data for dashboard)
else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Get latest reading
        if (isset($_GET['action']) && $_GET['action'] === 'latest') {
            $stmt = $conn->query("SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 1");
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($row) {
                echo json_encode([
                    'pm1_0' => floatval($row['pm1_0']),
                    'pm2_5' => floatval($row['pm2_5']),
                    'pm10' => floatval($row['pm10']),
                    'timestamp' => $row['timestamp']
                ]);
            } else {
                echo json_encode([
                    'pm1_0' => 0,
                    'pm2_5' => 0,
                    'pm10' => 0,
                    'timestamp' => null
                ]);
            }
        }
        
        // Get historical data (last N readings)
        else if (isset($_GET['action']) && $_GET['action'] === 'history') {
            $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
            $stmt = $conn->prepare("SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT :limit");
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($results);
        }
        
        else {
            echo json_encode([
                'status' => 'info',
                'message' => 'API is running',
                'endpoints' => [
                    'POST /' => 'Upload sensor data',
                    'GET /?action=latest' => 'Get latest reading',
                    'GET /?action=history&limit=100' => 'Get historical data'
                ]
            ]);
        }
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
}

else {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed'
    ]);
}
?>
