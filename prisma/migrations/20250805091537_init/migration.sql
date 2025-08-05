-- CreateTable
CREATE TABLE "public"."Log" (
    "id" SERIAL NOT NULL,
    "partNumber" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "ct" TEXT NOT NULL,
    "standard" TEXT NOT NULL,
    "limitHigh" INTEGER NOT NULL,
    "limitLow" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Thresholds" (
    "id" SERIAL NOT NULL,
    "partNumber" TEXT NOT NULL,
    "standard" TEXT NOT NULL,
    "limitHigh" INTEGER NOT NULL,
    "limitLow" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Thresholds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Log_partNumber_key" ON "public"."Log"("partNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Thresholds_partNumber_key" ON "public"."Thresholds"("partNumber");
