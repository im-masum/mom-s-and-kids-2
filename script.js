// Cart functionality
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartCount = document.getElementById("cart-count");

// Update cart count
function updateCartCount() {
  cartCount.textContent = cart.length;
}

// Add to cart function
function addToCart(product) {
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showNotification("Product added to cart!");
}

// Remove from cart function
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  updateCartDisplay();
  showNotification("Product removed from cart!");
}

// Clear cart function
function clearCart() {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  updateCartDisplay();
  showNotification("Cart cleared!");
}

// Update cart display
function updateCartDisplay() {
  const cartItems = document.getElementById("cart-items");
  const emptyCart = document.getElementById("empty-cart");

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.style.display = "none";
    emptyCart.style.display = "block";
  } else {
    cartItems.style.display = "block";
    emptyCart.style.display = "none";

    cartItems.innerHTML = cart
      .map(
        (item, index) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-details">
          <h3>${item.name}</h3>
          <p>${item.price}</p>
        </div>
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    `
      )
      .join("");

    updateCartTotal();
  }
}

// Update cart total
function updateCartTotal() {
  const subtotal = cart.reduce(
    (total, item) => total + parseFloat(item.price.replace("$", "")),
    0
  );
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("shipping").textContent = `$${shipping.toFixed(2)}`;
  document.getElementById("tax").textContent = `$${tax.toFixed(2)}`;
  document.getElementById("total").textContent = `$${total.toFixed(2)}`;
}

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDarkMode);

  // Update dark mode button
  const darkToggle = document.querySelector(".dark-toggle");
  darkToggle.textContent = isDarkMode ? "☀️" : "🌙";
}

// Check for saved dark mode preference
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
  document.querySelector(".dark-toggle").textContent = "☀️";
}

// Enhanced Menu Toggle Functionality
function initMenuToggle() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const dropdownContainers = document.querySelectorAll(".dropdown-container");
  const body = document.body;
  let isMenuOpen = false;

  // Calculate scrollbar width
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty(
    "--scrollbar-width",
    `${scrollbarWidth}px`
  );

  // Toggle menu function with improved animations
  function toggleMenu(event) {
    if (event) {
      event.preventDefault();
    }

    isMenuOpen = !isMenuOpen;
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("show");
    body.classList.toggle("nav-open");

    // Animate nav links with staggered delay
    const navItems = navLinks.querySelectorAll("li");
    navItems.forEach((item, index) => {
      if (isMenuOpen) {
        item.style.animation = `slideUpFade 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards ${
          index * 0.1
        }s`;
      } else {
        item.style.animation = "";
      }
    });

    // Handle focus trap when menu is open
    if (isMenuOpen) {
      trapFocus(navLinks);
    } else {
      removeFocusTrap();
    }
  }

  // Focus trap for accessibility
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    function handleFocusTrap(e) {
      const isTabPressed = e.key === "Tab";
      if (!isTabPressed) return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }

    document.addEventListener("keydown", handleFocusTrap);
    firstFocusable.focus();
  }

  function removeFocusTrap() {
    document.removeEventListener("keydown", handleFocusTrap);
  }

  // Handle menu toggle click
  menuToggle.addEventListener("click", toggleMenu);

  // Handle dropdown toggles in mobile view
  dropdownContainers.forEach((container) => {
    const link = container.querySelector(".nav-link");
    const dropdown = container.querySelector(".dropdown");

    link.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();

        // Close other dropdowns with animation
        dropdownContainers.forEach((otherContainer) => {
          if (otherContainer !== container) {
            const otherDropdown = otherContainer.querySelector(".dropdown");
            const otherLink = otherContainer.querySelector(".nav-link");
            if (otherDropdown.classList.contains("show")) {
              otherDropdown.style.animation =
                "slideUpFadeOut 0.3s ease forwards";
              setTimeout(() => {
                otherDropdown.classList.remove("show");
                otherLink.classList.remove("active");
                otherDropdown.style.animation = "";
              }, 300);
            }
          }
        });

        // Toggle current dropdown with animation
        if (!dropdown.classList.contains("show")) {
          dropdown.classList.add("show");
          link.classList.add("active");
          dropdown.style.animation = "slideUpFadeIn 0.3s ease forwards";
        } else {
          dropdown.style.animation = "slideUpFadeOut 0.3s ease forwards";
          setTimeout(() => {
            dropdown.classList.remove("show");
            link.classList.remove("active");
            dropdown.style.animation = "";
          }, 300);
        }
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      isMenuOpen &&
      !navLinks.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      toggleMenu();
    }
  });

  // Handle escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (isMenuOpen) {
        toggleMenu();
      } else {
        // Close any open dropdowns
        dropdownContainers.forEach((container) => {
          const dropdown = container.querySelector(".dropdown");
          const link = container.querySelector(".nav-link");
          if (dropdown.classList.contains("show")) {
            dropdown.classList.remove("show");
            link.classList.remove("active");
          }
        });
      }
    }
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768 && isMenuOpen) {
        toggleMenu();
      }
      // Update scrollbar width
      const newScrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty(
        "--scrollbar-width",
        `${newScrollbarWidth}px`
      );
    }, 250);
  });
}

// Show notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Form submission
document.addEventListener("DOMContentLoaded", function () {
  // Contact form
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = {
        name: this.querySelector("#name").value,
        email: this.querySelector("#email").value,
        subject: this.querySelector("#subject").value,
        message: this.querySelector("#message").value,
      };

      // Here you would typically send the data to your server
      console.log("Form submitted:", formData);

      // Show success message
      showNotification("Message sent successfully!");

      // Reset form
      this.reset();
    });
  }

  // Newsletter form
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = this.querySelector('input[type="email"]').value;

      // Here you would typically send the email to your server
      console.log("Newsletter subscription:", email);

      // Show success message
      showNotification("Thank you for subscribing!");

      // Reset form
      this.reset();
    });
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Initialize cart count on page load
updateCartCount();

// Add notification styles dynamically
const style = document.createElement("style");
style.textContent = `
  .notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: var(--primary-color);
    color: white;
    padding: 1rem 2rem;
    border-radius: 4px;
    box-shadow: var(--shadow);
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  .notification.show {
    transform: translateY(0);
    opacity: 1;
  }
  
  .menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }
  
  .menu-icon {
    display: block;
    width: 25px;
    height: 2px;
    background-color: var(--text-color);
    position: relative;
    transition: var(--transition);
  }
  
  .menu-icon::before,
  .menu-icon::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--text-color);
    transition: var(--transition);
  }
  
  .menu-icon::before {
    transform: translateY(-8px);
  }
  
  .menu-icon::after {
    transform: translateY(8px);
  }
  
  .menu-toggle.active .menu-icon {
    background-color: transparent;
  }
  
  .menu-toggle.active .menu-icon::before {
    transform: rotate(45deg);
  }
  
  .menu-toggle.active .menu-icon::after {
    transform: rotate(-45deg);
  }
  
  @media (max-width: 768px) {
    .nav-links.show {
      display: block;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: var(--background-color);
      padding: 1rem;
      box-shadow: var(--shadow);
    }
    
    .nav-links.show ul {
      flex-direction: column;
      gap: 1rem;
    }
    
    .nav-links.show .dropdown {
      position: static;
      box-shadow: none;
      padding-left: 1rem;
    }
  }
