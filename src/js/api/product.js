"use strict";

export class ProductsAPI {
  constructor() {
    this.baseUrl = "https://nutriplan-api.vercel.app/api/products";
  }

  async getCategories() {
    const res = await fetch(`${this.baseUrl}/categories`);
    if (!res.ok) return [];
    const data = await res.json();
    console.log(data.results)
    return data.results || [];
  }

  async getByCategory(category) {
    const res = await fetch(`${this.baseUrl}/category/${category}`);
    if (!res.ok) return [];
    const data = await res.json();
    console.log(data.results)
    return data.results || [];
  }

  async getByBarcode(barcode) {
    const res = await fetch(`${this.baseUrl}/barcode/${barcode}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.result || data;
  }
   async getByName(name) {
    const res = await fetch(`${this.baseUrl}/search?q=${name}&page=1&limit=24`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.results;
  }
}
