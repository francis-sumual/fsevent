echo "Resetting Prisma database..."

# Drop the database schema
echo "Dropping database schema..."
npx prisma migrate reset --force

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push the schema to the database
echo "Pushing schema to database..."
npx prisma db push

# Seed the database
echo "Seeding the database..."
curl -X POST http://localhost:3000/api/seed

echo "Database reset complete!"

