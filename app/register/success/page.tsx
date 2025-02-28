import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegistrationSuccessPage() {
  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle>Registration Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your registration has been confirmed. We look forward to seeing you at the gathering.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/register">Register for Another Gathering</Link>
          </Button>
        </CardFooter>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/registrations">Lihat Pendaftaran</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
