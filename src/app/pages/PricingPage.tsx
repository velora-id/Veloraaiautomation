import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Check, Bot } from "lucide-react";

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
      "Community access",
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
      "Advanced analytics",
      "Team collaboration",
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
      "Dedicated account manager",
      "Custom contracts",
      "On-premise option",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <nav className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Bot className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Velora AI
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose the plan that's right for your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-8 relative ${
                plan.popular
                  ? "border-2 border-purple-600 shadow-xl scale-105"
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
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {" "}
                  / {plan.period}
                </span>
              </div>
              <Link to="/register">
                <Button
                  className="w-full mb-6"
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="size-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            All plans include 14-day free trial • No credit card required
          </p>
          <Link to="/register">
            <Button size="lg">Start Free Trial</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
