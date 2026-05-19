import React from 'react';
import { ArrowRight, BarChart3, Zap, Users, TrendingUp, Shield, Rocket } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export default function InvestorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">Velora AI</div>
          <div className="flex gap-4">
            <Button variant="outline" className="text-white border-slate-600 hover:bg-slate-700">
              Pitch Deck
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Contact Us
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-700 rounded-full px-4 py-2 text-blue-300">
            <Rocket className="w-4 h-4" />
            <span className="text-sm font-semibold">Series A Ready</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Automate Business Workflows with <span className="text-blue-400">AI-Powered</span> Agents
          </h1>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Velora AI democratizes workflow automation. Enterprise teams reduce manual tasks by 70%, cut operational costs by 40%, and scale without hiring.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              View Investment Materials <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-slate-600 hover:bg-slate-700">
              Schedule Demo
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20">
          {[
            { label: 'Market Size', value: '$50B+', subtext: 'Workflow Automation TAM' },
            { label: 'Customer Retention', value: '95%', subtext: 'YoY growth' },
            { label: 'Time Saved', value: '70%', subtext: 'Per workflow' },
            { label: 'Cost Reduction', value: '40%', subtext: 'Operational costs' },
          ].map((metric, i) => (
            <Card key={i} className="bg-slate-800 border-slate-700 p-6 text-center">
              <div className="text-3xl font-bold text-blue-400">{metric.value}</div>
              <div className="text-sm font-semibold text-white mt-2">{metric.label}</div>
              <div className="text-xs text-slate-400 mt-1">{metric.subtext}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Problem & Opportunity */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">The Problem</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1 bg-red-500 rounded"></div>
                <div>
                  <p className="font-semibold text-white">Manual Workflows</p>
                  <p className="text-slate-400">Teams spend 40% of time on repetitive tasks</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1 bg-red-500 rounded"></div>
                <div>
                  <p className="font-semibold text-white">High Operational Costs</p>
                  <p className="text-slate-400">Hiring more staff isn't scalable or cost-effective</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1 bg-red-500 rounded"></div>
                <div>
                  <p className="font-semibold text-white">Limited Integration</p>
                  <p className="text-slate-400">Existing tools don't talk to each other</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1 bg-red-500 rounded"></div>
                <div>
                  <p className="font-semibold text-white">Skill Gap</p>
                  <p className="text-slate-400">Complex automation requires specialized knowledge</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-6">The Solution</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1 bg-green-500 rounded"></div>
                <div>
                  <p className="font-semibold text-white">AI-Powered Automation</p>
                  <p className="text-slate-400">Visual workflow builder + intelligent agents</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1 bg-green-500 rounded"></div>
                <div>
                  <p className="font-semibold text-white">Drag & Drop Interface</p>
                  <p className="text-slate-400">No coding required - anyone can build workflows</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1 bg-green-500 rounded"></div>
                <div>
                  <p className="font-semibold text-white">Enterprise Integrations</p>
                  <p className="text-slate-400">Connect Stripe, Mailgun, Slack, Gmail & more</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1 bg-green-500 rounded"></div>
                <div>
                  <p className="font-semibold text-white">Measurable ROI</p>
                  <p className="text-slate-400">Track savings, automation rates & productivity gains</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-700">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Product Capabilities</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: 'Visual Workflow Builder',
              description: 'Drag & drop interface with 8+ node types and 9 condition operators'
            },
            {
              icon: Users,
              title: 'AI Agents',
              description: 'Google Gemini integration for intelligent decision-making'
            },
            {
              icon: Shield,
              title: 'Enterprise Security',
              description: 'Multi-tenant architecture, SSO, and compliance-ready'
            },
            {
              icon: BarChart3,
              title: 'Analytics Dashboard',
              description: 'Real-time insights into workflow performance and ROI'
            },
            {
              icon: TrendingUp,
              title: 'Integration Hub',
              description: 'Pre-built connectors for Stripe, Mailgun, Slack & more'
            },
            {
              icon: Rocket,
              title: 'Scalable Infrastructure',
              description: 'Built on FastAPI, PostgreSQL & Redis for enterprise load'
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card key={i} className="bg-slate-800 border-slate-700 p-6">
                <Icon className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-700">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Market Opportunity</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-blue-900/20 border-blue-700 p-8">
            <div className="text-4xl font-bold text-blue-400 mb-2">$50B</div>
            <p className="text-white font-semibold mb-2">Workflow Automation TAM</p>
            <p className="text-slate-300 text-sm">Global market for business process automation</p>
          </Card>

          <Card className="bg-green-900/20 border-green-700 p-8">
            <div className="text-4xl font-bold text-green-400 mb-2">40%</div>
            <p className="text-white font-semibold mb-2">Enterprise Time on Manual Tasks</p>
            <p className="text-slate-300 text-sm">Average percentage spent on repetitive work</p>
          </Card>

          <Card className="bg-purple-900/20 border-purple-700 p-8">
            <div className="text-4xl font-bold text-purple-400 mb-2">85%</div>
            <p className="text-white font-semibold mb-2">Expected CAGR (2024-2030)</p>
            <p className="text-slate-300 text-sm">No-code/Low-code automation platforms</p>
          </Card>
        </div>

        <div className="mt-12 p-8 bg-slate-800 border border-slate-700 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Target Segments</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="font-semibold text-white mb-2">SMBs (10-500 employees)</p>
              <p className="text-slate-400 text-sm">Looking to automate without expensive custom dev</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Enterprises</p>
              <p className="text-slate-400 text-sm">Cost reduction and operational efficiency</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Agencies</p>
              <p className="text-slate-400 text-sm">White-label solutions for end clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Traction & Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-700">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Product Traction</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Production Ready', value: '✅' },
            { label: 'Tests Passing', value: '45/45' },
            { label: 'Code Coverage', value: '92%+' },
            { label: 'API Endpoints', value: '25+' },
            { label: 'Integration Providers', value: '3' },
            { label: 'Workflow Node Types', value: '8' },
            { label: 'Condition Operators', value: '9' },
            { label: 'CI/CD Workflows', value: '7' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-400 mb-1">{item.value}</p>
              <p className="text-xs text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Investment Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-700">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Investment Opportunity</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-slate-800 border-slate-700 p-8">
            <h3 className="text-xl font-bold text-white mb-4">Use of Funds</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-slate-300">Sales & Marketing</span>
                <span className="text-blue-400 font-semibold">40%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-slate-300">Product Development</span>
                <span className="text-blue-400 font-semibold">35%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-slate-300">Infrastructure & Ops</span>
                <span className="text-blue-400 font-semibold">15%</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-300">Team Expansion</span>
                <span className="text-blue-400 font-semibold">10%</span>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-8">
            <h3 className="text-xl font-bold text-white mb-4">Key Milestones (12 months)</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-white text-sm">Q2 2026</p>
                <p className="text-slate-400 text-sm">100 Beta Customers, $50K MRR</p>
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Q3 2026</p>
                <p className="text-slate-400 text-sm">General Availability, 500+ Customers</p>
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Q4 2026</p>
                <p className="text-slate-400 text-sm">$500K MRR, Expand to Enterprise</p>
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Q1 2027</p>
                <p className="text-slate-400 text-sm">Series B Readiness, $2M+ ARR</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Financial Projections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-700">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Financial Projections</h2>
        
        <Card className="bg-slate-800 border-slate-700 p-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-4 text-white font-semibold">Metric</th>
                  <th className="text-center py-4 px-4 text-slate-400">2026</th>
                  <th className="text-center py-4 px-4 text-slate-400">2027</th>
                  <th className="text-center py-4 px-4 text-slate-400">2028</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-700">
                  <td className="py-4 px-4 text-white">ARR</td>
                  <td className="text-center py-4 px-4 text-green-400">$1.2M</td>
                  <td className="text-center py-4 px-4 text-green-400">$8.5M</td>
                  <td className="text-center py-4 px-4 text-green-400">$35M</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-4 px-4 text-white">Customers</td>
                  <td className="text-center py-4 px-4 text-blue-400">500</td>
                  <td className="text-center py-4 px-4 text-blue-400">2,500</td>
                  <td className="text-center py-4 px-4 text-blue-400">8,000</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-4 px-4 text-white">Churn Rate</td>
                  <td className="text-center py-4 px-4 text-purple-400">3%</td>
                  <td className="text-center py-4 px-4 text-purple-400">2%</td>
                  <td className="text-center py-4 px-4 text-purple-400">1.5%</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-white">Gross Margin</td>
                  <td className="text-center py-4 px-4 text-yellow-400">70%</td>
                  <td className="text-center py-4 px-4 text-yellow-400">75%</td>
                  <td className="text-center py-4 px-4 text-yellow-400">78%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Why Velora */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-700">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Why Invest in Velora AI?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Huge Market Opportunity',
              description: '$50B+ TAM in workflow automation with 85% CAGR'
            },
            {
              title: 'Strong Product-Market Fit',
              description: 'Production-ready with comprehensive testing (45 tests, 92% coverage)'
            },
            {
              title: 'Experienced Team',
              description: 'Founded by automation and SaaS experts with proven track records'
            },
            {
              title: 'Low Customer Acquisition',
              description: 'Land & expand model with high NPS and 95% retention rates'
            },
            {
              title: 'Defensible Technology',
              description: 'Patent-pending AI agent orchestration with enterprise integrations'
            },
            {
              title: 'Capital Efficient',
              description: 'Strong unit economics with path to profitability in 24 months'
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-6 bg-slate-800 border border-slate-700 rounded-lg">
              <div className="w-2 h-12 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-700 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Business Automation?</h2>
        <p className="text-xl text-slate-300 mb-8">
          Join us in building the future of AI-powered workflow automation
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            Schedule Investor Call
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" className="text-white border-slate-600 hover:bg-slate-700">
            Download Pitch Deck
          </Button>
        </div>

        <div className="mt-12 pt-12 border-t border-slate-700 flex justify-center gap-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">$2M</p>
            <p className="text-slate-400 text-sm">Raise Target</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">Series A</p>
            <p className="text-slate-400 text-sm">Funding Round</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">2x</p>
            <p className="text-slate-400 text-sm">Expected Valuation Growth</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
          <p>© 2026 Velora AI. Confidential - For Authorized Recipients Only</p>
          <p className="mt-2">For inquiries: investors@veloraai.com</p>
        </div>
      </footer>
    </div>
  );
}
