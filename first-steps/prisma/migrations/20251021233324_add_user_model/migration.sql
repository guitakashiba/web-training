/*
  Warnings:

  - Added the required column `userId` to the `Hero` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hero" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "power" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Hero_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Hero" ("age", "id", "name", "power") SELECT "age", "id", "name", "power" FROM "Hero";
DROP TABLE "Hero";
ALTER TABLE "new_Hero" RENAME TO "Hero";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
