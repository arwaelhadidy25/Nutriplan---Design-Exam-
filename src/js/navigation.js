"use strict"
// loading
export function showLoading() {
  const overlay = document.getElementById("app-loading-overlay");
  if (overlay) overlay.style.display = "flex";
}

export function hideLoading() {
  const overlay = document.getElementById("app-loading-overlay");
  if (overlay) overlay.style.display = "none";
}
// sections
export function showSection(sectionId) {
  const homeSections = [
    "search-filters-section",
    "meal-categories-section",
    "all-recipes-section"
  ];

  const allSections = [
    ...homeSections,
    "meal-details",
    "foodlog-section",
    "products-section"
  ];

  for (let i = 0; i < allSections.length; i++) {
    const el = document.getElementById(allSections[i]);
    if (!el) continue;

    if (sectionId === "home") {
      el.style.display = homeSections.includes(allSections[i])
        ? "block"
        : "none";
    } else {
      el.style.display = allSections[i] === sectionId ? "block" : "none";
    }
  }
}

// sidebar active
function setActiveSidebar(activeId) {
  const buttons = document.querySelectorAll(".sidebar-btn");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }

  const activeBtn = document.getElementById(activeId);
  if (activeBtn) activeBtn.classList.add("active");
}


//navigation
export function navigateTo(sectionId, sidebarId, focusId = null) {
  showSection(sectionId);

  // sidebar active
  if (sidebarId) {
    const buttons = document.querySelectorAll(".sidebar-btn");
    buttons.forEach(btn => btn.classList.remove("active"));

    const activeBtn = document.getElementById(sidebarId);
    if (activeBtn) activeBtn.classList.add("active");
  }
//focus in input
  if (focusId) {
    setTimeout(() => {
      const input = document.getElementById(focusId);
      if (input) input.focus();
    }, 0);
  }
}

// Sidebar Clicks 
const sidebar = document.getElementById("sidebar");

sidebar.addEventListener("click", e => {
  const btn = e.target.closest(".sidebar-btn");
  if (!btn) return;

  if (btn.id === "home") {
    navigateTo("home", "home");
  }

  if (btn.id === "product-show") {
    navigateTo("products-section", "product-show");
  }

  if (btn.id === "foodlog-show") {
    navigateTo("foodlog-section", "foodlog-show");
  }
});

// Back Button (Meal Details)
document.getElementById("meal-details").addEventListener("click", e => {
  if (e.target.closest("#back-to-meals-btn")) {
    navigateTo("home", "home");
  }
});

// modals
export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

export function closeProductModal() {
  closeModal("product-modal");
}

export function closeServingModal() {
  closeModal("servings-modal");
}

/* Product Modal */
document.getElementById("close-product-modal").addEventListener("click", closeProductModal);

document.getElementById("close-product-modal-2").addEventListener("click", closeProductModal);

/* Serving Modal */
document.getElementById("close-serving").addEventListener("click", closeServingModal);

document.getElementById("quick-log-meal-btn").addEventListener("click", () => {
  navigateTo("home", "home");});
document.getElementById("quick-scan-btn").addEventListener("click", () => {
  navigateTo("products-section", "product-show", "barcode-input");
  });
document.getElementById("quick-search-product").addEventListener("click", () => {
  navigateTo("products-section", "product-show", "product-search-input");
  });