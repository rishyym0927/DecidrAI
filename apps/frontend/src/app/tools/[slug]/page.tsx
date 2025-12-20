/**
 * Tool Detail Page
 * Server component with dynamic metadata generation
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ToolDetailClient from './ToolDetailClient';
import { generateToolMetadata, generateToolSchema, SITE_CONFIG } from '@/lib/seo.config';

// API helper to fetch tool data
async function getToolBySlug(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const response = await fetch(`${apiUrl}/tools/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data?.data || null;
  } catch (error) {
    console.error('Failed to fetch tool:', error);
    return null;
  }
}

// API helper to fetch related tools
async function getRelatedTools(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const response = await fetch(`${apiUrl}/tools/${slug}/related`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error('Failed to fetch related tools:', error);
    return [];
  }
}

// Generate dynamic metadata based on tool data
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  
  if (!tool) {
    return {
      title: 'Tool Not Found',
      description: 'The requested tool could not be found.',
    };
  }
  
  return generateToolMetadata(tool);
}

// Page component
export default async function ToolDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // Fetch data server-side
  const [tool, relatedTools] = await Promise.all([
    getToolBySlug(slug),
    getRelatedTools(slug),
  ]);
  
  if (!tool) {
    notFound();
  }
  
  // Generate JSON-LD for this specific tool
  const toolSchema = generateToolSchema(tool);
  
  return (
    <>
      {/* Tool-specific JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(toolSchema),
        }}
      />
      
      {/* Client-side interactive component */}
      <ToolDetailClient tool={tool} relatedTools={relatedTools} />
    </>
  );
}
