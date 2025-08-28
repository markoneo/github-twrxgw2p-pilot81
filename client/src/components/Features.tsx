import React, { useEffect } from 'react';
import { Calendar, MapPin, Users, BarChart2, Settings, Shield, DollarSign, Zap, Smartphone, Car, Clock, TrendingUp, MessageCircle } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Calendar,
    title: 'Trip Scheduling & Dispatching',
    description: 'Efficiently plan and assign trips, ensuring optimal use of resources and timely service delivery.',
    image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&q=80&w=800',
  },
  {
    icon: MapPin,
    title: 'Vehicle & Driver Management',
    description: 'Maintain detailed records of vehicles and drivers, facilitating easy tracking and assignment.',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800',
  },
  {
    icon: Users,
    title: 'Customer Management',
    description: 'Store and manage customer information securely, enhancing service personalization and communication.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
  },
  {
    icon: BarChart2,
    title: 'Automated Reporting',
    description: 'Generate comprehensive reports on trips, mileage, and other key metrics to support compliance and decision-making.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
  },
  {
    icon: Settings,
    title: 'User-Friendly Interface',
    description: 'Navigate through tasks with ease using an intuitive design that reduces the learning curve for new users.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
  },
  {
    icon: Shield,
    title: 'Customization & Flexibility',
    description: 'Tailor the system to meet specific agency needs, ensuring it aligns with unique operational requirements.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
  },
];

