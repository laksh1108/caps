<?php
require_once 'db.php';

// Set headers for JSON response
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$requestMethod = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

switch ($requestMethod) {
    case 'GET':
        if (preg_match('/\/blogs\/(\d+)/', $uri, $matches)) {
            $id = $matches[1];
            getBlog($id);
        } else {
            getAllBlogs();
        }
        break;

    case 'POST':
        createBlog();
        break;

    case 'PUT':
        if (preg_match('/\/blogs\/(\d+)/', $uri, $matches)) {
            $id = $matches[1];
            updateBlog($id);
        }
        break;

    case 'DELETE':
        if (preg_match('/\/blogs\/(\d+)/', $uri, $matches)) {
            $id = $matches[1];
            deleteBlog($id);
        }
        break;

    default:
        respondWithJson(['message' => 'Method not allowed'], 405);
        break;
}

// Fetch all blogs with pagination
function getAllBlogs() {
    global $pdo;
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = 5;
    $offset = ($page - 1) * $limit;

    $stmt = $pdo->prepare("SELECT * FROM blogs LIMIT :limit OFFSET :offset");
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $blogs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    respondWithJson($blogs);
}

// Fetch a single blog by ID
function getBlog($id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM blogs WHERE id = :id");
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    $blog = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($blog) {
        respondWithJson($blog);
    } else {
        respondWithJson(['message' => 'Blog not found'], 404);
    }
}

// Create a new blog post
// Create a new blog post
function createBlog() {
    global $pdo;

    // Get the raw POST data
    $data = json_decode(file_get_contents('php://input'), true);

    // Ensure all fields are provided
    if (isset($data['title'], $data['author'], $data['content'], $data['image_url'])) {
        $title = $data['title'];
        $author = $data['author'];
        $content = $data['content'];
        $imageUrl = $data['image_url']; // This will be the Base64 image

        // Insert into the database
        $stmt = $pdo->prepare("INSERT INTO blogs (title, author, content, image_url) VALUES (?, ?, ?, ?)");
        $stmt->execute([$title, $author, $content, $imageUrl]);

        echo json_encode(['message' => 'Blog created successfully']);
    } else {
        echo json_encode(['message' => 'Missing required fields']);
    }
}


// Function to handle Base64 image and save it
function handleBase64Image($base64String) {
    // Check if the base64 string has the "data:image..." prefix
    if (strpos($base64String, 'data:image/') !== 0) {
        return false; // Invalid format
    }

    // Extract MIME type and base64 data
    [$metaData, $encodedImage] = explode(',', $base64String);
    $mimeParts = explode(';', $metaData);

    if (count($mimeParts) < 2 || !str_contains($mimeParts[0], 'image/')) {
        return false; // Invalid MIME type
    }

    $extension = explode('/', $mimeParts[0])[1]; // Get file extension
    $decodedImage = base64_decode($encodedImage);

    if (!$decodedImage) {
        return false; // Failed to decode base64
    }

    // Generate a unique name and save the image
    $imageName = uniqid('blog_image_', true) . '.' . $extension;
    $imagePath = 'uploads/' . $imageName;

    if (!file_put_contents($imagePath, $decodedImage)) {
        return false; // Failed to save the image
    }

    return $imagePath; // Return the new image path
}


// Helper function to respond with JSON
function respondWithJson($data, $statusCode = 200) {
    header('Content-Type: application/json');
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

function updateBlog($id) {
    global $pdo;

    // Parse JSON input
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        respondWithJson(['message' => 'No data provided'], 400);
    }

    // Fetch the existing blog data
    $stmt = $pdo->prepare("SELECT * FROM blogs WHERE id = :id");
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $blog = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$blog) {
        respondWithJson(['message' => 'Blog not found'], 404);
    }

    // Extract fields with fallbacks to existing values
    $title = $data['title'] ?? $blog['title'];
    $author = $data['author'] ?? $blog['author'];
    $content = $data['content'] ?? $blog['content'];
    $imageBase64 = $data['image'] ?? $blog['image_url']; // Use sent image or keep existing

    // Debug input
    error_log("Incoming image data: " . substr($imageBase64, 0, 50) . "..."); // Log part of the image for debugging

    // Update the blog record in the database
    $stmt = $pdo->prepare("UPDATE blogs SET title = ?, author = ?, content = ?, image_url = ? WHERE id = ?");
    $stmt->execute([$title, $author, $content, $imageBase64, $id]);

    respondWithJson(['message' => 'Blog updated successfully']);
}


// Delete a blog post
function deleteBlog($id) {
    global $pdo;
    $stmt = $pdo->prepare("DELETE FROM blogs WHERE id = ?");
    $stmt->execute([$id]);

    respondWithJson(['message' => 'Blog deleted successfully']);
}
?>
