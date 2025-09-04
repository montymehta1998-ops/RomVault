import { useRoute } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Article() {
  const [, params] = useRoute("/articles/:slug");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!params?.slug) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/articles/${params.slug}.html`);
        
        if (!response.ok) {
          throw new Error(`Article not found: ${response.status}`);
        }
        
        const html = await response.text();
        setContent(html);
      } catch (err) {
        console.error("Error loading article:", err);
        setError(err instanceof Error ? err.message : "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Article Not Found</h1>
              <p className="text-gray-600">{error}</p>
              <p className="text-sm text-gray-500 mt-2">
                The article you're looking for might have been moved or deleted.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <div 
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}