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

function Policy_details() {
  const navigate = useNavigate();

  //   const [isLoading, setisLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("company");
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

  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}api/upcomingholiday/view-upcomingholiday`)
      .then((res) => {
        const holidayEvents = res.data.data.map((holiday) => ({
          title: holiday.reason,
          start: new Date(holiday.date),
          end: new Date(holiday.date),
          allDay: true,
        }));
        setEvents(holidayEvents);
      });
  }, []);

  return (
    <div className="flex  flex-col justify-between w-screen min-h-screen bg-gray-100 px-3 md:px-5 pt-2 md:pt-10 ">
      <div className="p-3 ">
        <Mobile_Sidebar />

        {/* breadcrumb */}
        <div className="flex gap-2  text-sm items-center">
          <p className="text-sm text-blue-500 ">Policy</p>
          <p>{">"}</p>
        </div>
        <section className="md:mt-5 flex pt-5">
          <div className="bg-white p-2 md:p-6 rounded-xl shadow-md w-full">
            {/* Tab Buttons */}
            <div className="flex md:gap-6 mb-4 border-b pb-2">
              {["company", "leave", "Holiday"].map((tab) => (
                <div
                  key={tab}
                  className={`px-3 py-2 rounded-t-lg transition-all duration-300 cursor-pointer font-medium
          ${
            activeTab === tab
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "company"
                    ? "Company Protocol"
                    : tab === "leave"
                    ? "Leave Policy"
                    : "Holiday"}
                </div>
              ))}
            </div>

            {/* Tab Content */}
            <div
              className="transition-all duration-500 ease-in-out animate-fade-in bg-gray-100 p-6 rounded-lg shadow-sm"
              key={activeTab}
            >
              {activeTab === "company" && (
                <div>
                  <h2 className="text-xl font-bold mb-2 uppercase">
                    company protocol
                  </h2>

                  {/* Tab Buttons */}
                  <div className="flex overflow-x-auto md:overflow-hidden mb-4  pb-2 mt-4 ">
                    {["intern", "inter2emp", "experience"].map((tab1) => (
                      <div
                        key={tab1}
                        className={`px-4 py-2 border-b border-x border-gray-300 transition-all duration-300 cursor-pointer font-medium
          ${
            activeProtocolTab === tab1
              ? " bg-blue-600 text-white  "
              : "text-gray-700 bg-white hover:bg-blue-100 hover:text-blue-600"
          }`}
                        onClick={() => setActiveProtocolTab(tab1)}
                      >
                        {tab1 === "intern" ? "For Intern" : tab1 === "inter2emp" ? "Conversion Policy": "For Experience"}
                      </div>
                    ))}
                  </div>

                  {activeProtocolTab === "intern" && (
                    <div className="text-gray-800 space-y-6">
                      {/* Section Title */}
                      <h2 className="text-xl font-bold border-b pb-2">
                        Intern Policy
                      </h2> 

                      <ul className="list-disc list-inside space-y-1">
                        <li>
                          Before joining as an intern, you must submit your original certificates for verification.   
                        </li>
                        <li>
                          Everyday start with your work you must check your mail, slack & group chats.
                        </li>
                        <li>
                          You should properly maintain a manual attendance notebook, employee portal, and daily reporting mail. Everyday task details should be maintained in Excel to submit a monthly audit.
                        </li>
                        <li>
                          It is mandatory to send a report email, after you logout at the end of the day, it will be used to determine your present, absent, and half-day status. If report mail is not received, the employee will be marked absent for the day.
                        </li>
                        <li>
                          Don’t share your credential details & your project-related confidential details from outside the organization, Friends and Families.
                        </li>
                        <li>
                          In case any behavioral changes happen, management has the right to take disciplinary action.
                        </li>
                        <li>
                          We evaluate your performance, if you do not perform well through the Internship period management has the right to relieve you at that time.
                        </li>
                        <li>
                          During the internship period, no casual leave (CL) is allowed. Any leave taken will be considered as Loss of Pay (LOP).
                        </li>
                        <li>
                          In case of emergency leave, it will be allowed but will still be considered as LOP.
                        </li>
                        <li>
                          Unplanned/unwanted leaves may result in an extension of the internship period, equivalent to the number of days of leave taken.
                        </li>
                        <li>
                          If you leave the company before completing the internship, only a Participation Certificate will be provided (not an Internship Completion Certificate).
                        </li>
                        <li>
                          If you resign during the internship period, you must serve a 30-day notice period if you are assigned to any client project.
                        </li>
                        <li>
                          If you complete the internship and are converted to a full-time employee, but later choose to resign, you must serve a 1-month notice period.
                        </li>
                        <li>
                         If you resign without completing the intern  period , you will be required to refund the stipend received for the previous months.
                        </li>
                        <li>
                          During the first month, no stipend will be provided.
                        </li>
                        <li>
                          From the 2nd to 6th month, the stipend will be ₹7,000 per month.
                        </li>
                        <li>
                          After the 7th month, based on your performance, you will be converted to a full-time employee, and a salary hike of 10% to 30% will be applicable.
                        </li>
                      </ul>
                    </div>
                  )}

                  {activeProtocolTab === "inter2emp" && (
                    <div className="text-gray-800 space-y-6">
                      {/* Section Title */} 
                      <h2 className="text-xl font-bold border-b pb-2">
                        Intern to Employee Conversion Policy
                      </h2>

                       <ul className="list-disc list-inside space-y-1">
                        <li>
                          After completing the internship,the intern will appear for an interview. Successful candidates will be offered full-time employment.
                        </li>
                        <li>
                          A salary hike of 10% to 30% will be granted based on the performance.
                        </li>
                        <li>
                          The employee will receive all benefits applicable to regular employees.
                        </li>
                      </ul>
                       </div>
                  )}

                  {activeProtocolTab === "experience" && (
                    <div className="text-gray-800 space-y-6">
                      {/* Section Title */} 
                      <h2 className="text-xl font-bold border-b pb-2">
                        Employee Policy 
                      </h2>

                       <ul className="list-disc list-inside space-y-1">
                        <li>
                          After the probation period, at that time fixed pay increases based on your performance, we will fix basic pay. Additionally, you will be eligible for incentives ranging from 5% to 20% on the business volume generated from internal company projects, contingent upon the conversion of leads into sales. Please note that these incentives do not apply to client projects.
                        </li>
                        <li>
                          Everyday start with your work you must check your mail, slack & group chats.
                        </li>
                        <li>
                          You should properly maintain a manual attendance notebook, employee portal, and daily reporting mail. Everyday task details should be maintained in Excel to submit a monthly audit.
                        </li>
                        <li>
                          It is mandatory to send a report email, after you logout at the end of the day, it will be used to determine your present, absent, and half-day status. If report mail is not received, the employee will be marked absent for the day.
                        </li>
                        <li>
                          Don’t share your credential details & your project-related confidential details from outside the organization, Friends and Families.
                        </li>
                        <li>
                          In case any behavioural changes happen, management has the right to take disciplinary action.
                        </li>
                        <li>
                          We evaluate your performance, if you do not perform well through the probation period management has the right to relieve you at that time.
                        </li>
                        <li>
                          Every year once from your joining month, the salary hike will be revised based on your performance.
                        </li>
                        <li>
                          At that time, you will be serving notice period or applying resignation, we should not provide a hike.
                        </li>
                        <li>
                          Once a hike is announced, within 8 months if you want to apply for resignation. At that time we mentioned the previous salary only with your relieving letter.
                        </li>
                        <li>
                          Please avoid discussing salary and raise details with colleagues. Management may reassess adjustments if discrepancies arise.
                        </li>
                        <li>
                          If you wish to take leave, inform HR; they will obtain permission from Aruna Mam and update the portal with the reason for your absence.
                        </li>
                        <li>
                          Leave policy - For Trainees, a six months period is considered as loss of pay, and after completion of this period, they become eligible for monthly casual leave (CL). If experienced, casual leave becomes applicable after completing one month.
                        </li>
                        <li>
                          Planned leave must be requested 1-2 weeks in advance. For emergencies or health issues, inform us before requesting a day off. Unapproved leave may result in management action.
                        </li>
                        <li>
                          If you desire to leave the company, you will serve two months of notice period.
                        </li>
                        <li>
                          You will not receive any documents from us if you leave without giving prior notice or before the notice period has expired and your salary will not be processed.
                        </li>
                        <li>
                          After leaving, do not contact our clients or projects. Any such action will result in legal action from us.
                        </li>
                        <li>
                          For the next three years, you cannot collaborate with other companies on products or concepts similar to those you worked on in our organization. 
                        </li>
                      </ul>
                       </div>
                  )}
                      
                </div>
              )}

              {activeTab === "leave" && (
                <div className="text-gray-800 space-y-6">
                  {/* Section Title */}
                  <h2 className="text-xl font-bold border-b pb-2">
                    Leave Policy
                  </h2>

                  {/* Monthly Leave & CL Allowance */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Monthly Leave & CL Allowance
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        Casual Leave (CL) is granted at 1 day per month and can
                        be encashed at year-end.
                      </li>
                      <li>
                        Monthly leave is applicable only after completing 6
                        months from the date of joining.
                      </li>
                      <li>
                        CL cannot be availed on Fridays, Mondays, or in
                        combination with weekends.
                      </li>
                      <li>
                        Interns are not eligible for CL during internship
                        period. If an intern takes leave, it will be treated as
                        Loss of Pay (LOP).
                      </li>
                    </ul>
                  </div>

                  {/* General Rules */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      General Rules
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        All leave must be applied for in advance of 15days
                        through the HR system.
                      </li>
                      <li>
                        A Medical Certificate is required for Sick Leave
                        exceeding 3 days.
                      </li>
                      <li>
                        CL encashment is permitted only at the end of the
                        calendar year.
                      </li>
                    </ul>
                  </div>

                  {/* Permission Time */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Permission Time
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>A maximum of 2 hours/month is allowed.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Login After 10:30 AM{" "}
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        If you log in after 10:30 AM more than 4 times in a
                        month, the 5th instance onward will be treated as LOP
                        (Loss of Pay).
                      </li>
                      <li>
                        Office hours begin at 10:00 AM. Kindly ensure timely
                        arrival, complete 8 hours of productive work, and finish
                        your assigned tasks before leaving for the day.
                      </li>
                    </ul>
                  </div>

                  {/* Working Hours & Break Time */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Working Hours & Break Time
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        Employees must complete 8 hours of actual productive
                        work each day.
                      </li>
                      <li>
                        All breaks (food, calls, etc.) must be logged properly.
                      </li>
                      <li>
                        Failing to log out during breaks is considered policy
                        violation and will marked as LOP for the day.
                      </li>
                    </ul>
                  </div>

                  {/* Strictly Not Allowed */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-red-600">
                      Strictly Not Allowed
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Leaving the desk without logging a break.</li>
                      <li>
                        Personal chatting, phone calls, or idling during
                        production hours. Phones should be put under silent
                        mode.
                      </li>
                      <li>
                        Repeated late login or consistently low productivity may
                        result in disciplinary action.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "Holiday" && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Holiday Details</h2>
                  <p className="text-gray-700">
                    <div style={{ height: 500 }}>
                      <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        views={["month"]}
                        selectable={false}
                      />
                    </div>
                  </p>
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

export default Policy_details;
