// Navigation JS

document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const body = document.body;
  const cartIcon = document.querySelector(".cart-icon");
  const darkToggle = document.querySelector(".dark-toggle");
  const dropdownContainer = document.querySelector(".dropdown-container");
  let dropdownMenu = dropdownContainer
    ? dropdownContainer.querySelector(".dropdown")
    : null;

  // Helper: Remove active from all nav elements
  function clearNavActive() {
    document
      .querySelectorAll(".nav-link, .cart-icon, .dark-toggle, .menu-toggle")
      .forEach((el) => {
        el.classList.remove("active");
      });
  }

  // Dark mode logic
  function setDarkMode(on) {
    if (on) {
      body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "on");
    } else {
      body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "off");
    }
  }
  // Load dark mode preference
  if (localStorage.getItem("darkMode") === "on") {
    body.classList.add("dark-mode");
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").replace("#", "");
      if (targetId && document.getElementById(targetId)) {
        e.preventDefault();
        document
          .getElementById(targetId)
          .scrollIntoView({ behavior: "smooth", block: "start" });
        // Update URL hash without jumping
        history.replaceState(null, "", "#" + targetId);
      }
    });
  });

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function (e) {
      menuToggle.classList.toggle("active");
      navLinks.classList.toggle("show");
      body.classList.toggle("nav-open");
      clearNavActive();
      menuToggle.classList.add("active");
    });
    // Close menu when clicking a link (mobile UX)
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", function () {
        menuToggle.classList.remove("active");
        navLinks.classList.remove("show");
        body.classList.remove("nav-open");
      });
    });
  }

  // Dropdown toggle for mobile and keyboard
  if (dropdownContainer && dropdownMenu) {
    const dropdownToggle = dropdownContainer.querySelector(".nav-link");
    dropdownToggle.addEventListener("click", function (e) {
      // Only toggle on mobile
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdownMenu.classList.toggle("show");
      }
    });
    // Keyboard accessibility for dropdown
    dropdownToggle.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && window.innerWidth <= 768) {
        e.preventDefault();
        dropdownMenu.classList.toggle("show");
      }
      if (e.key === "Escape") {
        dropdownMenu.classList.remove("show");
      }
    });
  }

  // Highlight active nav link and nav buttons
  const navLinkEls = document.querySelectorAll(".nav-link");
  navLinkEls.forEach((link) => {
    link.addEventListener("click", function () {
      clearNavActive();
      this.classList.add("active");
    });
  });

  if (cartIcon) {
    cartIcon.addEventListener("click", function (e) {
      clearNavActive();
      cartIcon.classList.add("active");
    });
  }

  if (darkToggle) {
    darkToggle.addEventListener("click", function (e) {
      clearNavActive();
      darkToggle.classList.add("active");
      setDarkMode(!body.classList.contains("dark-mode"));
    });
  }

  // Auto-highlight nav links based on scroll position
  const sectionIds = Array.from(navLinkEls)
    .map((link) => link.getAttribute("href"))
    .filter((href) => href && href.startsWith("#") && href.length > 1)
    .map((href) => href.replace("#", ""));
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function highlightNavOnScroll() {
    let scrollPos = window.scrollY + 100; // Offset for nav height
    let found = false;
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section && section.offsetTop <= scrollPos) {
        clearNavActive();
        const activeLink = document.querySelector(
          '.nav-link[href="#' + section.id + '"]'
        );
        if (activeLink) activeLink.classList.add("active");
        found = true;
        break;
      }
    }
    // If no section found, highlight Home
    if (!found) {
      clearNavActive();
      const homeLink = document.querySelector('.nav-link[href="#index.html"]');
      if (homeLink) homeLink.classList.add("active");
    }
  }
  window.addEventListener("scroll", highlightNavOnScroll);
  highlightNavOnScroll();

  // Close nav/dropdown on outside click or Escape
  document.addEventListener("mousedown", function (e) {
    if (
      navLinks &&
      navLinks.classList.contains("show") &&
      !navLinks.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      navLinks.classList.remove("show");
      menuToggle.classList.remove("active");
      body.classList.remove("nav-open");
    }
    if (
      dropdownMenu &&
      dropdownMenu.classList.contains("show") &&
      !dropdownContainer.contains(e.target)
    ) {
      dropdownMenu.classList.remove("show");
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (navLinks && navLinks.classList.contains("show")) {
        navLinks.classList.remove("show");
        menuToggle.classList.remove("active");
        body.classList.remove("nav-open");
      }
      if (dropdownMenu && dropdownMenu.classList.contains("show")) {
        dropdownMenu.classList.remove("show");
      }
    }
  });

  // HERO SECTION JS
  // 1. Animate hero stats counting up
  function animateCountUp(el, target, duration = 1500) {
    let start = 0;
    let startTime = null;
    target = +target;
    function animateStep(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const value = Math.floor(progress * (target - start) + start);
      el.textContent = value >= 1000 ? value.toLocaleString() : value;
      if (progress < 1) {
        requestAnimationFrame(animateStep);
      } else {
        el.textContent = target >= 1000 ? target.toLocaleString() : target;
      }
    }
    requestAnimationFrame(animateStep);
  }

  // Animate all hero stats when hero is in view
  const heroStats = document.querySelectorAll(".hero-stats .stat-nmbr");
  let statsAnimated = false;
  function animateHeroStatsIfInView() {
    if (statsAnimated) return;
    const hero = document.getElementById("hero");
    const rect = hero.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      heroStats.forEach((el) => {
        const target = el.getAttribute("data-count");
        if (target) animateCountUp(el, target);
      });
      statsAnimated = true;
    }
  }
  window.addEventListener("scroll", animateHeroStatsIfInView);
  animateHeroStatsIfInView();

  // 2. Scroll arrow smooth scroll to next section
  const scrollArrow = document.querySelector(".hero-scroll");
  if (scrollArrow) {
    scrollArrow.addEventListener("click", function () {
      const nextSection = document.getElementById("features");
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // 3. Fade-in hero features and stats on scroll
  function fadeInOnScroll(selector) {
    const elements = document.querySelectorAll(selector);
    function checkFade() {
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
          el.classList.add("visible");
        }
      });
    }
    window.addEventListener("scroll", checkFade);
    checkFade();
  }
  fadeInOnScroll(".hero-feature");
  fadeInOnScroll(".stat");

  // FEATURES SECTION JS
  // 1. Fade-in feature cards on scroll (already handled by fadeInOnScroll, but ensure for .feature-card)
  fadeInOnScroll && fadeInOnScroll(".feature-card");

  // 2. Animate feature list checkmarks on hover/focus
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.addEventListener("mouseenter", animateFeatureList);
    card.addEventListener("focusin", animateFeatureList);
    card.addEventListener("mouseleave", resetFeatureList);
    card.addEventListener("focusout", resetFeatureList);
  });
  function animateFeatureList(e) {
    const lis = this.querySelectorAll(".feature-list li");
    lis.forEach((li, idx) => {
      setTimeout(() => {
        li.style.opacity = "1";
        li.style.transform = "translateX(5px)";
        const check = li.querySelector("::before");
        if (check) check.style.opacity = "1";
      }, idx * 100);
    });
  }
  function resetFeatureList(e) {
    const lis = this.querySelectorAll(".feature-list li");
    lis.forEach((li) => {
      li.style.opacity = "";
      li.style.transform = "";
    });
  }

  // 3. Keyboard accessibility: allow feature card focus/hover effect
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        card.classList.add("hover");
        animateFeatureList.call(card);
      }
      if (e.key === "Escape") {
        card.classList.remove("hover");
        resetFeatureList.call(card);
      }
    });
    card.addEventListener("blur", function () {
      card.classList.remove("hover");
      resetFeatureList.call(card);
    });
  });

  // CONTACT SECTION JS
  // 1. Fade-in info cards and form on scroll
  fadeInOnScroll && fadeInOnScroll(".info-card");
  fadeInOnScroll && fadeInOnScroll(".contact-form");

  // 2. Contact form validation and feedback
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let valid = true;
      const name = contactForm.querySelector("#name");
      const email = contactForm.querySelector("#email");
      const subject = contactForm.querySelector("#subject");
      const message = contactForm.querySelector("#message");
      // Simple validation
      [name, email, subject, message].forEach((input) => {
        input.classList.remove("input-error");
        if (!input.value.trim()) {
          input.classList.add("input-error");
          valid = false;
        }
      });
      // Email format check
      if (email && email.value && !/^\S+@\S+\.\S+$/.test(email.value)) {
        email.classList.add("input-error");
        valid = false;
      }
      // Show feedback
      let feedback = contactForm.querySelector(".form-feedback");
      if (!feedback) {
        feedback = document.createElement("div");
        feedback.className = "form-feedback";
        contactForm.appendChild(feedback);
      }
      if (valid) {
        feedback.textContent =
          "Thank you for contacting us! We will get back to you soon.";
        feedback.style.color = "#4a90e2";
        feedback.style.margin = "1rem 0";
        feedback.style.fontWeight = "bold";
        contactForm.reset();
        setTimeout(() => {
          feedback.textContent = "";
        }, 4000);
      } else {
        feedback.textContent = "Please fill in all fields correctly.";
        feedback.style.color = "#f63e3e";
        feedback.style.margin = "1rem 0";
        feedback.style.fontWeight = "bold";
      }
    });
    // Remove error style on input
    contactForm.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("input", function () {
        this.classList.remove("input-error");
      });
    });
  }

  // NAV IMPROVEMENTS
  // 1. Sticky, auto-hiding nav on scroll direction
  let lastScrollY = window.scrollY;
  let navHidden = false;
  function handleNavAutoHide() {
    const currentY = window.scrollY;
    if (currentY > lastScrollY && currentY > 80 && !navHidden) {
      nav.classList.add("nav-hidden");
      navHidden = true;
    } else if (currentY < lastScrollY && navHidden) {
      nav.classList.remove("nav-hidden");
      navHidden = false;
    }
    lastScrollY = currentY;
  }
  window.addEventListener("scroll", handleNavAutoHide);

  // 2. Animated underline for active nav link
  let underline = document.createElement("div");
  underline.className = "nav-underline";
  document.body.appendChild(underline);
  function moveUnderlineTo(link) {
    if (!link) return (underline.style.opacity = 0);
    const rect = link.getBoundingClientRect();
    underline.style.opacity = 1;
    underline.style.position = "fixed";
    underline.style.left = rect.left + "px";
    underline.style.top = rect.bottom - 2 + "px";
    underline.style.width = rect.width + "px";
    underline.style.height = "3px";
    underline.style.background =
      "linear-gradient(90deg, #fd5c06, #ff69b4, #4a90e2)";
    underline.style.borderRadius = "2px";
    underline.style.transition = "all 0.3s cubic-bezier(0.4,0,0.2,1)";
    underline.style.zIndex = 2000;
    underline.style.pointerEvents = "none";
  }
  function updateUnderline() {
    const active = document.querySelector(".nav-link.active");
    moveUnderlineTo(active);
  }
  updateUnderline();
  window.addEventListener("resize", updateUnderline);
  document.addEventListener("scroll", updateUnderline, true);
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("mouseenter", function () {
      moveUnderlineTo(this);
    });
    link.addEventListener("mouseleave", updateUnderline);
    link.addEventListener("focus", function () {
      moveUnderlineTo(this);
    });
    link.addEventListener("blur", updateUnderline);
  });
  // Update underline on nav link click
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", updateUnderline);
  });

  // 3. Dropdown keyboard navigation
  if (dropdownContainer && dropdownMenu) {
    const dropdownLinks = dropdownMenu.querySelectorAll("a");
    dropdownContainer.setAttribute("tabindex", "0");
    dropdownContainer.setAttribute("aria-haspopup", "true");
    dropdownContainer.setAttribute("aria-expanded", "false");
    dropdownContainer.setAttribute("role", "menuitem");
    dropdownMenu.setAttribute("role", "menu");
    dropdownLinks.forEach((link) => link.setAttribute("role", "menuitem"));
    dropdownContainer.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        dropdownMenu.classList.add("show");
        dropdownLinks[0].focus();
      }
    });
    dropdownLinks.forEach((link, idx) => {
      link.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          if (idx < dropdownLinks.length - 1) dropdownLinks[idx + 1].focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (idx > 0) dropdownLinks[idx - 1].focus();
          else dropdownContainer.focus();
        } else if (e.key === "Escape") {
          dropdownMenu.classList.remove("show");
          dropdownContainer.focus();
        }
      });
    });
    dropdownMenu.addEventListener("mouseleave", function () {
      dropdownMenu.classList.remove("show");
      dropdownContainer.setAttribute("aria-expanded", "false");
    });
    dropdownContainer.addEventListener("mouseenter", function () {
      dropdownMenu.classList.add("show");
      dropdownContainer.setAttribute("aria-expanded", "true");
    });
    dropdownContainer.addEventListener("mouseleave", function () {
      dropdownMenu.classList.remove("show");
      dropdownContainer.setAttribute("aria-expanded", "false");
    });
  }

  // 4. ARIA attributes for nav accessibility
  nav.setAttribute("role", "navigation");
  nav.setAttribute("aria-label", "Main Navigation");
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.setAttribute("tabindex", "0");
    link.setAttribute("role", "menuitem");
  });
});
