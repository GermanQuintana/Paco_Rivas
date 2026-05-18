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
    const trackBtns = Array.from(document.querySelectorAll(".track-btn"));
    const currentTrackTitle = document.getElementById("current-track-title");
    const playerContainer = document.querySelector(".audio-player");
    const ctrlPlay = document.getElementById("ctrl-play");
    const ctrlPrev = document.getElementById("ctrl-prev");
    const ctrlNext = document.getElementById("ctrl-next");
    const ctrlBack = document.getElementById("ctrl-back");
    const ctrlFwd = document.getElementById("ctrl-fwd");
    const progressBar = document.getElementById("progress-bar");
    const progressFill = document.getElementById("progress-fill");
    const timeCurrent = document.getElementById("time-current");
    const timeTotal = document.getElementById("time-total");
    let currentIndex = -1;

    const formatTime = (s) => {
        if (!isFinite(s) || s < 0) return "0:00";
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return m + ":" + (sec < 10 ? "0" : "") + sec;
    };

    const setPlayIcon = (playing) => {
        if (ctrlPlay) ctrlPlay.innerText = playing ? "⏸" : "▶";
    };

    const refreshTrackIcons = () => {
        trackBtns.forEach((b, i) => {
            const icon = b.querySelector(".track-play-icon");
            if (i === currentIndex) {
                b.classList.add("active");
                if (icon) icon.innerText = audioPlayer.paused ? "▶" : "⏸";
            } else {
                b.classList.remove("active");
                if (icon) icon.innerText = "▶";
            }
        });
    };

    const loadTrack = (index, autoplay = true) => {
        if (index < 0 || index >= trackBtns.length) return;
        const btn = trackBtns[index];
        const trackSrc = btn.getAttribute("data-src");
        const trackName = btn.querySelector(".track-name").innerText;
        currentIndex = index;
        currentTrackTitle.innerText = (autoplay ? "Soando: " : "Listo: ") + trackName;
        audioPlayer.src = encodeURI(trackSrc);
        if (autoplay) {
            audioPlayer.play().catch(() => {});
        }
        refreshTrackIcons();
    };

    if (audioPlayer && trackBtns.length > 0) {
        trackBtns.forEach((btn, index) => {
            btn.addEventListener("click", () => {
                if (currentIndex === index) {
                    if (audioPlayer.paused) {
                        audioPlayer.play().catch(() => {});
                    } else {
                        audioPlayer.pause();
                    }
                } else {
                    loadTrack(index, true);
                }
            });
        });

        if (ctrlPlay) {
            ctrlPlay.addEventListener("click", () => {
                if (currentIndex === -1) {
                    loadTrack(0, true);
                    return;
                }
                if (audioPlayer.paused) {
                    audioPlayer.play().catch(() => {});
                } else {
                    audioPlayer.pause();
                }
            });
        }

        if (ctrlPrev) {
            ctrlPrev.addEventListener("click", () => {
                if (currentIndex === -1) {
                    loadTrack(0, true);
                } else {
                    loadTrack((currentIndex - 1 + trackBtns.length) % trackBtns.length, true);
                }
            });
        }

        if (ctrlNext) {
            ctrlNext.addEventListener("click", () => {
                if (currentIndex === -1) {
                    loadTrack(0, true);
                } else {
                    loadTrack((currentIndex + 1) % trackBtns.length, true);
                }
            });
        }

        if (ctrlBack) {
            ctrlBack.addEventListener("click", () => {
                if (currentIndex === -1) return;
                audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);
            });
        }

        if (ctrlFwd) {
            ctrlFwd.addEventListener("click", () => {
                if (currentIndex === -1) return;
                const dur = audioPlayer.duration || 0;
                audioPlayer.currentTime = Math.min(dur, audioPlayer.currentTime + 10);
            });
        }

        if (progressBar) {
            progressBar.addEventListener("click", (e) => {
                const dur = audioPlayer.duration;
                if (!isFinite(dur) || dur <= 0) return;
                const rect = progressBar.getBoundingClientRect();
                const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
                audioPlayer.currentTime = ratio * dur;
            });
        }

        audioPlayer.addEventListener("play", () => {
            playerContainer.classList.add("playing-state");
            setPlayIcon(true);
            refreshTrackIcons();
        });

        audioPlayer.addEventListener("pause", () => {
            playerContainer.classList.remove("playing-state");
            setPlayIcon(false);
            refreshTrackIcons();
        });

        audioPlayer.addEventListener("timeupdate", () => {
            const cur = audioPlayer.currentTime || 0;
            const dur = audioPlayer.duration || 0;
            if (timeCurrent) timeCurrent.innerText = formatTime(cur);
            if (progressFill && dur > 0) {
                progressFill.style.width = ((cur / dur) * 100) + "%";
            }
        });

        audioPlayer.addEventListener("loadedmetadata", () => {
            if (timeTotal) timeTotal.innerText = formatTime(audioPlayer.duration);
        });

        audioPlayer.addEventListener("ended", () => {
            if (currentIndex !== -1 && currentIndex < trackBtns.length - 1) {
                loadTrack(currentIndex + 1, true);
            } else {
                playerContainer.classList.remove("playing-state");
                setPlayIcon(false);
                if (progressFill) progressFill.style.width = "0%";
                if (timeCurrent) timeCurrent.innerText = "0:00";
                currentTrackTitle.innerText = "Selecciona unha pista para escoitar...";
                currentIndex = -1;
                refreshTrackIcons();
            }
        });
    }
});
