-- CreateTable
CREATE TABLE "CustomSet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CustomTopic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "setId" TEXT NOT NULL,
    CONSTRAINT "CustomTopic_setId_fkey" FOREIGN KEY ("setId") REFERENCES "CustomSet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CustomTopic_setId_orderIndex_idx" ON "CustomTopic"("setId", "orderIndex");
