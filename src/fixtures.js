const Items = require('../src/models/items');
const Promotions = require('../src/models/promotions');

function loadAllItems() {
    return [
        new Items('ITEM000000', '可口可乐', '瓶', 3.00),
        new Items('ITEM000001', '雪碧', '瓶', 3.00),
        new Items('ITEM000002', '苹果', '斤', 5.50),
        new Items('ITEM000003', '荔枝', '斤', 15.00),
        new Items('ITEM000004', '电池', '个', 2.00),
        new Items('ITEM000005', '方便面', '袋', 4.50)
    ];
}

function loadPromotions() {
    return [
        new Promotions('BUY_TWO_GET_ONE_FREE', ['ITEM000000', 'ITEM000001', 'ITEM000005'])
    ]
}

exports.loadAllItems = loadAllItems;
exports.loadPromotions = loadPromotions;