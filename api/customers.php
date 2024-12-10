<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM customers ORDER BY name");
        $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get orders for each customer
        foreach($customers as &$customer) {
            $stmt = $pdo->prepare("
                SELECT o.*, oi.id as item_id, oi.name as item_name, oi.quantity, oi.price 
                FROM orders o 
                LEFT JOIN order_items oi ON o.id = oi.order_id 
                WHERE o.customer_id = ?
            ");
            $stmt->execute([$customer['id']]);
            $orders = [];
            
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                if(!isset($orders[$row['id']])) {
                    $orders[$row['id']] = [
                        'id' => $row['id'],
                        'date' => $row['date'],
                        'total' => $row['total'],
                        'items' => []
                    ];
                }
                if($row['item_id']) {
                    $orders[$row['id']]['items'][] = [
                        'id' => $row['item_id'],
                        'name' => $row['item_name'],
                        'quantity' => $row['quantity'],
                        'price' => $row['price']
                    ];
                }
            }
            $customer['orders'] = array_values($orders);
        }
        
        echo json_encode($customers);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $pdo->prepare("INSERT INTO customers (id, name, organization) VALUES (?, ?, ?)");
        $id = uniqid();
        $stmt->execute([$id, $data['name'], $data['organization']]);
        
        echo json_encode(['id' => $id]);
        break;

    case 'DELETE':
        $id = $_GET['id'];
        
        $pdo->beginTransaction();
        try {
            // Delete order items
            $stmt = $pdo->prepare("
                DELETE oi FROM order_items oi 
                INNER JOIN orders o ON oi.order_id = o.id 
                WHERE o.customer_id = ?
            ");
            $stmt->execute([$id]);
            
            // Delete orders
            $stmt = $pdo->prepare("DELETE FROM orders WHERE customer_id = ?");
            $stmt->execute([$id]);
            
            // Delete customer
            $stmt = $pdo->prepare("DELETE FROM customers WHERE id = ?");
            $stmt->execute([$id]);
            
            $pdo->commit();
            echo json_encode(['success' => true]);
        } catch(Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;
}