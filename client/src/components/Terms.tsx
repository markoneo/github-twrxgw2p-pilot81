import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              Effective Date: April 15, 2025
            </p>

            <p className="text-gray-600 mb-6">
              Welcome to RidePilot. By accessing or using our services, you agree to be bound by these Terms and Conditions. Please read them carefully.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h3>
                <p className="text-gray-600">
                  By using RidePilot's website and services, you agree to comply with and be legally bound by these Terms and Conditions, as well as our Privacy Policy. If you do not agree to these terms, please refrain from using our services.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Services Provided</h3>
                <p className="text-gray-600">
                  RidePilot offers a platform that connects users with transportation services, providing information, booking capabilities, and other related functionalities. We do not own or operate any transportation vehicles; instead, we facilitate connections between users and third-party transportation providers.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">3. User Responsibilities</h3>
                <p className="text-gray-600">
                  <strong>Account Information:</strong> You agree to provide accurate and complete information when creating an account and to update your information as necessary.
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Compliance:</strong> You agree to comply with all applicable laws and regulations when using our services.
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Prohibited Activities:</strong> You will not misuse our services, including but not limited to engaging in fraudulent activities, disrupting the service, or infringing on the rights of others.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Third-Party Services</h3>
                <p className="text-gray-600">
                  Our platform may include links to third-party websites or services. RidePilot is not responsible for the content, policies, or practices of these third parties. Your interactions with third-party services are governed by their respective terms and conditions.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">5. Intellectual Property</h3>
                <p className="text-gray-600">
                  All content on the RidePilot website, including text, graphics, logos, and software, is the property of RidePilot or its licensors and is protected by intellectual property laws. Unauthorized use of any content is prohibited.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">6. Limitation of Liability</h3>
                <p className="text-gray-600">
                  RidePilot is not liable for any direct, indirect, incidental, or consequential damages resulting from your use of our services. We do not guarantee the accuracy, reliability, or availability of our services at all times.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">7. Indemnification</h3>
                <p className="text-gray-600">
                  You agree to indemnify and hold harmless RidePilot, its affiliates, and their respective officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses arising out of your use of our services or violation of these Terms and Conditions.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">8. Termination</h3>
                <p className="text-gray-600">
                  We reserve the right to suspend or terminate your access to our services at our discretion, without notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users or us.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">9. Changes to Terms</h3>
                <p className="text-gray-600">
                  RidePilot may modify these Terms and Conditions at any time. We will notify users of significant changes by posting the updated terms on our website. Your continued use of our services after such changes constitutes your acceptance of the new terms.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">10. Governing Law</h3>
                <p className="text-gray-600">
                  These Terms and Conditions are governed by the laws of Slovenia. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in Ljubljana, Slovenia.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">11. Contact Information</h3>
                <p className="text-gray-600">
                  For any questions or concerns regarding these Terms and Conditions, please contact us at:{' '}
                  <a href="mailto:ridepilot.info@gmail.com" className="text-green-600 hover:text-green-700">
                    ridepilot.info@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}