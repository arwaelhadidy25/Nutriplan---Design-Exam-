"use strict"
import {showLoading , hideLoading} from "./navigation.js"
import { MealDB } from "./api/mealdb.js";
import { renderCategories } from "./ui/components.js";
import { renderMeals } from "./ui/components.js";
import { renderAreas } from "./ui/components.js";
import { showMealsLoading } from "./ui/components.js";
import { renderMealDetails } from "./ui/components.js";
import {getFoodLog,addToFoodLog } from "./state/appState.js";
import {renderFoodLog} from "./ui/components.js"
import { clearFoodLog } from "./state/appState.js";
import { removeFromFoodLog } from "./state/appState.js";
import { showSection } from "./navigation.js";
import { ProductsAPI } from "./api/product.js";
import { renderProducts, openProductModal } from "./ui/productsUI.js";
import { loadMealNutrition } from "./api/nutrition.js"
import { openServingsModal,closeServingsModal,fillServingsModal } from "./ui/components.js";

const searchInput = document.getElementById("search-input");
let currentMeal ="";
let currentMealNutrition = null;
let selectedServings=1;
let currentProduct=""
const api = new MealDB();
// loading
async function initHome() {
  showLoading();

  const meals = await api.getRandomMeals();
  renderMeals(meals);

  const categories = await api.getCategories();
  renderCategories(categories);

  const areas = await api.getAreas();
  renderAreas(areas);

  hideLoading();
}

initHome();

 //search meal
  searchInput.addEventListener("input", async function () {
    showMealsLoading();
  const query = searchInput.value.trim();

  if (query === "") {
    const meals = await api.getRandomMeals();
    renderMeals(meals);
  } else {
    const meals = await api.searchMeals(query);
    renderMeals(meals);
  }
});
// filter by category with getMeals function and searchMeal for filter 
document.getElementById("categories-grid").addEventListener("click", async function (e) {
    
    console.log(e)
    const card = e.target.closest(".category-card");
    console.log(card)
    if (!card) return;
    showMealsLoading();
    const categoryName =  card.querySelector("h3").textContent;
    const meals = await api.searchMeals(categoryName);
    console.log(meals)
    renderMeals(meals);
  });
//display meals by area
  document.getElementById("areas-grid").addEventListener("click", async function (e) {
  const card = e.target.closest(".area-card");
    if (!card) return;

    const areaButtons = document.querySelectorAll(".area-card");

for (let i = 0; i < areaButtons.length; i++) {
  areaButtons[i].classList.remove("bg-emerald-600", "text-white");
  areaButtons[i].classList.add("bg-gray-100", "text-gray-700");
}
    card.classList.add("bg-emerald-600", "text-white");
    card.classList.remove("bg-gray-100", "text-gray-700");

   const areaName = card.textContent.trim();
   showMealsLoading();
    if (areaName === "All Recipes") {
      const meals = await api.getRandomMeals();
      renderMeals(meals);
      return;
    }

    const meals = await api.searchMeals(areaName);
    renderMeals(meals);
  });
//display details

document.getElementById("recipes-grid").addEventListener("click", async function (e) {

    const card = e.target.closest(".recipe-card");
    if (!card) return;

    const mealId = card.dataset.mealId;

    const meal = await api.getMealById(mealId);
    currentMeal =meal;
    renderMealDetails(meal);
    
    
 showSection("meal-details")
  });
// food log show
document.getElementById("foodlog-show").addEventListener("click", () => {
  showSection("foodlog-section");
  renderFoodLog(getFoodLog());
});
//clear all food log
document.getElementById("clear-foodlog").addEventListener("click", function () {
  clearFoodLog();
  renderFoodLog([]);
});
    document.getElementById("foodlog-show").addEventListener("click", function (e) {
showSection("foodlog-section")
renderFoodLog(getFoodLog());

  });


document.addEventListener("click", function (e) {
  if (e.target.closest(".delete-log")) {
    const id = e.target.closest(".delete-log").dataset.id;
    removeFromFoodLog(id);
    renderFoodLog();
  }})
//products

const apiProduct = new ProductsAPI();
const barcodeInput = document.getElementById("barcode-input");
const barcodeBtn = document.getElementById("lookup-barcode-btn");
const categories = document.getElementById("product-categories");
const searchProductInput =document.getElementById("product-search-input")
const searchProductBtn=document.getElementById("search-product-btn")

