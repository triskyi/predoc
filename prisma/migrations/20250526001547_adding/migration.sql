/*
  Warnings:

  - You are about to drop the column `region` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "region",
ADD COLUMN     "country" TEXT,
ADD COLUMN     "district" TEXT;
