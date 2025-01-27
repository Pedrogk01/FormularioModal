$(document).ready(function () {
    $('#exportToPdf').click(function () {
        if (!window.jspdf) {
            alert("Erro: jsPDF não está carregado!");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape');
        const pdfTitle = 'Dados Cadastrados';
        doc.setFontSize(8);
        doc.text(pdfTitle, 14, 15);

        const columns = [];
        const rows = [];

        $('#dadosTable thead th').each(function () {
            columns.push($(this).text().trim());
        });

        columns.pop();

        $('#dadosTable tbody tr').each(function () {
            const rowData = [];
            $(this).find('td').each(function (index) {
                if (index < $(this).parent().find('td').length - 1) {
                    rowData.push($(this).text().trim());
                }
            });
            rows.push(rowData);
        });

        doc.setFontSize(6);
        doc.autoTable({
            head: [columns],
            body: rows,
            startY: 25,
            margin: { top: 20, bottom: 10 },
        });

        const fileName = 'dados_cadastrados.pdf';
        doc.save(fileName);
    });
    
    $('#sortDropdown .dropdown-item').click(function () {
        $('#sortDropdown .dropdown-item').removeClass('active');
        $(this).addClass('active');
        $('#sortDropdown .dropdown-toggle').text($(this).text());
    });
});
