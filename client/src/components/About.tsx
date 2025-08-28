import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About RidePilot</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              RidePilot is an open-source, web-based transportation scheduling and reporting system 
              tailored for small to medium-sized agencies. It streamlines operations by enabling 
              efficient management of vehicles, drivers, customers, trips, and reports through an 
              intuitive interface.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Core Features</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Intuitive trip scheduling and management</li>
                  <li>• Real-time driver and vehicle tracking</li>
                  <li>• Automated compliance reporting</li>
                  <li>• Customer management system</li>
                  <li>• Payment tracking and processing</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Cost-effective solution</li>
                  <li>• Streamlined operations</li>
                  <li>• Improved efficiency</li>
                  <li>• Enhanced customer service</li>
                  <li>• Reduced administrative burden</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600 mb-6">
              Our mission is to provide transportation agencies with powerful, yet accessible tools 
              that simplify their daily operations. We believe in making transportation management 
              efficient, cost-effective, and user-friendly without compromising on features or 
              reliability.
            </p>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose RidePilot?</h3>
              <div className="grid md:grid-cols-2 gap-6 text-gray-600">
                <div>
                  <p className="mb-2 font-medium">For Agencies</p>
                  <ul className="space-y-2">
                    <li>• Comprehensive management tools</li>
                    <li>• Customizable reporting</li>
                    <li>• Scalable solution</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-2 font-medium">For Drivers</p>
                  <ul className="space-y-2">
                    <li>• Easy-to-use interface</li>
                    <li>• Real-time updates</li>
                    <li>• Efficient route management</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Company:</strong> Artcomp</p>
                <p><strong>Address:</strong> Kotnikova Ulica 5, Ljubljana, Slovenia</p>
                <p><strong>Email:</strong> ridepilot.info@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}