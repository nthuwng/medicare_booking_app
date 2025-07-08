/*
  Warnings:

  - The primary key for the `schedules` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `schedules` DROP PRIMARY KEY,
    MODIFY `schedule_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`schedule_id`);
