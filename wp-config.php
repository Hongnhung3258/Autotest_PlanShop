<?php
// Database settings cho Docker
define('DB_NAME', 'wordpress');
define('DB_USER', 'wordpress');  
define('DB_PASSWORD', 'wordpress123');
define('DB_HOST', 'db:3306'); // 'db' là tên service trong docker-compose
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

// URL settings cho Docker
define('WP_HOME','http://localhost:8080');
define('WP_SITEURL','http://localhost:8080');

// Tắt file editing trong admin (bảo mật)
define('DISALLOW_FILE_EDIT', true);

// Copy từ wp-config.php cũ trong LocalWP hoặc tạo mới
define( 'AUTH_KEY',          'Q,Cyc$sqU<g<YH|WYBFR[y1y(Eb[9uV^iK8IboC~ay5gWK>zKOBwVl8G7#<[`gd?' );
define( 'SECURE_AUTH_KEY',   '_@.Wh^<;5<uIY-J}loqhxcP@rCp}S+S[Xtt*}A&13y4z3`gjOdR.d+]-wBf52s@l' );
define( 'LOGGED_IN_KEY',     'D73^>ESk0]YAY$pO%7HAacJ#Eup~Px:-_i5HD({zKx@qK(1/+DDK?T?XtWaM+X@1' );
define( 'NONCE_KEY',         '/LPR,9rm1=<}*D;eDBLZc/BUr2%IQZzbg&0cu!TX4k/b$N&Rq1ND5g,Z)GPiE=C%' );
define( 'AUTH_SALT',         ')5i%3ZZ6)mh5v;,`u=E @t)7Gy=(mgX(kchg=P]YHfOE!h7rfB*TnGr;JyjiL-ZD' );
define( 'SECURE_AUTH_SALT',  'NwUUMD.S!)NmwmdXRGn{D?` `f 8,,:,)-m7+wgOhexQsVFU9j,)s~XW)af{/)p>' );
define( 'LOGGED_IN_SALT',    'EHK_U4P1JhG+c6 ns`5}aR1gPK/)Z1BDm{!q]-eY5|63_zq<-/`X;&196y?JZtyH' );
define( 'NONCE_SALT',        'gzPPJ:3E^zl1<jQ.uxBdO]92apv5ym6JmXOcLz=KbKHLsY^yc=D1f-Z-s_tM:r~U' );
define( 'WP_CACHE_KEY_SALT', '>9kc270Q1+TI>C&CZ&TdZ1$TBQ9Bpr~q)~gqQo:.(C)]y*D_6)jmRYp{h2Orn{R*' );

$table_prefix = 'wp_'; // Giữ nguyên từ LocalWP

define('WP_DEBUG', false);
define('WP_DEBUG_LOG', false);
define('WP_DEBUG_DISPLAY', false);

if ( !defined('ABSPATH') )
    define('ABSPATH', dirname(__FILE__) . '/');

require_once(ABSPATH . 'wp-settings.php');
?>