/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `shippers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `shippers_name_key` ON `shippers`(`name`);
