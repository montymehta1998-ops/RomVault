import * as fs from 'fs';
import * as path from 'path';

// Define the article data structure
interface ArticleData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  author: string;
}

// Function to convert WordPress content to clean HTML
function convertWordPressToHTML(content: string): string {
  // Remove WordPress block comments
  let cleanContent = content.replace(/<!-- wp:[\s\S]*? -->/g, '');
  cleanContent = cleanContent.replace(/<!-- \/wp:[\s\S]*? -->/g, '');
  
  // Remove extra newlines
  cleanContent = cleanContent.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Trim whitespace
  cleanContent = cleanContent.trim();
  
  return cleanContent;
}

// Function to create a slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Function to extract excerpt from content
function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove HTML tags for excerpt
  const plainText = content.replace(/<[^>]*>/g, '');
  // Take first maxLength characters and add ellipsis if needed
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength).trim() + '...' 
    : plainText;
}

// Process all article files
function processArticles(): ArticleData[] {
  const articlesDir = path.join(__dirname, '..', 'client');
  const articleFiles = fs.readdirSync(articlesDir).filter(file => 
    file.startsWith('Article') && file.endsWith('.txt')
  );
  
  const articles: ArticleData[] = [];
  
  for (const file of articleFiles) {
    const filePath = path.join(articlesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Parse the article content
    const lines = content.split('\n');
    
    // Extract title (first line)
    const titleLine = lines.find(line => line.startsWith('Title:'));
    const title = titleLine ? titleLine.replace('Title: ', '').trim() : 'Untitled';
    
    // Extract URL (third line)
    const urlLine = lines.find(line => line.startsWith('URL Must be:'));
    const url = urlLine ? urlLine.replace('URL Must be: ', '').trim() : '';
    
    // Extract slug from URL
    const slug = url ? url.split('/').filter(Boolean).pop() || createSlug(title) : createSlug(title);
    
    // Find content section
    const contentStartIndex = lines.findIndex(line => line.startsWith('Content('));
    const contentLines = contentStartIndex >= 0 ? lines.slice(contentStartIndex + 1) : [];
    const rawContent = contentLines.join('\n');
    
    // Convert to clean HTML
    const cleanContent = convertWordPressToHTML(rawContent);
    
    // Create excerpt
    const excerpt = extractExcerpt(cleanContent);
    
    // Create article object
    const article: ArticleData = {
      id: slug,
      title,
      slug,
      content: cleanContent,
      excerpt,
      date: new Date().toISOString(),
      author: 'Emulator Games'
    };
    
    articles.push(article);
  }
  
  return articles;
}

// Save articles to JSON file
function saveArticles(articles: ArticleData[]): void {
  const outputPath = path.join(__dirname, '..', 'data', 'articles.json');
  fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2));
  console.log(`Processed ${articles.length} articles and saved to ${outputPath}`);
}

// Run the processing
const articles = processArticles();
saveArticles(articles);

export { ArticleData, processArticles };