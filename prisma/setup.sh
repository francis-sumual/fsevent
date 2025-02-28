# This script helps set up the Prisma database

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Check if the database exists and is accessible
echo "Checking database connection..."
npx prisma db pull --force

if [ $? -eq 0 ]; then
  echo "Database connection successful!"
  
  # Create initial migration
  echo "Creating initial migration..."
  npx prisma migrate dev --name init
else
  echo "Database connection failed. Please check your DATABASE_URL in .env"
  exit 1
fi

echo "Setup complete! You can now run 'npx prisma studio' to view your database."

