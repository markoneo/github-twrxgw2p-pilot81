import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              Effective Date: April 15, 2025
            </p>

            <p className="text-gray-600 mb-6">
              RidePilot ("we," "our," or "us") is committed to protecting and respecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and safeguard your personal data when you visit our website and use our services.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Data Controller</h3>
                <p className="text-gray-600">
                  The data controller responsible for your personal data is:
                </p>
                <p className="text-gray-600 mt-2">
                  RidePilot<br />
                  Kottnikova Ulica 5<br />
                  Ljubljana, Slovenia<br />
                  Email: <a href="mailto:ridepilot.info@gmail.com" className="text-green-600 hover:text-green-700">ridepilot.info@gmail.com</a>
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Information We Collect</h3>
                <p className="text-gray-600">
                  We may collect and process the following types of personal data:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mt-2 space-y-2">
                  <li>
                    <strong>Personal Identification Information:</strong> Name, email address, phone number, etc.
                  </li>
                  <li>
                    <strong>Technical Data:</strong> IP address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Information about how you use our website, products, and services.
                  </li>
                  <li>
                    <strong>Marketing and Communications Data:</strong> Your preferences in receiving marketing from us and your communication preferences.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">3. How We Use Your Information</h3>
                <p className="text-gray-600">
                  We use your personal data for the following purposes:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mt-2 space-y-2">
                  <li>
                    <strong>To Provide Services:</strong> Facilitating your use of our transportation assistant services.
                  </li>
                  <li>
                    <strong>To Communicate:</strong> Responding to inquiries, sending service updates, and providing customer support.
                  </li>
                  <li>
                    <strong>To Improve Our Services:</strong> Analyzing usage to enhance user experience and service functionality.
                  </li>
                  <li>
                    <strong>Marketing:</strong> Sending promotional materials, subject to your consent.
                  </li>
                  <li>
                    <strong>Legal Obligations:</strong> Complying with legal and regulatory requirements.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Legal Basis for Processing</h3>
                <p className="text-gray-600">
                  We process your personal data based on the following legal grounds:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mt-2 space-y-2">
                  <li>
                    <strong>Consent:</strong> Where you have given us explicit permission to process your data.
                  </li>
                  <li>
                    <strong>Contractual Necessity:</strong> Processing necessary for the performance of a contract with you.
                  </li>
                  <li>
                    <strong>Legal Obligation:</strong> Processing required to comply with legal obligations.
                  </li>
                  <li>
                    <strong>Legitimate Interests:</strong> Processing necessary for our legitimate interests, provided your interests and fundamental rights do not override those interests.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">5. Data Sharing and Disclosure</h3>
                <p className="text-gray-600">
                  We may share your personal data with:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mt-2 space-y-2">
                  <li>
                    <strong>Service Providers:</strong> Third parties who provide services on our behalf.
                  </li>
                  <li>
                    <strong>Legal Authorities:</strong> When required by law or to protect our legal rights.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">6. International Data Transfers</h3>
                <p className="text-gray-600">
                  If we transfer your personal data outside the European Economic Area (EEA), we ensure appropriate safeguards are in place to protect your data in accordance with GDPR requirements.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">7. Data Security</h3>
                <p className="text-gray-600">
                  We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">8. Data Retention</h3>
                <p className="text-gray-600">
                  We retain your personal data only for as long as necessary to fulfill the purposes we collected it for, including satisfying any legal, accounting, or reporting requirements.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">9. Your Rights</h3>
                <p className="text-gray-600">
                  Under GDPR, you have the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mt-2 space-y-2">
                  <li>
                    <strong>Access:</strong> Request access to your personal data.
                  </li>
                  <li>
                    <strong>Rectification:</strong> Request correction of inaccurate or incomplete data.
                  </li>
                  <li>
                    <strong>Erasure:</strong> Request deletion of your personal data.
                  </li>
                  <li>
                    <strong>Restriction:</strong> Request restriction of processing your personal data.
                  </li>
                  <li>
                    <strong>Data Portability:</strong> Request transfer of your personal data to another party.
                  </li>
                  <li>
                    <strong>Objection:</strong> Object to processing of your personal data.
                  </li>
                  <li>
                    <strong>Withdraw Consent:</strong> Withdraw consent at any time where we are relying on consent to process your personal data.
                  </li>
                </ul>
                <p className="text-gray-600 mt-2">
                  To exercise any of these rights, please contact us at <a href="mailto:ridepilot.info@gmail.com" className="text-green-600 hover:text-green-700">ridepilot.info@gmail.com</a>.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">10. Cookies</h3>
                <p className="text-gray-600">
                  Our website uses cookies to enhance user experience. For detailed information on the cookies we use and the purposes for which we use them, please refer to our Cookie Policy.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">11. Third-Party Links</h3>
                <p className="text-gray-600">
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices of these websites and encourage you to read their privacy policies.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">12. Changes to This Privacy Policy</h3>
                <p className="text-gray-600">
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">13. Contact Us</h3>
                <p className="text-gray-600">
                  If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
                </p>
                <p className="text-gray-600 mt-2">
                  RidePilot<br />
                  Kottnikova Ulica 5<br />
                  Ljubljana, Slovenia<br />
                  Email: <a href="mailto:ridepilot.info@gmail.com" className="text-green-600 hover:text-green-700">ridepilot.info@gmail.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}