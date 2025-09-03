"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processArticles = processArticles;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Function to convert WordPress content to clean HTML
function convertWordPressToHTML(content) {
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
function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
// Function to extract excerpt from content
function extractExcerpt(content, maxLength = 160) {
    // Remove HTML tags for excerpt
    const plainText = content.replace(/<[^>]*>/g, '');
    // Take first maxLength characters and add ellipsis if needed
    return plainText.length > maxLength
        ? plainText.substring(0, maxLength).trim() + '...'
        : plainText;
}
// Process all article files
function processArticles() {
    const articlesDir = path.join(__dirname, '..', 'client');
    const articleFiles = fs.readdirSync(articlesDir).filter(file => file.startsWith('Article') && file.endsWith('.txt'));
    const articles = [];
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
        const article = {
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
function saveArticles(articles) {
    const outputPath = path.join(__dirname, '..', 'data', 'articles.json');
    fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2));
    console.log(`Processed ${articles.length} articles and saved to ${outputPath}`);
}
// Run the processing
const articles = processArticles();
saveArticles(articles);
