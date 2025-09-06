import SearchMenu from '../../pageObjects/SearchMenu';

describe('Search Functionality Tests', () => {
  const searchPage = new SearchMenu();

  beforeEach(() => {
    cy.visitPage();
    searchPage.clickInputSearch();
  });

  it('PS_046: Kiểm tra hiển thị mặc định ô tìm kiếm', () => {
    searchPage.checkSearchLayout();
  });

  it.only('PS_047: Kiểm tra nhập từ khóa tìm kiếm không tồn tại', () => {
    cy.fixture('search').then((search) => {
      searchPage.searchKeyword(search.invalidKeyword.keyword);
      searchPage.keywordNotExits(search.invalidKeyword.keyword, {timeout: 4000});
    });
  });

  it('PS_048: Kiểm tra tìm kiếm với từ khóa hợp lệ', () => {
    cy.fixture('search').then((search) => {
      searchPage.searchKeyword(search.validKeyword.keyword);
      searchPage.verifySearchResults();
    });
  });

  it('PS_049: Kiểm tra nhập tìm kiếm toàn space hoặc ký tự đặc biệt', () => {
    cy.fixture('search').then((search) => {
      searchPage.searchKeyword(search.spaceKeyword.keyword);
      searchPage.verifyNoResults();
    });
  });

  it('PS_050: Kiểm tra khi nhập đúng 1 phần từ khóa', () => {
    cy.fixture('search').then((search) => {
      searchPage.searchKeyword(search.exactlyPartKeyword.keyword);
      searchPage.verifySearchResults();
      searchPage.verifyKeywordMatchInResults(search.exactlyPartKeyword.keyword);
    });
  });

  it('PS_051: Kiểm tra click vào 1 sản phẩm trong danh sách', () => {
    cy.fixture('search').then((search) => {
      searchPage.searchKeyword(search.validKeyword.keyword);
      searchPage.clickFirstProduct();
    });
  });

  it('PS_052: Kiểm tra click nút "Thêm vào giỏ hàng"', () => {
    cy.fixture('search').then((search) => {
      searchPage.searchKeyword(search.validKeyword.keyword);
      searchPage.clickAddToCart();
    });
  });

  it('PS_053: Kiểm tra click nút "Lựa chọn tùy chọn"', () => {
    cy.fixture('search').then((search) => {
      searchPage.searchKeyword(search.exactlyPartKeyword.keyword);
      searchPage.clickSelectOption();
    });
  });

  it('PS_054: Kiểm tra click "Xem tất cả sản phẩm"', () => {
    cy.fixture('search').then((search) => {
      searchPage.searchKeyword(search.exactlyPartKeyword.keyword);
      searchPage.clickViewAllProducts();
    });
  });
  
  it('PS_055: Kiểm tra kết quả tìm kiếm', () => {
    cy.fixture('search').then((search) => {
      searchPage.searchKeyword(search.validKeyword.keyword);
      searchPage.verifyResultPage(search.validKeyword.keyword);
    });
  });
});