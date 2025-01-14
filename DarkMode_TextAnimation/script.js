
    // Intersection Observer for animations
    document.addEventListener("DOMContentLoaded", () => {
        const observerOptions = {
            root: null, // Viewport as the root
            rootMargin: "0px",
            threshold: 0.1, // Element is considered visible when 10% is in the viewport
        };

        const observerCallback = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Select all elements with animations
        const animatedElements = document.querySelectorAll(
            ".fade-in, .about-content, .skills li, .project-card, form input, form textarea, .social-links a"
        );

        animatedElements.forEach((el) => observer.observe(el));
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80, // Adjust for fixed navigation
                    behavior: "smooth",
                });
            }
        });
    });

