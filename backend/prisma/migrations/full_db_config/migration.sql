-- CreateEnum
CREATE TYPE "Role" AS ENUM ('HOLOVA', 'PYSAR', 'SKARBNYK', 'HR_HEAD', 'RECHNYK', 'KOMIRNYK', 'RAK_MEMBER', 'BRATCHYK');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NEWCOMER', 'MALIUK', 'BRATCHYK', 'POSHANOVANYI', 'EX_BRATCHYK');

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parental" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "date_birth" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "parent_id" INTEGER,
    "faculty_id" INTEGER NOT NULL,
    "specialty_id" INTEGER NOT NULL,
    "year_enter" INTEGER NOT NULL,
    "avatar" BYTEA NOT NULL,
    "about" TEXT NOT NULL,
    "telegram" TEXT,
    "facebook" TEXT,
    "date_fill_form" TIMESTAMP(3) NOT NULL,
    "date_vysviata" TIMESTAMP(3),
    "date_poshanuvannia" TIMESTAMP(3),
    "date_exclusion" TIMESTAMP(3),
    "role" "Role",

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialty" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Generation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Generation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date_start" TIMESTAMP(3) NOT NULL,
    "date_end" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "photo" BYTEA NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "person_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "hours" INTEGER NOT NULL,
    "position" "Role" NOT NULL,
    "contribution" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("person_id","event_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_email_key" ON "Person"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Person_telephone_key" ON "Person"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "Person_telegram_key" ON "Person"("telegram");

-- CreateIndex
CREATE UNIQUE INDEX "Person_facebook_key" ON "Person"("facebook");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_name_key" ON "Faculty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_name_key" ON "Specialty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Generation_name_key" ON "Generation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_password_key" ON "User"("password");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "Faculty"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "Specialty"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
