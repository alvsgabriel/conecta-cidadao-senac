const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.nav-menu');

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

// Seleciona todos os links dentro do menu mobile
const navItemLinks = document.querySelectorAll(".nav-menu a");

// Para cada link, adiciona um evento de clique
navItemLinks.forEach(link => {
    link.addEventListener("click", () => {
        // Remove a classe 'active' do menu e do botão hambúrguer
        menu.classList.remove('is-active');
        menuLinks.classList.remove('active');
    });
});

// Espera todo o conteúdo (incluindo imagens) carregar para calcular as posições reais
window.addEventListener('load', () => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-menu a");

    function scrollSpy() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Margem para o header fixo
            const sectionId = current.getAttribute("id");

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(".nav-menu a[href*=" + sectionId + "]")?.classList.add("active");
            } else {
                document.querySelector(".nav-menu a[href*=" + sectionId + "]")?.classList.remove("active");
            }
        });
    }

    window.addEventListener("scroll", scrollSpy);
    scrollSpy(); // Executa uma vez ao carregar para marcar o topo
});