/*
  Warnings:

  - You are about to drop the column `paymentDate` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `paymentVendor` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `orderDetails` table. All the data in the column will be lost.
  - You are about to drop the column `priceEach` on the `orderDetails` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `orderDetails` table. All the data in the column will be lost.
  - You are about to drop the column `quantityOrdered` on the `orderDetails` table. All the data in the column will be lost.
  - You are about to drop the column `orderDate` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `requiredDate` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shippedDate` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shipperId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shippingPrice` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `quantityInStock` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `supplierId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_id]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[payment_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order_id` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_date` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_method` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `orderDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `orderDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_name` to the `orderDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_price_each` to the `orderDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_weight` to the `orderDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity_ordered` to the `orderDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyer_name` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `required_date` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_charge` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipper_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipper_name` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_address` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_name` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_phone` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_amount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_product_amount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_quantity` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_shipping_cost` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_shopping_amount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_weight` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplier_id` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `orderDetails` DROP FOREIGN KEY `orderDetails_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `orderDetails` DROP FOREIGN KEY `orderDetails_productId_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_shipperId_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_supplierId_fkey`;

-- AlterTable
ALTER TABLE `Payment` DROP COLUMN `paymentDate`,
    DROP COLUMN `paymentVendor`,
    ADD COLUMN `order_id` INTEGER NOT NULL,
    ADD COLUMN `payment_date` DATETIME(3) NOT NULL,
    ADD COLUMN `payment_method` VARCHAR(100) NOT NULL,
    ADD COLUMN `status` ENUM('PENDING', 'COMPLETED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `orderDetails` DROP COLUMN `orderId`,
    DROP COLUMN `priceEach`,
    DROP COLUMN `productId`,
    DROP COLUMN `quantityOrdered`,
    ADD COLUMN `order_id` INTEGER NOT NULL,
    ADD COLUMN `product_id` INTEGER NOT NULL,
    ADD COLUMN `product_name` VARCHAR(255) NOT NULL,
    ADD COLUMN `product_price_each` DOUBLE NOT NULL,
    ADD COLUMN `product_weight` INTEGER NOT NULL,
    ADD COLUMN `quantity_ordered` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `orderDate`,
    DROP COLUMN `requiredDate`,
    DROP COLUMN `shippedDate`,
    DROP COLUMN `shipperId`,
    DROP COLUMN `shippingPrice`,
    ADD COLUMN `buyer_name` VARCHAR(100) NOT NULL,
    ADD COLUMN `order_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `payment_id` INTEGER NOT NULL,
    ADD COLUMN `required_date` DATETIME(3) NOT NULL,
    ADD COLUMN `service_charge` DOUBLE NOT NULL,
    ADD COLUMN `shipped_date` DATETIME(3) NULL,
    ADD COLUMN `shipper_id` INTEGER NOT NULL,
    ADD COLUMN `shipper_name` VARCHAR(25) NOT NULL,
    ADD COLUMN `shipping_address` VARCHAR(500) NOT NULL,
    ADD COLUMN `shipping_name` VARCHAR(100) NOT NULL,
    ADD COLUMN `shipping_phone` VARCHAR(25) NOT NULL,
    ADD COLUMN `total_amount` DOUBLE NOT NULL,
    ADD COLUMN `total_product_amount` DOUBLE NOT NULL,
    ADD COLUMN `total_quantity` INTEGER NOT NULL,
    ADD COLUMN `total_shipping_cost` DOUBLE NOT NULL,
    ADD COLUMN `total_shopping_amount` DOUBLE NOT NULL,
    ADD COLUMN `total_weight` INTEGER NOT NULL,
    MODIFY `status` ENUM('Paid', 'In_Process', 'Shipped', 'Cancelled', 'Completed') NOT NULL DEFAULT 'In_Process';

-- AlterTable
ALTER TABLE `products` DROP COLUMN `categoryId`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `quantityInStock`,
    DROP COLUMN `supplierId`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `category_id` INTEGER NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `stock` INTEGER NOT NULL,
    ADD COLUMN `supplier_id` INTEGER NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `weight` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `createdAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `Payment_order_id_key` ON `Payment`(`order_id`);

-- CreateIndex
CREATE UNIQUE INDEX `orders_payment_id_key` ON `orders`(`payment_id`);

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_shipper_id_fkey` FOREIGN KEY (`shipper_id`) REFERENCES `shippers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderDetails` ADD CONSTRAINT `orderDetails_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderDetails` ADD CONSTRAINT `orderDetails_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
