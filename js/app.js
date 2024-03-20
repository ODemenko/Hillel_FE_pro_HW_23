window.addEventListener('DOMContentLoaded', showCategories);

document.getElementById('categories').addEventListener('click', event => {
  const categoryId = event.target.getAttribute('data-category');
  if (categoryId) {
    showProductsByCategory(categoryId);
    highlightSelectedCategory(categoryId);
  }
});

document.getElementById('products').addEventListener('click', event => {
  const productId = event.target.getAttribute('data-product');
  const categoryId = event.target.getAttribute('data-category');
  if (productId) {
    showProductInfo(categoryId, productId);
    highlightSelectedProduct(productId);
  }
});

document.getElementById('myOrdersBtn').addEventListener('click', () => {
  const categoriesDiv = document.getElementById('categories');
  categoriesDiv.innerHTML = '';

  showOrders();
});