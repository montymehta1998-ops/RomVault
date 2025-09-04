import { useRoute } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function RomArticle() {
  const [, params] = useRoute("/roms/:slug");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  console.log("RomArticle component rendered, params:", params);

  useEffect(() => {
    if (!params?.slug) {
      console.log("No slug found in ROM article params");
      setError("No ROM article slug provided");
      setLoading(false);
      return;
    }

    console.log(`ROM article component mounted with slug: ${params.slug}`);
    
    const fetchRomArticle = async () => {
      try {
        setLoading(true);
        setError("");
        
        const url = `/roms/${params.slug}.html`;
        console.log(`Fetching ROM article from: ${url}`);
        
        const response = await fetch(url);
        console.log(`ROM article response - Status: ${response.status}, OK: ${response.ok}`);
        
        if (!response.ok) {
          throw new Error(`ROM article not found: ${response.status}`);
        }
        
        const html = await response.text();
        console.log(`ROM article content loaded, length: ${html.length} characters`);
        
        if (html.length === 0) {
          throw new Error("ROM article content is empty");
        }
        
        setContent(html);
      } catch (err) {
        console.error("Error loading ROM article:", err);
        setError(err instanceof Error ? err.message : "Failed to load ROM article");
      } finally {
        console.log("Setting ROM article loading to false");
        setLoading(false);
      }
    };

    fetchRomArticle();
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading ROM article...</p>
            </CardContent>
          </Card>
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
              <h1 className="text-2xl font-bold text-red-600 mb-4">ROM Article Not Found</h1>
              <p className="text-gray-600">{error}</p>
              <p className="text-sm text-gray-500 mt-2">
                The ROM article you're looking for might have been moved or deleted.
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