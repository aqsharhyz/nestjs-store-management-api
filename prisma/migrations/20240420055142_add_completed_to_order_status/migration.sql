/*
  Warnings:

  - You are about to drop the column `userId` on the `orders` table. All the data in the column will be lost.
  - Added the required column `username` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_userId_fkey`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `userId`,
    ADD COLUMN `username` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('In_Process', 'Shipped', 'Cancelled', 'Completed') NOT NULL DEFAULT 'In_Process';

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
