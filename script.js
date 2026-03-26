document.addEventListener("DOMContentLoaded", () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = document.querySelector(".nav-links");
    
    mobileMenu.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            if (navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
            }
        });
    });

    // 3. Scroll Reveal Animations via Intersection Observer
    const revealElements = document.querySelectorAll(".reveal");
    
    const revealOptions = {
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the bottom
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            // Add the 'active' class to trigger animation
            entry.target.classList.add("active");
            
            // Unobserve after revealing for performance
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Trigger reveal on elements already in viewport on load
    setTimeout(() => {
        revealElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top <= window.innerHeight) {
                element.classList.add("active");
            }
        });
    }, 100);

    // 4. Custom Audio Player Logic
    const audioPlayer = document.getElementById("main-audio-player");
    const trackBtns = document.querySelectorAll(".track-btn");
    const currentTrackTitle = document.getElementById("current-track-title");
    const playerContainer = document.querySelector(".audio-player");
    let currentTrackBtn = null;

    if (audioPlayer && trackBtns.length > 0) {
        trackBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const trackSrc = btn.getAttribute("data-src");
                const trackName = btn.querySelector(".track-name").innerText;

                if (currentTrackBtn === btn) {
                    // Toggle play/pause for the same track
                    if (audioPlayer.paused) {
                        audioPlayer.play();
                        playerContainer.classList.add("playing-state");
                        btn.classList.add("active");
                    } else {
                        audioPlayer.pause();
                        playerContainer.classList.remove("playing-state");
                        btn.classList.remove("active");
                    }
                } else {
                    // Play a new track
                    if (currentTrackBtn) {
                        currentTrackBtn.classList.remove("active");
                    }
                    
                    // Update current
                    currentTrackBtn = btn;
                    currentTrackBtn.classList.add("active");
                    currentTrackTitle.innerText = "Soando: " + trackName;
                    
                    // Update audio source and play
                    audioPlayer.src = encodeURI(trackSrc);
                    audioPlayer.play();
                    playerContainer.classList.add("playing-state");
                }
            });
        });

        // When audio ends naturally
        audioPlayer.addEventListener("ended", () => {
            playerContainer.classList.remove("playing-state");
            if (currentTrackBtn) {
                currentTrackBtn.classList.remove("active");
            }
            currentTrackBtn = null;
            currentTrackTitle.innerText = "Selecciona unha pista para escoitar...";
        });
    }
});
