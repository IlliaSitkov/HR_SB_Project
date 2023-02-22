/*
  Warnings:

  - Changed the type of `position` on the `Activity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "position",
ADD COLUMN     "position" TEXT NOT NULL;
