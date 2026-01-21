export async function loadMealNutrition(meal) {
  // false data
  if (!meal || !meal.ingredients) {
    return {
      success: false,
      message: "Invalid meal data"
    };
  }

  const ingredients = meal.ingredients.map(
    item => `${item.measure} ${item.ingredient}`
  );

  // api post data and get
  const response = await fetch(
    "https://nutriplan-api.vercel.app/api/nutrition/analyze",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "dbMXzJhzXe8X29tDpIPm7bbiGEvJtSnKoarPTaQ8"
      },
      body: JSON.stringify({ ingredients })
    }
  );

  const data = await response.json();

  if (!data.success) return null;

  return data.data;
}
