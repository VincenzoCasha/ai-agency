-- ─────────────────────────────────────────────────────────────────────────────
-- CRUDO V1 · Migration 002 · Indexes
-- ─────────────────────────────────────────────────────────────────────────────
-- MariaDB no soporta `CREATE INDEX IF NOT EXISTS` de forma fiable en versiones
-- antiguas. Usamos nombres unicos y la tabla schema_migrations garantiza que
-- esta migracion solo se aplica una vez. Si se reaplica manualmente fallara,
-- como debe ser.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX `ix_product_type_active`        ON `product` (`type`, `is_active`);
CREATE INDEX `ix_product_alcohol_active`     ON `product` (`is_alcohol`, `is_active`);
CREATE INDEX `ix_product_seasonal_featured`  ON `product` (`is_seasonal`, `is_featured`);
CREATE INDEX `ix_product_milk_type`          ON `product` (`milk_type`);
CREATE INDEX `ix_product_intensity`          ON `product` (`intensity`);

CREATE INDEX `ix_product_image_product`      ON `product_image` (`product_id`, `sort_order`);

CREATE INDEX `ix_variant_product_active`     ON `product_variant` (`product_id`, `is_active`);

CREATE INDEX `ix_event_starts_active`        ON `event` (`starts_at`, `is_active`);

CREATE INDEX `ix_reservation_event_status`   ON `event_reservation` (`event_id`, `status`);

CREATE INDEX `ix_pickup_status_date`         ON `pickup_order` (`status`, `pickup_date`);
CREATE INDEX `ix_pickup_item_order`          ON `pickup_order_item` (`pickup_order_id`);

CREATE INDEX `ix_inquiry_type_status`        ON `inquiry` (`type`, `status`);

CREATE INDEX `ix_audit_entity`               ON `audit_log` (`entity_type`, `entity_id`);
CREATE INDEX `ix_audit_created`              ON `audit_log` (`created_at`);
