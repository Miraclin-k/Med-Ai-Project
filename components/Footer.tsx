import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MedAI+</h3>
            <p className="text-gray-400">Your trusted partner in AI-driven healthcare and clinical decision support.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">Find a Doctor</a></li>
              <li><a href="#" className="hover:text-white">Book an Appointment</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400">123 Health St, Med-City, 10101</p>
            <p className="text-gray-400">iniyan.workhub@gmail.com</p>
            <p className="text-gray-400">miraclinkulandaisamy@gmail.com</p>
            <p className="text-gray-400">(555) 123-4567</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} MedAI+ Systems. All rights reserved. This is a demonstration application.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;