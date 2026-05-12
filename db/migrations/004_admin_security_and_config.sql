-- ─────────────────────────────────────────────────────────────────────────────
-- CRUDO V1 · Migration 004 · Admin security extensions (Fase 5)
-- ─────────────────────────────────────────────────────────────────────────────
-- Anade soporte para refresh tokens persistidos con denylist y un email
-- canonico unico (case-insensitive) sobre `admin_user`. Nada del schema de
-- audit_log/admin_user se modifica destructivamente.
--
--  · `admin_refresh_token` guarda el hash SHA-256 del refresh token (nunca el
--    valor en claro) junto con expiracion, fingerprint anonimo (ip/UA hash) y
--    `revoked_at` para revocaciones manuales o por logout.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `admin_refresh_token` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_user_id`   BIGINT UNSIGNED NOT NULL,
  `token_hash`      VARCHAR(128) NOT NULL,
  `ip_hash`         VARCHAR(128) NULL,
  `user_agent_hash` VARCHAR(128) NULL,
  `expires_at`      TIMESTAMP NOT NULL,
  `revoked_at`      TIMESTAMP NULL DEFAULT NULL,
  `created_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_refresh_token_hash` (`token_hash`),
  CONSTRAINT `fk_refresh_admin` FOREIGN KEY (`admin_user_id`)
    REFERENCES `admin_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `ix_refresh_admin_active` ON `admin_refresh_token` (`admin_user_id`, `revoked_at`, `expires_at`);
