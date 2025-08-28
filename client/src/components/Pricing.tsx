import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bike, Car, Plane, Check, ArrowLeft, ChevronRight, Star, Zap, Shield, TrendingUp, DollarSign, X, Users, Code, Lightbulb, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ContactForm from './ContactForm';

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    icon: Bike,
    price: '9.90',
    period: 'month',
    color: 'from-indigo-500 to-indigo-600',
    borderColor: 'border-indigo-200',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    features: [
      'Complete dispatching system',
      'Driver portal & mobile app',
      'Real-time analytics',
      'Customer management',
      'Financial reporting',
      'Email support',
      '30-day free trial'
    ],
    stripeLink: 'https://buy.stripe.com/3cs2bu8Cv1dR7q8fZw'
  },
  {
    id: 'yearly',
    name: 'Yearly',
    icon: Car,
    price: '79',
    period: 'year',
    color: 'from-green-500 to-green-600',
    borderColor: 'border-green-200',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    popular: true,
    savings: 'Save 33%',
    features: [
      'Everything in Monthly',
      'Priority support',
      'Advanced analytics',
      'Custom integrations',
      'Data export tools',
      'Multi-language support',
      '30-day free trial'
    ],
    stripeLink: 'https://buy.stripe.com/fZedUc5qj2hV9yg00z'
  },
  {
    id: 'twoYear',
    name: '2 Years',
    icon: Plane,
    price: '139',
    period: '2 years',
    color: 'from-purple-500 to-purple-600',
    borderColor: 'border-purple-200',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    savings: 'Save 41%',
    features: [
      'Everything in Yearly',
      'Dedicated account manager',
      'Custom feature requests',
      'White-label options',
      'API access',
      'Training sessions',
      '30-day free trial'
    ],
    stripeLink: 'https://buy.stripe.com/bIY7vO4mf6ybcKsaFe'
  }
];