let allProducts = [];
let filteredProducts =[];
const nutriScoreSection = document.querySelector(".nutri-score");
//display by category
categories.addEventListener("click", async (e) => {
  const btn = e.target.closest(".product-category-btn");
  if (!btn) return;

  const category = btn.textContent;
  allProducts = await apiProduct.getByCategory(category);
  filteredProducts = allProducts;

  renderProducts(filteredProducts);});
  //nutri score search
nutriScoreSection.addEventListener("click", (e) => {
  const btn = e.target.closest(".nutri-score-filter");
  if (!btn) return;

  const grade = btn.dataset.grade

  if (!grade || grade==="All") {
    filteredProducts = allProducts;
    console.log(filteredProducts)
  } else {
    filteredProducts = allProducts.filter(
      p => p.nutritionGrade === grade
    );
  }

  renderProducts(filteredProducts);
});
// barcode search
barcodeBtn.addEventListener("click", async () => {
  const code = barcodeInput.value.trim();
  if (!code) return;

  const product = await apiProduct.getByBarcode(code);
  renderProducts(product ? [product] : []);
});

// name search
searchProductBtn.addEventListener("click", async () => {
  const code = searchProductInput.value.trim();
  if (!code) return;
  const product = await apiProduct.getByName(code);
  renderProducts(product);
});


document.getElementById("products-grid").addEventListener("click", e => {
  const card = e.target.closest(".product-card");
  if (!card) return;

  const barcode = card.dataset.barcode;
  const product = filteredProducts.find(p => p.barcode === barcode);

  if (product) {
    openProductModal(product);
  }
});

//////////////add meal to log food

//meal button action
document.addEventListener("click", async (e) => {
  if (!e.target.closest("#log-meal-btn")) return;
  console.log(currentMeal);
  const nutrition = await loadMealNutrition(currentMeal);
  currentMealNutrition = nutrition.perServing;
  selectedServings = 1;
  document.getElementById("servings-count").textContent = "1";
  await fillServingsModal(currentMeal, nutrition);
  openServingsModal();
});

//serving counter
document.getElementById("plus-serving").addEventListener("click", () => {
  selectedServings=selectedServings+0.5;
  document.getElementById("servings-count").textContent = selectedServings;
});

document.getElementById("minus-serving").addEventListener("click", () => {
  if (selectedServings > 1) {
    selectedServings=selectedServings-0.5;
    document.getElementById("servings-count").textContent = selectedServings;
  }
});
document.getElementById("confirm-serving").addEventListener("click", () => {
  if (!currentMeal || !currentMealNutrition) return;

  const logItem = {
    id: currentMeal.id + "-" + Date.now(),
    name: currentMeal.name,
    image: currentMeal.thumbnail,
    type: "meal",
    servings: selectedServings,

    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    }),
    date: new Date().toISOString().split("T")[0],

    calories: currentMealNutrition.calories * selectedServings,
    protein:  currentMealNutrition.protein  * selectedServings,
    carbs:    currentMealNutrition.carbs    * selectedServings,
    fat:      currentMealNutrition.fat      * selectedServings,
    fiber:    currentMealNutrition.fiber    * selectedServings
  };

  addToFoodLog(logItem);
  closeServingsModal();
});
//////////////add meal to log food
function addProductToFoodLog(product) {
  const logItem = {
    id: `product-${product.barcode}-${Date.now()}`,
    type: "product",

    name: product.name,
    image: product.image,
    servings: 1,

    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    }),
    date: new Date().toISOString().split("T")[0],

    calories: product.nutrients.calories,
    protein: product.nutrients.protein,
    carbs: product.nutrients.carbs,
    fat: product.nutrients.fat,
    sugar: product.nutrients.sugar,
    fiber: product.nutrients.fiber,
    sodium: product.nutrients.sodium
  };

  addToFoodLog(logItem);
}


document.getElementById("products-grid").addEventListener("click",  async function (e) {
  const card = e.target.closest(".product-card");
  const barcode = card.dataset.barcode;
  const product = await apiProduct.getByBarcode(barcode);
  currentProduct =product;
  addProductToFoodLog(product);
});
