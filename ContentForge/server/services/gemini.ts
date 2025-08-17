import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || "" 
});

export async function generateMarketingContent(
  language: string,
  contentType: string,
  tone: string,
  contentIdea: string
): Promise<string> {
  try {
    const prompt = `Generate a ${contentType} in a ${tone} tone, using the ${language} language, based on this idea: ${contentIdea}. 

Please make the content engaging, compelling, and appropriate for marketing purposes. The content should be well-structured, persuasive, and suitable for the specified content type and tone.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-05-20",
      contents: prompt,
    });

    const generatedText = response.text;
    
    if (!generatedText || generatedText.trim().length === 0) {
      throw new Error("Empty response from AI model");
    }

    return generatedText;
  } catch (error: any) {
    console.error("Error generating content:", error);
    throw new Error(`Failed to generate marketing content: ${error.message || "Unknown error"}`);
  }
}

export async function generateMarketingImage(
  contentType: string,
  tone: string,
  contentIdea: string
): Promise<string | null> {
  try {
    // Create images directory if it doesn't exist
    const imagesDir = path.join(process.cwd(), 'client', 'public', 'generated-images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Create a complete marketing poster prompt with text and graphics
    const posterPrompt = createMarketingPosterPrompt(contentType, tone, contentIdea);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [{ role: "user", parts: [{ text: posterPrompt }] }],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      return null;
    }

    const content = candidates[0].content;
    if (!content || !content.parts) {
      return null;
    }

    for (const part of content.parts) {
      if (part.inlineData && part.inlineData.data) {
        const timestamp = Date.now();
        const filename = `marketing-image-${timestamp}.png`;
        const imagePath = path.join(imagesDir, filename);
        
        const imageData = Buffer.from(part.inlineData.data, "base64");
        fs.writeFileSync(imagePath, imageData);
        
        console.log(`Marketing poster saved as ${imagePath}`);
        return `/generated-images/${filename}`;
      }
    }

    return null;
  } catch (error: any) {
    console.error("Error generating marketing poster:", error);
    return null;
  }
}

function createMarketingPosterPrompt(contentType: string, tone: string, contentIdea: string): string {
  // Create highly specific marketing poster prompts with text and graphics
  let composition = "";
  let visualElements = "";
  let colorPalette = "";
  let designStyle = "";
  
  switch (contentType.toLowerCase()) {
    case "social media post":
      composition = "Square format (1080x1080px) marketing poster with bold headline text, brand logo space, and engaging visual composition";
      visualElements = "Eye-catching headline text, brand graphics, call-to-action buttons, social media icons, trendy design patterns, marketing copy";
      colorPalette = "Vibrant, Instagram-worthy colors with high saturation and contrast for maximum engagement";
      designStyle = "Modern social media marketing poster with flat design elements, bold typography, and contemporary styling";
      break;
    case "poster headline":
      composition = "Vertical marketing poster layout (24x36 inches ratio) with large headline text, subheadings, and dramatic visual hierarchy";
      visualElements = "Large bold headline text, compelling subheadings, marketing copy, brand logos, call-to-action text, powerful imagery";
      colorPalette = "High-contrast color scheme with bold, impactful color combinations designed for visibility and impact";
      designStyle = "Professional marketing poster design with cinematic styling, bold typography, and commercial visual impact";
      break;
    case "ad copy":
      composition = "Banner format (1200x628) marketing advertisement with product focus, headline text, and call-to-action area";
      visualElements = "Product showcase imagery, benefit bullet points, persuasive headline text, call-to-action buttons, brand logos";
      colorPalette = "Brand-focused colors that build trust and encourage action with conversion-optimized color psychology";
      designStyle = "Clean advertising poster layout with conversion-optimized design elements and professional marketing appeal";
      break;
    case "email newsletter":
      composition = "Email header format (600x200px) marketing banner with newsletter branding, headline text, and professional layout";
      visualElements = "Newsletter title text, company branding, trustworthy imagery, professional graphics, contact information";
      colorPalette = "Email-safe colors with professional, readable color scheme optimized for inbox visibility";
      designStyle = "Corporate newsletter marketing design with clean, professional aesthetics and business appeal";
      break;
    default:
      composition = "Professional marketing poster format with balanced visual layout, headline text, and brand elements";
      visualElements = "Engaging marketing graphics with commercial appeal, headline text, brand logos, call-to-action elements";
      colorPalette = "Modern marketing color palette designed for commercial impact";
      designStyle = "Contemporary marketing poster design with professional commercial appeal";
  }
  
  // Tone-specific design mood and styling
  let designMood = "";
  let styleDetails = "";
  switch (tone.toLowerCase()) {
    case "professional":
      designMood = "Corporate sophistication with premium business appeal";
      styleDetails = "Clean minimalist layout, sophisticated typography, executive-level aesthetics";
      break;
    case "casual":
      designMood = "Friendly and approachable with relaxed atmosphere";
      styleDetails = "Warm, inviting design with accessible styling and comfortable feel";
      break;
    case "witty":
      designMood = "Creative and engaging with clever visual elements";
      styleDetails = "Playful graphics, creative compositions, smart visual humor";
      break;
    case "inspirational":
      designMood = "Uplifting and motivational with aspirational energy";
      styleDetails = "Inspiring imagery, positive visual elements, achievement-focused design";
      break;
    case "formal":
      designMood = "Traditional elegance with refined sophistication";
      styleDetails = "Classic design principles, conservative styling, timeless aesthetics";
      break;
    default:
      designMood = "Balanced professional appeal";
      styleDetails = "Versatile design with broad commercial appeal";
  }
  
  // Create comprehensive marketing poster prompt
  const detailedPrompt = `Create a complete marketing poster for: "${contentIdea}"

POSTER TYPE: ${contentType.toLowerCase()} marketing poster with full text and graphics

COMPOSITION & FORMAT:
${composition}

VISUAL ELEMENTS & TEXT:
${visualElements}
- Include compelling headline text related to "${contentIdea}"
- Add marketing copy and persuasive text elements
- Include brand elements and marketing graphics
- Add call-to-action text and buttons where appropriate

COLOR SCHEME:
${colorPalette}

DESIGN STYLE:
${designStyle}

MOOD & TONE:
${designMood}
${styleDetails}

MARKETING POSTER REQUIREMENTS:
- Complete marketing poster with integrated text and graphics
- Eye-catching headline text that relates directly to "${contentIdea}"
- Professional marketing copy and persuasive messaging
- Brand-ready design with commercial marketing appeal
- Call-to-action elements and marketing graphics
- Industry-standard marketing poster layout and typography
- Text should be clear, readable, and professionally designed
- Include marketing elements like logos, badges, or promotional graphics
- Ready-to-use marketing poster suitable for campaigns

TECHNICAL SPECIFICATIONS:
- High resolution marketing poster quality
- Professional typography and text integration
- Marketing industry standard composition with text hierarchy
- Commercial-grade poster design with full marketing elements
- Complete poster design including all text and graphic elements

CREATE A COMPLETE MARKETING POSTER, NOT JUST AN IMAGE - include all text, headlines, marketing copy, and graphic elements integrated into the design.`;

  return detailedPrompt;
}
