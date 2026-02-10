-- Create enums
CREATE TYPE "VehicleStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD', 'INACTIVE');
CREATE TYPE "ClientType" AS ENUM ('PF', 'PJ');
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'FINANCING', 'CONSORTIUM', 'CARD', 'PIX', 'BOLETO', 'OTHER');
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SELLER');

-- Create tables
CREATE TABLE "vehicles" (
  "id" TEXT PRIMARY KEY,
  "plate" TEXT NOT NULL UNIQUE,
  "renavam" TEXT,
  "chassis" TEXT,
  "brand" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "version" TEXT NOT NULL,
  "yearFab" INTEGER NOT NULL,
  "yearModel" INTEGER NOT NULL,
  "color" TEXT NOT NULL,
  "fuel" TEXT NOT NULL,
  "gear" TEXT NOT NULL,
  "km" INTEGER NOT NULL,
  "salePrice" DECIMAL(12,2) NOT NULL,
  "costPrice" DECIMAL(12,2),
  "status" "VehicleStatus" NOT NULL DEFAULT 'AVAILABLE',
  "observations" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "clients" (
  "id" TEXT PRIMARY KEY,
  "type" "ClientType" NOT NULL,
  "name" TEXT NOT NULL,
  "cpfCnpj" TEXT NOT NULL UNIQUE,
  "rgIe" TEXT,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "cep" TEXT NOT NULL,
  "street" TEXT NOT NULL,
  "number" TEXT NOT NULL,
  "neighborhood" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "observations" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "users" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'SELLER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "sales" (
  "id" TEXT PRIMARY KEY,
  "clientId" TEXT NOT NULL,
  "vehicleId" TEXT NOT NULL,
  "saleDate" TIMESTAMP(3) NOT NULL,
  "listPrice" DECIMAL(12,2) NOT NULL,
  "discountValue" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "finalValue" DECIMAL(12,2) NOT NULL,
  "paymentMethod" "PaymentMethod" NOT NULL,
  "downPayment" DECIMAL(12,2),
  "installmentsCount" INTEGER,
  "installmentsValue" DECIMAL(12,2),
  "observations" TEXT,
  "sellerId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sales_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "sales_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "sales_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
