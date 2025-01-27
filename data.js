document.addEventListener('DOMContentLoaded', () => {
    loadTableData();

    // Listeners para os botões de ordenação
    ['cpf', 'logradouro', 'bairro', 'data', 'nome', 'cidade'].forEach(column => {
        document.getElementById(`sortBy${capitalize(column)}`).addEventListener('click', () => {
            console.log(`Ordenar por ${capitalize(column)}`);
            sortTable(column);
        });
    });

    // Listener para o envio do formulário
    document.getElementById('formModal').addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = getFormData();
        if (!validateForm(formData)) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        const action = localStorage.getItem('editIndex') !== null ? 'update' : 'insert';
        saveData(formData, action);
    });

    // Funções auxiliares
    function getFormData() {
        return {
            nome: document.getElementById('nome').value.trim(),
            sobrenome: document.getElementById('sobrenome').value.trim(),
            data: document.getElementById('data').value.trim(),
            sexo: document.querySelector('input[name="sexo"]:checked')?.value,
            cpf: document.getElementById('cpf').value.trim(),
            tipo: document.getElementById('tipo').value.trim(),
            logradouro: document.getElementById('logradouro').value.trim(),
            cidade: document.getElementById('cidade').value.trim(),
            bairro: document.getElementById('bairro').value.trim(),
            numero: document.getElementById('numero').value.trim(),
            cep: document.getElementById('cep').value.trim(),
            email: document.getElementById('email').value.trim(),
            telefone: document.getElementById('telefone').value.trim()
        };
    }

    function validateForm(data) {
        return Object.values(data).every(value => value !== '') && validateDateOfBirth(data.data) && validateEmail(data.email);
    }

    function validateDateOfBirth(date) {
        if (!date) return false;

        const today = new Date();
        const birthDate = new Date(date.split('/').reverse().join('-'));
        return birthDate <= today && birthDate.getFullYear() >= 1900;
    }

    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailPattern.test(email);
    }

    function loadTableData() {
        fetch('manageData.php', {
            method: 'POST',
            body: new URLSearchParams({
                action: 'load'  // Enviando a ação 'load' para carregar os dados
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateTable(data.data);  // Usando 'data' como o array de registros
            } else {
                alert('Erro ao carregar os dados!');
            }
        })
        .catch(err => console.error('Erro:', err));
    }

    function saveData(record, action) {
        const formData = new FormData();
        Object.entries(record).forEach(([key, value]) => formData.append(key, value));
        formData.append('action', action);

        if (action === 'update') {
            formData.append('id', localStorage.getItem('editIndex'));
        }

        fetch('manageData.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                localStorage.removeItem('editIndex');
                loadTableData();
            } else {
                alert('Erro: ' + data.message);
            }
        })
        .catch(err => console.error('Erro:', err));
    }

    function populateTable(records) {
        const tbody = document.querySelector("#dadosTable tbody");
        tbody.innerHTML = '';
        records.forEach((record, index) => addRowToTable(record, index));
    }

    function addRowToTable(data, index) {
        const tbody = document.querySelector("#dadosTable tbody");
        const newRow = tbody.insertRow();

        Object.values(data).forEach(value => {
            const cell = newRow.insertCell();
            cell.innerText = value;
        });

        const actionsCell = newRow.insertCell();
        const editButton = createButton('Editar', 'btn-warning', () => editRecord(data.id));
        const deleteButton = createButton('Excluir', 'btn-danger', () => deleteRecord(data.id));

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
    }

    function createButton(text, className, onClick) {
        const button = document.createElement('button');
        button.innerText = text;
        button.className = `btn btn-sm ${className}`;
        button.onclick = onClick;
        return button;
    }

    function editRecord(id) {
        fetch('manageData.php', {
            method: 'POST',
            body: new URLSearchParams({
                action: 'edit',  // Ação para buscar os dados do registro
                id: id
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Preenche o formulário com os dados do registro
                Object.keys(data.record).forEach(key => {
                    const element = document.getElementById(key);
                    if (element) {
                        if (element.type === 'radio') {
                            // Para campos de radio, marque o valor correspondente
                            element.checked = (element.value === data.record[key]);
                        } else {
                            element.value = data.record[key];  // Preenche os campos do formulário
                        }
                    }
                });

                // Preenche o campo de sexo (radio buttons)
                const sexoValue = data.record.sexo; 
                if (sexoValue) {
                    const sexoRadio = document.querySelector(`input[name="sexo"][value="${sexoValue}"]`);
                    if (sexoRadio) sexoRadio.checked = true;
                }

                // Armazena o ID do registro para usar na atualização
                localStorage.setItem('editIndex', id);

                // Exibe o modal de edição (se estiver usando o Bootstrap)
                const modal = new bootstrap.Modal(document.getElementById('formModal'));
                modal.show();
            } else {
                alert('Erro ao carregar os dados do registro para edição: ' + data.message);
            }
        })
        .catch(err => console.error('Erro:', err));
    }

    function deleteRecord(id) {
        if (!confirm('Tem certeza que deseja excluir este registro?')) return;

        fetch('manageData.php', {
            method: 'POST',
            body: new URLSearchParams({
                action: 'delete',
                id: id
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                loadTableData();
            } else {
                alert('Erro ao excluir o registro!');
            }
        })
        .catch(err => console.error('Erro:', err));
    }

    function sortTable(column) {
        fetch('manageData.php', {
            method: 'POST',
            body: new URLSearchParams({
                action: 'sort',
                column: column
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateTable(data.data);
            } else {
                alert('Erro ao ordenar os dados!');
            }
        })
        .catch(err => console.error('Erro:', err));
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
