/*
  Warnings:

  - Added the required column `generation_id` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "generation_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_generation_id_fkey" FOREIGN KEY ("generation_id") REFERENCES "Generation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
