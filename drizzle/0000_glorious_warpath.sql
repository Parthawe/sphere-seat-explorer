CREATE TABLE `email_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`status` text DEFAULT 'unverified' NOT NULL,
	`consent_version` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_requests_email_unique` ON `email_requests` (`email`);--> statement-breakpoint
CREATE INDEX `email_created_idx` ON `email_requests` (`created_at`);--> statement-breakpoint
CREATE TABLE `request_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `limit_expiry_idx` ON `request_limits` (`expires_at`);--> statement-breakpoint
CREATE TABLE `usage_events` (
	`id` text PRIMARY KEY NOT NULL,
	`session` text NOT NULL,
	`at` integer NOT NULL,
	`event` text NOT NULL,
	`page` text NOT NULL,
	`season` integer,
	`race` text,
	`device` text NOT NULL,
	`country` text NOT NULL,
	`referrer` text NOT NULL,
	`kind` text,
	`speed` text
);
--> statement-breakpoint
CREATE INDEX `usage_at_idx` ON `usage_events` (`at`);--> statement-breakpoint
CREATE INDEX `usage_event_idx` ON `usage_events` (`event`,`at`);