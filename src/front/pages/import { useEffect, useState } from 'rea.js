import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion'; // For animation
import { FaCheckCircle, FaStar, FaCrown } from 'react-icons/fa'; // Importing icons
import './PromotionsPage.css'; // Import custom CSS for scrollable section

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const promotionsPerPage = 6;

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get('http://localhost:3005/api/promotions');
        setPromotions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching promotions:', error);
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const filteredPromotions = promotions.filter(promotion =>
    promotion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promotion.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPromotion = currentPage * promotionsPerPage;
  const indexOfFirstPromotion = indexOfLastPromotion - promotionsPerPage;
  const currentPromotions = filteredPromotions.slice(indexOfFirstPromotion, indexOfLastPromotion);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="relative h-60">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://png.pngtree.com/thumb_back/fw800/background/20220217/pngtree-simple-atmosphere-black-line-promotion-background-image_954276.jpg)' }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <h1 className="text-4xl font-bold text-white relative z-10 flex justify-center items-center h-full font-poppins">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              PROMOTIONS
            </motion.div>
          </h1>
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="bg-opacity-20 bg-blue-500 rounded-full w-40 h-40 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search promotions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full mb-6"
        />

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPromotions.map((promotion) => (
            <div key={promotion._id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold">{promotion.title}</h2>
              <p className="text-gray-600">{promotion.description}</p>
              <a href={promotion.targetUrl} className="text-blue-500 hover:underline">
                Learn More
              </a>
              {promotion.mediaType === 'Image' && (
                <img src={promotion.mediaUrl} alt={promotion.title} className="mt-4 w-full h-auto rounded-md" />
              )}
              {promotion.mediaType === 'Video' && (
                <video controls className="mt-4 w-full h-auto rounded-md">
                  <source src={promotion.mediaUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: Math.ceil(filteredPromotions.length / promotionsPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-4 py-2 mx-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Promotion Packages Section */}
        <h2 className="text-3xl font-bold my-6 font-poppins">Promotion Packages</h2>
        <div className="promotion-packages-container overflow-x-auto flex space-x-4 p-4">
          <motion.div
            className="bg-gray-100 p-6 rounded-lg shadow-lg min-w-[300px] transition-transform transform hover:scale-105"
            whileHover={{ scale: 1.1 }}
          >
            <h3 className="text-2xl font-semibold mb-2 flex items-center">
              <FaCheckCircle className="mr-2 text-green-500" /> Basic Package
            </h3>
            <p className="text-gray-600 mb-4">Includes basic promotion services for startups and small businesses.</p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Online Listing</li>
              <li>Social Media Mention</li>
              <li>Email Campaign</li>
            </ul>
            <a href="#" className="text-blue-500 hover:underline">
              Learn More
            </a>
          </motion.div>

          <motion.div
            className="bg-gray-100 p-6 rounded-lg shadow-lg min-w-[300px] transition-transform transform hover:scale-105"
            whileHover={{ scale: 1.1 }}
          >
            <h3 className="text-2xl font-semibold mb-2 flex items-center">
              <FaStar className="mr-2 text-yellow-500" /> Standard Package
            </h3>
            <p className="text-gray-600 mb-4">Best suited for medium-sized businesses looking for comprehensive promotion.</p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Featured Listing</li>
              <li>Social Media Campaign</li>
              <li>Press Release</li>
            </ul>
            <a href="#" className="text-blue-500 hover:underline">
              Learn More
            </a>
          </motion.div>

          <motion.div
            className="bg-gray-100 p-6 rounded-lg shadow-lg min-w-[300px] transition-transform transform hover:scale-105"
            whileHover={{ scale: 1.1 }}
          >
            <h3 className="text-2xl font-semibold mb-2 flex items-center">
              <FaCrown className="mr-2 text-purple-500" /> Premium Package
            </h3>
            <p className="text-gray-600 mb-4">Comprehensive promotion for established businesses aiming for growth.</p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Premium Listing</li>
              <li>Custom Ad Campaign</li>
              <li>Content Creation</li>
            </ul>
            <a href="#" className="text-blue-500 hover:underline">
              Learn More
            </a>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PromotionsPage;
