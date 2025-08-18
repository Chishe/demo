-- AlterTable
ALTER TABLE "public"."user_logs" ADD COLUMN     "meta" JSONB,
ADD COLUMN     "type" TEXT;
