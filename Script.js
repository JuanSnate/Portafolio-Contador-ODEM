(function () {
  "use strict";

  /* ---------- Sticky header ---------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    if (window.scrollY > 12) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Ledger service tabs ---------- */
  const tabs = Array.from(document.querySelectorAll(".ledger-tab"));
  const panels = Array.from(document.querySelectorAll(".ledger-panel"));

  function activateTab(targetId) {
    tabs.forEach((tab) => {
      const isTarget = tab.dataset.target === targetId;
      tab.classList.toggle("is-active", isTarget);
      tab.setAttribute("aria-selected", String(isTarget));
    });
    panels.forEach((panel) => {
      const isTarget = panel.id === targetId;
      panel.classList.toggle("is-active", isTarget);
      panel.hidden = !isTarget;
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab.dataset.target));
  });

  /* keyboard navigation between tabs (left/right/up/down arrows) */
  const tabList = document.querySelector('[role="tablist"]');
  tabList.addEventListener("keydown", (e) => {
    const currentIndex = tabs.findIndex((t) => t.classList.contains("is-active"));
    let nextIndex = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") nextIndex = (currentIndex + 1) % tabs.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (nextIndex !== null) {
      e.preventDefault();
      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex].dataset.target);
    }
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-question").forEach((btn) => {
    const answer = btn.nextElementSibling;
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";

      // close all others
      document.querySelectorAll(".faq-question").forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute("aria-expanded", "false");
          otherBtn.nextElementSibling.style.maxHeight = null;
        }
      });

      btn.setAttribute("aria-expanded", String(!isOpen));
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + "px";
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Hero stamp animation ---------- */
  const stamp = document.getElementById("heroStamp");
  if (stamp) {
    setTimeout(() => stamp.classList.add("is-stamped"), 350);
  }

  /* ---------- Contact form -> mailto ---------- */
  const form = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = form.nombre.value.trim();
    const telefono = form.telefono.value.trim();
    const servicio = form.servicio.value;
    const mensaje = form.mensaje.value.trim();

    if (!nombre || !telefono || !mensaje) {
      formNote.textContent = "Por favor completa nombre, teléfono y mensaje.";
      formNote.style.color = "#b8863a";
      return;
    }

    const subject = encodeURIComponent(`Consulta desde el sitio web — ${servicio}`);
    const body = encodeURIComponent(
      `Nombre: ${nombre}\nTeléfono: ${telefono}\nServicio de interés: ${servicio}\n\nMensaje:\n${mensaje}`
    );

    window.location.href = `mailto:contador.odem@gmail.com?subject=${subject}&body=${body}`;
    formNote.textContent = "Abriendo tu cliente de correo con el mensaje listo…";
    formNote.style.color = "#56636e";
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
