/*
  Warnings:
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - Added the required column `person_id` to the `User` table without a default value. This is not possible if the table is not empty.
*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_password_key";

-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "parental" DROP NOT NULL,
ALTER COLUMN "date_birth" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "telephone" DROP NOT NULL,
ALTER COLUMN "year_enter" DROP NOT NULL,
ALTER COLUMN "avatar" DROP NOT NULL,
ALTER COLUMN "about" DROP NOT NULL,
ALTER COLUMN "date_fill_form" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "password",
ADD COLUMN  "person_id" INTEGER NOT NULL;
