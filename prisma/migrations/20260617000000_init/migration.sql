CREATE DATABASE IF NOT EXISTS `onestack_app` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `onestack_app`;

CREATE TABLE `User` (
  `id`        VARCHAR(191) NOT NULL,
  `email`     VARCHAR(191) NOT NULL,
  `password`  VARCHAR(191) NOT NULL,
  `name`      VARCHAR(191),
  `phone`     VARCHAR(191),
  `pushToken` VARCHAR(191),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Request` (
  `id`        VARCHAR(191) NOT NULL,
  `userId`    VARCHAR(191) NOT NULL,
  `service`   VARCHAR(191) NOT NULL,
  `features`  JSON NOT NULL,
  `price`     INT,
  `message`   TEXT,
  `status`    ENUM('NEW','IN_REVIEW','APPROVED','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL DEFAULT 'NEW',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Request_userId_fkey` (`userId`),
  CONSTRAINT `Request_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Project` (
  `id`        VARCHAR(191) NOT NULL,
  `requestId` VARCHAR(191) NOT NULL,
  `title`     VARCHAR(191) NOT NULL,
  `startDate` DATETIME(3),
  `endDate`   DATETIME(3),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Project_requestId_key` (`requestId`),
  CONSTRAINT `Project_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `Request` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Stage` (
  `id`          VARCHAR(191) NOT NULL,
  `projectId`   VARCHAR(191) NOT NULL,
  `title`       VARCHAR(191) NOT NULL,
  `description` TEXT,
  `status`      ENUM('PENDING','IN_PROGRESS','COMPLETED') NOT NULL DEFAULT 'PENDING',
  `order`       INT NOT NULL,
  `completedAt` DATETIME(3),
  PRIMARY KEY (`id`),
  KEY `Stage_projectId_fkey` (`projectId`),
  CONSTRAINT `Stage_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Demo` (
  `id`          VARCHAR(191) NOT NULL,
  `title`       VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `service`     VARCHAR(191) NOT NULL,
  `imageUrl`    VARCHAR(191),
  `url`         VARCHAR(191),
  `tags`        JSON NOT NULL DEFAULT ('[]'),
  `isActive`    TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
