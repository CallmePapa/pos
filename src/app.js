const CartItems = require('../src/models/cart-item');
const RecepitItems = require('../src/models/recepit-item');
const Receipt = require('./models/receipt');
const Items = require('./models/items');
const Promotions = require('./models/promotions');

function printReceipt(tags) {
    const cartItems = CartItems.buildCartItems(tags, Items.all());
    const receiptItems = RecepitItems.buildReceiptItems(cartItems, Promotions.all());
    const receipt = new Receipt(receiptItems);
    const receiptText = Receipt.buildReceiptText(receipt);

    console.log(receiptText);
}

exports.printReceipt = printReceipt;