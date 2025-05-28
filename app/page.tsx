  "use client"

  import { useEffect, useState, ChangeEvent } from "react";
  import AcmeLogo from "@/app/ui/acme-logo";
  import { ArrowRightIcon } from "@heroicons/react/24/outline";
  import Link from "next/link";
  import { lusitana } from "@/app/ui/fonts";
  // import { BanknotesIcon, DocumentTextIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
  import { motion } from "framer-motion";
  import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
  import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
  import { BarChart, Bar, Cell } from "recharts";
import SignIn from "@/app/components/sign-in-resen";


  // Define types for props
  type FooterProps = {
    bgColor: string;
    textColor: string;
    iconColor: string;
    handleColorChangeFooter: (type: string, value: string) => void;
  };

  // Reusable Footer Component


const Footer = ({ bgColor, textColor, iconColor, handleColorChangeFooter }: FooterProps) => {
  return (
    <footer className="py-8 mt-16" style={{ backgroundColor: bgColor }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: textColor }}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["Home", "About Ethiopia", "Services", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-teal-500 transition-colors"
                    style={{ color: textColor }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: textColor }}>
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li style={{ color: textColor }}>
                Bole Road, Addis Ababa, Ethiopia
              </li>
              <li style={{ color: textColor }}>
                Email: support@ethiopiaexample.com
              </li>
              <li style={{ color: textColor }}>
                Phone: +251 911 123 456
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4" style={{ color: textColor }}>
              Follow Us
            </h3>
            <div className="flex space-x-6">
              {[
                { icon: FaFacebook, url: "https://www.facebook.com/EthiopiaPage" },
                { icon: FaTwitter, url: "https://twitter.com/EthiopiaGov" },
                { icon: FaInstagram, url: "https://www.instagram.com/visitethiopia" },
                { icon: FaLinkedin, url: "https://www.linkedin.com/company/ethiopia-development" },
              ].map(({ icon: Icon, url }) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-500 transition-colors"
                >
                  <Icon className="w-6 h-6" style={{ color: iconColor }} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-gray-700 pt-6 mt-8 text-center">
          <p className="text-sm" style={{ color: textColor }}>
            &copy; 2025 Ethiopian Tech Solutions. All rights reserved.
          </p>
        </div>

        {/* Color Picker Controls */}
        <div className="mt-8 flex gap-4 justify-center">
          {[
            { label: "Text Color", value: textColor, type: "text" },
            { label: "Background Color", value: bgColor, type: "bg" },
            { label: "Icon Color", value: iconColor, type: "icon" },
          ].map(({ label, value, type }) => (
            <div key={type}>
              <label className="text-white font-medium">{label}:</label>
              <input
                type="color"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleColorChangeFooter(type, e.target.value)
                }
                className="ml-2 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};



  export default function HomePage() {
    const [primaryColor, setPrimaryColor] = useState<string>("#14b8a6");
    const [textColor, setTextColor] = useState<string>("#ffffff");
    const [bgColor, setBgColor] = useState<string>("#1f2937");
    const [iconColor, setIconColor] = useState<string>("#ffffff");

    // Load colors from local storage
    useEffect(() => {
      const savedPrimaryColor = localStorage.getItem("primaryColor") || primaryColor;
      const savedTextColor = localStorage.getItem("footerTextColor") || textColor;
      const savedBgColor = localStorage.getItem("footerBgColor") || bgColor;
      const savedIconColor = localStorage.getItem("footerIconColor") || iconColor;

      setPrimaryColor(savedPrimaryColor);
      setTextColor(savedTextColor);
      setBgColor(savedBgColor);
      setIconColor(savedIconColor);
    }, []);

    // Update CSS variables
    useEffect(() => {
      document.documentElement.style.setProperty("--primary-color", primaryColor);
      document.documentElement.style.setProperty("--footer-bg-color", bgColor);
      document.documentElement.style.setProperty("--footer-text-color", textColor);
      document.documentElement.style.setProperty("--footer-icon-color", iconColor);
    }, [primaryColor, bgColor, textColor, iconColor]);

    // Handle color changes
    const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
      const newColor = event.target.value;
      setPrimaryColor(newColor);
      localStorage.setItem("primaryColor", newColor);
    };

    const handleColorChangeFooter = (type: string, value: string) => {
      const setters: { [key: string]: (value: string) => void } = {
        text: setTextColor,
        bg: setBgColor,
        icon: setIconColor,
      };
      setters[type](value);
      localStorage.setItem(`footer${type.charAt(0).toUpperCase() + type.slice(1)}Color`, value);
    };

    // Sample data for charts
    const savingsData = [
      { month: "Jan", savings: 4000 },
      { month: "Feb", savings: 3000 },
      { month: "Mar", savings: 5000 },
      { month: "Apr", savings: 6000 },
      { month: "May", savings: 4500 },
      { month: "Jun", savings: 7000 },
    ];

    const loanData = [
      { month: "Jan", loan: 2400 },
      { month: "Feb", loan: 1398 },
      { month: "Mar", loan: 9800 },
      { month: "Apr", loan: 3908 },
      { month: "May", loan: 4800 },
      { month: "Jun", loan: 3800 },
    ];

    return (
      <main className="flex min-h-screen flex-col p-6 bg-gray-100 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex h-20 md:h-52 shrink-0 items-center justify-between rounded-lg p-4"
          style={{ backgroundColor: primaryColor }}
        >
          <AcmeLogo />
          <div>
            <label className="text-white font-medium">Theme Color:</label>
            <input
              type="color"
              value={primaryColor}
              onChange={handleColorChange}
              className="ml-2 cursor-pointer bg-transparent border-none"
            />
          </div>
        </motion.div>

        <div className="mt-8 flex flex-col md:flex-row gap-6 justify-center md:p-3 p-6">
          {/* Left Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col justify-center gap-6 rounded-lg p-8 md:w-2/5"
          >
            <h1 className={`${lusitana.className} text-4xl font-bold text-gray-800 dark:text-white`}>
              Credit, Loan & Savings Management System
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              A secure platform for managing financial transactions, savings, and loan applications.
            </p>
            <div className="flex gap-4">
              <Link
                href="/auth/login"
                className="flex items-center gap-3 rounded-lg px-6 py-3 text-white font-medium transition hover:opacity-80"
                style={{ backgroundColor: primaryColor }}
              >
                Log in <ArrowRightIcon className="w-5" />
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center gap-3 border border-gray-400 px-6 py-3 rounded-lg text-gray-800 dark:text-white font-medium transition hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Register <ArrowRightIcon className="w-5" />
              </Link>
            </div>
          </motion.div>

          {/* Right Section */}
          <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="flex flex-col justify-center gap-6 rounded-lg p-8 md:w-3/5"
  >
    <h2 className={`${lusitana.className} text-4xl font-bold text-gray-800 dark:text-white`}>
      Your Financial Freedom Starts Here
    </h2>
    <p className="text-lg text-gray-600 dark:text-gray-300">
    Take control of your finances with our easy-to-use tools and personalized insights. Whether you're saving for the future, managing credit, or applying for a loan, we’re here to help you every step of the way.  </p>

    


      
  </motion.div>
        </div>
        <SignIn/>
        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Savings Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Savings Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={savingsData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="savings" stroke={primaryColor} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Loan Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Loan Repayment</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={loanData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="loan" fill={primaryColor} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Footer */}
        <Footer
          bgColor={bgColor}
          textColor={textColor}
          iconColor={iconColor}
          handleColorChangeFooter={handleColorChangeFooter}
        />
      </main>
    );
  }