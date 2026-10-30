(() => {
  document.documentElement.classList.add("js");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");

  if (menuButton && nav) {
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.querySelector(".sr-only").textContent = "Open menu";
      nav.classList.remove("is-open");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.querySelector(".sr-only").textContent = isOpen ? "Open menu" : "Close menu";
      nav.classList.toggle("is-open", !isOpen);
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        closeMenu();
        menuButton.focus();
      }
    });
  }

  const themeButtons = document.querySelectorAll(".theme-toggle");
  const themeStorageKey = "lumina-theme";
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem(themeStorageKey);
  } catch {
    savedTheme = null;
  }
  const initialTheme = savedTheme === "dark" || savedTheme === "light"
    ? savedTheme
    : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  const applyTheme = (theme) => {
    document.body.classList.toggle("dark-theme", theme === "dark");
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.setAttribute("content", theme === "dark" ? "#171d1b" : "#f5f4ed");
    });
    themeButtons.forEach((button) => {
      const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
      button.setAttribute("aria-label", label);
      const text = button.querySelector(".theme-label");
      if (text) text.textContent = theme === "dark" ? "Light mode" : "Dark mode";
    });
  };
  applyTheme(initialTheme);

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
      applyTheme(nextTheme);
      try {
        localStorage.setItem(themeStorageKey, nextTheme);
      } catch {
        // The current page still uses the selected theme when storage is unavailable.
      }
    });
  });

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
  const revealItems = document.querySelectorAll("[data-reveal]");
  const revealItems = document.querySelectorAll("[data-reveal]");
  const animateCounter = (element) => {
    if (element.dataset.counted) return;
    element.dataset.counted = "true";
    const target = Number(element.dataset.count);
    const suffix = element.dataset.suffix || "";
    const duration = 900;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.round(target * (1 - (1 - progress) ** 3));
      element.textContent = `${value}${suffix}`;
      if (progress < 1) window.requestAnimationFrame(update);
    };
    window.requestAnimationFrame(update);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll("[data-count]").forEach(animateCounter);
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
      item.querySelectorAll("[data-count]").forEach(animateCounter);
    });
  }

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      const values = new FormData(contactForm);
      const name = String(values.get("name")).trim();
      const email = String(values.get("email")).trim();
      const subject = String(values.get("subject"));
      const message = String(values.get("message")).trim();
      const mailSubject = encodeURIComponent(`${subject} — ${name}`);
      const mailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      const status = contactForm.querySelector("[data-form-status]");
      status.textContent = "Your email app should open with your message. It will only be sent after you press send there.";
      window.location.href = `mailto:hello@luminafurnishings.example?subject=${mailSubject}&body=${mailBody}`;
    });
  }
})();
