// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Tworzenie instancji PrismaClient
const prisma = new PrismaClient();

// Eksportowanie instancji
export { prisma };