`;

document.head.appendChild(style);

// Initialize menu toggle functionality
document.addEventListener("DOMContentLoaded", function () {
  initMenuToggle();

  // ... existing DOMContentLoaded code ...
});

// Navigation functionality
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector("nav");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const dropdownContainers = document.querySelectorAll(".dropdown-container");
  const body = document.body;

  // Scroll effect for navigation
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    // Add/remove scrolled class for glass effect
    if (currentScroll > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  });

  // Mobile menu toggle
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("show");
    body.classList.toggle("nav-open");
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && navLinks.classList.contains("show")) {
      menuToggle.classList.remove("active");
      navLinks.classList.remove("show");
      body.classList.remove("nav-open");
    }
  });

  // Handle dropdowns in mobile view
  dropdownContainers.forEach((container) => {
    const link = container.querySelector(".nav-link");
    const dropdown = container.querySelector(".dropdown");

    link.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle("show");

        // Close other dropdowns
        dropdownContainers.forEach((otherContainer) => {
          if (otherContainer !== container) {
            otherContainer.querySelector(".dropdown").classList.remove("show");
          }
        });
      }
    });
  });

  // Close mobile menu on window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      menuToggle.classList.remove("active");
      navLinks.classList.remove("show");
      body.classList.remove("nav-open");

      // Close all dropdowns
      document.querySelectorAll(".dropdown").forEach((dropdown) => {
        dropdown.classList.remove("show");
      });
    }
  });

  // Active link highlighting
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute("id");
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (
        navLink &&
        scrollY > sectionTop &&
        scrollY <= sectionTop + sectionHeight
      ) {
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.remove("active");
        });
        navLink.classList.add("active");
      }
    });
  });
});

// Add new keyframe animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes slideUpFadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUpFadeOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(10px);
    }
  }
`;
document.head.appendChild(styleSheet);