// Animation component for the feature cards
const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay: index * 0.1,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
      className="group bg-white/60 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={feature.image}
          alt={feature.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg">
            <Icon className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {feature.title}
        </h3>
        <p className="text-gray-600">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

export default function Features() {
  // Header animations
  const headerControls = useAnimation();
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (headerInView) {
      headerControls.start('visible');
    }
  }, [headerControls, headerInView]);

  // Software showcase animations
  const showcaseControls = useAnimation();
  const [showcaseRef, showcaseInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (showcaseInView) {
      showcaseControls.start('visible');
    }
  }, [showcaseControls, showcaseInView]);

  return (
    <div className="relative min-h-screen py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Enhanced decorative background elements - matching hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[15%] w-[60%] h-[60%] rounded-full bg-gradient-to-r from-green-100 to-emerald-100 blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-[30%] right-[0%] w-[50%] h-[60%] rounded-full bg-gradient-to-l from-blue-100 to-cyan-100 blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-gradient-to-br from-purple-100 to-pink-100 blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-[15%] left-[10%] w-20 h-20 border border-green-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[30%] right-[15%] w-16 h-16 bg-blue-200 rounded-lg opacity-20 transform rotate-45 animate-bounce"></div>
        <div className="absolute top-[60%] left-[5%] w-12 h-12 bg-purple-200 rounded-full opacity-25 animate-ping"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          ref={headerRef}
          initial="hidden"
          animate={headerControls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.h2 
            className="text-4xl font-bold text-gray-900 mb-6"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { 
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1]
                }
              }
            }}
          >
            Streamline Your Transportation Operations
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { 
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1]
                }
              }
            }}
          >
            RidePilot is a comprehensive, open-source platform designed to streamline transportation operations 
            for small to medium-sized agencies. Its user-friendly interface and robust features empower 
            agencies to manage their services efficiently and effectively.
          </motion.p>
        </motion.div>

        {/* Software Showcase Section */}
        <motion.div 
          ref={showcaseRef}
          initial="hidden"
          animate={showcaseControls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
          className="mb-20 bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 overflow-hidden"
        >
          <div className="grid md:grid-cols-2 gap-0">
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { 
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1]
                  }
                }
              }}
              className="p-8 lg:p-12 bg-gradient-to-br from-green-50/80 via-blue-50/60 to-emerald-50/80 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Complete Management Dashboard
              </h3>
              <div className="space-y-4 mb-6">
                {[
                  { icon: BarChart2, text: "Real-time analytics and performance metrics" },
                  { icon: TrendingUp, text: "Revenue tracking and growth insights" },
                  { icon: Clock, text: "Active project monitoring" },
                  { icon: DollarSign, text: "Financial reporting and payment tracking" }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { delay: 0.3 + (index * 0.1), duration: 0.6 }
                        }
                      }}
                      className="flex items-center"
                    >
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <Icon className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-gray-700">{item.text}</span>
                    </motion.div>
                  );
                })}
              </div>
              <p className="text-gray-600">
                Get a bird's eye view of your entire operation with our comprehensive dashboard that shows everything from daily revenue to driver performance.
              </p>
            </motion.div>
            
            <motion.div 
              className="relative"
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { 
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1]
                  }
                }
              }}
            >
              <div className="relative overflow-hidden h-full min-h-[400px]">
                <img
                  src="/Screenshot 2025-06-23 at 19.13.21.png"
                  alt="Transportation Management Dashboard"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Driver Portal Showcase */}
        <motion.div 
          initial="hidden"
          animate={showcaseInView ? 'visible' : 'hidden'}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
          className="mb-20 bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="grid md:grid-cols-2 gap-0">
            <motion.div 
              className="relative order-2 md:order-1"
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { 
                    duration: 0.8,
                    delay: 0.2,
                    ease: [0.22, 1, 0.36, 1]
                  }
                }
              }}
            >
              <div className="relative overflow-hidden h-full min-h-[400px] flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900">
                <img
                  src="/IMG_3448.jpg"
                  alt="Driver Portal Mobile Interface"
                  className="h-full max-h-[500px] w-auto object-contain"
                />
              </div>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { 
                    duration: 0.8,
                    delay: 0.4,
                    ease: [0.22, 1, 0.36, 1]
                  }
                }
              }}
              className="p-8 lg:p-12 bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-indigo-50/80 backdrop-blur-sm order-1 md:order-2"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Dedicated Driver Experience
              </h3>
              <div className="space-y-4 mb-6">
                {[
                  { icon: Smartphone, text: "Mobile-optimized interface for drivers" },
                  { icon: Car, text: "Trip management and navigation" },
                  { icon: DollarSign, text: "Earnings tracking and payment status" },
                  { icon: Users, text: "Client communication tools" }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, x: 20 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { delay: 0.6 + (index * 0.1), duration: 0.6 }
                        }
                      }}
                      className="flex items-center"
                    >
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-gray-700">{item.text}</span>
                    </motion.div>
                  );
                })}
              </div>
              <p className="text-gray-600">
                Empower your drivers with a dedicated portal that makes their job easier and keeps them informed about their trips and earnings.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Location Analytics Showcase */}
        <motion.div 
          initial="hidden"
          animate={showcaseInView ? 'visible' : 'hidden'}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
          className="mb-20 bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="grid md:grid-cols-2 gap-0">
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { 
                    duration: 0.8,
                    delay: 0.6,
                    ease: [0.22, 1, 0.36, 1]
                  }
                }
              }}
              className="p-8 lg:p-12 bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-violet-50/80 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Advanced Location Analytics
              </h3>
              <div className="space-y-4 mb-6">
                {[
                  { icon: MapPin, text: "Interactive heat map visualization" },
                  { icon: BarChart2, text: "Geographic trip insights and patterns" },
                  { icon: TrendingUp, text: "Popular location frequency analysis" },
                  { icon: Settings, text: "Customizable pickup/dropoff tracking" }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { delay: 0.8 + (index * 0.1), duration: 0.6 }
                        }
                      }}
                      className="flex items-center"
                    >
                      <div className="bg-purple-100 p-2 rounded-lg mr-3">
                        <Icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-gray-700">{item.text}</span>
                    </motion.div>
                  );
                })}
              </div>
              <p className="text-gray-600">
                Gain valuable insights into your transportation patterns with comprehensive location analytics that help optimize routes and identify business opportunities.
              </p>
            </motion.div>
            
            <motion.div 
              className="relative"
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { 
                    duration: 0.8,
                    delay: 0.8,
                    ease: [0.22, 1, 0.36, 1]
                  }
                }
              }}
            >
              <div className="relative overflow-hidden h-full min-h-[400px]">
                <img
                  src="/Screenshot 2025-06-23 at 19.31.12 copy copy.png"
                  alt="Location Analytics Interface"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Call to Action for Feature Suggestions */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white mb-10"
        >
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 mr-3" />
              Have an Idea? We're Listening!
            </h2>
            <p className="text-xl mb-8">
              Keep the ideas coming—we're listening! We'll go through all your suggestions and bring the best ones to life.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:bg-blue-50"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Suggest a Feature
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate={showcaseInView ? 'visible' : 'hidden'}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
          className="mt-20 bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 p-8 lg:p-12"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { 
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1]
                  }
                }
              }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Why Choose RidePilot?
              </h3>
              <ul className="space-y-4">
                <motion.li 
                  className="flex items-start"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { delay: 0.1, duration: 0.6 }
                    }
                  }}
                >
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <span className="text-green-600 text-lg">✓</span>
                  </div>
                  <span className="ml-3 text-gray-600">
                    Open-source solution with no vendor lock-in
                  </span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { delay: 0.2, duration: 0.6 }
                    }
                  }}
                >
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <span className="text-green-600 text-lg">✓</span>
                  </div>
                  <span className="ml-3 text-gray-600">
                    Customizable to your specific needs
                  </span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { delay: 0.3, duration: 0.6 }
                    }
                  }}
                >
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <span className="text-green-600 text-lg">✓</span>
                  </div>
                  <span className="ml-3 text-gray-600">
                    Regular updates and community support
                  </span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { delay: 0.4, duration: 0.6 }
                    }
                  }}
                >
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <span className="text-green-600 text-lg">✓</span>
                  </div>
                  <span className="ml-3 text-gray-600">
                    Secure and compliant with industry standards
                  </span>
                </motion.li>
              </ul>
            </motion.div>
            <motion.div 
              className="relative"
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { 
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1]
                  }
                }
              }}
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000"
                  alt="Transportation Management"
                  className="rounded-lg shadow-lg object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg"></div>
              </div>
              
              {/* Floating element */}
              <motion.div 
                className="absolute -bottom-8 -right-8 bg-white rounded-lg shadow-xl p-4 z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cost-effective</p>
                    <p className="text-xs text-gray-500">Save up to 30%</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}