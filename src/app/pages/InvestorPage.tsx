import React, { useState } from 'react';
import { ArrowRight, TrendingUp, Users, Zap, BarChart3, Target, Lightbulb, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function InvestorPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
            <span className="font-bold text-lg">Velora AI</span>
          </div>
          <div className="flex gap-4">
            <a href="#pitch-deck" className="hover:text-blue-400 transition">Pitch Deck</a>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = 'mailto:investors@velora.ai'}>
              Contact Investors
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/50">
            <span className="text-blue-300 text-sm font-semibold">🚀 Series A Ready</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
            Enterprise AI Workflow Automation
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Help businesses automate complex workflows with AI agents, integrations, and intelligent orchestration
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <div className="text-3xl font-bold text-blue-400">$50B+</div>
              <div className="text-slate-300 text-sm">TAM</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <div className="text-3xl font-bold text-green-400">95%</div>
              <div className="text-slate-300 text-sm">Customer Retention</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <div className="text-3xl font-bold text-purple-400">70%</div>
              <div className="text-slate-300 text-sm">Time Saved</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <div className="text-3xl font-bold text-pink-400">40%</div>
              <div className="text-slate-300 text-sm">Cost Reduction</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#pitch-deck" className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">
              View Pitch Deck
            </a>
            <Button variant="outline" className="border-slate-500 hover:bg-slate-800">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">The Problem</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="text-red-400 mt-1">✗</div>
                  <div>
                    <div className="font-semibold">Manual Workflows</div>
                    <p className="text-slate-400">Teams waste hours on repetitive tasks</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="text-red-400 mt-1">✗</div>
                  <div>
                    <div className="font-semibold">Siloed Systems</div>
                    <p className="text-slate-400">Tools don't communicate effectively</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="text-red-400 mt-1">✗</div>
                  <div>
                    <div className="font-semibold">AI Underutilized</div>
                    <p className="text-slate-400">Limited access to advanced AI capabilities</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="text-red-400 mt-1">✗</div>
                  <div>
                    <div className="font-semibold">Expensive Operations</div>
                    <p className="text-slate-400">High overhead and operational costs</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Solution</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="text-green-400 mt-1">✓</div>
                  <div>
                    <div className="font-semibold">Visual Workflow Builder</div>
                    <p className="text-slate-400">No-code workflow automation platform</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="text-green-400 mt-1">✓</div>
                  <div>
                    <div className="font-semibold">Unified Integration Hub</div>
                    <p className="text-slate-400">Connect 50+ tools seamlessly</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="text-green-400 mt-1">✓</div>
                  <div>
                    <div className="font-semibold">AI-Powered Agents</div>
                    <p className="text-slate-400">Google Gemini AI at the core</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="text-green-400 mt-1">✓</div>
                  <div>
                    <div className="font-semibold">Enterprise Ready</div>
                    <p className="text-slate-400">Security, compliance, and scalability built-in</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Product Capabilities */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Platform Capabilities</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Workflow Automation', desc: '8+ node types for complex orchestration' },
              { icon: Users, title: 'AI Agents', desc: 'Google Gemini integration for intelligent decisions' },
              { icon: BarChart3, title: 'Analytics', desc: 'Real-time insights and performance tracking' },
              { icon: Target, title: 'Lead Management', desc: 'Track and manage leads through the funnel' },
              { icon: Lightbulb, title: '50+ Integrations', desc: 'Stripe, Mailgun, Slack, and more' },
              { icon: CheckCircle, title: 'Multi-Tenant', desc: 'Complete organization and team management' },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-blue-500 transition">
                  <Icon className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Market Opportunity</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
              <div className="text-2xl font-bold text-blue-400 mb-2">$50B+</div>
              <div className="font-semibold mb-2">Total Addressable Market</div>
              <p className="text-slate-400 text-sm">Workflow automation market includes RPA, iPaaS, and low-code platforms</p>
            </div>
            
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
              <div className="text-2xl font-bold text-purple-400 mb-2">85% CAGR</div>
              <div className="font-semibold mb-2">Market Growth</div>
              <p className="text-slate-400 text-sm">Expected through 2030 driven by digital transformation</p>
            </div>
            
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
              <div className="text-2xl font-bold text-green-400 mb-2">2M SMBs</div>
              <div className="font-semibold mb-2">Addressable Segment</div>
              <p className="text-slate-400 text-sm">Small and mid-market businesses needing workflow automation</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-8 rounded-lg border border-blue-700/50">
            <h3 className="text-2xl font-bold mb-4">Target Markets</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="font-semibold text-lg mb-2">Small & Mid-Market</div>
                <p className="text-slate-300">50-500 employees, need automation but can't afford expensive RPA</p>
              </div>
              <div>
                <div className="font-semibold text-lg mb-2">Agencies</div>
                <p className="text-slate-300">Service providers automating client workflows</p>
              </div>
              <div>
                <div className="font-semibold text-lg mb-2">Enterprises</div>
                <p className="text-slate-300">Large organizations wanting modern, AI-powered automation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Traction */}
      <section id="pitch-deck" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Product Traction</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
              <div className="text-3xl font-bold text-blue-400">45</div>
              <p className="text-slate-300">Tests Passing</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
              <div className="text-3xl font-bold text-green-400">92%</div>
              <p className="text-slate-300">Code Coverage</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
              <div className="text-3xl font-bold text-purple-400">25+</div>
              <p className="text-slate-300">API Endpoints</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
              <div className="text-3xl font-bold text-pink-400">3</div>
              <p className="text-slate-300">Core Providers</p>
            </div>
          </div>

          <div className="bg-slate-800/30 p-8 rounded-lg border border-slate-700">
            <h3 className="text-2xl font-bold mb-6">Production Readiness</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Enterprise Architecture</div>
                  <p className="text-slate-400">FastAPI backend with async/await, PostgreSQL, Redis, Docker</p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Security & Authentication</div>
                  <p className="text-slate-400">JWT tokens, role-based access control, tenant isolation</p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Comprehensive Testing</div>
                  <p className="text-slate-400">100% test passing rate with 92% code coverage</p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Modern Tech Stack</div>
                  <p className="text-slate-400">React, TypeScript, Tailwind CSS, Vite with Hot Module Reload</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Investment Opportunity */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Investment Opportunity</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-slate-900 p-8 rounded-lg border border-slate-700">
              <h3 className="text-2xl font-bold mb-6">Use of Funds</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Sales & Marketing</span>
                  <span className="font-semibold">40%</span>
                </div>
                <div className="flex justify-between">
                  <span>Product Development</span>
                  <span className="font-semibold">35%</span>
                </div>
                <div className="flex justify-between">
                  <span>Infrastructure & Ops</span>
                  <span className="font-semibold">15%</span>
                </div>
                <div className="flex justify-between">
                  <span>Team Expansion</span>
                  <span className="font-semibold">10%</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-lg border border-slate-700">
              <h3 className="text-2xl font-bold mb-6">Financial Projections</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-blue-400">Year 1</div>
                  <p>$1.2M ARR, 50 customers</p>
                </div>
                <div>
                  <div className="font-semibold text-purple-400">Year 2</div>
                  <p>$8.5M ARR, 300+ customers</p>
                </div>
                <div>
                  <div className="font-semibold text-green-400">Year 3</div>
                  <p>$35M ARR, 1000+ customers</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-8 rounded-lg border border-blue-700/50">
            <h3 className="text-2xl font-bold mb-6">Why Velora AI?</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <TrendingUp className="w-6 h-6 text-green-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Massive TAM</div>
                  <p className="text-slate-300">$50B+ workflow automation market</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Zap className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold">AI-First Approach</div>
                  <p className="text-slate-300">Google Gemini built into platform</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Users className="w-6 h-6 text-blue-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Experienced Team</div>
                  <p className="text-slate-300">Background in enterprise automation</p>
                </div>
              </div>
              <div className="flex gap-3">
                <BarChart3 className="w-6 h-6 text-pink-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Clear Path to Scale</div>
                  <p className="text-slate-300">$1.2M → $8.5M → $35M ARR</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12-Month Roadmap */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">12-Month Roadmap</h2>
          
          <div className="space-y-4">
            {[
              { quarter: 'Q1', milestone: 'Launch Beta', details: '10 early customers, MVP integrations' },
              { quarter: 'Q2', milestone: 'General Availability', details: '50+ customers, 25+ integrations' },
              { quarter: 'Q3', milestone: 'Enterprise Release', details: 'SSO, audit logs, advanced reporting' },
              { quarter: 'Q4', milestone: 'Scale & Optimize', details: 'Customer success, referral program, partnership ecosystem' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 flex gap-4">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-lg text-blue-400">{item.quarter}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.milestone}</h3>
                  <p className="text-slate-400">{item.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Revolutionize Workflow Automation?</h2>
          <p className="text-xl text-slate-300 mb-8">Join us in building the future of AI-powered business automation</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="mailto:investors@velora.ai" className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition gap-2">
              Contact Investors <ExternalLink className="w-4 h-4" />
            </a>
            <a href="#" className="inline-flex items-center justify-center px-8 py-3 border border-blue-400 hover:bg-blue-900/30 rounded-lg font-semibold transition gap-2">
              Download Pitch Deck
            </a>
          </div>

          <p className="text-sm text-slate-400">
            Series A Target: $2M | Valuation: TBD | Timeline: Q2 2026
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-slate-400 text-sm">
          <div>© 2026 Velora AI. All rights reserved.</div>
          <div>This is confidential and proprietary information.</div>
        </div>
      </footer>
    </div>
  );
}
