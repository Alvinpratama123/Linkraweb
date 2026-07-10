-- ============================================
-- MIGRATION: Create all tables
-- ============================================

-- Create User table
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'member',
    `position` VARCHAR(191) NULL,
    `profile` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT true,
    `credentialEmailSent` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    
    PRIMARY KEY (`id`),
    UNIQUE INDEX `User_email_key` (`email`),
    INDEX `User_email_idx` (`email`),
    INDEX `User_role_idx` (`role`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Notification table
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'system',
    `link` VARCHAR(191) NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `icon` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    
    PRIMARY KEY (`id`),
    INDEX `Notification_userId_idx` (`userId`),
    INDEX `Notification_isRead_idx` (`isRead`),
    INDEX `Notification_createdAt_idx` (`createdAt`),
    INDEX `Notification_userId_isRead_idx` (`userId`, `isRead`),
    
    CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create RegisterOtp table
CREATE TABLE `RegisterOtp` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `usedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NULL,
    
    PRIMARY KEY (`id`),
    INDEX `RegisterOtp_email_idx` (`email`),
    INDEX `RegisterOtp_code_idx` (`code`),
    INDEX `RegisterOtp_used_idx` (`used`),
    
    CONSTRAINT `RegisterOtp_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create PasswordResetToken table
CREATE TABLE `PasswordResetToken` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `usedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NULL,
    
    PRIMARY KEY (`id`),
    INDEX `PasswordResetToken_email_idx` (`email`),
    INDEX `PasswordResetToken_code_idx` (`code`),
    INDEX `PasswordResetToken_used_idx` (`used`),
    INDEX `PasswordResetToken_userId_idx` (`userId`),
    
    CONSTRAINT `PasswordResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Project table
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `repoLink` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `progress` INT NOT NULL DEFAULT 0,
    `decision` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `finished` BOOLEAN NOT NULL DEFAULT false,
    `imageDescription` VARCHAR(191) NULL,
    `imageDescription2` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `moduleUrl` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    
    PRIMARY KEY (`id`),
    UNIQUE INDEX `Project_name_userId_key` (`name`, `userId`),
    INDEX `Project_userId_idx` (`userId`),
    INDEX `Project_decision_idx` (`decision`),
    INDEX `Project_createdAt_idx` (`createdAt`),
    
    CONSTRAINT `Project_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create Attachment table
CREATE TABLE `Attachment` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `projectId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `description` VARCHAR(191) NULL,
    `isAdditionalDescription` BOOLEAN NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    
    PRIMARY KEY (`id`),
    INDEX `Attachment_projectId_idx` (`projectId`),
    INDEX `Attachment_status_idx` (`status`),
    
    CONSTRAINT `Attachment_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create RevisionReport table
CREATE TABLE `RevisionReport` (
    `id` VARCHAR(191) NOT NULL,
    `projectName` VARCHAR(191) NOT NULL,
    `issueType` VARCHAR(191) NOT NULL DEFAULT 'MODUL',
    `description` TEXT NULL,
    `progress` VARCHAR(191) NOT NULL DEFAULT 'BELUM_DILAKUKAN',
    `approval` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `approvalNote` TEXT NULL,
    `senderRole` VARCHAR(191) NOT NULL,
    `targetRole` VARCHAR(191) NOT NULL,
    `targetUserId` VARCHAR(191) NULL,
    `sentById` VARCHAR(191) NULL,
    `attachmentName` VARCHAR(191) NULL,
    `attachmentUrl` VARCHAR(191) NULL,
    `attachmentData` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    
    PRIMARY KEY (`id`),
    INDEX `RevisionReport_targetRole_idx` (`targetRole`),
    INDEX `RevisionReport_senderRole_idx` (`senderRole`),
    INDEX `RevisionReport_approval_idx` (`approval`),
    INDEX `RevisionReport_createdAt_idx` (`createdAt`),
    INDEX `RevisionReport_targetUserId_idx` (`targetUserId`),
    
    CONSTRAINT `RevisionReport_sentById_fkey` FOREIGN KEY (`sentById`) REFERENCES `User`(`id`) ON DELETE SET NULL,
    CONSTRAINT `RevisionReport_targetUserId_fkey` FOREIGN KEY (`targetUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create RevisionComment table
CREATE TABLE `RevisionComment` (
    `id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `reportId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    
    PRIMARY KEY (`id`),
    INDEX `RevisionComment_reportId_idx` (`reportId`),
    INDEX `RevisionComment_authorId_idx` (`authorId`),
    
    CONSTRAINT `RevisionComment_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
    CONSTRAINT `RevisionComment_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `RevisionReport`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================
-- Migration completed
-- ============================================