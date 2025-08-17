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

    // Create a marketing-focused image prompt
    const imagePrompt = createImagePrompt(contentType, tone, contentIdea);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [{ role: "user", parts: [{ text: imagePrompt }] }],
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
        
        console.log(`Marketing image saved as ${imagePath}`);
        return `/generated-images/${filename}`;
      }
    }

    return null;
  } catch (error: any) {
    console.error("Error generating marketing image:", error);
    return null;
  }
}

function createImagePrompt(contentType: string, tone: string, contentIdea: string): string {
  // Create highly specific marketing prompts with detailed visual specifications
  let composition = "";
  let visualElements = "";
  let colorPalette = "";
  let designStyle = "";
  
  switch (contentType.toLowerCase()) {
    case "social media post":
      composition = "Square format (1080x1080px) with centered focal point and dynamic composition";
      visualElements = "Bold graphic elements, clean typography space, eye-catching visuals, trendy design patterns";
      colorPalette = "Vibrant, Instagram-worthy colors with high saturation and contrast";
      designStyle = "Modern social media aesthetic with flat design elements and contemporary styling";
      break;
    case "poster headline":
      composition = "Vertical poster layout (24x36 inches ratio) with dramatic visual hierarchy";
      visualElements = "Large text space for headlines, powerful imagery, attention-grabbing graphics";
      colorPalette = "High-contrast color scheme with bold, impactful color combinations";
      designStyle = "Professional poster design with cinematic styling and bold visual impact";
      break;
    case "ad copy":
      composition = "Banner format (728x90 or 1200x628) with product focus and call-to-action space";
      visualElements = "Product showcase area, benefit highlights, persuasive visual cues";
      colorPalette = "Brand-focused colors that build trust and encourage action";
      designStyle = "Clean advertising layout with conversion-optimized design elements";
      break;
    case "email newsletter":
      composition = "Email header format (600x200px) with professional newsletter layout";
      visualElements = "Clean branding space, trustworthy imagery, professional graphics";
      colorPalette = "Email-safe colors with professional, readable color scheme";
      designStyle = "Corporate newsletter design with clean, professional aesthetics";
      break;
    default:
      composition = "Professional marketing format with balanced visual layout";
      visualElements = "Engaging marketing graphics with commercial appeal";
      colorPalette = "Modern marketing color palette";
      designStyle = "Contemporary marketing design";
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
  
  // Create comprehensive marketing-focused prompt
  const detailedPrompt = `Create a professional marketing ${contentType.toLowerCase()} image for: "${contentIdea}"

COMPOSITION & FORMAT:
${composition}

VISUAL ELEMENTS:
${visualElements}

COLOR SCHEME:
${colorPalette}

DESIGN STYLE:
${designStyle}

MOOD & TONE:
${designMood}
${styleDetails}

MARKETING REQUIREMENTS:
- High-quality commercial design suitable for professional marketing campaigns
- Visually striking and attention-grabbing for target audience engagement
- Brand-ready appearance with commercial appeal and conversion focus
- Professional photography quality with marketing industry standards
- Clean, polished design without any text overlays (text will be added separately)
- Suitable for digital marketing platforms and print media
- Modern design trends following current marketing best practices

TECHNICAL SPECIFICATIONS:
- High resolution and professional quality suitable for commercial use
- Sharp, clear imagery with excellent visual clarity
- Marketing industry standard composition and visual hierarchy
- Professional lighting and color balance
- Commercial-grade visual appeal`;

  return detailedPrompt;
}
