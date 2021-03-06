/*之前时小步提交的，现在就不一定了，hhhhh*/

let fixtures = require('./fixtures');
let main = require("../main/main.js");

describe('pos', function () {
    describe('Integration testing', function () {
        let inputs;

        it('should print text when have both promotions', function () {
            inputs = [
                'ITEM000001',
                'ITEM000001',
                'ITEM000001',
                'ITEM000001',
                'ITEM000001',
                'ITEM000003-2',
                'ITEM000005',
                'ITEM000005',
                'ITEM000005'
            ];

            spyOn(console, 'log');

            main.printReceipt(inputs);

            const expectText = '***<没钱赚商店>收据***' + '\n' +
                '名称：羽毛球，数量：5个，单价：1.00(元)，小计：4.00(元)' + '\n' +
                '名称：苹果，数量：2斤，单价：5.50(元)，小计：10.45(元)，节省：0.55(元)' + '\n' +
                '名称：可口可乐，数量：3瓶，单价：3.00(元)，小计：6.00(元)' + '\n' +
                '----------------------' + '\n' +
                '买二赠一商品' + '\n' +
                '名称：羽毛球，数量：1个' + '\n' +
                '名称：可口可乐，数量：1瓶' + '\n' +
                '----------------------' + '\n' +
                '总计：20.45(元)' + '\n' +
                '节省：4.55(元)' + '\n' +
                '**********************';

            expect(console.log).toHaveBeenCalledWith(expectText);
        });

        it('should print receipt when have A_95_PRESENT_CHARGE', function () {
            inputs = [
                'ITEM000000',
                'ITEM000000',
                'ITEM000000',
                'ITEM000002',
                'ITEM000002'
            ];
            spyOn(console, 'log');

            main.printReceipt(inputs);

            const expectText = '***<没钱赚商店>收据***' + '\n' +
                '名称：雪碧，数量：3瓶，单价：3.00(元)，小计：9.00(元)' + '\n' +
                '名称：荔枝，数量：2斤，单价：15.00(元)，小计：28.50(元)，节省：1.50(元)' + '\n' +
                '----------------------' + '\n' +
                '总计：37.50(元)' + '\n' +
                '节省：1.50(元)' + '\n' +
                '**********************';

            expect(console.log).toHaveBeenCalledWith(expectText);
        });

        it('should print receipt when have BUY_TWO_GET_ONE_FREE', function () {
            inputs = [
                'ITEM000000-3',
                'ITEM000001-6'
            ];
            spyOn(console, 'log');

            main.printReceipt(inputs);

            const expectText = '***<没钱赚商店>收据***' + '\n' +
                '名称：雪碧，数量：3瓶，单价：3.00(元)，小计：9.00(元)' + '\n' +
                '名称：羽毛球，数量：6个，单价：1.00(元)，小计：4.00(元)' + '\n' +
                '----------------------' + '\n' +
                '买二赠一商品' + '\n' +
                '名称：羽毛球，数量：2个' + '\n' +
                '----------------------' + '\n' +
                '总计：13.00(元)' + '\n' +
                '节省：2.00(元)' + '\n' +
                '**********************';

            expect(console.log).toHaveBeenCalledWith(expectText);
        })
    });

    describe('unit testing', function () {
        let inputs;
        let allItems;
        let promotions;
        let cartItems;
        let receiptItems;
        let receipt;

        beforeEach(function () {
            inputs = [
                'ITEM000001',
                'ITEM000001',
                'ITEM000001',
                'ITEM000001',
                'ITEM000001',
                'ITEM000003-2',
                'ITEM000005',
                'ITEM000005',
                'ITEM000005'
            ];
            allItems = fixtures.loadAllItems();
            promotions = fixtures.loadPromotions();
            cartItems = [
                {
                    item: {
                        barcode: "ITEM000001",
                        name: "羽毛球",
                        unit: "个",
                        price: 1.00
                    },
                    count: 5
                },
                {
                    item: {
                        barcode: "ITEM000003",
                        name: "苹果",
                        unit: "斤",
                        price: 5.50
                    },
                    count: 2
                },
                {
                    item: {
                        barcode: "ITEM000005",
                        name: "可口可乐",
                        unit: "瓶",
                        price: 3.00
                    },
                    count: 3
                }
            ];
            receiptItems = [
                {
                    cartItem: {
                        item: {
                            barcode: "ITEM000001",
                            name: "羽毛球",
                            unit: "个",
                            price: 1.00
                        },
                        count: 5
                    },
                    subtotal: 4.00,
                    saved: 1.00,
                    type: 'BUY_TWO_GET_ONE_FREE',
                    promotionCount: 1
                },
                {
                    cartItem: {
                        item: {
                            barcode: "ITEM000003",
                            name: "苹果",
                            unit: "斤",
                            price: 5.50
                        },
                        count: 2
                    },
                    subtotal: 10.45,
                    saved: 0.55,
                    type: 'A_95_PRESENT_CHARGE',
                    promotionCount: 0
                },
                {
                    cartItem: {
                        item: {
                            barcode: "ITEM000005",
                            name: "可口可乐",
                            unit: "瓶",
                            price: 3.00
                        },
                        count: 3
                    },
                    subtotal: 6.00,
                    saved: 3.00,
                    type: 'BUY_TWO_GET_ONE_FREE',
                    promotionCount: 1
                }
            ];
            receipt = {
                receiptItems: receiptItems,
                total: 20.45,
                totalSaved: 4.55
            }
        });

        it('should print cartItems', function () {
            let cartItems = main.buildCartItems(inputs, allItems);
            const expectCartItems = [
                {
                    item: {
                        barcode: "ITEM000001",
                        name: "羽毛球",
                        unit: "个",
                        price: 1.00
                    },
                    count: 5
                },
                {
                    item: {
                        barcode: "ITEM000003",
                        name: "苹果",
                        unit: "斤",
                        price: 5.50
                    },
                    count: 2
                },
                {
                    item: {
                        barcode: "ITEM000005",
                        name: "可口可乐",
                        unit: "瓶",
                        price: 3.00
                    },
                    count: 3
                }
            ];
            expect(cartItems).toEqual(expectCartItems);
        });

        it('when after dash number is digit', function () {
            let barcode = ['ITEM000003-1.5'];
            let cartItems = main.buildCartItems(barcode, allItems);
            const expectCartItems = [{
                item: {
                    barcode: "ITEM000003",
                    name: "苹果",
                    unit: "斤",
                    price: 5.50
                },
                count: 1.5
            }];

            expect(cartItems).toEqual(expectCartItems);
        });

        it('should print receiptItems', function () {
            let receiptItems = main.buildReceiptItems(cartItems, promotions);
            const expectReceiptItems = [
                {
                    cartItem: {
                        item: {
                            barcode: "ITEM000001",
                            name: "羽毛球",
                            unit: "个",
                            price: 1.00
                        },
                        count: 5
                    },
                    subtotal: 4.00,
                    saved: 1.00,
                    type: 'BUY_TWO_GET_ONE_FREE',
                    promotionCount: 1
                },
                {
                    cartItem: {
                        item: {
                            barcode: "ITEM000003",
                            name: "苹果",
                            unit: "斤",
                            price: 5.50
                        },
                        count: 2
                    },
                    subtotal: 10.45,
                    saved: 0.55,
                    type: 'A_95_PRESENT_CHARGE',
                    promotionCount: 0
                },
                {
                    cartItem: {
                        item: {
                            barcode: "ITEM000005",
                            name: "可口可乐",
                            unit: "瓶",
                            price: 3.00
                        },
                        count: 3
                    },
                    subtotal: 6.00,
                    saved: 3.00,
                    type: 'BUY_TWO_GET_ONE_FREE',
                    promotionCount: 1
                }
            ];
            expect(receiptItems).toEqual(expectReceiptItems);
        });

        it('should print receiptItems when no promotion', function () {
            let cartItems = [
                {
                    item: {
                        barcode: 'ITEM000004',
                        name: '电池',
                        unit: '个',
                        price: 2.00
                    },
                    count: 4
                }
            ];
            let receiptItems = main.buildReceiptItems(cartItems, promotions);
            let expectReceiptItems = [
                {
                    cartItem: {
                        item: {
                            barcode: 'ITEM000004',
                            name: '电池',
                            unit: '个',
                            price: 2.00
                        },
                        count: 4
                    },
                    subtotal: 8.00,
                    saved: 0.00
                }
            ];
            expect(receiptItems).toEqual(expectReceiptItems);
        });

        it('should print receipt', function () {
            let receipt = main.buildReceipt(receiptItems);
            const expectReceipt = {
                receiptItems: [
                    {
                        cartItem: {
                            item: {
                                barcode: "ITEM000001",
                                name: "羽毛球",
                                unit: "个",
                                price: 1.00
                            },
                            count: 5
                        },
                        subtotal: 4.00,
                        saved: 1.00,
                        type: 'BUY_TWO_GET_ONE_FREE',
                        promotionCount: 1
                    },
                    {
                        cartItem: {
                            item: {
                                barcode: "ITEM000003",
                                name: "苹果",
                                unit: "斤",
                                price: 5.50
                            },
                            count: 2
                        },
                        subtotal: 10.45,
                        saved: 0.55,
                        type: 'A_95_PRESENT_CHARGE',
                        promotionCount: 0
                    },
                    {
                        cartItem: {
                            item: {
                                barcode: "ITEM000005",
                                name: "可口可乐",
                                unit: "瓶",
                                price: 3.00
                            },
                            count: 3
                        },
                        subtotal: 6.00,
                        saved: 3.00,
                        type: 'BUY_TWO_GET_ONE_FREE',
                        promotionCount: 1
                    }
                ],
                total: 20.45,
                totalSaved: 4.55
            };

            expect(receipt).toEqual(expectReceipt);
        });
    });
});