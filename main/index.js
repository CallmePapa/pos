let fixtures = require('./fixtures');

/*打印小票*/
function printReceipt(tags) {
    let allItems = fixtures.loadAllItems();
    let cartItems = buildCartItems(tags, allItems);

    let promotions = fixtures.loadPromotions();
    let receiptItems = buildReceiptItems(cartItems, promotions);

    let receipt = buildReceipt(receiptItems);
    let receiptText = buildReceiptText(receipt);

    console.log(receiptText);

}

/*生成cartItem数组，数组中每个元素包含商品详细信息*/
function buildCartItems(tags, allItems) {

    let cartItems = [];

    for (let i = 0; i < tags.length; i++) {
        let splittedTag = tags[i].split('-');
        let barcode = splittedTag[0];
        let count = parseFloat(splittedTag[1] || 1);

        let cartItem = findCartItem(cartItems, barcode);

        if (cartItem) {
            cartItem.count++;
        } else {
            let item = findItem(allItems, barcode);
            cartItems.push({item: item, count: count});
        }
    }

    return cartItems;
}

/*根据输入的barcode查找相应的cartItem*/
function findCartItem(cartItems, barcode) {
    for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].item.barcode === barcode) {
            return cartItems[i];
        }
    }
}

/*根据输入的barcode,查找对应的item对象*/
function findItem(allItems, barcode) {
    for (let i = 0; i < allItems.length; i++) {
        if (allItems[i].barcode === barcode) {
            return allItems[i];
        }
    }
    return;
}

/*生成所要购买商品清单,计算相应的subtotal,saved,生成receiptItems对象数组*/
function buildReceiptItems(cartItems, promotions) {
    let receiptItems = [];

    for (let i = 0; i < cartItems.length; i++) {
        let promotionType = getPromotionType(cartItems[i].item.barcode, promotions)
        receiptItems.push(discount(cartItems[i], promotionType))
    }
    return receiptItems;
}

/*根据promotion,barcode,得到promotionType*/
function getPromotionType(barcode, promotions) {
    for (let i = 0; i < promotions.length; i++) {
        for (let j = 0; j < promotions[i].barcodes.length; j++) {
            if (promotions[i].barcodes[j] === barcode) {
                return promotions[i].type;
            }
        }
    }
}

/*根据promotionType,计算subtotal,saved*/
function discount(cartItem, promotionType) {
    let saved = 0;
    if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
        saved = cartItem.item.price * parseInt(cartItem.count / 3);
    } else if (promotionType === 'A_95_PRESENT_CHARGE') {
        saved = cartItem.item.price * cartItem.count * 0.05;
    }

    let subtotal = cartItem.item.price * parseInt(cartItem.count) - saved;

    if (promotionType) {
        return {
            cartItem: cartItem, subtotal: subtotal, saved: saved,
            type: promotionType, promotionCount: parseInt(cartItem.count / 3)
        };
    } else {
        return {cartItem: cartItem, subtotal: subtotal, saved: saved}
    }
}


/*生成receipt对象*/
function buildReceipt(receiptItems) {
    let total = 0;
    let totalSaved = 0;
    receiptItems.forEach(function (receiptItem) {
        total += receiptItem.subtotal;
        totalSaved += receiptItem.saved;
    });

    return {receiptItems: receiptItems, total: total, totalSaved: totalSaved}
}

/*得到相应的促销商品的属性和值*/
function promotionText(receipt) {
    let promotionType = '';
    let promotionContent = '';

    for (let i = 0; i < receipt.receiptItems.length; i++) {
        if (receipt.receiptItems[i].type === 'BUY_TWO_GET_ONE_FREE') {
            promotionType = '\n' + '----------------------' + '\n' + '买二赠一商品';
            promotionContent += '\n' + '名称：' + receipt.receiptItems[i].cartItem.item.name + '，数量：' +
                receipt.receiptItems[i].promotionCount + receipt.receiptItems[i].cartItem.item.unit
        }
    }

    return promotionType + promotionContent;
}

/*价格保留小数点2位*/
function formatMoney(money) {
    return money.toFixed(2);
}

/*生成打印receiptText*/
function buildReceiptText(receipt) {
    let receiptText = '***<没钱赚商店>收据***';

    receipt.receiptItems.forEach(function (receiptItem) {
        receiptText += '\n' + '名称：' + receiptItem.cartItem.item.name + '，数量：' + receiptItem.cartItem.count +
            receiptItem.cartItem.item.unit + '，单价：' + formatMoney(receiptItem.cartItem.item.price) + '(元)' + '，小计：' +
            formatMoney(receiptItem.subtotal) + '(元)';
        if (receiptItem.type === 'A_95_PRESENT_CHARGE') {
            receiptText += '，节省：' + formatMoney(receiptItem.saved) + '(元)';
        }
    });

    receiptText += promotionText(receipt) + '\n' + '----------------------' + '\n' +
        '总计：' + formatMoney(receipt.total) + '(元)' + '\n' + '节省：' +
        formatMoney(receipt.totalSaved) + '(元)' + '\n' + '**********************';

    return receiptText;
}

module.exports = {
    buildCartItems: buildCartItems,
    buildReceiptItems: buildReceiptItems,
    buildReceipt: buildReceipt,
    printReceipt: printReceipt
};