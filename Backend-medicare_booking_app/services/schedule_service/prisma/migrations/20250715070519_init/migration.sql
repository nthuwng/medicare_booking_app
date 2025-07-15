-- CreateTable
CREATE TABLE `schedules` (
    `schedule_id` VARCHAR(191) NOT NULL,
    `doctor_profile_id` VARCHAR(191) NOT NULL,
    `clinic_id` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `is_available` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`schedule_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `time_slots` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schedule_time_slots` (
    `schedule_id` VARCHAR(191) NOT NULL,
    `time_slot_id` INTEGER NOT NULL,
    `maxBooking` INTEGER NOT NULL DEFAULT 3,
    `currentBooking` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`schedule_id`, `time_slot_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `schedule_time_slots` ADD CONSTRAINT `schedule_time_slots_schedule_id_fkey` FOREIGN KEY (`schedule_id`) REFERENCES `schedules`(`schedule_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule_time_slots` ADD CONSTRAINT `schedule_time_slots_time_slot_id_fkey` FOREIGN KEY (`time_slot_id`) REFERENCES `time_slots`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
