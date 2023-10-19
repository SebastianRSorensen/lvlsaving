import { PrismaClient } from '@prisma/client'

// Kopiert inn og er bare en initialisering av prisma
// slikt av vi kan accesse db fra alle steder i koden
declare global {
    var cachedPrisma: PrismaClient
}

let prisma: PrismaClient
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
} else {
    if (!global.cachedPrisma) {
        global.cachedPrisma = new PrismaClient()
    }
    prisma = global.cachedPrisma
}

export const db = prisma