// Enhanced Hero Section Animations (Flat)
function initHeroAnimations() {
  // Set up text shadow effect only (no 3D)
  const heroTitle = document.querySelector(".hero-text h1");
  if (heroTitle) {
    heroTitle.setAttribute("data-text", heroTitle.textContent);
  }

  // Remove parallax 3D effect for hero features
  const heroFeatures = document.querySelectorAll(".hero-feature");

  // Smooth reveal animation for features
  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px",
  };

  const featureObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 100);
        featureObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  heroFeatures.forEach((feature, index) => {
    feature.style.opacity = "0";
    feature.style.transform = "translateY(30px)";
    feature.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
    featureObserver.observe(feature);
  });

  // --- HERO STATS ANIMATION ---
  const heroStats = document.querySelectorAll(".hero-stats .stat");
  const statNumbers = document.querySelectorAll(".stat-nmbr");
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;
    heroStats.forEach((stat, i) => {
      setTimeout(() => {
        stat.classList.add("visible");
        // Animate number
        const number = stat.querySelector(".stat-nmbr");
        if (number) {
          const target = parseInt(
            number.getAttribute("data-count").replace(/\D/g, "")
          );
          let current = 0;
          const duration = 1200;
          const step = Math.max(1, Math.ceil(target / (duration / 16)));
          function update() {
            current += step;
            if (current < target) {
              number.textContent = current.toLocaleString();
              requestAnimationFrame(update);
            } else {
              number.textContent = target.toLocaleString();
            }
          }
          update();
        }
      }, i * 200);
    });
  }

  // Use IntersectionObserver to trigger animation when stats are visible
  if (heroStats.length) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStats();
            statsObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(heroStats[0]);
  }

  // Interactive CTA buttons (no 3D rotation)
  const ctaButtons = document.querySelectorAll(".cta-btn");
  ctaButtons.forEach((button) => {
    button.addEventListener("mousemove", (e) => {
      button.style.transform = "translateY(-3px)";
    });
    button.addEventListener("mouseleave", () => {
      button.style.transform = "translateY(0)";
    });
  });

  // Animated background gradient
  const hero = document.querySelector(".hero");
  if (hero) {
    document.addEventListener("mousemove", (e) => {
      const { clientX, clientY } = e;
      const x = Math.round((clientX / window.innerWidth) * 100);
      const y = Math.round((clientY / window.innerHeight) * 100);
      hero.style.setProperty("--x", `${x}%`);
      hero.style.setProperty("--y", `${y}%`);
    });
  }

  // Smooth scroll with progress indicator
  const scrollArrow = document.querySelector(".hero-scroll");
  if (scrollArrow) {
    scrollArrow.addEventListener("click", () => {
      const featuresSection = document.querySelector("#features");
      if (featuresSection) {
        const targetPosition = featuresSection.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;
        function animation(currentTime) {
          if (start === null) start = currentTime;
          const timeElapsed = currentTime - start;
          const progress = Math.min(timeElapsed / duration, 1);
          const ease = easeOutCubic(progress);
          window.scrollTo(0, startPosition + distance * ease);
          if (timeElapsed < duration) {
            requestAnimationFrame(animation);
          }
        }
        function easeOutCubic(t) {
          return 1 - Math.pow(1 - t, 3);
        }
        requestAnimationFrame(animation);
      }
    });
  }

  // Add scroll progress indicator
  const progressIndicator = document.createElement("div");
  progressIndicator.className = "scroll-progress";
  document.body.appendChild(progressIndicator);
  window.addEventListener("scroll", () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / (documentHeight - windowHeight)) * 100;
    progressIndicator.style.width = `${progress}%`;
  });

  // Add floating particles effect
  createParticles();
}

