import React, { useEffect } from "react";
import Mobile_Sidebar from "../components/Mobile_Sidebar";
import { useState } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { API_URL } from "../components/config";
import enUS from "date-fns/locale/en-US";

const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function Bidding_details() {
  const navigate = useNavigate();

  //   const [isLoading, setisLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("NDA");
  const [activeProtocolTab, setActiveProtocolTab] = useState("intern");

  const [holidaysList, setHolidaysList] = useState([]);

  // const fetchHolidaysList = async () => {
  //   try {
  //     let response = await axios.get(
  //       `${API_URL}/api/upcomingholiday/view-upcomingholiday`
  //     );
  //     setHolidaysList(response.data.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchHolidaysList();
  // }, []);

  //   const [events, setEvents] = useState([]);

  //   useEffect(() => {
  //     axios
  //       .get(`${API_URL}api/upcomingholiday/view-upcomingholiday`)
  //       .then((res) => {
  //         const holidayEvents = res.data.data.map((holiday) => ({
  //           title: holiday.reason,
  //           start: new Date(holiday.date),
  //           end: new Date(holiday.date),
  //           allDay: true,
  //         }));
  //         setEvents(holidayEvents);
  //       });
  //   }, []);

  const [activeTab1, setActiveTab1] = useState("WordPress");

  const categories = {
    WordPress: [
      {
        name: "Conversion Media Group",
        url: "https://conversionmediagroup.com/",
      },
      {
        name: "Biokosmetik of Texas (WooCommerce)",
        url: "https://www.biokosmetikoftexas.com/",
      },
      { name: "Skincare USA (WooCommerce)", url: "https://skincare-usa.com/" },
      {
        name: "Vistap Global (Customized Theme)",
        url: "https://vistapglobal.com/",
      },
      { name: "Stream PCB", url: "https://streampcb.com/" },
      { name: "Medics Research", url: "https://medicsresearch.com/" },
      { name: "Online Diabetic Help", url: "https://onlinediabetichelp.com/" },
      { name: "Malcovid Yalaya", url: "https://malcovidyalaya.com/" },
      { name: "Pioneer BS", url: "https://pioneerbs.com/" },
      { name: "Delta Study Abroad", url: "https://deltastudyabroad.com/" },
      { name: "HR Metrics", url: "https://hrmetrics.in/" },
      { name: "Innerpece Blog", url: "https://blogs.innerpece.com/" },
      { name: "Debt Settlement", url: "https://www.debtsettlement.us/" },
      { name: "MatchPro Media", url: "https://www.matchpromedia.com/" },
    ],
    "PHP & MongoDB": [
      {
        name: "Conversion Media Group – Call Center LMS",
        url: "https://intranet.conversionmediagroup.com/admin/",
      },
      {
        name: "Emergency Response – Call Center LMS",
        url: "https://backoffice.emergencyresponse911.com/admin/",
      },
    ],
    "React & Laravel": [
      {
        name: "Project Management Tool",
        url: "https://pmtool.medicsresearch.com/",
      },
      { name: "Event Management", url: "https://backoffice.innerpece.com/" },
      { name: "HRMS", url: "https://hrms.medicsresearch.com/" },
    ],
    Laravel: [
      { name: "Circuit.pk – Ecommerce", url: "https://circuit.pk/" },
      { name: "Gadget Mart – Ecommerce", url: "https://gadgetmart4444.in/" },
      { name: "Lanka4 – News Portal", url: "https://lanka4.com/" },
      {
        name: "Aryu Academy – Lead Management",
        url: "https://backoffice.aryuacademy.com/",
      },
      {
        name: "Health Insurance",
        url: "https://aca.conversionmediagroup.com/admin",
      },
      { name: "Debt Settlement Admin", url: "http://18.219.88.54/admin" },
    ],
    MERN: [
      { name: "Utilities Grid", url: "https://app.utilitiesgrid.com/company" },
    ],
    "React JS": [
      { name: "Aryu Enterprises", url: "https://aryuenterprises.com/" },
      { name: "Aryu Technologies", url: "https://aryutechnologies.com/" },
      { name: "Aryu Academy", url: "https://aryuacademy.com/" },
      { name: "Yes to Boss", url: "https://yestoboss.com/" },
      { name: "Innerpece", url: "http://innerpece.com/" },
      { name: "Aryu Agency", url: "https://aryu.agency/" },
      { name: "Storyrise", url: "https://storyrise.in/" },
    ],
    "React Native": [
      {
        name: "Utilities Grid Mobile App",
        url: "https://app.utilitiesgrid.com/company",
      },
    ],
    Shopify: [
      {
        name: "Emergency Response Shop",
        url: "https://shop.emergencyresponse911.com/",
      },
      { name: "Avinsaa", url: "https://avinsaa.com/" },
    ],
    "Python & HTML": [
      { name: "Gadget Mart Data Scraping", url: "https://gadgetmart4444.in/" },
    ],
    "Python & React": [
      { name: "Aryu Academy Portal", url: "http://portal.aryuacademy.com/" },
    ],
  };
  return (
    <div className="flex  flex-col justify-between w-screen min-h-screen bg-gray-100 px-3 md:px-5 pt-2 md:pt-10 ">
      <div className="p-3 ">
        <Mobile_Sidebar />

        {/* breadcrumb */}
        <div className="flex gap-2  text-sm items-center">
          <p className="text-sm text-blue-500 ">Bidding Assest</p>
          <p>{">"}</p>
        </div>
        <section className=" mt-5 flex pt-5">
          <div className="bg-white p-6 rounded-xl shadow-md w-full">
            {/* Tab Buttons */}
            <div className="flex gap-6 mb-4 border-b pb-2">
              {["NDA", "About", "tech", "Portfolio"].map((tab) => (
                <div
                  key={tab}
                  className={`px-4 py-2 rounded-t-lg transition-all duration-300 cursor-pointer font-medium
          ${
            activeTab === tab
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "NDA"
                    ? "NDA"
                    : tab === "About"
                    ? "About company"
                    : tab === "tech"
                    ? "Technologies"
                    : "Portfolio"}
                </div>
              ))}
            </div>

            {/* Tab Content */}
            <div
              className="transition-all duration-500 ease-in-out animate-fade-in bg-gray-100 p-6 rounded-lg shadow-sm"
              key={activeTab}
            >
              {/* {activeTab === "NDA" && (
                <div className="text-gray-800 space-y-6">
                  <h2 className="text-xl font-bold border-b pb-2">Non-Disclosure Agreement(NDA) </h2>
                </div>
              )} */}

              {activeTab === "NDA" && (
                <div className="text-gray-800 space-y-8 leading-relaxed px-6 py-4">
                  {/* Header */}
                  <h2 className="text-2xl font-bold  border-b pb-3 mb-6">
                    Non-Disclosure Agreement (NDA)
                  </h2>

                  {/* Intro */}
                  <p>
                    {/* This Non-Disclosure Agreement (the “Agreement”) is made and entered into
      by and between <span className="font-semibold">[Company Name]</span>, a
      company incorporated under the laws of India, having its registered office
      at <span className="font-semibold">[Company Address]</span> (the
      “Disclosing Party”), and{" "}
      <span className="font-semibold">[Recipient Name]</span>, an individual
      residing at <span className="font-semibold">[Recipient Address]</span>
      (the “Recipient”). */}
                    This Non-Disclosure Agreement (the "Agreement") is made and
                    entered into by and between [Company Name], a company
                    incorporated under the laws of India, having its registered
                    office at [Company Address] (referred to as the "Disclosing
                    Party"), and [Recipient Name], an individual residing at
                    [Recipient Address] (referred to as the "Recipient").
                  </p>

                  {/* Sections */}
                  <div className="space-y-6">
                    <section>
                      <h3 className="text-lg font-semibold border-b mb-2">
                        Confidential Information
                      </h3>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>
                          The Disclosing Party may provide the Recipient with
                          confidential and proprietary information, including
                          but not limited to trade secrets, business strategies,
                          technical data, customer information, software, and
                          other proprietary information (collectively referred
                          to as the "Confidential Information").
                        </li>
                        <li>
                          The Recipient agrees to hold the Confidential
                          Information in strict confidence and to use it solely
                          for the purpose specified in this Agreement.
                        </li>
                      </ol>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold border-b mb-2">
                        Non-Disclosure Obligations
                      </h3>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>
                          The Recipient shall not disclose any Confidential
                          Information to any third party, including but not
                          limited to individuals, organizations, or entities,
                          without the prior written consent of the Disclosing
                          Party.
                        </li>
                        <li>
                          The Recipient shall take reasonable measures to
                          protect the Confidential Information from unauthorized
                          disclosure, using the same degree of care it employs
                          to protect its own confidential information.
                        </li>
                      </ol>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold border-b mb-2">
                        Permitted Disclosures
                      </h3>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>
                          The Recipient may disclose the Confidential
                          Information to its employees, agents, or contractors
                          who need to know such information for the purpose of
                          fulfilling their duties, provided that they are bound
                          by confidentiality obligations similar to those
                          contained in this Agreement.
                        </li>
                        <li>
                          The Recipient may disclose the Confidential
                          Information if required by applicable law, regulation,
                          or court order. In such cases, the Recipient shall
                          promptly notify the Disclosing Party to allow the
                          Disclosing Party to seek a protective order or other
                          appropriate remedy.
                        </li>
                      </ol>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold border-b mb-2">
                        Ownership & Return of Information
                      </h3>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>
                          All Confidential Information remains the exclusive
                          property of the Disclosing Party.
                        </li>
                        <li>
                          Upon written request by the Disclosing Party or upon
                          termination of this Agreement, the Recipient shall
                          promptly return or destroy all materials containing or
                          embodying the Confidential Information, including any
                          copies, notes, or summaries thereof, and provide
                          written confirmation of such return or destruction.
                        </li>
                      </ol>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold border-b mb-2">
                        Duration & Termination
                      </h3>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>
                          This Agreement shall remain in effect for a period of
                          [specify duration, e.g., 3 years] from the effective
                          date of this Agreement, unless terminated earlier by
                          written agreement of the parties.
                        </li>
                        <li>
                          The obligations of confidentiality and non-disclosure
                          under this Agreement shall survive the termination of
                          this Agreement.
                        </li>
                      </ol>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold border-b mb-2">
                        Governing Law & Jurisdiction
                      </h3>
                      <p>
                        This Agreement shall be governed by and construed in
                        accordance with the laws of India. Any disputes arising
                        out of or in connection with this Agreement shall be
                        subject to the exclusive jurisdiction of the courts
                        located in
                        <span className="font-semibold"> [City, State]</span>.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold border-b mb-2">
                        Entire Agreement
                      </h3>
                      <p>
                        This Agreement constitutes the entire understanding and
                        agreement between the parties with respect to the
                        subject matter hereof and supersedes any prior or
                        contemporaneous agreements, communications, or
                        representations, whether oral or written.
                      </p>
                    </section>
                  </div>

                  {/* Signature */}
                </div>
              )}

              {activeTab === "About" && (
                <div className="text-gray-800 space-y-6">
                  {/* Section Title */}
                  <h2 className="text-xl font-bold border-b pb-2">About Us</h2>

                  {/* Monthly Leave & CL Allowance */}
                  <div>
                    Aryu Enterprises is a diversified global group recognized
                    for innovation, professionalism, and service excellence.
                    From a small team of problem-solvers, we have grown into a
                    network of digital professionals serving clients in over 50
                    countries. We specialize in technology, branding, marketing,
                    and education, providing end-to-end solutions that help
                    organizations grow, strengthen their presence, and stay
                    competitive. The company prides itself on steady growth, a
                    strong team, a client-focused approach, and consistent
                    delivery of quality and value across all services.
                  </div>
                </div>
              )}
              {/* teck */}
              {activeTab === "tech" && (
                <div className="text-gray-800 space-y-6">
                  {/* Section Title */}
                  <h2 className="text-xl font-bold border-b pb-2">
                    Technologies We Work With
                  </h2>

                  {/* General Rules */}
                  <div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>WordPress</li>
                      <li>React.js</li>
                      <li>Next.js</li>
                      <li>PHP & MySQL</li>
                      <li>Laravel</li>
                      <li>Shopify </li>
                      <li>NexHTML, CSS, Bootstrap t.js</li>
                      <li>JavaScript, jQuery</li>
                      <li>AJAX</li>
                      <li>API Integration & Third-Party Tool Integration</li>
                      <li>Python</li>
                      <li>Python - Django</li>
                      <li>MongoDB</li>
                    </ul>
                  </div>
                </div>
              )}
              {/* profolio */}

              {activeTab === "Portfolio" && (
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    ARYU Enterprises - Portfolio
                  </h2>
                  <p className="text-gray-700"></p>

                  <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {Object.keys(categories).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveTab1(cat)}
                        className={`px-5 py-2 rounded-full text-sm md:text-base font-medium border
                transition-colors duration-300 ${
                  activeTab1 === cat
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Active Projects */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories[activeTab1].map((p) => (
                      <a
                        key={p.url}
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white rounded-2xl border border-gray-100 shadow-sm
                         hover:shadow-xl transition-all duration-300 p-5 text-center
                         hover:bg-gradient-to-r hover:from-indigo-600 hover:to-indigo-400
                        
                         hover:text-white"
                      >
                        <span className="text-lg font-semibold">{p.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer></Footer>
    </div>
  );
}

export default Bidding_details;
