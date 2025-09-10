import ShopPage from '../pageObjects/ShopPage';

describe('Shop Page Tests', () => {
    const shopPage = new ShopPage();

    beforeEach(() => {
        cy.visitShopPage();
    });

    describe('Add Product tests', () => {
        it('PS_083: Kiểm tra thêm sản phẩm không có lựa chọn vào giỏ hàng', () => {
            shopPage.addProductToCart();
        });

        it.only('PS_084: Kiểm tra thêm sản phẩm có lựa chọn vào giỏ hàng', () => {
            shopPage.addSelectedProductToCart();
        });

        it('PS_085: Kiểm tra thêm sản phẩm không có lựa chọn đã hết hàng', () => {
            shopPage.addProductSoldOut();
        });

        it('PS_086: Kiểm tra thêm sản phẩm có lựa chọn đã hết hàng', () => {
            shopPage.addSelectedProductSoldOut();
        });
    });

    describe('Navigation tests', () => {
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
    
    describe('Filter tests', () => {
        it('PS_092: Kiểm tra sắp xếp theo độ phổ biến', () => {
            shopPage.sortByPopularity();
        });

        it('PS_093: Kiểm tra sắp xếp theo xếp hàng trung bình', () => {
            shopPage.sortByRating();
        });

        it('PS_094: Kiểm tra sắp xếp theo mới nhất', () => {
            shopPage.sortByNewest();
        });

        it('PS_095: Kiểm tra sắp xếp theo giá: thấp đến cao', () => {
            shopPage.sortByPriceLowToHigh();
        });

        it('PS_096: Kiểm tra sắp xếp theo giá: cao đến thấp', () => {
            shopPage.sortByPriceHighToLow();
        });
    });

    describe('Pagination tests', () => {
         it('PS_097: Kiểm tra trường hợp ở trang đầu tiên', () => {
            shopPage.checkPaginationDisplay();
            shopPage.checkFirstPagePagination();
        });

        it('PS_098: Kiểm tra trường hợp ở trang cuối cùng', () => {
            shopPage.checkPaginationDisplay();
            shopPage.checkLastPagePagination();
        });

        it('PS_099: Kiểm tra click trang bất kỳ không phải là page 1 hoặc cuối', () => {
            shopPage.checkPaginationDisplay();
            shopPage.clickMiddlePage();
        });

         it('PS_100: Kiểm tra click nút [→]', () => {
            shopPage.checkPaginationDisplay();
            cy.visitShopPage2();
            shopPage.goToNextPage();
        });

        it('PS_101: Kiểm tra click nút [←]', () => { 
            shopPage.checkPaginationDisplay();
            cy.visitShopPage2();
            shopPage.goToPreviousPage();
        });
    });
});