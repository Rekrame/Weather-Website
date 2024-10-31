document.addEventListener("DOMContentLoaded", function() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);

            let lastScrollTop = 0;
            const navbar = document.querySelector('.navbar');

            window.addEventListener('scroll', function() {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if (scrollTop >= 0 && scrollTop <20) {
                    navbar.classList.remove('navbar-hidden');
                } else if (scrollTop > lastScrollTop) {
                    // Scrolling down
                    navbar.classList.add('navbar-hidden');
                } else {
                    // Scrolling up
                    navbar.classList.remove('navbar-hidden');
                }
                lastScrollTop = scrollTop;
            });
        });
});