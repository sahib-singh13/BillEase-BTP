import React from 'react';

const About = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('Untitled design.jpg')" }}
    >
      <div className="bg-orange-50 bg-opacity-90 p-8 md:p-12 rounded-2xl mx-4 my-8 max-w-6xl w-full shadow-xl overflow-y-auto max-h-[90vh] custom-scrollbar">
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(254, 215, 170, 0.3);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #fb923c;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #f97316;
          }
        `}</style>

        <h1 className="text-4xl font-bold text-center mb-8 text-orange-800">About BILLEASE</h1>
        
        <div className="space-y-8 text-orange-900">
          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              The "About" page of BILLEASE serves as an introduction to a cutting-edge platform 
              designed to revolutionize the way individuals manage their purchase records. BILLEASE 
              is a sophisticated system tailored to simplify the storage and display of digital bills 
              issued by local retailers. By transitioning from traditional paper-based receipts to an 
              environmentally friendly digital solution, the platform not only contributes to reducing 
              waste but also enhances convenience for both retailers and customers.
            </p>

            <p>
              With BILLEASE, users can securely store and access their digital bills at any time, 
              eliminating the need to keep physical receipts that can be easily lost or damaged. 
              The platform is designed with a user-friendly interface, ensuring seamless navigation 
              while offering advanced features such as real-time access to purchase history, organized 
              storage of bills, and easy retrieval of transaction details. Retailers, on the other hand, 
              benefit from the streamlined process of issuing digital receipts, fostering stronger 
              customer relationships and adopting sustainable business practices.
            </p>

            <p>
              At its core, BILLEASE prioritizes data security and privacy, implementing robust measures 
              to ensure the confidentiality and integrity of stored information. By bridging the gap 
              between retailers and customers through an innovative, paperless billing system, BILLEASE 
              positions itself as a leader in modern retail technology. Whether for everyday shopping or 
              maintaining long-term financial records, the platform empowers users to stay organized, 
              eco-conscious, and prepared for a more digital future.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-orange-100 p-6 rounded-xl border border-orange-200">
              <h3 className="text-xl font-semibold text-orange-700 mb-4">User Benefits</h3>
              <ul className="space-y-3 text-orange-800">
                <li>🌱 Eco-friendly digital receipts</li>
                <li>🔒 Secure cloud storage</li>
                <li>📱 24/7 Access from any device</li>
                <li>📈 Purchase history analytics</li>
              </ul>
            </div>

            <div className="bg-orange-100 p-6 rounded-xl border border-orange-200">
              <h3 className="text-xl font-semibold text-orange-700 mb-4">Retailer Features</h3>
              <ul className="space-y-3 text-orange-800">
                <li>🚀 Instant digital billing</li>
                <li>📊 Customer insights</li>
                <li>🌍 Sustainable practice</li>
                <li>🤝 Enhanced engagement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;