function createParticles() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const particlesContainer = document.createElement("div");
  particlesContainer.className = "particles-container";
  hero.appendChild(particlesContainer);
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    const size = Math.random() * 4 + 1;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 10;
    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${posX}%;
      top: ${posY}%;
      animation: float ${duration}s ease-in-out ${delay}s infinite;
      background: rgba(var(--primary-rgb), ${Math.random() * 0.3});
    `;
    particlesContainer.appendChild(particle);
  }
}

// Add new styles for enhanced animations
const enhancedStyles = document.createElement("style");
enhancedStyles.textContent = `
  .scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 3px;
    background: linear-gradient(to right, var(--primary-color), #ff8dc7);
    z-index: 1000;
    transition: width 0.2s ease-out;
  }

  .particles-container {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: 0;
  }

  .particle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  @keyframes float {
    0%, 100% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(${Math.random() * 100 - 50}px, ${
  Math.random() * 100 - 50
}px);
    }
  }

  .hero {
    --x: 50%;
    --y: 50%;
    background-image: 
      radial-gradient(
        circle at var(--x) var(--y),
        rgba(var(--primary-rgb), 0.1) 0%,
        rgba(var(--primary-rgb), 0.05) 30%,
        transparent 70%
      );
  }
`;
document.head.appendChild(enhancedStyles);

// Initialize enhanced animations
document.addEventListener("DOMContentLoaded", function () {
  initHeroAnimations();
  initMenuToggle();

  // ... existing DOMContentLoaded code ...
});

// About section advanced animation
function initAboutSection() {
  // Animate about-content entrance
  const aboutContent = document.querySelector(".about-content");
  if (aboutContent) {
    const aboutObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            aboutContent.classList.add("visible");
            aboutObserver.unobserve(aboutContent);
          }
        });
      },
      { threshold: 0.2 }
    );
    aboutObserver.observe(aboutContent);
  }

  // Animate value-item, team-member, achievement-item
  const animatedItems = document.querySelectorAll(
    ".value-item, .team-member, .achievement-item"
  );
  if (animatedItems.length) {
    const itemObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, i * 120);
            itemObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    animatedItems.forEach((item) => itemObserver.observe(item));
  }

  // Animate achievement count-up and progress bar
  const achievementNumbers = document.querySelectorAll(".achievement-number");
  if (achievementNumbers.length) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCountUp(entry.target);
            animateAchievementBar(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.7 }
    );
    achievementNumbers.forEach((num) => countObserver.observe(num));
  }


  // Mini-nav active link on scroll
  const navLinks = document.querySelectorAll(".about-mini-nav a");
  const sectionIds = [
    "our-story",
    "our-values",
    "our-team",
    "our-achievements",
  ];
  const sectionEls = sectionIds.map((id) => document.getElementById(id));
  if (navLinks.length && sectionEls.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => link.classList.remove("active"));
            const idx = sectionEls.findIndex((el) => el === entry.target);
            if (idx !== -1) navLinks[idx].classList.add("active");
          }
        });
      },
      { threshold: 0.4 }
    );
    sectionEls.forEach((el) => {
      if (el) navObserver.observe(el);
    });
  }
}

function animateCountUp(el) {
  const target = parseInt(el.getAttribute("data-count"), 10);
  let current = 0;
  let suffix = "";
  if (target >= 1000) {
    suffix = "k+";
  } else if (target < 100 && el.textContent.includes("%")) {
    suffix = "%";
  } else if (target > 100) {
    suffix = "+";
  }
  const duration = 1200;
  const step = Math.ceil(target / (duration / 16));
  function update() {
    current += step;
    if (current >= target) {
      el.textContent = target + suffix;
    } else {
      el.textContent =
        suffix === "k+" ? Math.floor(current / 1000) + "k+" : current + suffix;
      requestAnimationFrame(update);
    }
  }
  update();
}

function animateAchievementBar(el) {
  const bar = el.parentElement.querySelector(".achievement-bar");
  if (!bar) return;
  const target = parseInt(el.getAttribute("data-count"), 10);
  let percent = 0;
  if (target >= 10000) percent = 100;
  else if (target >= 500) percent = 80;
  else if (target >= 98) percent = 98;
  else percent = Math.min(target, 100);
  setTimeout(() => {
    bar.style.width = percent + "%";
  }, 200);
}

document.addEventListener("DOMContentLoaded", () => {
  initAboutSection();
});

// Features section animated reveal with enhanced effects
function initFeaturesAnimations() {
  const featureCards = document.querySelectorAll(".feature-card");
  if (featureCards.length) {
    const featureObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
              // Add entrance animation class
              entry.target.style.animation = `featureEntrance 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${
                i * 0.1
              }s both`;
            }, i * 150);
            featureObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    featureCards.forEach((card) => featureObserver.observe(card));
  }

  // Add interactive hover effects
  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });

    // Add ripple effect on click
    card.addEventListener("click", (e) => {
      const ripple = document.createElement("div");
      ripple.className = "ripple-effect";
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255, 105, 180, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
      `;

      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// Add enhanced styles for features
