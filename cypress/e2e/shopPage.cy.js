import ShopPage from '../pageObjects/ShopPage';

describe('Shop Page Tests', () => {
    const shopPage = new ShopPage();

    beforeEach(() => {
        cy.visitShopPage();
    });

    describe('Add Product Tests', () => {
        it('PS_083: Kiểm tra thêm sản phẩm không có lựa chọn vào giỏ hàng', () => {
            shopPage.addProductToCart();
        });

        it('PS_084: Kiểm tra thêm sản phẩm có lựa chọn vào giỏ hàng', () => {
            shopPage.addSelectedProductToCart();
        });

        it('PS_085: Kiểm tra thêm sản phẩm không có lựa chọn đã hết hàng', () => {
            shopPage.addProductSoldOut();
        });

        it('PS_086: Kiểm tra thêm sản phẩm có lựa chọn đã hết hàng', () => {
            shopPage.addSelectedProductSoldOut();
        });
    });

    describe('Navigation Tests', () => {
        it('PS_087: Kiểm tra click vào xem sản phẩm bất kỳ', () => {
            shopPage.viewProduct();
        });

        it('PS_088: Điều hướng khi click "Cây trồng trong chậu"', () => {
            shopPage.navigateToPottedPlants();
        });

        it('PS_089: Điều hướng khi click "Cây trồng trong không khí"', () => {
            shopPage.navigateToAirPlants();
        });

        it('PS_090: Điều hướng khi click "Chậu trồng cây"', () => {
            shopPage.navigateToPotsAndPlanters();
        });

        it('PS_091: Điều hướng khi click "Dụng cụ chăm sóc"', () => {
            shopPage.navigateToCareTools();
        });

        
    });
    
    describe('Filter Tests', () => {
        it('PS_092: Kiểm tra sắp xếp theo độ phổ biến', () => {
            shopPage.sortByPopularity();
        });

        it('PS_093: Kiểm tra sắp xếp theo xếp hàng trung bình', () => {
            shopPage.sortByRating();
        });

        it('PS_094: Kiểm tra sắp xếp theo mới nhất', () => {
            shopPage.sortByNewest();
        });

        it.only('PS_095: Kiểm tra sắp xếp theo giá: thấp đến cao', () => {
            shopPage.sortByPriceLowToHigh();
        });

        it('PS_096: Kiểm tra sắp xếp theo giá: cao đến thấp', () => {
            shopPage.sortByPriceHighToLow();
        });
    });
});