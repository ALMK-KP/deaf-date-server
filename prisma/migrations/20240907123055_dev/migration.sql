-- CreateTable
CREATE TABLE "Track" (
    "id" SERIAL NOT NULL,
    "ytId" TEXT NOT NULL,
    "ytLink" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "customTitle" TEXT NOT NULL,
    "audio" TEXT NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);
