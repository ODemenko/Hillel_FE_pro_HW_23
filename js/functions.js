function showCategories() {
  const parent = document.getElementById('categories');

  data.forEach(category => {
    const myCategoryElement = document.createElement('div');
    myCategoryElement.textContent = category.name;
    myCategoryElement.setAttribute('data-category', category.key);

    parent.appendChild(myCategoryElement);
  });
}

function showProductsByCategory(categoryId) {
  const selectedCategory = data.find(category => category.key === categoryId);

  const parent = document.getElementById('products');
  parent.innerHTML = '';

  selectedCategory.products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.textContent = product.name;
    productElement.setAttribute('data-product', product.id);
    productElement.setAttribute('data-category', categoryId);

    parent.appendChild(productElement);
  });
}

function showProductInfo(categoryId, productId) {
  const selectedCategory = data.find(category => category.key === categoryId);
  const selectedProduct = selectedCategory.products.find(product => product.id == productId);

  const parent = document.getElementById('product');
  parent.innerHTML = `
    <h2>${selectedProduct.name}</h2>
    <p>Price: $${selectedProduct.price}</p>
    <p>${selectedProduct.description}</p>
  `;

  const buyButton = document.createElement('input');
  buyButton.setAttribute('type', 'button');
  buyButton.setAttribute('value', 'Buy');

  buyButton.addEventListener('click', () => {
    showOrderForm(selectedProduct);
  });

  parent.appendChild(buyButton);
}

function showOrderForm(product) {
  const form = document.createElement('form');
  form.innerHTML = `
    <label for="name">Name:</label><br>
    <input type="text" id="name" name="name" required><br>
    <label for="city">City:</label><br>
    <select id="city" name="city" required>
      <option value="">Select a city</option>
      <option value="City 1">City 1</option>
      <option value="City 2">City 2</option>
      <option value="City 3">City 3</option>
    </select><br>
    <label for="address">Address:</label><br>
    <input type="text" id="address" name="address"><br>
    <label for="payment">Payment method:</label><br>
    <input type="radio" id="postpaid" name="payment" value="Postpaid" checked>
    <label for="postpaid">Postpaid</label><br>
    <input type="radio" id="bankCard" name="payment" value="Bank Card">
    <label for="bankCard">Bank Card</label><br>
    <label for="quantity">Quantity:</label><br>
    <input type="number" id="quantity" name="quantity" min="1" value="1" required><br>
    <label for="comment">Comment:</label><br>
    <textarea id="comment" name="comment"></textarea><br>
    <input type="submit" value="Confirm">
  `;

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (validateOrderForm(form)) {
      const formData = new FormData(form);
      const orderData = {
        product: product.name,
        price: product.price,
        name: formData.get('name'),
        city: formData.get('city'),
        address: formData.get('address'),
        payment: formData.get('payment'),
        quantity: formData.get('quantity'),
        comment: formData.get('comment')
      };
      displayOrderInformation(orderData);
    }
  });

  const parent = document.getElementById('info');
  parent.innerHTML = '';
  parent.appendChild(form);
}

function validateOrderForm(form) {
  const name = form.elements['name'].value;
  const city = form.elements['city'].value;
  if (!name || !city) {
    alert('Please fill in all mandatory fields.');
    return false;
  }
  return true;
}

function displayOrderInformation(orderData) {
  const info = document.getElementById('info');
  info.innerHTML = `
    <h3>Order Information:</h3>
    <p><strong>Product:</strong> ${orderData.product}</p>
    <p><strong>Price:</strong> $${orderData.price}</p>
    <p><strong>Name:</strong> ${orderData.name}</p>
    <p><strong>City:</strong> ${orderData.city}</p>
    <p><strong>Address:</strong> ${orderData.address}</p>
    <p><strong>Payment Method:</strong> ${orderData.payment}</p>
    <p><strong>Quantity:</strong> ${orderData.quantity}</p>
    <p><strong>Comment:</strong> ${orderData.comment}</p>
  `;
}

function reset() {
  const parent = document.getElementById('product');
  parent.innerHTML = '';
  document.querySelectorAll('.selected').forEach(element => {
    element.classList.remove('selected');
  });
}

function highlightSelectedCategory(categoryId) {
  document.querySelectorAll('.selected-category').forEach(element => {
    element.classList.remove('selected-category');
  });
  const selectedCategory = document.querySelector(`[data-category="${categoryId}"]`);
  selectedCategory.classList.add('selected-category');
}

function highlightSelectedProduct(productId) {
  document.querySelectorAll('.selected-product').forEach(element => {
    element.classList.remove('selected-product');
  });
  const selectedProduct = document.querySelector(`[data-product="${productId}"]`);
  selectedProduct.classList.add('selected-product');
}