const enhancedFeatureStyles = document.createElement("style");
enhancedFeatureStyles.textContent = `
  @keyframes featureEntrance {
    from {
      opacity: 0;
      transform: translateY(40px) scale(0.95) rotateX(10deg);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1) rotateX(0deg);
    }
  }

  @keyframes ripple {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }

  .feature-card {
    --mouse-x: 0px;
    --mouse-y: 0px;
  }

  .feature-card:hover {
    transform: translateY(-8px) scale(1.02) rotateY(2deg);
  }

  .feature-icon {
    position: relative;
  }

  .feature-icon::after {
    content: '';
    position: absolute;
    inset: -5px;
    background: linear-gradient(45deg, var(--primary-color), #ff8dc7, var(--primary-color));
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
    animation: icon-glow 2s ease-in-out infinite;
  }

  .feature-card:hover .feature-icon::after {
    opacity: 0.3;
  }

  @keyframes icon-glow {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.1); opacity: 0.5; }
  }

  .feature-list li {
    position: relative;
    overflow: hidden;
  }

  .feature-list li::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--primary-color), #ff8dc7);
    transition: width 0.3s ease;
  }

  .feature-card:hover .feature-list li::after {
    width: 100%;
  }

  .features-header h1 {
    position: relative;
  }

  .features-header h1::before {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0;
    background: linear-gradient(45deg, var(--primary-color), #ff8dc7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    opacity: 0.3;
    filter: blur(8px);
    animation: text-glow 3s ease-in-out infinite;
  }

  @keyframes text-glow {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.02); }
  }
`;
document.head.appendChild(enhancedFeatureStyles);

document.addEventListener("DOMContentLoaded", function () {
  initHeroAnimations();
  initMenuToggle();
  initFeaturesAnimations();
  // ... existing DOMContentLoaded code ...
});

