const { PrismaClient } = require('@prisma/client');

// Reuse a single client across hot-reloads in dev to avoid exhausting
// PostgreSQL connections.
const prisma = global.__montmellPrisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__montmellPrisma = prisma;
}

module.exports = prisma;
