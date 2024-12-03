import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules'; // Import Autoplay module from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar'; // Include if you want scrollbars
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Imges1 from '../image/view-city-square.jpg';
import Imges2 from '../image/4.jpg';
import Imges3 from '../image/2.jpg';
import Imges4 from '../image/3.jpg';
import FAQ from '../image/faq.jpg';
import AnimatedIcon from './AnimatedIcon';
import { FaArrowRight, FaRegListAlt, FaBullhorn, FaHandHoldingUsd, FaUsersCog } from 'react-icons/fa';
import { AiOutlineCheckCircle, AiOutlineHome } from 'react-icons/ai';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage = () => {
  const [companies, setCompanies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0); // Open the first FAQ item by default
  const [notifications, setNotifications] = useState([]);
  const token = 'your-auth-token'; // Replace with actual token
  const faqVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' }
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true, // Whether animation should happen only once - while scrolling down
    });
  }, []);


  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:3005/api/companies', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies', error);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:3005/api/promotions');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications', error);
      }
    };

    fetchNotifications();
  }, []);
  
  const images = [
    {
      src: Imges1,
      title: 'Welcome to Z-Group',
      link: '/about',
    },
    {
      src: Imges3,
      title: 'Company Registration',
      link: '/companies',
    },
    {
      src: Imges4,
      title: 'Promotion Services',
      link: '/promotions',
    },
  ];

  // FAQ Questions and Answers
  const faqs = [
    { question: 'What services do you offer?', answer: 'We offer a range of services including company registration, promotion services, and business consultation.' },
    { question: 'How do I register my company?', answer: 'You can register your company by filling out our online form, and our team will assist you with the entire process.' },
    { question: 'What are your promotion strategies?', answer: 'Our promotion strategies are tailored to your business needs, focusing on increasing visibility and attracting customers.' },
    { question: 'How much do your services cost?', answer: 'Our pricing is competitive and varies depending on the services you choose. Contact us for a detailed quote.' },
    { question: 'How can I get started?', answer: 'Getting started is easy! Just contact us, and we’ll guide you through the process.' },
  ];

  // Toggle FAQ
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="font-roboto">
      <Navbar />
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-4">
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 3000 }} // Delay is set to 3 seconds
          loop={true}
          modules={[Autoplay]} // Add Autoplay module here
          className="notification-swiper"
        >
          {notifications.map((notification, index) => (
            <SwiperSlide key={index}>
              <div className="text-center p-4 rounded-lg shadow-md bg-opacity-75">
                {notification.title}: {notification.description}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Image Slider Section */}
      <div className="relative mt-0">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          modules={[Autoplay]} // Add Autoplay module here
          autoplay={{ delay: 3000, disableOnInteraction: false }} // Configure autoplay
          className="image-swiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-screen">
                <img
                  src={image.src}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover" style={{objectFit: 'cover', objectPosition: 'center', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed'}}    
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 text-white p-4">
                  <h1 className="text-4xl font-bold mb-4">{image.title}</h1>
                  <a href={image.link}
                    className="bg-blue-600 px-4 py-2 no-underline rounded text-white hover:bg-blue-700 flex items-center justify-center"
                  >
                    <FaArrowRight className="hover:animate-spin transform transition duration-500" />
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <main className="container mx-auto p-6">
        <p className="text-lg mb-6">
          Welcome to Z-Group Company, where we specialize in company registration and promotion. Our goal is to simplify the process of setting up your business and help you gain visibility in the market.
        </p>
        <p className="text-base mb-6">
          We provide comprehensive solutions tailored to your needs, whether you're a new business seeking registration or an existing company looking to enhance your presence through targeted promotions.
        </p>

        {/* Services Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 font-poppins">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-110 hover:shadow-2xl hover:bg-indigo-500 hover:text-blue-500">
              <div className="flex items-center mb-4">
                <FaRegListAlt className="text-4xl text-blue-600 mr-4" />
                <h3 className="text-xl font-semibold">Company Registration</h3>
              </div>
              <p className="text-gray-600 hover:text-blue-500">
                We provide hassle-free company registration services to get your business up and running.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-110 hover:shadow-2xl hover:bg-indigo-500 hover:text-blue-500">
              <div className="flex items-center mb-4">
                <FaBullhorn className="text-4xl text-blue-600 mr-4" />
                <h3 className="text-xl font-semibold">Promotion Services</h3>
              </div>
              <p className="text-gray-600 hover:text-blue-500">
                Boost your company's visibility with our targeted promotion strategies.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-110 hover:shadow-2xl hover:bg-indigo-500 hover:text-blue-500">
              <div className="flex items-center mb-4">
                <FaHandHoldingUsd className="text-4xl text-blue-600 mr-4" />
                <h3 className="text-xl font-semibold">Consultation</h3>
              </div>
              <p className="text-gray-600 hover:text-blue-500">
                Get expert advice and guidance on various business aspects to help you succeed.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 font-poppins">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <AiOutlineCheckCircle className="text-4xl text-blue-600 mr-4" />
                <h3 className="text-xl font-semibold">Expert Team</h3>
              </div>
              <p className="text-gray-600">
                Our team consists of experienced professionals who are dedicated to your success.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <FaUsersCog className="text-4xl text-blue-600 mr-4" />
                <h3 className="text-xl font-semibold">Tailored Solutions</h3>
              </div>
              <p className="text-gray-600">
                We offer customized solutions that cater to your specific business needs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <AiOutlineHome className="text-4xl text-blue-600 mr-4" />
                <h3 className="text-xl font-semibold">Comprehensive Services</h3>
              </div>
              <p className="text-gray-600">
                From registration to promotion, we provide a full range of services under one roof.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 font-poppins">Frequently Asked Questions</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4">
                <div
                  className="cursor-pointer flex items-center justify-between text-lg font-semibold text-blue-600 hover:text-blue-800"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <span>{activeIndex === index ? '-' : '+'}</span>
                </div>
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={faqVariants}
                      className="mt-2 text-gray-600"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