function getOrdersFromStorage() {
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [];
}

function saveOrdersToStorage(orders) {
  localStorage.setItem('orders', JSON.stringify(orders));
}

function showOrders() {
  const orders = getOrdersFromStorage();
  const info = document.getElementById('info');
  info.innerHTML = '';

  orders.forEach(order => {
    const orderElement = document.createElement('div');
    orderElement.classList.add('order');
    orderElement.innerHTML = `
      <p>Date: ${order.date}</p>
      <p>Price: $${order.totalPrice}</p>
      <button class="expandBtn">Expand</button>
      <button class="removeBtn">Remove</button>
      <div class="expandedInfo"></div>
    `;

  
  orderElement.querySelector('.expandBtn').addEventListener('click', () => {
    const expandedInfo = orderElement.querySelector('.expandedInfo');
    if (expandedInfo.innerHTML === '') {
      expandedInfo.innerHTML = `
        <p><strong>Product:</strong> ${order.product}</p>
        <p><strong>Quantity:</strong> ${order.quantity}</p>
        <p><strong>Name:</strong> ${order.name}</p>
        <p><strong>City:</strong> ${order.city}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <p><strong>Payment Method:</strong> ${order.payment}</p>
        <p><strong>Comment:</strong> ${order.comment}</p>
      `;
    } else {
      expandedInfo.innerHTML = '';
    }
  });

  orderElement.querySelector('.removeBtn').addEventListener('click', () => {
    const index = orders.findIndex(o => o.date === order.date);
    if (index !== -1) {
      orders.splice(index, 1);
      saveOrdersToStorage(orders);
      showOrders();
    }
  });

  info.appendChild(orderElement);
});
}

document.getElementById('myOrdersBtn').addEventListener('click', () => {
  const categoriesDiv = document.getElementById('categories');
  categoriesDiv.innerHTML = '';

  showOrders();
});

function saveOrderToStorage(order) {
  const orders = getOrdersFromStorage();
  orders.push(order);
  saveOrdersToStorage(orders);
}

function showOrderForm(product) {
  const form = document.createElement('form');
  form.innerHTML = `
    <label for="name">Name:</label><br>
    <input type="text" id="name" name="name" required><br>
    <label for="city">City:</label><br>
    <select id="city" name="city" required>
      <option value="">Select a city</option>
      <option value="City 1">City 1</option>
      <option value="City 2">City 2</option>
      <option value="City 3">City 3</option>
    </select><br>
    <label for="address">Address:</label><br>
    <input type="text" id="address" name="address"><br>
    <label for="payment">Payment method:</label><br>
    <input type="radio" id="postpaid" name="payment" value="Postpaid" checked>
    <label for="postpaid">Postpaid</label><br>
    <input type="radio" id="bankCard" name="payment" value="Bank Card">
    <label for="bankCard">Bank Card</label><br>
    <label for="quantity">Quantity:</label><br>
    <input type="number" id="quantity" name="quantity" min="1" value="1" required><br>
    <label for="comment">Comment:</label><br>
    <textarea id="comment" name="comment"></textarea><br>
    <input type="submit" value="Confirm">
  `;

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (validateOrderForm(form)) {
      const formData = new FormData(form);
      const orderData = {
        product: product.name,
        totalPrice: product.price * formData.get('quantity'),
        date: new Date().toLocaleString(),
        name: formData.get('name'),
        city: formData.get('city'),
        address: formData.get('address'),
        payment: formData.get('payment'),
        quantity: formData.get('quantity'),
        comment: formData.get('comment')
      };
      saveOrderToStorage(orderData);
      displayOrderInformation(orderData);
    }
  });

  const parent = document.getElementById('info');
  parent.innerHTML = '';
  parent.appendChild(form);
}

function validateOrderForm(form) {
  const name = form.elements['name'].value;
  const city = form.elements['city'].value;
  if (!name || !city) {
    alert('Please fill in all mandatory fields.');
    return false;
  }
  return true;
}

function displayOrderInformation(orderData) {
  const info = document.getElementById('info');
  info.innerHTML = `
    <h3>Order Information:</h3>
    <p><strong>Product:</strong> ${orderData.product}</p>
    <p><strong>Total Price:</strong> $${orderData.totalPrice}</p>
    <p><strong>Name:</strong> ${orderData.name}</p>
    <p><strong>City:</strong> ${orderData.city}</p>
    <p><strong>Address:</strong> ${orderData.address}</p>
    <p><strong>Payment Method:</strong> ${orderData.payment}</p>
    <p><strong>Quantity:</strong> ${orderData.quantity}</p>
    <p><strong>Comment:</strong> ${orderData.comment}</p>
  `;
}