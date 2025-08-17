import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { 
  Zap, 
  Globe, 
  FileText, 
  MessageCircle, 
  Lightbulb, 
  Copy, 
  CheckCircle,
  Shield,
  Loader2,
  Image,
  Download,
  LogOut,
  User
} from "lucide-react";

interface GenerateContentRequest {
  language: string;
  contentType: string;
  tone: string;
  contentIdea: string;
  includeImage: boolean;
}

interface GenerateContentResponse {
  content: string;
  imageUrl?: string;
}

export default function Home() {
  const [formData, setFormData] = useState({
    language: "",
    contentType: "",
    tone: "",
    contentIdea: "",
    includeImage: false
  });
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateContentRequest): Promise<GenerateContentResponse> => {
      return await apiRequest("/api/generate-content", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
      }
      toast({
        title: "Content Generated!",
        description: data.imageUrl ? "Your marketing content and image have been successfully created." : "Your marketing content has been successfully created.",
      });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleGenerate = () => {
    if (!formData.language || !formData.contentType || !formData.tone || !formData.contentIdea.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before generating content.",
        variant: "destructive",
      });
      return;
    }

    // Reset previous results
    setGeneratedImageUrl("");
    generateMutation.mutate(formData);
  };

  const handleCopy = async () => {
    if (!generatedContent) return;
    
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Content has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive",
      });
    }
  };

  const languages = [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi (हिन्दी)" },
    { value: "Spanish", label: "Spanish (Español)" },
    { value: "French", label: "French (Français)" },
    { value: "Punjabi", label: "Punjabi (ਪੰਜਾਬੀ)" },
    { value: "Tamil", label: "Tamil (தமிழ்)" },
    { value: "Bengali", label: "Bengali (বাংলা)" },
    { value: "German", label: "German (Deutsch)" },
    { value: "Mandarin", label: "Mandarin (中文)" }
  ];

  const contentTypes = [
    { value: "Social Media Post", label: "Social Media Post" },
    { value: "Poster Headline", label: "Poster Headline" },
    { value: "Ad Copy", label: "Ad Copy" },
    { value: "Email Newsletter", label: "Email Newsletter" },
    { value: "Blog Post", label: "Blog Post" },
    { value: "Product Description", label: "Product Description" }
  ];

  const tones = [
    { value: "Professional", label: "Professional" },
    { value: "Casual", label: "Casual" },
    { value: "Witty", label: "Witty" },
    { value: "Inspirational", label: "Inspirational" },
    { value: "Formal", label: "Formal" },
    { value: "Friendly", label: "Friendly" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="fixed top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      <div className="fixed top-40 right-10 w-80 h-80 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="fixed bottom-20 left-1/2 w-64 h-64 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      
      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* User Header */}
        <div className="flex justify-between items-center mb-8 p-4 bg-white/60 backdrop-blur border-2 border-white/50 rounded-2xl shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
              </p>
              <p className="text-sm text-slate-600">
                {user?.email || 'Authenticated User'}
              </p>
            </div>
          </div>
          <Button
            onClick={() => window.location.href = '/api/logout'}
            variant="outline"
            size="sm"
            className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 text-slate-700 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-violet-600 rounded-2xl mb-6 shadow-2xl animate-bounce-soft">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent leading-tight">
            AI Marketing Content Platform
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 font-light max-w-3xl mx-auto mb-4">
            Generate compelling multilingual marketing content with the power of AI
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-slate-500 mb-8">
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-1 text-blue-500" />
              <span>9+ Languages</span>
            </div>
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-1 text-violet-500" />
              <span>6+ Content Types</span>
            </div>
            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1 text-emerald-500" />
              <span>6+ Tones</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <Card className="glass-effect rounded-3xl shadow-2xl p-8 md:p-12 animate-slide-up border border-white/20 relative overflow-hidden">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Language Selection */}
            <div className="space-y-3">
              <Label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <Globe className="w-5 h-5 mr-2 text-blue-500" />
                Select Language
              </Label>
              <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                <SelectTrigger className="w-full px-4 py-4 bg-gradient-to-r from-white to-blue-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all duration-300 text-slate-700 font-medium shadow-sm hover:shadow-md group">
                  <SelectValue placeholder="🌍 Choose a language..." />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content Type Selection */}
            <div className="space-y-3">
              <Label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <FileText className="w-5 h-5 mr-2 text-violet-500" />
                Select Content Type
              </Label>
              <Select value={formData.contentType} onValueChange={(value) => setFormData({...formData, contentType: value})}>
                <SelectTrigger className="w-full px-4 py-4 bg-gradient-to-r from-white to-violet-50 border-2 border-slate-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 focus:bg-white transition-all duration-300 text-slate-700 font-medium shadow-sm hover:shadow-md group">
                  <SelectValue placeholder="📄 Choose content type..." />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tone Selection */}
            <div className="space-y-3">
              <Label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <MessageCircle className="w-5 h-5 mr-2 text-emerald-500" />
                Select Tone
              </Label>
              <Select value={formData.tone} onValueChange={(value) => setFormData({...formData, tone: value})}>
                <SelectTrigger className="w-full px-4 py-4 bg-gradient-to-r from-white to-emerald-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:bg-white transition-all duration-300 text-slate-700 font-medium shadow-sm hover:shadow-md group">
                  <SelectValue placeholder="🎭 Choose tone..." />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prompt Input */}
            <div className="md:col-span-2 space-y-3">
              <Label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
                Your Content Idea
              </Label>
              <Textarea
                rows={5}
                value={formData.contentIdea}
                onChange={(e) => setFormData({...formData, contentIdea: e.target.value})}
                className="w-full px-4 py-4 bg-gradient-to-r from-white to-amber-50 border-2 border-slate-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 focus:bg-white transition-all duration-300 text-slate-700 font-medium resize-none shadow-sm hover:shadow-md"
                placeholder="💡 Describe your marketing idea, product, or campaign message here..."
              />
            </div>

            {/* Image Generation Toggle */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Image className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">Generate Marketing Image</Label>
                    <p className="text-xs text-slate-500">Create a professional visual to accompany your content</p>
                  </div>
                </div>
                <Switch
                  checked={formData.includeImage}
                  onCheckedChange={(checked) => setFormData({...formData, includeImage: checked})}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center mb-8">
            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-violet-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 hover:animate-pulse-glow focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed animate-scale-in"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {formData.includeImage ? "Creating content & image..." : "Generating amazing content..."}
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  {formData.includeImage ? "Generate Content + Image" : "Generate Content"}
                </>
              )}
            </Button>
          </div>

          {/* Output Section */}
          {generatedContent && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-bold text-slate-800 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  Generated Content
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 text-slate-700 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-100 via-blue-50 to-purple-100 rounded-2xl blur-sm"></div>
                <div className="relative bg-white/90 backdrop-blur border-2 border-white/50 rounded-2xl p-8 shadow-xl">
                  <div className="text-slate-800 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                    {generatedContent}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-200 mt-6">
                    <span className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 text-sm font-semibold rounded-full shadow-sm border border-emerald-200">
                      {formData.tone}
                    </span>
                    <span className="px-4 py-2 bg-gradient-to-r from-violet-100 to-violet-200 text-violet-800 text-sm font-semibold rounded-full shadow-sm border border-violet-200">
                      {formData.contentType}
                    </span>
                    <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-sm font-semibold rounded-full shadow-sm border border-blue-200">
                      {formData.language}
                    </span>
                  </div>
                </div>
              </div>

              {/* Generated Image Section */}
              {generatedImageUrl && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-2xl font-bold text-slate-800 flex items-center">
                      <div className="w-7 h-7 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                        <Image className="w-4 h-4 text-white" />
                      </div>
                      Marketing Image
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = generatedImageUrl;
                        link.download = `marketing-image-${Date.now()}.png`;
                        link.click();
                      }}
                      className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 text-slate-700 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Image
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-50 to-blue-100 rounded-2xl blur-sm"></div>
                    <div className="relative bg-white/90 backdrop-blur border-2 border-white/50 rounded-2xl p-6 shadow-xl">
                      <img 
                        src={generatedImageUrl} 
                        alt="Generated marketing image"
                        className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
                        style={{ aspectRatio: 'auto' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
        </Card>

        {/* Footer */}
        <footer className="text-center mt-16">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-8 mb-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-center space-x-6 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-600">Powered by Gemini AI</span>
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-600">Secure & Privacy-First</span>
              </div>
            </div>
            <p className="text-xs text-slate-500">© 2024 AI Marketing Content Platform. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
