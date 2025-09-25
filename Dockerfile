FROM wordpress:php8.1-apache

# Install additional PHP extensions nếu cần
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Copy WordPress files
COPY ./wordpress /var/www/html/

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && find /var/www/html -type d -exec chmod 755 {} \; \
    && find /var/www/html -type f -exec chmod 644 {} \;

# Copy wp-config if exists
COPY wp-config.php /var/www/html/ 2>/dev/null || true

EXPOSE 80