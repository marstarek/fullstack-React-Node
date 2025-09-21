/*
  Warnings:

  - Made the column `phone` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `refreshToken` VARCHAR(191) NULL,
    MODIFY `phone` VARCHAR(191) NOT NULL;
