document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. MOBILE NAVIGATION & HAMBURGER MENU
  // ==========================================
  const hamburgerToggle = document.getElementById('hamburger-toggle');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  function toggleMobileMenu() {
    hamburgerToggle.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  }
  
  if (hamburgerToggle && mobileMenuOverlay) {
    hamburgerToggle.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on links
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenuOverlay.classList.contains('open')) {
          toggleMobileMenu();
        }
      });
    });
  }

  // ==========================================
  // 2. NAV BAR STYLE ON SCROLL
  // ==========================================
  const navBar = document.querySelector('.nav-bar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navBar.classList.add('scrolled');
    } else {
      navBar.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 3. SCROLL REVEAL & SCROLLSPY (Intersection Observer)
  // ==========================================
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const revealSections = document.querySelectorAll('.section-reveal');
  
  // Section Scroll Reveal Observer
  const revealObserverOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Stop observing after it has revealed
      }
    });
  }, revealObserverOptions);
  
  revealSections.forEach(section => {
    revealObserver.observe(section);
  });
  
  // Scrollspy Observer to highlight active link in navigation
  const scrollspyOptions = {
    root: null,
    threshold: 0.25,
    rootMargin: '-80px 0px -50% 0px' // adjust for nav height and viewport center
  };
  
  const scrollspyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, scrollspyOptions);
  
  sections.forEach(section => {
    scrollspyObserver.observe(section);
  });

  // ==========================================
  // 4. STATS COUNT-UP ANIMATION
  // ==========================================
  const statCounts = document.querySelectorAll('.stat-count');
  let statsAnimated = false;
  
  function animateStats() {
    statCounts.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const decimals = parseInt(stat.getAttribute('data-decimals') || '0');
      const duration = 2000; // 2 seconds
      const startTime = performance.now();
      
      function updateNumber(currentTime) {
        const elapsedTime = currentTime - startTime;
        if (elapsedTime >= duration) {
          stat.textContent = target.toFixed(decimals);
          return;
        }
        
        const progress = elapsedTime / duration;
        // Ease-out quad formula
        const easeProgress = progress * (2 - progress);
        const currentValue = easeProgress * target;
        
        stat.textContent = currentValue.toFixed(decimals);
        requestAnimationFrame(updateNumber);
      }
      
      requestAnimationFrame(updateNumber);
    });
  }
  
  // Observe the Hero stats to trigger animation
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          animateStats();
          statsAnimated = true;
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
  }

  // ==========================================
  // 5. TOAST NOTIFICATION SYSTEM
  // ==========================================
  const toastContainer = document.getElementById('toast-container');
  
  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Icon based on type
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else {
      iconSvg = `<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    }
    
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">
          ${iconSvg}
        </div>
        <span class="toast-msg">${message}</span>
      </div>
      <button class="toast-close">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 50);
    
    // Auto-remove toast after 4 seconds
    const autoRemoveTimeout = setTimeout(() => {
      removeToast(toast);
    }, 4000);
    
    // Close button event listener
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      clearTimeout(autoRemoveTimeout);
      removeToast(toast);
    });
  }
  
  function removeToast(toast) {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }

  // ==========================================
  // 6. CONTACT FORM SUBMISSION SIMULATION
  // ==========================================
  const contactForm = document.getElementById('contact-form-element');
  const submitBtn = document.getElementById('submit-btn');
  
  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic client-side validation check
      const fname = document.getElementById('fname').value.trim();
      const lname = document.getElementById('lname').value.trim();
      const email = document.getElementById('email').value.trim();
      const service = document.getElementById('service').value;
      
      if (!fname || !lname || !email || !service) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }
      
      // Show loading spinner
      submitBtn.classList.add('loading');
      
      // Simulate API submit call
      setTimeout(() => {
        // Success
        submitBtn.classList.remove('loading');
        showToast(`Thank you, ${fname}! Your request has been sent successfully.`, 'success');
        
        // Reset form fields
        contactForm.reset();
      }, 1800);
    });
  }

  // ==========================================
  // 7. PROCESS STEPS SCROLL EFFECT
  // ==========================================
  const processSteps = document.querySelectorAll('.step');
  if (processSteps.length > 0) {
    const processObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Highlight steps sequentially
          processSteps.forEach((step, idx) => {
            setTimeout(() => {
              step.classList.add('active');
            }, idx * 250); // cascading delays
          });
          processObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    const processSection = document.getElementById('process');
    if (processSection) {
      processObserver.observe(processSection);
    }
  }

});
