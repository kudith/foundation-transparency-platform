import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User } from "lucide-react";

const ProgramCard = ({ event }) => {
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Get event status
  const getEventStatus = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      return "past";
    } else if (eventDate.toDateString() === today.toDateString()) {
      return "today";
    } else {
      return "upcoming";
    }
  };

  const status = getEventStatus(event.date);

  // Get first image or placeholder
  const imageUrl =
    event.images && event.images.length > 0
      ? event.images[0].url
      : "https://placehold.co/600x400/e2e8f0/64748b?text=Event";

  return (
    <Link to={`/program/${event._id}`} className="group">
      <Card className="h-full overflow-hidden border-border/70 bg-background/95 transition-all hover:border-primary/50 hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={event.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Overlay badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Badge
              variant="outline"
              className="bg-background/90 backdrop-blur-sm font-serif text-xs"
            >
              {event.community || event.communityName}
            </Badge>
            {status === "today" && (
              <Badge
                variant="default"
                className="bg-primary/90 backdrop-blur-sm font-serif text-xs"
              >
                Hari Ini
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <CardHeader>
          <CardTitle className="font-serif text-xl line-clamp-2 group-hover:text-primary transition-colors">
            {event.name}
          </CardTitle>
          {event.description && (
            <CardDescription className="font-serif text-sm line-clamp-2">
              {event.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span className="font-serif">{formatDate(event.date)}</span>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="font-serif line-clamp-1">{event.location}</span>
            </div>
          )}

          {/* Tutor */}
          {event.tutor && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4 shrink-0" />
              <span className="font-serif">
                {event.tutor.name}{" "}
                <span className="text-xs">({event.tutor.type})</span>
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

ProgramCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    date: PropTypes.string.isRequired,
    location: PropTypes.string,
    community: PropTypes.string,
    communityName: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        publicId: PropTypes.string,
      })
    ),
    tutor: PropTypes.shape({
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      userID: PropTypes.string,
    }),
  }).isRequired,
};

export default ProgramCard;
