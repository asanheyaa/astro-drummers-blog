import {CURRENCY_SYMBOLS} from "./consts";

const STORAGE_KEY='drummer-blog-cart';
const MAX_QUANTITY=99;

let products={};
let currency='';
let cartEl,listEl,totalEl,templateEl;

// quantity is always an integer from 1 to 99
function clamp(value) {
	const n=parseInt(value,10);
	if(!Number.isFinite(n)) return 1;
	return Math.min(MAX_QUANTITY,Math.max(1,n));
}

function loadItems() {
	try {
		const raw=JSON.parse(localStorage.getItem(STORAGE_KEY));
		if(!Array.isArray(raw)) return [];
		return raw
			.filter((i) => i&&typeof i.productId==='string')
			.map((i) => ({productId: i.productId,quantity: clamp(i.quantity)}));
	} catch {
		return [];
	}
}

function saveItems(items) {
	try {
		localStorage.setItem(STORAGE_KEY,JSON.stringify(items));
	} catch {
		// localStorage is unavailable (private mode, etc.)
	}
}

// calculate prices in cents to avoid floating-point errors
function toCents(price) {
	return Math.round(parseFloat(price)*100)||0;
}

function formatMoney(cents) {
	const symbol=CURRENCY_SYMBOLS[currency]??currency;
	return `${(cents/100).toFixed(2)} ${symbol}`.trim();
}

function buildRow(item) {
	const product=products[item.productId];
	const row=templateEl.content.firstElementChild.cloneNode(true);

	row.dataset.productId=item.productId;

	const img=row.querySelector('[data-cart-image]'),
		imgWrapper=img.parentElement;
	img.src=product.image;
	img.alt=product.title;
	imgWrapper.href = product.url;

	const link=row.querySelector('[data-cart-link]');
	link.href=product.url;
	link.textContent=product.title;

	row.querySelector('[data-cart-price]').textContent=formatMoney(toCents(product.price));
	row.querySelector('[data-quantity-input]').value=item.quantity;

	return row;
}

function updateSummary(items) {
	const count=items.reduce((sum,i) => sum+i.quantity,0);
	const total=items.reduce(
		(sum,i) => sum+toCents(products[i.productId].price)*i.quantity,
		0
	);

	document.querySelectorAll('[data-cart-counter]').forEach((el) => {
		el.textContent=count;
	});
	cartEl.classList.toggle('--empty',items.length===0);
	totalEl.textContent=formatMoney(total);
}

// Sync the list with the data without touching rows already in the DOM
function syncList(items) {
	const existing=new Map(
		[...listEl.querySelectorAll('[data-cart-item]')].map((row) => [row.dataset.productId,row])
	);
	const wanted=new Set(items.map((i) => i.productId));

	// remove extra rows
	existing.forEach((row,id) => {
		if(!wanted.has(id)) row.remove();
	});

	// add missing rows and update quantities in existing ones, preserving order
	items.forEach((item,index) => {
		let row=existing.get(item.productId);
		if(!row) {
			row=buildRow(item);
		} else {
			const input=row.querySelector('[data-quantity-input]');
			if(input&&document.activeElement!==input) input.value=item.quantity;
		}
		// insert at the required position only if it differs
		if(listEl.children[index]!==row) {
			listEl.insertBefore(row,listEl.children[index]??null);
		}
	});
}

function render() {
	const items=loadItems().filter((i) => products[i.productId]);
	syncList(items);
	updateSummary(items);
}

function update(change) {
	saveItems(change(loadItems()));
	render();
}

function getQuantity(productId) {
	return loadItems().find((i) => i.productId===productId)?.quantity??1;
}

export function addToCart(productId,quantity=1) {
	if(!products[productId]) return;
	update((items) => {
		const found=items.find((i) => i.productId===productId);
		if(found) {
			found.quantity=clamp(found.quantity+quantity);
		} else {
			items.push({productId,quantity: clamp(quantity)});
		}
		return items;
	});
}

function setQuantity(productId,quantity) {
	update((items) =>
		items.map((i) => (i.productId===productId? {...i,quantity: clamp(quantity)}:i))
	);
}

function removeFromCart(productId) {
	const row=listEl.querySelector(`[data-product-id="${CSS.escape(productId)}"]`);
	const next=row?.nextElementSibling??row?.previousElementSibling;

	update((items) => items.filter((i) => i.productId!==productId));

	// move focus to the delete button of the adjacent row or to the cart close button
	const target=
		next?.querySelector('[data-cart-delete]')??
		cartEl.querySelector('[data-menu-collapse]');
	target?.focus();
}

export function initCart() {
	const dataEl=document.getElementById('cart-data');
	cartEl=document.querySelector('[data-menu-wrapper="cart"]');
	if(!dataEl||!cartEl) return;

	listEl=cartEl.querySelector('[data-cart-list]');
	totalEl=cartEl.querySelector('[data-cart-total]');
	templateEl=cartEl.querySelector('[data-cart-item-template]');
	if(!listEl||!totalEl||!templateEl) return;

	try {
		const data=JSON.parse(dataEl.textContent);
		products=data.products??{};
		currency=data.currency??'';
	} catch {
		return;
	}

	render();

	document.addEventListener('click',(e) => {
		// "add to cart" button (product card, product page)
		const addButton=e.target.closest('[data-add-to-cart]');
		if(addButton) {
			addToCart(addButton.dataset.addToCart);
			return;
		}

		// actions inside the cart
		const row=e.target.closest('[data-cart-item]');
		if(!row||!cartEl.contains(row)) return;

		const id=row.dataset.productId;
		const isMore=e.target.closest('[data-quantity-more]');
		const isLess=e.target.closest('[data-quantity-less]');
		const isDelete=e.target.closest('[data-cart-delete]');
		if(!isMore&&!isLess&&!isDelete) return;

		// The row is re-rendered and the clicked button disappears from the DOM. Then the menu
		// handler on window won't find [data-menu-body] and would close the cart, so we stop the event.
		e.stopPropagation();

		if(isDelete) removeFromCart(id);
		else if(isMore) setQuantity(id,getQuantity(id)+1);
		else setQuantity(id,getQuantity(id)-1); // clamp does not go below 1
	});

	// manual quantity input
	document.addEventListener('change',(e) => {
		const input=e.target.closest('[data-quantity-input]');
		const row=input?.closest('[data-cart-item]');
		if(!row||!cartEl.contains(row)) return;

		const value=parseInt(input.value,10);
		if(!Number.isFinite(value)||value<1) {
			input.value=getQuantity(row.dataset.productId);
			return;
		}
		setQuantity(row.dataset.productId,value);
	});
}