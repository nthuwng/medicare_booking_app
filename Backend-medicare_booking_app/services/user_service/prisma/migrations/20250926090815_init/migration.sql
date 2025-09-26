-- AlterTable
ALTER TABLE `patients` MODIFY `full_name` VARCHAR(255) NULL,
    MODIFY `phone` VARCHAR(20) NULL,
    MODIFY `gender` ENUM('Male', 'Female', 'Other') NULL;
