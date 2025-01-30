$(document).ready(function () {
  
    $('#cpf').mask('000.000.000-00');
    $('#cep').mask('00000-000');
    $('#telefone').mask('(00) 00000-0000');
  
    $('.select2').select2();
    
  });
  document.addEventListener("DOMContentLoaded", function() {
    const bairrosPorCidade = {
      "saosebastiao": [
        "Barequeçaba", "Boiçucanga", "Camburi", "Centro", "Juquehy", 
        "Maresias", "Pontal da Cruz", "Paúba", "Santiago", "Toque-Toque Grande"
      ].sort(),
  
      "ilhabela": [
        "Barra Velha", "Borrifos", "Centro", "Perequê", "Praia de Castelhanos", 
        "Praia do Curral", "Praia do Julião", "Armação", "Ponta da Sela", "Siriúba"
      ].sort(),
  
      "caraguatatuba": [
        "Capricórnio", "Centro", "Cocanha", "Martim de Sá", "Massaguaçu", 
        "Praia Brava", "Tabatinga", "Indaiá", "Jardim Primavera", "Porto Novo"
      ].sort()
    };
  
    const cidadeSelect = document.getElementById("cidade");
    const bairroSelect = document.getElementById("bairro");
  
    cidadeSelect.addEventListener("change", function() {
      const cidadeSelecionada = cidadeSelect.value;
      const bairros = bairrosPorCidade[cidadeSelecionada] || [];
  
      bairroSelect.innerHTML = '<option value="">Selecione um bairro</option>';
      bairros.forEach(function(bairro) {
        const option = document.createElement("option");
        option.value = bairro.toLowerCase().replace(/\s+/g, '_');
        option.textContent = bairro;
        bairroSelect.appendChild(option);
      });
    });
  
    cidadeSelect.dispatchEvent(new Event("change"));
  
    function isValidCPF(cpf) {
      cpf = cpf.replace(/\D/g, '');
      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
      let soma = 0, resto;
      for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf.substring(9, 10))) return false;
      soma = 0;
      for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      return resto === parseInt(cpf.substring(10, 11));
    }
  });
  