'use client';

import { Button } from "@workspace/ui/components/button";
import { MessageSquare, Zap, Shield, Users, ArrowRight } from "lucide-react";
import FeatureCard from "@/components/featureCard";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Connect Instantly with Real-Time Chat
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Experience seamless communication with our lightning-fast chat platform. Built for teams and individuals who value real-time connections.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline">
              Live Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Zap className="w-10 h-10 text-blue-500" />}
              title="Lightning Fast"
              description="Experience real-time messaging with zero latency"
            />
            <FeatureCard 
              icon={<Shield className="w-10 h-10 text-green-500" />}
              title="Secure & Private"
              description="End-to-end encryption for all your conversations"
            />
            <FeatureCard 
              icon={<Users className="w-10 h-10 text-purple-500" />}
              title="Team Collaboration"
              description="Perfect for teams of any size"
            />
            <FeatureCard 
              icon={<MessageSquare className="w-10 h-10 text-orange-500" />}
              title="Rich Messages"
              description="Share files, images, and more with ease"
            />
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-muted-foreground">Join thousands of companies already using our platform</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-70">
            {['Microsoft', 'Google', 'Netflix', 'Airbnb'].map((company) => (
              <div key={company} className="text-xl font-semibold">{company}</div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already experiencing the future of communication.
            Start for free, no credit card required.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">Start Chatting Now</Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              <span className="font-bold">ChatApp</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 ChatApp. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}