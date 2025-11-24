import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const statusStyles = {
  Aktif: "border-primary/40 bg-primary/10 text-primary",
  "Dalam Perencanaan": "border-border/80 bg-background text-muted-foreground",
  Selesai: "border-border/80 bg-background text-muted-foreground",
};

const ProgramCard = ({
  id,
  title,
  description,
  budget,
  beneficiaries,
  category,
  status,
  href,
  descriptionClamp = false,
  linkLabel = "Lihat Detail",
}) => {
  const detailPath = href ?? `/program/${id}`;

  return (
    <Card className="flex h-full flex-col border-border/70 bg-background/95 transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide">
          <span className="font-serif text-muted-foreground">{category}</span>
          <span
            className={cn(
              "border px-2 py-1 font-serif text-[11px] font-medium",
              statusStyles[status] ?? "border-border text-muted-foreground"
            )}
          >
            {status}
          </span>
        </div>
        <CardTitle className="font-serif text-xl text-foreground">{title}</CardTitle>
        <CardDescription
          className={cn(
            "font-serif text-sm text-muted-foreground",
            descriptionClamp && "line-clamp-3"
          )}
        >
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto space-y-3 font-serif text-sm text-muted-foreground">
        <div className="flex items-center justify-between border border-border/60 bg-background/70 px-3 py-2">
          <span>Anggaran</span>
          <span className="font-semibold text-foreground">{budget}</span>
        </div>
        <div className="flex items-center justify-between border border-border/60 bg-background/70 px-3 py-2">
          <span>Penerima Manfaat</span>
          <span className="font-semibold text-foreground">{beneficiaries}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="link"
          asChild
          className="px-0 font-serif text-sm text-primary"
        >
          <Link to={detailPath}>{linkLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProgramCard;

