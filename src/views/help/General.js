import React, { useState, useEffect } from 'react';
import './css/General.css'; // Make sure this CSS file exists

const General = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Fade in the entire component after a short delay
    const timeoutId = setTimeout(() => {
      setIsLoaded(true);
    }, 200); // A bit longer delay than usual
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={`general-info ${isLoaded ? 'loaded' : ''}`}>
      <h5>BetaPMS: The All-In-One Solution for Modern Property Management</h5>
      <p>
        In today's fast-paced and competitive real estate landscape, efficient and effective property
        management is no longer a luxury – it's a necessity. BetaPMS provides a robust and
        user-friendly platform that revolutionizes the way you manage your properties, empowering
        you to achieve greater profitability, tenant satisfaction, and operational excellence.
      </p>

      <h6>Beyond the Basics: Why Choose BetaPMS?</h6>
      <ul>
        <li>
          <strong>Proactive Maintenance Management:</strong> Move beyond reactive repairs with preventative
          maintenance scheduling, automated reminders, and detailed maintenance history tracking.
          Identify potential problems before they escalate, saving time and money.
        </li>
        <li>
          <strong>Advanced Tenant Screening:</strong> Minimize risks with integrated tenant screening
          tools that provide comprehensive background checks, credit reports, and eviction history.
          Ensure you're placing reliable and responsible tenants.
        </li>
        <li>
          <strong>Automated Lease Management:</strong> Streamline the lease process with customizable
          lease templates, automated reminders for lease renewals, and secure online document storage.
          Eliminate paperwork and improve efficiency.
        </li>
        <li>
          <strong>Integrated Accounting & Financial Reporting:</strong> Simplify financial management with
          automated rent collection, expense tracking, and powerful reporting tools. Generate accurate
          financial statements with ease, gain insights into your profitability, and make
          data-driven decisions.
        </li>
        <li>
          <strong>Mobile Accessibility:</strong> Manage your properties from anywhere, at any time, with
          BetaPMS's mobile-friendly interface. Stay connected to your tenants and staff, even when
          you're on the go.
        </li>
        <li>
          <strong>Customizable Workflows:</strong> Tailor BetaPMS to your specific needs with
          customizable workflows and user roles. Ensure that your team is working efficiently and
          effectively.
        </li>
        <li>
          <strong>Scalability:</strong> BetaPMS is designed to grow with your business. Whether you manage
          a single property or a large portfolio, BetaPMS can handle your increasing needs.
        </li>
        <li>
          <strong>Secure Data Storage:</strong> Rest assured knowing your valuable data is securely stored
          with industry-leading encryption and security protocols.
        </li>
        <li>
          <strong>Dedicated Support:</strong> Benefit from dedicated support and training to ensure you get
          the most out of BetaPMS.
        </li>
      </ul>

      <h6>Key Features Expanded:</h6>
      <ul>
        <li>
          <strong>Intelligent Property Marketing:</strong> Create stunning property listings with
          high-resolution images, virtual tours, and detailed descriptions. Automatically syndicate
          your listings to leading online portals, maximizing your reach and attracting qualified
          tenants.
        </li>
        <li>
          <strong>Streamlined Tenant Onboarding:</strong> Simplify the tenant onboarding process with online
          applications, digital signatures, and automated welcome packages. Create a positive first
          impression and foster strong tenant relationships.
        </li>
        <li>
          <strong>Automated Rent Payment Reminders:</strong> Reduce late payments with automated rent
          payment reminders sent via email or SMS. Make it easy for tenants to pay on time, every time.
        </li>
        <li>
          <strong>Comprehensive Reporting & Analytics:</strong> Generate a wide range of reports, including
          occupancy rates, rent collection summaries, maintenance expenses, and profit and loss
          statements. Gain actionable insights to improve your property performance.
        </li>
        <li>
          <strong>Alerts and Notifications:</strong> Stay in the know with real-time alerts for important
          events, such as late rent payments, maintenance requests, and lease expirations.
        </li>
      </ul>

      <h6>Who Can Benefit from BetaPMS?</h6>
      <ul>
        <li>
          <strong>Residential Property Managers:</strong> Manage apartment complexes, single-family homes, and
          multi-unit dwellings with ease.
        </li>
        <li>
          <strong>Commercial Property Managers:</strong> Oversee office buildings, retail centers, and
          industrial properties efficiently.
        </li>
        <li>
          <strong>Homeowners Associations (HOAs):</strong> Streamline HOA management with features for
          managing dues, maintenance requests, and community communications.
        </li>
        <li>
          <strong>Real Estate Investors:</strong> Maximize your returns and streamline your property
          management operations with BetaPMS's powerful features.
        </li>
      </ul>

      <p>
        BetaPMS is more than just software; it's a strategic investment that will transform your
        property management operations, improve your bottom line, and enhance the overall experience
        for your tenants and staff. Discover the difference BetaPMS can make.
      </p>
    </div>
  );
};

export default General;