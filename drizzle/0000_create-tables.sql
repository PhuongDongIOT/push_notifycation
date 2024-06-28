CREATE TABLE `articles` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`full_name` varchar(256),
	CONSTRAINT `articles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dailyWarningSends` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`warningId` bigint NOT NULL,
	`isSend` boolean DEFAULT false,
	CONSTRAINT `dailyWarningSends_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dailyWarnings` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`warningName` varchar(256) NOT NULL,
	`warningExpiredId` bigint NOT NULL,
	`warningPreviousExpiredNum` bigint NOT NULL,
	`warningPreviousExpiredId` bigint NOT NULL,
	`warningType` varchar(256),
	`warningDescription` varchar(256),
	`userId` bigint NOT NULL,
	`isDeleted` boolean DEFAULT false,
	`dateCreated` timestamp NOT NULL DEFAULT (now()),
	`dateUpdated` timestamp NOT NULL DEFAULT (now()),
	`dateDeleted` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dailyWarnings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dailyWarningsDate` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`warningDate` date NOT NULL,
	`isDeleted` boolean DEFAULT false,
	`dateCreated` timestamp NOT NULL DEFAULT (now()),
	`dateUpdated` timestamp NOT NULL DEFAULT (now()),
	`dateDeleted` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dailyWarningsDate_id` PRIMARY KEY(`id`),
	CONSTRAINT `warningDateUniqueIndex` UNIQUE(`warningDate`)
);
--> statement-breakpoint
ALTER TABLE `dailyWarningSends` ADD CONSTRAINT `dailyWarningSends_warningId_dailyWarnings_id_fk` FOREIGN KEY (`warningId`) REFERENCES `dailyWarnings`(`id`) ON DELETE no action ON UPDATE no action;