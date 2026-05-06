import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  imageSrc: string;
  mobileImageSrc?: string;
  imageAlt: string;
  title: string;
  description?: string;
  eyebrow?: string;
  eyebrowIcon?: ElementType;
  headerChildren?: ReactNode;
  footerChildren?: ReactNode;
  sectionClassName?: string;
  imageClassName?: string;
  containerClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

const PageHero = ({
  imageSrc,
  mobileImageSrc,
  imageAlt,
  title,
  description,
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  headerChildren,
  footerChildren,
  sectionClassName,
  imageClassName,
  containerClassName,
  contentClassName,
  titleClassName,
  descriptionClassName,
}: PageHeroProps) => {
  const hasBelowTitle = Boolean(description || footerChildren);

  return (
    <section
      className={cn(
        "relative h-[50vh] min-h-[400px] flex items-end overflow-hidden",
        sectionClassName,
      )}
    >
      <picture className="absolute inset-0 w-full h-full">
        {mobileImageSrc && <source media="(max-width: 768px)" srcSet={mobileImageSrc} />}
        <img
          src={imageSrc}
          alt={imageAlt}
          className={cn("w-full h-full object-cover", imageClassName)}
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-hero" />

      <div className={cn("relative z-10 container mx-auto px-4 lg:px-8 pb-12", containerClassName)}>
        <div
          className={cn("max-w-4xl", contentClassName)}
        >

          {eyebrow && (
            <div className="flex items-center gap-3 mb-2">
              {EyebrowIcon && <EyebrowIcon className="w-5 h-5 text-accent" />}
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">
                {eyebrow}
              </span>
            </div>
          )}

          {headerChildren}

          <h1
            className={cn(
              "text-4xl lg:text-5xl font-bold text-primary-foreground",
              hasBelowTitle && "mb-4",
              titleClassName,
            )}
          >
            {title}
          </h1>

          {description && (
            <p
              className={cn(
                "text-lg text-primary-foreground/85 max-w-2xl leading-relaxed",
                descriptionClassName,
              )}
            >
              {description}
            </p>
          )}

          {footerChildren}
        </div>

      </div>
    </section>
  );
};

export default PageHero;
