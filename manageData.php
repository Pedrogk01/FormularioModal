<?php
$server = 'localhost';
$usuario = 'root';
$senha = '';
$banco = 'formulario_modal'; 

$conn = new mysqli($server, $usuario, $senha, $banco);

if ($conn->connect_error) {
    die("Erro na conexão com o banco de dados: " . $conn->connect_error);
}

function insertData($data) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO cadastro (nome, sobrenome, data, sexo, cpf, tipo, logradouro, bairro, cidade, numero, cep, email, telefone) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "sssssssssssss", 
        $data['nome'], $data['sobrenome'], $data['data'], $data['sexo'], $data['cpf'], 
        $data['tipo'], $data['logradouro'], $data['bairro'], $data['cidade'], $data['numero'], 
        $data['cep'], $data['email'], $data['telefone']
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Registro inserido com sucesso!"]);
    } else {
        echo json_encode(["success" => false, "message" => $stmt->error]);
    }

    $stmt->close();
}

function updateData($data) {
    global $conn;
    $stmt = $conn->prepare("UPDATE cadastro 
                            SET nome = ?, sobrenome = ?, data = ?, sexo = ?, cpf = ?, tipo = ?, logradouro = ?, bairro = ?, cidade = ?, numero = ?, cep = ?, email = ?, telefone = ?
                            WHERE id = ?");
    $stmt->bind_param(
        "sssssssssssssi", 
        $data['nome'], $data['sobrenome'], $data['data'], $data['sexo'], $data['cpf'], 
        $data['tipo'], $data['logradouro'], $data['bairro'], $data['cidade'], $data['numero'], 
        $data['cep'], $data['email'], $data['telefone'], $data['id']
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Registro atualizado com sucesso!"]);
    } else {
        echo json_encode(["success" => false, "message" => $stmt->error]);
    }

    $stmt->close();
}

function deleteData($id) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM cadastro WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Registro excluído com sucesso!"]);
    } else {
        echo json_encode(["success" => false, "message" => $stmt->error]);
    }

    $stmt->close();
}

function loadTableData() {
    global $conn;
    $result = $conn->query("SELECT * FROM cadastro");
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    return $data;
}

function getRecordById($id) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM cadastro WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $record = $result->fetch_assoc();
    $stmt->close();
    
    return $record;
}

function sortData($column) {
    global $conn;
    $result = $conn->query("SELECT * FROM cadastro ORDER BY $column");
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    return $data;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $action = $_POST['action'] ?? '';

    switch ($action) {
        case 'insert':
            $data = $_POST;
            unset($data['action']);
            insertData($data);
            break;

        case 'update':
            $data = $_POST;
            unset($data['action']);
            updateData($data);
            break;

        case 'delete':
            $id = $_POST['id'];
            deleteData($id);
            break;

        case 'load':
            $tableData = loadTableData();
            echo json_encode(["success" => true, "data" => $tableData]);
            break;

        case 'edit':
            $id = $_POST['id'];
            $record = getRecordById($id);
            if ($record) {
                echo json_encode(["success" => true, "record" => $record]);
            } else {
                echo json_encode(["success" => false, "message" => "Registro não encontrado."]);
            }
            break;

        case 'sort':
            $column = $_POST['column'];
            $sortedData = sortData($column);
            echo json_encode(["success" => true, "data" => $sortedData]);
            break;

        default:
            echo json_encode(["success" => false, "message" => "Ação inválida."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Requisição inválida."]);
}

$conn->close();
?>