// Contact section enhanced functionality
function initContactSection() {
  const infoCards = document.querySelectorAll(".info-card");
  const contactForm = document.querySelector(".contact-form");
  const formGroups = document.querySelectorAll(".form-group");

  // Animate info cards on scroll
  if (infoCards.length) {
    const infoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, i * 200);
            infoObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    infoCards.forEach((card) => infoObserver.observe(card));
  }

  // Enhanced form interactions
  formGroups.forEach((group) => {
    const input = group.querySelector("input, textarea");
    const label = group.querySelector("label");

    if (input && label) {
      // Add floating label effect
      input.addEventListener("focus", () => {
        label.style.transform = "translateY(-25px) scale(0.85)";
        label.style.color = "var(--primary-color)";
      });

      input.addEventListener("blur", () => {
        if (!input.value) {
          label.style.transform = "translateY(0) scale(1)";
          label.style.color = "var(--text-color)";
        }
      });

      // Add character counter for textarea
      if (input.tagName === "TEXTAREA") {
        const counter = document.createElement("div");
        counter.className = "char-counter";
        counter.style.cssText = `
          position: absolute;
          bottom: -20px;
          right: 0;
          font-size: 0.8rem;
          color: var(--light-text);
          opacity: 0.7;
        `;
        group.style.position = "relative";
        group.appendChild(counter);

        input.addEventListener("input", () => {
          const count = input.value.length;
          const maxLength = 500;
          counter.textContent = `${count}/${maxLength}`;

          if (count > maxLength * 0.8) {
            counter.style.color = "var(--primary-color)";
          } else {
            counter.style.color = "var(--light-text)";
          }
        });
      }

      // Add ripple effect on input focus
      input.addEventListener("focus", (e) => {
        const ripple = document.createElement("div");
        ripple.className = "input-ripple";
        ripple.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: radial-gradient(circle, rgba(255, 105, 180, 0.2) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 1;
          animation: rippleExpand 0.6s ease-out;
        `;

        group.style.position = "relative";
        group.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    }
  });

  // Form submission with validation
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name =
        formData.get("name") || contactForm.querySelector("#name").value;
      const email =
        formData.get("email") || contactForm.querySelector("#email").value;
      const subject =
        formData.get("subject") || contactForm.querySelector("#subject").value;
      const message =
        formData.get("message") || contactForm.querySelector("#message").value;

      // Basic validation
      if (!name || !email || !subject || !message) {
        showNotification("Please fill in all fields", "error");
        return;
      }

      if (!isValidEmail(email)) {
        showNotification("Please enter a valid email address", "error");
        return;
      }

      // Simulate form submission
      const submitBtn = contactForm.querySelector(".submit-btn");
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showNotification(
          "Message sent successfully! We'll get back to you soon.",
          "success"
        );
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Reset character counter
        const counter = contactForm.querySelector(".char-counter");
        if (counter) {
          counter.textContent = "0/500";
          counter.style.color = "var(--light-text)";
        }
      }, 2000);
    });
  }

  // Add floating particles to contact section
  addContactParticles();
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  `;

  const bgColor =
    type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3";
  notification.style.backgroundColor = bgColor;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto remove
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 4000);
}

// Add floating particles to contact section
function addContactParticles() {
  const contactSection = document.querySelector(".contact");
  if (!contactSection) return;

  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("div");
    particle.className = "contact-particle";
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: var(--primary-color);
      border-radius: 50%;
      opacity: 0.3;
      pointer-events: none;
      animation: float-particle ${3 + Math.random() * 4}s ease-in-out infinite;
      animation-delay: ${Math.random() * 2}s;
    `;

    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;

    contactSection.appendChild(particle);
  }
}

// Add CSS animations for contact section
const contactStyles = document.createElement("style");
contactStyles.textContent = `
  @keyframes rippleExpand {
    0% {
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      width: 300px;
      height: 300px;
      opacity: 0;
    }
  }

  @keyframes float-particle {
    0%, 100% {
      transform: translateY(0px) translateX(0px);
      opacity: 0.3;
    }
    25% {
      transform: translateY(-20px) translateX(10px);
      opacity: 0.6;
    }
    50% {
      transform: translateY(-10px) translateX(-15px);
      opacity: 0.4;
    }
    75% {
      transform: translateY(-30px) translateX(5px);
      opacity: 0.7;
    }
  }

  .notification {
    backdrop-filter: blur(10px);
  }

  .form-group input:focus,
  .form-group textarea:focus {
    animation: formFieldFocus 0.6s ease-out;
  }

  @keyframes formFieldFocus {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 105, 180, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(255, 105, 180, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 105, 180, 0);
    }
  }
`;
document.head.appendChild(contactStyles);

// Initialize contact section when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initContactSection();
});
