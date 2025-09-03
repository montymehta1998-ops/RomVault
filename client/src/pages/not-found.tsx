import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Search } from "lucide-react";

interface ArticleData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  author: string;
}

export default function NotFound() {
  const [location, setLocation] = useLocation();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkForArticle = async () => {
      // Extract slug from URL path
      const pathParts = location.split('/').filter(Boolean);
      
      // Check if this might be an article URL
      if (pathParts.length > 0) {
        const slug = pathParts[pathParts.length - 1];
        
        try {
          const response = await fetch(`/api/articles/${slug}`);
          if (response.ok) {
            const data = await response.json();
            setArticle(data);
          }
        } catch (error) {
          console.error("Error checking for article:", error);
        }
      }
      
      setLoading(false);
    };

    checkForArticle();
  }, [location]);

  // If we found an article, redirect to the article page
  useEffect(() => {
    if (article) {
      setLocation(`/articles/${article.slug}`);
    }
  }, [article, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <Search className="h-8 w-8 text-blue-500 animate-spin" />
              <h1 className="text-2xl font-bold text-gray-900">Checking...</h1>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Looking for content that might match your request...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
