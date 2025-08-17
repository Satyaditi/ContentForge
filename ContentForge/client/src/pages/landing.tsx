import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Zap, Image, Users, Star, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Marketing Platform
              </h1>
            </div>
            <Button
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl px-6 py-2.5 rounded-xl font-semibold"
            >
              Sign In
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Create Stunning
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Marketing Content
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                Generate professional marketing content and beautiful visuals in multiple languages 
                using advanced AI technology. Perfect for social media, ads, newsletters, and more.
              </p>
              <Button
                onClick={() => window.location.href = '/api/login'}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl px-8 py-4 text-lg font-semibold rounded-2xl group"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <Card className="bg-white/80 backdrop-blur border-2 border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center pb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">Multilingual</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-slate-600">
                    Create content in English, Hindi, Spanish, French, Punjabi, Tamil, Bengali and more
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur border-2 border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center pb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Image className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">AI Images</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-slate-600">
                    Generate professional marketing images that perfectly match your content
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur border-2 border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center pb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">Fast & Easy</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-slate-600">
                    Generate professional content in seconds with our intuitive interface
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur border-2 border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center pb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">Multiple Formats</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-slate-600">
                    Social posts, ads, newsletters, headlines - all in your preferred tone
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Content Types */}
            <div className="bg-white/60 backdrop-blur border-2 border-white/50 rounded-3xl p-8 shadow-xl">
              <h3 className="text-3xl font-bold text-center text-slate-900 mb-8">
                Perfect for Every Marketing Need
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                  <h4 className="font-semibold text-blue-900 mb-2">Social Media</h4>
                  <p className="text-sm text-blue-800">Engaging posts for all platforms</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                  <h4 className="font-semibold text-purple-900 mb-2">Advertisements</h4>
                  <p className="text-sm text-purple-800">Compelling ad copy that converts</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl">
                  <h4 className="font-semibold text-pink-900 mb-2">Email Marketing</h4>
                  <p className="text-sm text-pink-800">Professional newsletters</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                  <h4 className="font-semibold text-green-900 mb-2">Headlines</h4>
                  <p className="text-sm text-green-800">Attention-grabbing poster text</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                Ready to Transform Your Marketing?
              </h3>
              <p className="text-xl text-slate-600 mb-8">
                Join thousands of creators using AI to build better marketing content
              </p>
              <Button
                onClick={() => window.location.href = '/api/login'}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl px-10 py-4 text-xl font-bold rounded-2xl group"
              >
                Start Creating Now
                <Star className="w-6 h-6 ml-2 group-hover:rotate-12 transition-transform" />
              </Button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-8 border-t border-white/20">
          <div className="max-w-7xl mx-auto text-center text-slate-600">
            <p>© 2024 AI Marketing Platform. Powered by advanced AI technology.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}