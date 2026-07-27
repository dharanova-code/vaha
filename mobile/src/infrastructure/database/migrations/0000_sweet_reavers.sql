CREATE TABLE `captures` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`title` text,
	`transcript` text,
	`summary` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`collection_id` integer,
	`device_id` integer,
	`sync_state` text DEFAULT 'pending' NOT NULL,
	FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `collections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`name` text NOT NULL,
	`color` text,
	`icon` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `capture_tags` (
	`capture_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	FOREIGN KEY (`capture_id`) REFERENCES `captures`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`name` text NOT NULL,
	`color` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `devices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`name` text NOT NULL,
	`model` text,
	`firmware` text,
	`last_seen` integer,
	`trusted` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sync_queue` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`entity` text NOT NULL,
	`entity_id` integer NOT NULL,
	`operation` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `captures_uuid_unique` ON `captures` (`uuid`);--> statement-breakpoint
CREATE INDEX `captures_created_at_idx` ON `captures` (`created_at`);--> statement-breakpoint
CREATE INDEX `captures_updated_at_idx` ON `captures` (`updated_at`);--> statement-breakpoint
CREATE INDEX `captures_collection_id_idx` ON `captures` (`collection_id`);--> statement-breakpoint
CREATE INDEX `captures_device_id_idx` ON `captures` (`device_id`);--> statement-breakpoint
CREATE INDEX `captures_sync_state_idx` ON `captures` (`sync_state`);--> statement-breakpoint
CREATE UNIQUE INDEX `collections_uuid_unique` ON `collections` (`uuid`);--> statement-breakpoint
CREATE INDEX `capture_tags_capture_id_idx` ON `capture_tags` (`capture_id`);--> statement-breakpoint
CREATE INDEX `capture_tags_tag_id_idx` ON `capture_tags` (`tag_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `tags_uuid_unique` ON `tags` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `devices_uuid_unique` ON `devices` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `settings_key_unique` ON `settings` (`key`);--> statement-breakpoint
CREATE INDEX `sync_queue_status_idx` ON `sync_queue` (`status`);--> statement-breakpoint
CREATE INDEX `sync_queue_created_at_idx` ON `sync_queue` (`created_at`);