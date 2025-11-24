import { Link, useNavigate } from "react-router-dom";
import Header from "../components/home/Header";
import Footer from "../components/home/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ErrorPage = ({ code = "404", title, message, showBackButton = true }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="min-h-screen grow flex items-center justify-center bg-muted/20 py-32">
        <div className="container mx-auto px-6 max-w-2xl flex justify-center">
          <Card className="w-full border-border/70 bg-background/95">
            <CardHeader>
              <CardTitle className="font-serif text-7xl md:text-8xl font-bold text-foreground text-center mb-2">
                {code}
              </CardTitle>
              <CardDescription className="font-serif text-2xl md:text-3xl font-bold text-center text-foreground mb-2">
                {title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-serif text-muted-foreground leading-relaxed text-center mb-8">
                {message}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {showBackButton && (
                  <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="font-serif text-sm px-6 py-3"
                  >
                    ← Kembali
                  </Button>
                )}
                <Button asChild className="font-serif text-sm px-6 py-3">
                  <Link to="/">Ke Beranda</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ErrorPage;
