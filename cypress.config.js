module.exports = {
  // ID dự án Cypress Cloud để tracking và dashboard
  projectId: "xnn6up",

  e2e: {
    baseUrl:  process.env.CYPRESS_baseUrl || process.env.BASE_URL || 'http://planshop.local/', // URL gốc của ứng dụng web cần test
    specPattern: 'cypress/e2e/**/*.cy.js', // Pattern để tìm các file test (tất cả file .cy.js trong thư mục e2e)
    screenshotsFolder: 'cypress/screenshots',  // Thư mục lưu ảnh chụp màn hình
    videosFolder: 'cypress/videos',            // Thư mục lưu video recording
    video: true,                        // Bật recording video khi chạy test
    videoCompression: 32,               // Mức nén video (32 = chất lượng trung bình)
    screenshotOnRunFailure: true,       // Tự động chụp ảnh khi test fail
    trashAssetsBeforeRuns: true,        // Xóa ảnh/video cũ trước khi chạy test mới
    
    viewportWidth: 1920,                // Chiều rộng màn hình test (Full HD)
    viewportHeight: 1080,               // Chiều cao màn hình test (Full HD)
    
    defaultCommandTimeout: 6000,        // Thời gian chờ mặc định cho mỗi command (6 giây)
    requestTimeout: 10000,              // Thời gian chờ HTTP request (10 giây)
    responseTimeout: 30000,             // Thời gian chờ HTTP response (30 giây)
    pageLoadTimeout: 30000,             // Thời gian chờ tải trang (30 giây)
    
    watchForFileChanges: false,         // Không tự động chạy lại test khi file thay đổi
    chromeWebSecurity: false,           // Tắt bảo mật web của Chrome (cho phép CORS)
    
    // Cho phép chạy tất cả spec files cùng lúc (experimental feature)
    experimentalRunAllSpecs: true,

    reporter: 'cypress-mochawesome-reporter', // Sử dụng mochawesome để tạo báo cáo HTML
    reporterOptions: {
      reportDir: 'cypress/reports',     // Thư mục lưu báo cáo
      overwrite: false,                 // Không ghi đè báo cáo cũ (giữ lịch sử)
      html: true,                       // Tạo file HTML report
      json: true,                       // Tạo file JSON report (để xử lý sau)
      timestamp: 'mmddyyyy_HHMMss'      // Thêm timestamp vào tên file báo cáo
    },
    
    retries: {
      runMode: 2,    // Thử lại 2 lần khi chạy headless (CI/CD)
      openMode: 0    // Không thử lại khi chạy với giao diện (development)
    },
    
    env: {
      SHORT_TIMEOUT: 3000,              // Timeout ngắn (3 giây)
      MEDIUM_TIMEOUT: 10000,            // Timeout trung bình (10 giây)
      LONG_TIMEOUT: 30000,              // Timeout dài (30 giây)
      RECORD_VIDEO: true,               // Cho phép ghi video
      TAKE_SCREENSHOTS: true            // Cho phép chụp ảnh
    },
    
    // === CẤU HÌNH NODE EVENTS (PLUGINS VÀ TASKS) ===
    setupNodeEvents(on, config) {
      // Đăng ký plugin mochawesome reporter
      require('cypress-mochawesome-reporter/plugin')(on);
      
      // === ĐĂNG KÝ CÁC TASK TỰ ĐỊNH NGHĨA ===
      on('task', {
        // Task để log message ra console
        log(message) {
          console.log(message);
          return null;  // Phải return null trong Cypress tasks
        },
        
        // Task để log data dạng table
        logTable(data) {
          console.table(data);
          return null;
        },
        
        // Task để log khi test failed
        failed(message) {
          console.log('Test Failed:', message);
          return null;
        }
      });

      // === EVENT LISTENER KHI CHỤP ẢNH ===
      on('after:screenshot', (details) => {
        console.log(`Screenshot saved: ${details.path}`);
        return null;
      });

      // === EVENT LISTENER SAU KHI CHẠY XONG TẤT CẢ TEST ===
      on('after:run', (results) => {
        console.log('\n' + '='.repeat(60));
        console.log('CYPRESS TEST RESULTS SUMMARY');
        console.log('='.repeat(60));
        console.log(`Total Tests: ${results.totalTests}`);      // Tổng số test
        console.log(`Total Passed: ${results.totalPassed}`);    // Số test passed
        console.log(`Total Failed: ${results.totalFailed}`);    // Số test failed
        console.log(`Total Pending: ${results.totalPending}`);  // Số test pending
        console.log(`Total Skipped: ${results.totalSkipped}`);  // Số test skipped
        
        // Hiển thị thông tin về screenshots và videos nếu có test fail
        if (results.totalFailed > 0) {
          console.log(`\nScreenshots saved in: cypress/screenshots/`);
          console.log(`Videos saved in: cypress/videos/`);
        }
        
        // Link đến Cypress Cloud dashboard
        console.log(`\nView full reports at: https://cloud.cypress.io/projects/xnn6up`);
        console.log('='.repeat(60));
        return null;
      });

      // === EVENT LISTENER SAU KHI CHẠY XONG MỖI SPEC FILE ===
      on('after:spec', (spec, results) => {
        // Log đường dẫn video nếu có
        if (results && results.video) {
          console.log(`Video saved: ${results.video}`);
        }
        
        // Log kết quả chi tiết cho từng spec file
        const { stats } = results;
        console.log(`\nTest Results for ${spec.name}:`);
        console.log(`   Passed: ${stats.passes}`);     // Số test passed trong file này
        console.log(`   Failed: ${stats.failures}`);   // Số test failed trong file này
        console.log(`   Pending: ${stats.pending}`);   // Số test pending trong file này
        console.log(`   Duration: ${stats.duration}ms`); // Thời gian chạy file này
        
        return null;
      });

      // === CẤU HÌNH BROWSER LAUNCH ===
      on('before:browser:launch', (browser, launchOptions) => {
        // Chỉ áp dụng cho Chromium-based browsers (Chrome, Edge, etc.)
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          // Các flag để tối ưu performance và tránh lỗi
          launchOptions.args.push('--disable-dev-shm-usage');        // Tránh lỗi shared memory
          launchOptions.args.push('--no-sandbox');                   // Tắt sandbox (cần cho Docker)
          launchOptions.args.push('--disable-gpu');                  // Tắt GPU acceleration
          launchOptions.args.push('--disable-web-security');         // Tắt web security
          launchOptions.args.push('--allow-running-insecure-content'); // Cho phép HTTP content
          
          // Nếu chạy trong CI/CD environment
          if (process.env.CI) {
            launchOptions.args.push('--headless');                   // Chạy headless mode
            launchOptions.args.push('--disable-background-timer-throttling'); // Tắt timer throttling
            launchOptions.args.push('--disable-backgrounding-occluded-windows'); // Tắt window backgrounding
            launchOptions.args.push('--disable-renderer-backgrounding'); // Tắt renderer backgrounding
          }
        }
        
        return launchOptions;
      });

      // === CẤU HÌNH ĐẶC BIỆT CHO CI/CD ===
      if (process.env.CI) {
        // Cho phép tắt video recording thông qua environment variable
        config.video = process.env.CYPRESS_video !== 'false';
        // Luôn chụp ảnh khi test fail trong CI
        config.screenshotOnRunFailure = true;
        // Không watch file changes trong CI
        config.watchForFileChanges = false;
        // Nén video nhiều hơn để tiết kiệm dung lượng trong CI
        config.videoCompression = 15;
      }

      // Trả về config đã được modify
      return config;
    }
  }
};
