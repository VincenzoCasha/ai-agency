-- ─────────────────────────────────────────────────────────────────────────────
-- CRUDO V1 · Migration 003 · Idempotency keys for pickup-orders (Fase 4)
-- ─────────────────────────────────────────────────────────────────────────────
-- Permite que `POST /api/v1/pickup-orders` sea seguro frente a retries de red.
--
--  · Misma key + mismo request_hash  -> devolvemos response/status guardados.
--  · Misma key + request_hash distinto -> 409 Conflict.
--  · Las claves expiran a 24h por contrato V1; una limpieza periodica borrara
--    las caducadas (no implementada en V1).
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `idempotency_key` (
  `key_value`     VARCHAR(128) NOT NULL,
  `request_hash`  VARCHAR(128) NOT NULL,
  `status_code`   INT          NOT NULL,
  `response_json` LONGTEXT     NOT NULL,
  `resource_type` VARCHAR(40)  NULL,
  `resource_id`   BIGINT UNSIGNED NULL,
  `expires_at`    TIMESTAMP    NOT NULL,
  `created_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`key_value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `ix_idempotency_expires` ON `idempotency_key` (`expires_at`);
