// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Prevenir clique nos links "códigos" e "links de livros"
    const codigosLink = document.getElementById('codigos-link');
    const livrosLink = document.getElementById('livros-link');

    codigosLink.addEventListener('click', function(e) {
        e.preventDefault();
    });

    livrosLink.addEventListener('click', function(e) {
        e.preventDefault();
    });
});