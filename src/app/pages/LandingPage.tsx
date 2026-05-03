import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Bot,
  Workflow,
  Zap,
  Users,
  TrendingUp,
  Shield,
  Sparkles,
  ArrowRight,
  Check,
  Star,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Agent Builder",
    description:
      "Create custom AI agents for lead generation, customer support, content creation, and more with our no-code builder.",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "Build powerful automation workflows with triggers, actions, and integrations to streamline your business operations.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Powered by Gemini AI, our platform delivers instant responses and automates tasks in real-time.",
  },
  {
    icon: Users,
    title: "Multi-Tenant SaaS",
    description:
      "Enterprise-grade multi-tenant architecture with team collaboration, role-based access, and data isolation.",
  },
  {
    icon: TrendingUp,
    title: "Advanced Analytics",
    description:
      "Track performance, measure ROI, and optimize your AI agents with comprehensive analytics and insights.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-level security with JWT authentication, 2FA, audit logs, and SOC 2 compliance ready infrastructure.",
  },
];

const useCases = [
  "Lead Generation & Enrichment",
  "Automated Email Campaigns",
  "Customer Support Chatbots",
  "Content Creation & SEO",
  "Sales Pipeline Management",
  "Research & Data Analysis",
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO at TechStart",
    content:
      "Velora AI helped us automate our entire lead generation process. We've seen a 300% increase in qualified leads.",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "Head of Marketing at GrowthCo",
    content:
      "The workflow builder is incredible. We built complex automation in minutes that would have taken weeks to code.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Operations Director at ScaleUp",
    content:
      "This platform saved us 40 hours per week in manual tasks. The ROI is outstanding.",
    rating: 5,
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out Velora AI",
    features: [
      "5,000 AI credits/month",
      "3 AI agents",
      "5 workflows",
      "Basic integrations",
      "Email support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    description: "For growing teams and businesses",
    features: [
      "50,000 AI credits/month",
      "Unlimited AI agents",
      "Unlimited workflows",
      "All integrations",
      "Priority support",
      "Custom branding",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For large organizations",
    features: [
      "Unlimited AI credits",
      "White-label solution",
      "Dedicated infrastructure",
      "SSO & advanced security",
      "24/7 phone support",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const logos = [
  "Acme Corp",
  "TechStart",
  "GrowthCo",
  "ScaleUp",
  "Innovate Inc",
  "Future Labs",
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Bot className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Velora AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/pricing">
              <Button variant="ghost">Pricing</Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <Badge className="mb-6" variant="secondary">
          <Sparkles className="size-3 mr-1" />
          Powered by Gemini AI
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          Automate Your Business
          <br />
          with AI Agents
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
          Build powerful AI automation workflows in minutes. Generate leads,
          engage customers, create content, and scale your operations with
          intelligent AI agents.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="text-lg h-12 px-8">
              Start Free Trial
              <ArrowRight className="size-5 ml-2" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="text-lg h-12 px-8">
            Watch Demo
          </Button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          No credit card required • 14-day free trial
        </p>

        {/* Hero Image/Mockup */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-950 via-transparent to-transparent h-32 bottom-0 z-10" />
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-2xl bg-gray-50 dark:bg-gray-900 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 bg-white dark:bg-gray-800">
                  <div className="size-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                    <Bot className="size-6 text-purple-600" />
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded mb-1" />
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-5/6" />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Logo Cloud */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-y border-gray-200 dark:border-gray-800">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
          Trusted by innovative companies worldwide
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center opacity-50">
          {logos.map((logo) => (
            <div
              key={logo}
              className="text-center font-semibold text-gray-600 dark:text-gray-400"
            >
              {logo}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything you need to automate
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Powerful features built for modern businesses
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="p-6 hover:shadow-lg transition-shadow">
                <div className="size-12 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center mb-4">
                  <Icon className="size-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for every use case</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              From startups to enterprises
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase) => (
              <Card key={useCase} className="p-6 flex items-center gap-4">
                <div className="size-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                  <Check className="size-5 text-purple-600" />
                </div>
                <p className="font-medium">{useCase}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Loved by businesses</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            See what our customers are saying
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="size-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                "{testimonial.content}"
              </p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.role}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Choose the plan that's right for your business
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`p-8 relative ${
                  plan.popular
                    ? "border-2 border-purple-600 shadow-lg scale-105"
                    : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600">
                    Most Popular
                  </Badge>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {" "}
                    / {plan.period}
                  </span>
                </div>
                <Link to="/register">
                  <Button
                    className="w-full mb-6"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="size-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Card className="p-12 text-center bg-gradient-to-br from-purple-600 to-blue-600 text-white border-0">
          <h2 className="text-4xl font-bold mb-4">
            Ready to transform your business?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of companies automating with AI
          </p>
          <Link to="/register">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg h-12 px-8 bg-white text-purple-600 hover:bg-gray-100"
            >
              Start Free Trial
              <ArrowRight className="size-5 ml-2" />
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Integrations</li>
                <li>API</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Community</li>
                <li>Status</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Security</li>
                <li>Compliance</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-8 border-t border-gray-200 dark:border-gray-800">
            © 2026 Velora AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
