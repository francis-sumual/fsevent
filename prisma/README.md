# Prisma Database Setup

This project uses Prisma with PostgreSQL for database management.

## Setup Instructions

1. Create a PostgreSQL database
2. Copy `.env.example` to `.env` and update the `DATABASE_URL` with your database credentials
3. Run the following commands to set up your database:

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Create database tables
npm run prisma:migrate:dev

