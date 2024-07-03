CREATE TABLE `articles` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`full_name` varchar(256),
	CONSTRAINT `articles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dailyWarningSends` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`warningVehicleId` bigint NOT NULL,
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
	`dailyWarningsId` bigint DEFAULT 0,
	`warningRoadLimit` bigint DEFAULT 0,
	`dailyWarningsLevelId` bigint,
	`warningType` varchar(256),
	`warningDescription` varchar(256),
	`userId` bigint NOT NULL,
	`isChecked` boolean DEFAULT false,
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
CREATE TABLE `dailyWarningsLevel` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`warningLevel` varchar(256) NOT NULL,
	`isDeleted` boolean DEFAULT false,
	`dateCreated` timestamp NOT NULL DEFAULT (now()),
	`dateUpdated` timestamp NOT NULL DEFAULT (now()),
	`dateDeleted` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dailyWarningsLevel_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dailyWarningsRoad` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`vehicleName` varchar(256) NOT NULL,
	`isDeleted` boolean DEFAULT false,
	`dateCreated` timestamp NOT NULL DEFAULT (now()),
	`dateUpdated` timestamp NOT NULL DEFAULT (now()),
	`dateDeleted` timestamp NOT NULL DEFAULT (now()),
	`dailyWarningsId` bigint,
	CONSTRAINT `dailyWarningsRoad_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `dailyWarningSends` ADD CONSTRAINT `dailyWarningSends_warningVehicleId_dailyWarningsRoad_id_fk` FOREIGN KEY (`warningVehicleId`) REFERENCES `dailyWarningsRoad`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dailyWarningsRoad` ADD CONSTRAINT `dailyWarningsRoad_dailyWarningsId_dailyWarnings_id_fk` FOREIGN KEY (`dailyWarningsId`) REFERENCES `dailyWarnings`(`id`) ON DELETE no action ON UPDATE no action;