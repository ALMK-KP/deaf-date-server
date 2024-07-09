-- CreateTable
CREATE TABLE "Track" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ytId" TEXT NOT NULL,
    "ytLink" TEXT NOT NULL,
    "playlistId" TEXT,
    "thumbnail" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "customTitle" TEXT NOT NULL,
    "audio" TEXT NOT NULL
);
