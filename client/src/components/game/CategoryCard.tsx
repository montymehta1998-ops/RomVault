import { Link } from "wouter";
import type { CategoryData } from "@shared/schema";

interface CategoryCardProps {
  category: CategoryData;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link 
      to={`/category/${category.id}`}
      className="game-card group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 block"
      data-testid={`card-category-${category.id}`}
    >
      <img 
        src={category.image}
        alt={`${category.name} console`}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
        <p className="text-muted-foreground text-sm mb-3">{category.description}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span data-testid={`text-game-count-${category.id}`}>
            {category.gameCount.toLocaleString()} games
          </span>
          <span className="text-primary">Explore →</span>
        </div>
      </div>
    </Link>
  );
}
