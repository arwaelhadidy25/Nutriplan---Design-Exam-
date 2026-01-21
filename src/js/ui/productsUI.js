"use strict";
import{closeProductModal} from "../navigation.js"
export function renderProducts(products) {
  let grid = "";
  const counter = document.getElementById("products-count");

  if (!products || products.length === 0) {
    counter.textContent = "No products found";
    return;
  }
for(let i=0; i<products.length;i++){
grid +=`
    <div
                class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                data-barcode="${products[i].barcode}"
              >
                <div
                  class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden"
                >
                  <img
                    class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    src="${products[i].image}"
                    alt="${products[i].name}"
                    loading="lazy"
                  />

                  <!-- Nutri-Score Badge -->
                  <div
                    class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase"
                  >
                    Nutri-Score ${products[i].nutritionGrade}
                  </div>

                  <!-- NOVA Badge -->
                  <div
                    class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    title="NOVA ${products[i].novaGroup? products[i].novaGroup:""}"
                  >
                    ${products[i].novaGroup? products[i].novaGroup:0}
                  </div>
                </div>

                <div class="p-4">
                  <p
                    class="text-xs text-emerald-600 font-semibold mb-1 truncate"
                  >
                    ${products[i].brand}
                  </p>
                  <h3
                    class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors"
                  >
                    ${products[i].name}
                  </h3>

                  <div
                    class="flex items-center gap-3 text-xs text-gray-500 mb-3"
                  >
                    <span
                      ><i class="fa-solid fa-weight-scale mr-1"></i>250g</span
                    >
                    <span
                      ><i class="fa-solid fa-fire mr-1"></i>350 kcal/100g</span
                    >
                  </div>

                  <!-- Mini Nutrition -->
                  <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                      <p class="text-xs font-bold text-emerald-700">${products[i].nutrients.protein}g</p>
                      <p class="text-[10px] text-gray-500">Protein</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                      <p class="text-xs font-bold text-blue-700">${products[i].nutrients.carbs}g</p>
                      <p class="text-[10px] text-gray-500">Carbs</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                      <p class="text-xs font-bold text-purple-700">${products[i].nutrients.fat}g</p>
                      <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                      <p class="text-xs font-bold text-orange-700">${products[i].nutrients.sugar}g</p>
                      <p class="text-[10px] text-gray-500">Sugar</p>
                    </div>
                  </div>
                </div>
              </div>
  
`
}
 counter.textContent = `${products.length} products`;
document.getElementById("products-grid").innerHTML=grid;
}
let selectedProduct = null;

export function openProductModal(product) {
  selectedProduct = product;

  document.getElementById("modal-image").src = product.image;
  document.getElementById("modal-brand").textContent = product.brand || "";
  document.getElementById("modal-name").textContent = product.name;

  // Nutri score
  const nutri = document.getElementById("modal-nutri");
  nutri.textContent = `Nutri-Score ${product.nutritionGrade.toUpperCase()}`;
  nutri.className =
    "px-3 py-1 rounded-lg text-xs font-bold " +
    {
      a: "bg-green-100 text-green-700",
      b: "bg-lime-100 text-lime-700",
      c: "bg-yellow-100 text-yellow-700",
      d: "bg-orange-100 text-orange-700",
      e: "bg-red-100 text-red-700"
    }[product.nutritionGrade];

  document.getElementById("modal-nova").textContent =
    `NOVA ${product.novaGroup?product.novaGroup:""}`;

  // Nutrition
  document.getElementById("modal-product-calories").textContent =product.nutrients.calories;

  document.getElementById("modal-product-protein").textContent =`${product.nutrients.protein}g`;
  document.getElementById("modal-product-carbs").textContent =`${product.nutrients.carbs}g`;
  document.getElementById("modal-product-fat").textContent =
    `${product.nutrients.fat}g`;
  document.getElementById("modal-product-sugar").textContent =
    `${product.nutrients.sugar}g`;
//   // Show modal
  const modal = document.getElementById("product-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}
document.getElementById("log-product-btn").addEventListener("click", () => {
  if (!selectedProduct) return;

  console.log("Log product:", selectedProduct);

  closeProductModal();
});