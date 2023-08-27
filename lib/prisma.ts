import { PrismaClient } from "../prisma/generated/pgsql_client";
import { PrismaClient as PrismaMongoClient } from "../prisma/generated/mongo_client";

declare global {
  var prisma: PrismaClient | undefined;
  var prismaMongo: PrismaMongoClient | undefined;
}

const prisma = global.prisma || new PrismaClient();
const prismaMongo = global.prismaMongo || new PrismaMongoClient();

if (process.env.NODE_ENV === "development") global.prisma = prisma;
if (process.env.NODE_ENV === "development") global.prismaMongo = prismaMongo;

export { prismaMongo, prisma };
