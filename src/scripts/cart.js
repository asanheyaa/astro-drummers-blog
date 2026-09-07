const cookies = {
  get(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  },
  set(name, value, days = 7) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Strict`;
  }
};

function getProducts() {
  const savedCart = cookies.get('dremmersblog_shopping_cart');
  let cart = savedCart ? JSON.parse(decodeURIComponent(savedCart)) : {};
  return cart;
}

function setProducts(cart) {
  cookies.set('dremmersblog_shopping_cart', encodeURIComponent(JSON.stringify(cart)))
}

function updateCartCounter() {
  const cartCounters = document.querySelectorAll('[data-cart-counter]');
  if (!cartCounters.length) return; 
  
  const sum = Object.values(getProducts()).reduce((acc, curr) => acc + curr.quantity, 0)
  cartCounters.forEach(cartCounter => {
    cartCounter.textContent = `${sum}`;
    if (sum <= 0){
      cartCounter.classList.add('--empty')
    } else {
      cartCounter.classList.remove('--empty')
    }
  });

  emptyCheck(sum)
}

function emptyCheck(productQuantity) {
  const cart = document.querySelector('[data-cart]');
  if (!cart) return

  const products = document.querySelector('.products');

  if (productQuantity <= 0){
    cart.dataset.cart = "empty"
    if (products) products.classList.add('--empty')
    cart.classList.add('--empty')
  } else {
    cart.dataset.cart = ""
    if (products) products.classList.remove('--empty')
    cart.classList.remove('--empty')
  }
}

function updateTotalAmount() {
  const products = getProducts();
  const totalAmountWrappers = document.querySelectorAll('[data-cart-total-count]');
  if (!totalAmountWrappers.length) return;
  
  let totalAmount = 0
  Object.values(products).forEach(product => {
    const productPrice = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0
    const productQuantity = product.quantity || 0
    totalAmount += productPrice * productQuantity
  });
  
  totalAmountWrappers.forEach(wrapper => {
    wrapper.textContent = totalAmount.toFixed(2)
  });
}

function updateQuantity(cart, productId, newValue) {
  if(cart[productId]){
    cart[productId].quantity = +newValue
    setProducts(cart)
  }
  updateCartCounter()
  updateTotalAmount()
  updateCartItemUI(productId, newValue)
}

function updateCartItemUI(productId, newQuantity) {
  const productElement = document.querySelector(`[data-cart-product="${productId}"]`);
  if (!productElement) return;
  
  const isCard = productElement.closest('[data-cart]')
  if(isCard){
  const quantityInput = productElement.querySelector('[data-quantity-input]');
  if (quantityInput) {
    quantityInput.value = newQuantity;
  }
  
  const priceElement = productElement.querySelector('[data-cart-price]');
  const subtotalElement = productElement.querySelector('[data-cart-subtotal]');
  
  if (priceElement && subtotalElement) {
    const price = parseFloat(priceElement.textContent) || 0;
    const subtotal = price * newQuantity;
    subtotalElement.textContent = subtotal.toFixed(2);
  }
}
}

function renderCartItems() {
  const cartWrapper = document.querySelector('[data-cart-wrapper]');
  if (!cartWrapper) return;
  
  const products = getProducts();
  const productEntries = Object.entries(products);
  
  cartWrapper.innerHTML = '';
  
  if (productEntries.length === 0) {
    return;
  }
  
  productEntries.forEach(([id, item]) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    const subtotalPrice = price * item.quantity;
    
    cartWrapper.insertAdjacentHTML('beforeend', `
      <div class="content-cart__item" data-cart-product="${id}">
        <div class="content-cart__details">
          <button
            type="button"
            class="content-cart__remove-button"
            aria-label='Remove the product from cart'
            data-cart-remove-product
          >
            <i class="product-remove"></i>
          </button>
          <a href="${item.href || '#'}" class="content-cart__photo">
            <img src='${item.cover || ''}' alt="${item.title || ''}" />
          </a>
          <a href="${item.href || '#'}" class="content-cart__name"
            >${item.title || ''}
          </a>
        </div>
        <div class="content-cart__price">
          € <span data-cart-price>${price.toFixed(2)}</span>
        </div>
        <div class="content-cart__quantity">
          <div class="quantity" data-quantity>
            <button
              type="button"
              class="quantity__button quantity__button-less"
              data-quantity-less
            >
              <i class="dfd-socicon-minus-symbol"></i>
            </button>
            <input
              type="number"
              class="quantity__input"
              value="${item.quantity}"
              min="1"
              max="99"
              autocomplete="off"
              inputmode="numeric"
              data-quantity-input
              name="quantity"
            />
            <button
              type="button"
              class="quantity__button quantity__button-more"
              data-quantity-more
            >
              <i class="dfd-socicon-plus-black-symbol"></i>
            </button>
          </div>
        </div>
        <div class="content-cart__subtotal">€ <span data-cart-subtotal>${subtotalPrice.toFixed(2)}</span></div>
      </div>
    `);
  });
}

function handleAddToCart(e) {
  const target = e.currentTarget;
  
  const productId = target.dataset.productId;
  const productTitle = target.dataset.productTitle;
  const productPrice = target.dataset.productPrice;
  const productCover = target.dataset.productCover;
  const productHref = target.dataset.productHref;
  
  if (!productId) return;

  let cart = getProducts();

  const productWrapper = target.closest('[data-cart-product]');
  if (productWrapper) {
    const productQuantityInput = productWrapper.querySelector('[data-quantity-input]');
    const quantityToAdd = productQuantityInput ? Number(productQuantityInput.value) : 1;
    if (cart[productId]) {
      cart[productId].quantity += quantityToAdd;
    } else {
      cart[productId] = {
        quantity: quantityToAdd,
        title: productTitle || '',
        price: productPrice || '',
        cover: productCover || '',
        id: productId || '',
        href: productHref || ''
      };
    }
  } 

  setProducts(cart);
  updateCartCounter();
  updateTotalAmount();
  
  const existingProduct = document.querySelector(`[data-cart-product="${productId}"]`);
  if (existingProduct) {
    updateCartItemUI(productId, cart[productId].quantity);
  } else {
    addProductToCartUI(productId, cart[productId]);
  }
  
  target.classList.add('--added');
  target.disabled = true;
  
  setTimeout(() => {
    target.classList.remove('--added');
    target.disabled = false;
  }, 1500);
}

function addProductToCartUI(productId, productData) {
  const cartWrapper = document.querySelector('[data-cart-wrapper]');
  if (!cartWrapper) return;
  
  const price = parseFloat(productData.price.replace(/[^0-9.]/g, '')) || 0;
  const subtotalPrice = price * productData.quantity;
  
  cartWrapper.insertAdjacentHTML('beforeend', `
    <div class="content-cart__item" data-cart-product="${productId}">
      <div class="content-cart__details">
        <button
          type="button"
          class="content-cart__remove-button"
          aria-label='Remove the product from cart'
          data-cart-remove-product
        >
          <i class="product-remove"></i>
        </button>
        <a href="${productData.href || '#'}" class="content-cart__photo">
          <img src='${productData.cover || ''}' alt="${productData.title || ''}" />
        </a>
        <a href="${productData.href || '#'}" class="content-cart__name"
          >${productData.title || ''}
        </a>
      </div>
      <div class="content-cart__price">
        € <span data-cart-price>${price.toFixed(2)}</span>
      </div>
      <div class="content-cart__quantity">
        <div class="quantity" data-quantity>
          <button
            type="button"
            class="quantity__button quantity__button-less"
            data-quantity-less
          >
            <i class="dfd-socicon-minus-symbol"></i>
          </button>
          <input
            type="number"
            class="quantity__input"
            value="${productData.quantity}"
            min="1"
            max="99"
            autocomplete="off"
            inputmode="numeric"
            data-quantity-input
            name="quantity"
          />
          <button
            type="button"
            class="quantity__button quantity__button-more"
            data-quantity-more
          >
            <i class="dfd-socicon-plus-black-symbol"></i>
          </button>
        </div>
      </div>
      <div class="content-cart__subtotal">€ <span data-cart-subtotal>${subtotalPrice.toFixed(2)}</span></div>
    </div>
  `);
}

function initCartDelegation() {
  document.addEventListener('click', function(e) {
    const button = e.target.closest('[data-add-to-cart]');
    if (button) {
      e.preventDefault();
      handleAddToCart({ currentTarget: button });
    }
    
    const removeButton = e.target.closest('[data-cart-remove-product]');
    if (removeButton) {
      e.preventDefault();
      handleRemoveProduct(removeButton);
    }
    
    const lessButton = e.target.closest('[data-quantity-less]');
    if (lessButton) {
      e.preventDefault();
      handleQuantityChange(lessButton, -1);
    }
    
    const moreButton = e.target.closest('[data-quantity-more]');
    if (moreButton) {
      e.preventDefault();
      handleQuantityChange(moreButton, 1);
    }
  });

  document.addEventListener('change', function(e) {
    const input = e.target.closest('[data-quantity-input]');
    if (input) {
      handleQuantityInputChange(input);
    }
  });

  document.addEventListener('input', function(e) {
    const input = e.target.closest('[data-quantity-input]');
    if (input) {
      handleQuantityInputChange(input);
    }
  });
}

function handleQuantityInputChange(input) {
  const quantityBlock = input.closest('[data-quantity]');
  if (!quantityBlock) return;
  
  const product = quantityBlock.closest('[data-cart-product]');
  if (!product) return;
  
  const min = parseInt(input.getAttribute('min')) || 1;
  const max = parseInt(input.getAttribute('max')) || 99;
  let value = parseInt(input.value);
  
  if (isNaN(value) || value < min) {
    input.value = min;
    value = min;
  } else if (value > max) {
    input.value = max;
    value = max;
  }
  
  const cart = getProducts();
  const productId = product.dataset.cartProduct;
  
  if (cart[productId]) {
    cart[productId].quantity = value;
    setProducts(cart);
    updateCartCounter();
    updateTotalAmount();
    
    const priceElement = product.querySelector('[data-cart-price]');
    const subtotalElement = product.querySelector('[data-cart-subtotal]');
    
    if (priceElement && subtotalElement) {
      const price = parseFloat(priceElement.textContent) || 0;
      const subtotal = price * value;
      subtotalElement.textContent = subtotal.toFixed(2);
    }
  }
}

function handleRemoveProduct(button) {
  const product = button.closest('[data-cart-product]');
  if (!product) return;
  
  const productId = product.dataset.cartProduct;
  let cart = getProducts();
  
  if (cart[productId]) {
    delete cart[productId];
    setProducts(cart);
    product.remove();
    updateCartCounter();
    updateTotalAmount();
    
    const cartWrapper = document.querySelector('[data-cart-wrapper]');
    if (cartWrapper && cartWrapper.children.length === 0) {
      emptyCheck(0);
    }
  }
}

function handleQuantityChange(button, delta) {
  const quantityBlock = button.closest('[data-quantity]');
  if (!quantityBlock) return;
  
  const input = quantityBlock.querySelector('[data-quantity-input]');
  const product = quantityBlock.closest('[data-cart-product]');
  if (!input || !product) return;
  
  const min = parseInt(input.getAttribute('min')) || 1;
  const max = parseInt(input.getAttribute('max')) || 99;
  let currentValue = parseInt(input.value) || min;
  let newValue = currentValue + delta;
  
  if (newValue < min) newValue = min;
  if (newValue > max) newValue = max;
  
  const isCard = product.closest('[data-cart]');
  const cart = getProducts();
  const productId = product.dataset.cartProduct;
  if (isCard) {
    
    if (cart[productId]) {
      cart[productId].quantity = newValue;
      setProducts(cart);
      updateCartCounter();
      updateTotalAmount();
      
      input.value = newValue;
      
      const priceElement = product.querySelector('[data-cart-price]');
      const subtotalElement = product.querySelector('[data-cart-subtotal]');
      
      if (priceElement && subtotalElement) {
        const price = parseFloat(priceElement.textContent) || 0;
        const subtotal = price * newValue;
        subtotalElement.textContent = subtotal.toFixed(2);
      }
    }
  } else {
    input.value = newValue;
     if (cart[productId]){
       cart[productId].quantity+= newValue
     }
  }
}

function initAllCartLogic() {
  renderCartItems(); 
  initCartDelegation();
  updateCartCounter();
  updateTotalAmount();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllCartLogic);
} else {
  initAllCartLogic();
}