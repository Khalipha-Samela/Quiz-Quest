# Use secure PHP + Apache image
FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    zip \
    unzip \
    && docker-php-ext-configure gd \
    --with-freetype \
    --with-jpeg \
    && docker-php-ext-install gd mysqli pdo pdo_mysql

# Enable Apache rewrite
RUN a2enmod rewrite

# Copy app
COPY . /var/www/html/

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Environment variables (Render will inject real values)
ENV PORT=80

# Expose web port
EXPOSE 80

# Default command
CMD ["apache2-foreground"]
