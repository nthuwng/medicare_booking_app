-- AlterTable
ALTER TABLE `schedule_time_slots` ADD COLUMN `status` ENUM('OPEN', 'EXPIRED') NOT NULL DEFAULT 'OPEN';
