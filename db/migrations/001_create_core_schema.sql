-- ─────────────────────────────────────────────────────────────────────────────
-- CRUDO V1 · Migration 001 · Core schema
-- ─────────────────────────────────────────────────────────────────────────────
-- Creates all V1 entities. Idempotent via `CREATE TABLE IF NOT EXISTS`.
-- Engine InnoDB, charset utf8mb4 to support full unicode (acentos, emojis si owner los usa).
-- All money fields are integer cents. All timestamps are UTC server time.
-- payload_json columns use LONGTEXT (MariaDB JSON type is alias of LONGTEXT
-- with optional CHECK json_valid; documented for portability across MariaDB versions).
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `category` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`       VARCHAR(160) NOT NULL,
  `name`       VARCHAR(200) NOT NULL,
  `type`       VARCHAR(32)  NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_category_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `product` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`            VARCHAR(160) NOT NULL,
  `name`            VARCHAR(200) NOT NULL,
  `type`            VARCHAR(16)  NOT NULL,
  `is_alcohol`      TINYINT(1)   NOT NULL DEFAULT 0,
  `price_cents`     INT          NOT NULL DEFAULT 0,
  `vat_rate`        DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  `short_desc`      VARCHAR(500) NULL,
  `long_desc`       TEXT         NULL,
  `producer`        VARCHAR(200) NULL,
  `region`          VARCHAR(160) NULL,
  `milk_type`       VARCHAR(16)  NULL,
  `milk_treatment`  VARCHAR(16)  NULL,
  `intensity`       VARCHAR(16)  NULL,
  `pairing_notes`   TEXT         NULL,
  `is_seasonal`     TINYINT(1)   NOT NULL DEFAULT 0,
  `is_featured`     TINYINT(1)   NOT NULL DEFAULT 0,
  `is_active`       TINYINT(1)   NOT NULL DEFAULT 1,
  `stock_status`    VARCHAR(16)  NOT NULL DEFAULT 'IN_STOCK',
  `created_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_product_slug` (`slug`),
  CONSTRAINT `ck_product_type`         CHECK (`type` IN ('CHEESE','WINE','TABLA','OTHER')),
  CONSTRAINT `ck_product_stock`        CHECK (`stock_status` IN ('IN_STOCK','LOW','OUT')),
  CONSTRAINT `ck_product_price_nonneg` CHECK (`price_cents` >= 0),
  CONSTRAINT `ck_product_milk_type`    CHECK (`milk_type` IS NULL OR `milk_type` IN ('COW','SHEEP','GOAT','MIXED')),
  CONSTRAINT `ck_product_milk_treat`   CHECK (`milk_treatment` IS NULL OR `milk_treatment` IN ('RAW','PASTEURIZED','THERMIZED')),
  CONSTRAINT `ck_product_intensity`    CHECK (`intensity` IS NULL OR `intensity` IN ('MILD','MEDIUM','STRONG'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `product_image` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `url`        VARCHAR(500) NOT NULL,
  `alt_text`   VARCHAR(300) NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_primary` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_product_image_product` FOREIGN KEY (`product_id`)
    REFERENCES `product` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `product_category` (
  `product_id`  BIGINT UNSIGNED NOT NULL,
  `category_id` BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`product_id`, `category_id`),
  CONSTRAINT `fk_pc_product`  FOREIGN KEY (`product_id`)  REFERENCES `product`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pc_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- product_variant: tablas con tamano y maridaje opcional.
-- Una variante con `is_alcohol=1` representa la version con maridaje de vino
-- y no podra entrar en Mi Tabla (regla que se aplica en Fase 4 a nivel servicio/endpoint).
CREATE TABLE IF NOT EXISTS `product_variant` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`    BIGINT UNSIGNED NOT NULL,
  `slug`          VARCHAR(160) NOT NULL,
  `label`         VARCHAR(200) NOT NULL,
  `size_label`    VARCHAR(80)  NULL,
  `pairing_label` VARCHAR(120) NULL,
  `price_cents`   INT NOT NULL DEFAULT 0,
  `is_alcohol`    TINYINT(1) NOT NULL DEFAULT 0,
  `is_active`     TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order`    INT NOT NULL DEFAULT 0,
  `created_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_variant_slug` (`slug`),
  CONSTRAINT `fk_variant_product` FOREIGN KEY (`product_id`)
    REFERENCES `product` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ck_variant_price_nonneg` CHECK (`price_cents` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `campaign` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`           VARCHAR(160) NOT NULL,
  `title`          VARCHAR(200) NOT NULL,
  `subtitle`       VARCHAR(300) NULL,
  `hero_image_url` VARCHAR(500) NULL,
  `body_md`        MEDIUMTEXT   NULL,
  `starts_at`      TIMESTAMP NULL DEFAULT NULL,
  `ends_at`        TIMESTAMP NULL DEFAULT NULL,
  `is_active`      TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_campaign_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `campaign_product` (
  `campaign_id` BIGINT UNSIGNED NOT NULL,
  `product_id`  BIGINT UNSIGNED NOT NULL,
  `sort_order`  INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`campaign_id`, `product_id`),
  CONSTRAINT `fk_cp_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `campaign` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cp_product`  FOREIGN KEY (`product_id`)  REFERENCES `product`  (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `event` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`           VARCHAR(160) NOT NULL,
  `title`          VARCHAR(200) NOT NULL,
  `description_md` MEDIUMTEXT NULL,
  `hero_image_url` VARCHAR(500) NULL,
  `starts_at`      TIMESTAMP NOT NULL,
  `ends_at`        TIMESTAMP NULL DEFAULT NULL,
  `capacity`       INT NOT NULL DEFAULT 0,
  `price_cents`    INT NOT NULL DEFAULT 0,
  `location`       VARCHAR(200) NULL,
  `is_active`      TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_event_slug` (`slug`),
  CONSTRAINT `ck_event_capacity_nonneg` CHECK (`capacity` >= 0),
  CONSTRAINT `ck_event_price_nonneg`    CHECK (`price_cents` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `event_reservation` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_id`   BIGINT UNSIGNED NOT NULL,
  `name`       VARCHAR(200) NOT NULL,
  `email`      VARCHAR(255) NOT NULL,
  `phone`      VARCHAR(40)  NULL,
  `party_size` INT NOT NULL DEFAULT 1,
  `notes`      TEXT NULL,
  `status`     VARCHAR(16) NOT NULL DEFAULT 'NEW',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_reservation_event` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ck_reservation_status` CHECK (`status` IN ('NEW','CONFIRMED','CANCELLED')),
  CONSTRAINT `ck_reservation_party`  CHECK (`party_size` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `inquiry` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `type`         VARCHAR(16) NOT NULL,
  `name`         VARCHAR(200) NOT NULL,
  `email`        VARCHAR(255) NOT NULL,
  `phone`        VARCHAR(40)  NULL,
  `message`      TEXT NULL,
  `payload_json` LONGTEXT NULL,
  `status`       VARCHAR(16) NOT NULL DEFAULT 'NEW',
  `created_at`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `ck_inquiry_type`   CHECK (`type` IN ('CONTACT','WHOLESALE','PICKUP','EVENT')),
  CONSTRAINT `ck_inquiry_status` CHECK (`status` IN ('NEW','IN_PROGRESS','DONE','SPAM'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pickup_order` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`         VARCHAR(200) NOT NULL,
  `email`        VARCHAR(255) NOT NULL,
  `phone`        VARCHAR(40)  NULL,
  `pickup_date`  DATE NOT NULL,
  `pickup_slot`  VARCHAR(40)  NULL,
  `notes`        TEXT NULL,
  `total_cents`  INT NOT NULL DEFAULT 0,
  `status`       VARCHAR(16) NOT NULL DEFAULT 'NEW',
  `created_at`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `ck_pickup_status`        CHECK (`status` IN ('NEW','CONFIRMED','READY','PICKED_UP','CANCELLED')),
  CONSTRAINT `ck_pickup_total_nonneg`  CHECK (`total_cents` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pickup_order_item` (
  `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pickup_order_id`  BIGINT UNSIGNED NOT NULL,
  `product_id`       BIGINT UNSIGNED NOT NULL,
  `variant_id`       BIGINT UNSIGNED NULL,
  `qty`              INT NOT NULL DEFAULT 1,
  `unit_price_cents` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_poi_order`   FOREIGN KEY (`pickup_order_id`) REFERENCES `pickup_order`    (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_poi_product` FOREIGN KEY (`product_id`)      REFERENCES `product`         (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_poi_variant` FOREIGN KEY (`variant_id`)      REFERENCES `product_variant` (`id`) ON DELETE SET NULL,
  CONSTRAINT `ck_poi_qty_pos`        CHECK (`qty` > 0),
  CONSTRAINT `ck_poi_unit_price_nn`  CHECK (`unit_price_cents` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `newsletter_subscriber` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email`      VARCHAR(255) NOT NULL,
  `source`     VARCHAR(80)  NULL,
  `consent_at` TIMESTAMP NULL DEFAULT NULL,
  `ip`         VARCHAR(64)  NULL,
  `status`     VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_newsletter_email` (`email`),
  CONSTRAINT `ck_newsletter_status` CHECK (`status` IN ('ACTIVE','UNSUBSCRIBED','BOUNCED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `admin_user` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email`         VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role`          VARCHAR(16) NOT NULL DEFAULT 'ADMIN',
  `is_active`     TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admin_email` (`email`),
  CONSTRAINT `ck_admin_role` CHECK (`role` IN ('ADMIN','STAFF'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `consent_log` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `consent_id`      VARCHAR(64)  NOT NULL,
  `analytics`       TINYINT(1) NOT NULL DEFAULT 0,
  `marketing`       TINYINT(1) NOT NULL DEFAULT 0,
  `preferences`     TINYINT(1) NOT NULL DEFAULT 0,
  `ip_hash`         VARCHAR(128) NULL,
  `user_agent_hash` VARCHAR(128) NULL,
  `created_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at`      TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `audit_log` (
  `id`                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `actor_admin_user_id`   BIGINT UNSIGNED NULL,
  `action`                VARCHAR(80)  NOT NULL,
  `entity_type`           VARCHAR(80)  NOT NULL,
  `entity_id`             BIGINT UNSIGNED NULL,
  `payload_json`          LONGTEXT NULL,
  `created_at`            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_audit_admin` FOREIGN KEY (`actor_admin_user_id`)
    REFERENCES `admin_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- site_config: kill switch para pickups y otros flags globales runtime.
-- Almacena pares key/value; el flag `pickup_paused` es obligatorio en V1.
CREATE TABLE IF NOT EXISTS `site_config` (
  `config_key`  VARCHAR(80)  NOT NULL,
  `value_text`  TEXT NULL,
  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
