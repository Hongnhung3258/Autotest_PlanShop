<?php
define('WP_CACHE', false ); // Added by AirLift

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'local' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'Q,Cyc$sqU<g<YH|WYBFR[y1y(Eb[9uV^iK8IboC~ay5gWK>zKOBwVl8G7#<[`gd?' );
define( 'SECURE_AUTH_KEY',   '_@.Wh^<;5<uIY-J}loqhxcP@rCp}S+S[Xtt*}A&13y4z3`gjOdR.d+]-wBf52s@l' );
define( 'LOGGED_IN_KEY',     'D73^>ESk0]YAY$pO%7HAacJ#Eup~Px:-_i5HD({zKx@qK(1/+DDK?T?XtWaM+X@1' );
define( 'NONCE_KEY',         '/LPR,9rm1=<}*D;eDBLZc/BUr2%IQZzbg&0cu!TX4k/b$N&Rq1ND5g,Z)GPiE=C%' );
define( 'AUTH_SALT',         ')5i%3ZZ6)mh5v;,`u=E @t)7Gy=(mgX(kchg=P]YHfOE!h7rfB*TnGr;JyjiL-ZD' );
define( 'SECURE_AUTH_SALT',  'NwUUMD.S!)NmwmdXRGn{D?` `f 8,,:,)-m7+wgOhexQsVFU9j,)s~XW)af{/)p>' );
define( 'LOGGED_IN_SALT',    'EHK_U4P1JhG+c6 ns`5}aR1gPK/)Z1BDm{!q]-eY5|63_zq<-/`X;&196y?JZtyH' );
define( 'NONCE_SALT',        'gzPPJ:3E^zl1<jQ.uxBdO]92apv5ym6JmXOcLz=KbKHLsY^yc=D1f-Z-s_tM:r~U' );
define( 'WP_CACHE_KEY_SALT', '>9kc270Q1+TI>C&CZ&TdZ1$TBQ9Bpr~q)~gqQo:.(C)]y*D_6)jmRYp{h2Orn{R*' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'WP_ENVIRONMENT_TYPE', 'local' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
