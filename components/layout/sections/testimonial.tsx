"use client";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";
import AutoplayPlugin from "embla-carousel-autoplay";

interface ReviewProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
  rating: number;
}

const reviewList: ReviewProps[] = [
  {
    image: "/shadcn.png",
    name: "Dr. Sarah Johnson",
    userName: "Medical Practitioner",
    comment: "This AI-powered medical report analyzer has significantly improved our diagnostic efficiency. The nutrition insights are particularly valuable for patient consultations.",
    rating: 5.0,
  },
  {
    image: "/shadcn.png",
    name: "Emma Rodriguez",
    userName: "Clinical Nutritionist",
    comment: "The nutrition label analysis feature is a game-changer. It helps me provide more accurate dietary recommendations to my patients instantly.",
    rating: 4.8,
  },
  {
    image: "/shadcn.png",
    name: "Michael Chen",
    userName: "Patient",
    comment: "Understanding my medical reports has never been easier. The AI explains everything in simple terms and helps me track my nutritional intake effectively.",
    rating: 4.9,
  },
  {
    image: "/shadcn.png",
    name: "Dr. James Wilson",
    userName: "Healthcare Specialist",
    comment: "The medicine analyzer feature provides comprehensive information about drug interactions and dosage recommendations. An invaluable tool for healthcare professionals.",
    rating: 5.0,
  },
  {
    image: "/shadcn.png",
    name: "Dr. Lisa Kumar",
    userName: "Medical Researcher",
    comment: "The integration of RAG with Pinecone delivers remarkably accurate and context-aware medical insights. A powerful tool for research and clinical practice.",
    rating: 5.0,
  },
  {
    image: "/shadcn.png",
    name: "Robert Martinez",
    userName: "Registered Dietitian",
    comment: "The food nutrition analyzer helps me create personalized meal plans quickly. The image recognition of nutrition labels is impressively accurate.",
    rating: 4.9,
  },
];

export const TestimonialSection = () => {
  const plugin = useRef(
    AutoplayPlugin({
      delay: 4000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  return (
    <section id="testimonials" className="container py-24 sm:py-32 px-6 sm:px-12 lg:px-24 bg-gradient-to-b from-background to-muted/50">
      <div className="text-center mb-12">
        <h2 className="text-lg text-primary text-center mb-3 tracking-wider font-semibold">
          Success Stories
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
          Trusted by Healthcare Professionals
        </h2>
        
        <p className="text-muted-foreground max-w-2xl mx-auto">
          See how our AI-powered medical analysis and nutrition assistant is transforming healthcare delivery and patient care.
        </p>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="relative w-[90%] lg:max-w-screen-xl mx-auto"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {reviewList.map((review) => (
            <CarouselItem
              key={review.name}
              className="md:basis-1/2 lg:basis-1/3 pl-2 md:pl-4"
            >
              <Card className="bg-card border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg h-[420px] flex flex-col">
                <CardContent className="pt-6 flex-grow">
                  <div className="flex gap-1 pb-6">
                    {[...Array(Math.floor(review.rating))].map((_, index) => (
                      <Star
                        key={index}
                        className="size-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed line-clamp-6">
                    {`"${review.comment}"`}
                  </p>
                </CardContent>

                <CardHeader className="mt-auto">
                  <div className="flex flex-row items-center gap-4">
                    <Avatar className="border-2 border-primary/20">
                      <AvatarImage
                        src={review.image}
                        alt={review.name}
                      />
                      <AvatarFallback className="bg-primary/5">
                        {review.name[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <CardTitle className="text-lg font-semibold">
                        {review.name}
                      </CardTitle>
                      <CardDescription className="text-primary/80">
                        {review.userName}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12 hover:bg-primary hover:text-white transition-colors duration-200" />
        <CarouselNext className="hidden md:flex -right-12 hover:bg-primary hover:text-white transition-colors duration-200" />
      </Carousel>
    </section>
  );
};