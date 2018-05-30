class Items {
    constructor(barcode, name, unit, price = 0) {
        this.barcode = barcode;
        this.name = name;
        this.unit = unit;
        this.price = price;
    }

    static all() {
        return [
            new Items('ITEM000000', '可口可乐', '瓶', 3.00),
            new Items('ITEM000001', '雪碧', '瓶', 3.00),
            new Items('ITEM000002', '苹果', '斤', 5.50),
            new Items('ITEM000003', '荔枝', '斤', 15.00),
            new Items('ITEM000004', '电池', '个', 2.00),
            new Items('ITEM000005', '方便面', '袋', 4.50)
        ]
    }
}

module.exports = Items;