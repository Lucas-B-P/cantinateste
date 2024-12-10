<?php
header('Content-Type: application/json');
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $pdo->beginTransaction();
    try {
        // Create order
        $stmt = $pdo->prepare("
            INSERT INTO orders (id, customer_id, date, total) 
            VALUES (?, ?, ?, ?)
        ");
        $orderId = uniqid();
        $stmt->execute([
            $orderId,
            $data['customer_id'],
            date('Y-m-d'),
            $data['total']
        ]);
        
        // Create order items
        $stmt = $pdo->prepare("
            INSERT INTO order_items (id, order_id, name, quantity, price) 
            VALUES (?, ?, ?, ?, ?)
        ");
        foreach($data['items'] as $item) {
            $stmt->execute([
                uniqid(),
                $orderId,
                $item['name'],
                $item['quantity'],
                $item['price']
            ]);
        }
        
        $pdo->commit();
        echo json_encode(['id' => $orderId]);
    } catch(Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}