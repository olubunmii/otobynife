let cart = JSON.parse(localStorage.getItem('FARM_CART')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    setupEventListeners();
    
    // Refresh modal content whenever it's opened
    $('#cartModal').on('show.bs.modal', function () {
        renderCart();
    });
});

function setupEventListeners() {
    document.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const cardBody = e.target.closest('.card-body');
            const name = cardBody.querySelector('.card-title').innerText;
            const price = parseFloat(cardBody.querySelector('h6').innerText.replace('$', ''));
            const quantity = parseInt(cardBody.querySelector('.quantity-input').value);
            
            addToCart(name, price, quantity);
        });
    });
}

function addToCart(name, price, quantity) {
    // Check if item already exists to update quantity instead of duplicating
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        const item = { name, price, quantity, id: Date.now() };
        cart.push(item);
    }
    
    saveAndRefresh();
    alert(`${quantity} ${name}(s) added to cart!`);
}

function updateQuantity(index, newQty) {
    if (newQty < 1) return removeItem(index);
    cart[index].quantity = parseInt(newQty);
    saveAndRefresh();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveAndRefresh();
}

function saveAndRefresh() {
    localStorage.setItem('FARM_CART', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.innerText = totalItems);
}

function renderCart() {
    const list = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total');
    if (!list) return;

    list.innerHTML = '';
    let grandTotal = 0;

    if (cart.length === 0) {
        list.innerHTML = '<p class="text-center">Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            grandTotal += itemTotal;
            list.innerHTML += `
                <div class="row align-items-center border-bottom py-3">
                    <div class="col-4"><strong>${item.name}</strong><br><small>$${item.price.toFixed(2)} ea</small></div>
                    <div class="col-4">
                        <input type="number" class="form-control form-control-sm" 
                               value="${item.quantity}" min="1" 
                               onchange="updateQuantity(${index}, this.value)">
                    </div>
                    <div class="col-3 text-right">$${itemTotal.toFixed(2)}</div>
                    <div class="col-1 p-0">
                        <button class="btn btn-sm text-danger" onclick="removeItem(${index})"><i class="fas fa-trash"></i></button>
                    </div>
                </div>`;
        });
    }

    totalEl.innerText = `$${grandTotal.toFixed(2)}`;
}

function checkout() {
    if (cart.length === 0) return alert("Your cart is empty!");
    alert("Order Summary:\nTotal: " + document.getElementById('cart-total').innerText + "\nProceeding to payment...");
    cart = [];
    saveAndRefresh();
}