const competitorComparison = [
  { name: 'Traditional Software A', price: '$2,500/month', features: 'Basic dispatching' },
  { name: 'Enterprise Solution B', price: '$5,000/month', features: 'Full suite + support' },
  { name: 'Industry Leader C', price: '$8,000/month', features: 'Premium features' },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>('yearly');
  const [showComparison, setShowComparison] = useState(false);

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleContinue = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (plan) {
      window.open(plan.stripeLink, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-4">
              <DollarSign className="w-4 h-4 mr-2" />
              Save thousands on dispatching software
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Why Pay <span className="text-red-600 line-through">Thousands</span> When You Can Get 
            <span className="text-green-600 block">The Best for Almost Nothing?</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Get enterprise-level dispatching software that competitors charge $2,000-$8,000/month for. 
            We believe great software should be affordable for everyone.
          </motion.p>

          {/* Comparison Toggle */}
          <motion.button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            {showComparison ? 'Hide' : 'See'} Competitor Comparison
          </motion.button>
        </div>

        {/* Competitor Comparison - Improved Layout with Better Text Sizing */}
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-16 bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6">
              <h3 className="text-2xl font-bold text-center text-white">See How Much You'll Save</h3>
              <p className="text-gray-300 text-center mt-2">Compare our pricing with industry leaders</p>
            </div>
            
            <div className="p-8">
              <div className="grid md:grid-cols-4 gap-6">
                {/* Competitor Cards - Consistent Layout with Equal Heights */}
                {competitorComparison.map((competitor, index) => (
                  <div key={index} className="relative">
                    <div className="h-full flex flex-col justify-between bg-red-50 rounded-xl border-2 border-red-200 p-6 text-center min-h-[280px]">
                      {/* Header Section - Consistent spacing */}
                      <div className="flex flex-col items-center mb-4">
                        <div className="text-red-600 mb-3">
                          <X className="w-8 h-8 mx-auto" />
                        </div>
                        <h4 className="font-bold text-gray-900 text-base mb-2 leading-tight">{competitor.name}</h4>
                      </div>
                      
                      {/* Price Section - Consistent sizing */}
                      <div className="flex-1 flex flex-col justify-center mb-4">
                        <div className="text-2xl font-bold text-red-600 mb-2">{competitor.price}</div>
                        <p className="text-sm text-gray-600 bg-white rounded-lg py-2 px-3">
                          {competitor.features}
                        </p>
                      </div>
                      
                      {/* Bottom spacer for equal heights */}
                      <div className="h-12"></div>
                    </div>
                  </div>
                ))}
                
                {/* RidePilot Card - Optimized Text Sizes and Spacing */}
                <div className="relative">
                  {/* Best Value Badge - Properly positioned */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      BEST VALUE
                    </div>
                  </div>
                  
                  <div className="h-full flex flex-col justify-between bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 p-6 text-center pt-8 min-h-[280px]">
                    {/* Header Section - Consistent with competitors */}
                    <div className="flex flex-col items-center mb-4">
                      <div className="text-green-600 mb-3">
                        <Check className="w-8 h-8 mx-auto" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-base mb-2 leading-tight">RidePilot</h4>
                    </div>
                    
                    {/* Price Section - Better balanced sizing */}
                    <div className="flex-1 flex flex-col justify-center mb-3">
                      <div className="text-2xl font-bold text-green-600 mb-2">€79/year</div>
                      <p className="text-sm text-gray-700 bg-white rounded-lg py-2 px-3 mb-3 font-medium">
                        All features + more
                      </p>
                    </div>
                    
                    {/* Savings Section - Optimized Text Sizes */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-3 shadow-lg">
                      <div className="text-sm font-bold mb-1">Save up to</div>
                      <div className="text-lg font-extrabold leading-tight">€95,000/year!</div>
                      <div className="text-xs opacity-90 mt-1">vs industry leaders</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Stats */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 rounded-full px-6 py-3">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-semibold">
                    Join thousands of companies who switched and saved millions
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => handlePlanSelection(plan.id)}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                  isSelected ? 'ring-4 ring-green-400 transform scale-105' : 
                  'hover:shadow-2xl hover:scale-102'
                } ${plan.popular && !isSelected ? 'ring-2 ring-green-300' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-green-600 text-white text-center text-sm py-2 font-semibold">
                    <Star className="w-4 h-4 inline mr-1" />
                    Most Popular - Best Value
                  </div>
                )}
                
                {plan.savings && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {plan.savings}
                  </div>
                )}

                <div className={`p-8 ${plan.popular ? 'pt-16' : 'pt-8'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 transition-all ${
                        isSelected ? 
                        'border-green-500 bg-green-500' : 
                        'border-gray-300'
                      }`}>
                        {isSelected && (
                          <div className="flex items-center justify-center h-full">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold text-gray-900">€{plan.price}</span>
                    <span className="text-gray-500 ml-2">/{plan.period}</span>
                  </div>

                  {plan.id === 'yearly' && (
                    <div className="mb-6 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700 font-medium text-center">
                        💰 Competitors charge €30,000+ annually for similar features
                      </p>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-100 pt-6">
                    <p className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">Everything Included:</p>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <Check className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${plan.textColor}`} />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.id === 'monthly' && (
                    <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600 text-center">
                        Perfect for trying out our full feature set
                      </p>
                    </div>
                  )}

                  {plan.id === 'twoYear' && (
                    <div className="mt-6 p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-purple-600 text-center">
                        Maximum savings + premium support
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* CTA Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <button
            onClick={handleContinue}
            disabled={!selectedPlan}
            className={`px-12 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 flex items-center mx-auto shadow-2xl ${
              selectedPlan ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <Zap className="w-6 h-6 mr-2" />
            Start Your Free Trial
            <ChevronRight className="ml-2 w-6 h-6" />
          </button>
          {!selectedPlan && (
            <p className="text-gray-500 mt-3">Please select a plan to continue</p>
          )}
          
          <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1 text-green-500" />
              30-day free trial
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-1 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center">
              <X className="w-4 h-4 mr-1 text-green-500" />
              Cancel anytime
            </div>
          </div>
        </motion.div>

        {/* Our Story Section - NEW */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl shadow-2xl p-8 lg:p-12 text-white mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2 mb-4">
                <Lightbulb className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Our Story</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Built by Dispatchers, for Dispatchers
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Code className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">Originally Internal</h4>
                <p className="text-sm opacity-90">We built RidePilot as our own internal dispatch tool for daily operations</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">Real-World Tested</h4>
                <p className="text-sm opacity-90">After seeing how well it worked, we decided to make it public</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">Continuous Innovation</h4>
                <p className="text-sm opacity-90">We keep improving it because we use it daily ourselves</p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-lg leading-relaxed text-center">
                "We originally built RidePilot as our own internal dispatch tool, but after seeing how well it worked, we decided to make it public. That's why the price is so low—it's built by us, for real use. We'll keep improving it because we use it daily ourselves, and with upcoming AI features, our goal is to make it the best dispatch software on the market."
              </p>
              <div className="text-center mt-4">
                <p className="text-sm opacity-75">— The RidePilot Team</p>
              </div>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-white mb-16">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Why We Can Offer Premium Software for Less
            </h2>
            <p className="text-xl opacity-90 mb-6">
              While others charge thousands for basic features, we believe in making powerful dispatching software accessible to everyone. Our efficient development approach and modern technology stack allows us to offer enterprise-grade features at a fraction of the cost.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Zap className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">Modern Technology</h4>
                <p className="text-sm opacity-80">Built with cutting-edge tools for maximum efficiency</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">No Overhead</h4>
                <p className="text-sm opacity-80">Direct to customer, no expensive sales teams</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Shield className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">Fair Pricing</h4>
                <p className="text-sm opacity-80">We believe great software should be affordable</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Suggestions Section */}
        <div id="feature-suggestions" className="mb-16 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Help Shape the Future of RidePilot
            </h2>
            <p className="text-xl text-gray-600">
              We're constantly improving RidePilot based on your feedback. Let us know what features you'd like to see next!
            </p>
            <p className="mt-3 text-lg text-blue-600">
              Keep the ideas coming—we're listening! We'll go through all your suggestions and bring the best ones to life.
            </p>
          </div>
          
          <ContactForm 
            title="Suggest a Feature"
            subtitle="Your ideas help us make RidePilot even better"
            variant="suggestions"
          />
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                question: "How can you offer such low prices compared to competitors?",
                answer: "We originally built RidePilot for our own use as an internal dispatch tool. Because it was battle-tested in our own operations before going public, we don't have the typical development overhead that other companies face. Plus, we use modern, efficient technology and have no expensive sales teams or legacy infrastructure."
              },
              {
                question: "Is there really no catch with the pricing?",
                answer: "No catch! Since we built this software for ourselves first, we already recovered our development costs through internal use. Our pricing includes all core features, and we're transparent about what's included."
              },
              {
                question: "Will you keep improving the software?",
                answer: "Absolutely! We use RidePilot daily for our own operations, so we're constantly motivated to improve it. We have exciting AI features in development, and our goal is to make it the best dispatch software on the market."
              },
              {
                question: "Can I switch plans later?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. The price difference will be prorated, and changes take effect immediately."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards through our secure payment processor. Annual plans also support bank transfers for larger organizations."
              },
              {
                question: "How does the free trial work?",
                answer: "Get full access to all features for 30 days, completely free. No credit card required to start. If you love it, simply choose a plan. If not, no worries - your data is safely deleted."
              },
              {
                question: "Do you offer refunds?",
                answer: "Yes, we offer a 30-day money-back guarantee on all plans. If you're not completely satisfied, we'll refund your payment, no questions asked."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-lg shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}