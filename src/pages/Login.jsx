import login_image from "../assets/login_image.svg";
import { LuUser } from "react-icons/lu";
import { SlLock } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import aryu_logo from "/Aryu.svg";
import Footer from "../components/Footer";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../components/config";
import ReCAPTCHA from "react-google-recaptcha";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const Login = ({ setIsLoggedIn }) => {
  let navigate = useNavigate();
  let [email_address, setEmail_address] = useState("");
  let [password, setPassword] = useState("");
  let [requiredError, setRequiredError] = useState("");
  let [adminError, setAdminError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [captchaValue, setCaptchaValue] = useState(null);
  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
    console.log("Captcha value:", value);
  };

  const onCLickLogin = async () => {
    try {
      let payload = {
        email: email_address,
        password,
      };
      const response = await axios.post(
        `${API_URL}api/employees/login-employee`,
        payload
      );

    

      if (response.data && response.data.token) {
        const { token, user } = response.data;

        localStorage.setItem("hrms_employee", JSON.stringify(user));
        localStorage.setItem("hrms_employee_token", token);

        // ✅ Set default expiry time: 1 minute from now
        // const expiresIn = 60 * 60; // 1 hour
        // const expiryTime = Date.now() + expiresIn * 1000; // in milliseconds
        // console.log("data", Date.now());
        // localStorage.setItem("token_expiry", expiryTime);

        // // ✅ Set auto logout after 1 minute
        // setTimeout(() => {
        //   // localStorage.removeItem("hrms_employee_token");
        //   // localStorage.removeItem("hrms_employee");
        //   // localStorage.removeItem("token_expiry");
        //   setIsLoggedIn(false);
        //   navigate("/", { replace: true }); // replace current history entry
        // }, expiresIn * 1000);

        navigate("/dashboard");
        setIsLoggedIn(true);
      }
    } catch (error) {
      
      setRequiredError("Invalid email or password.");
      // console.log(error.response.data.errors);
      // console.log(error.response.data.errors);
    }
  };

  return (
    <div className="min-h-screen  flex flex-col justify-between px-5">
      <div>
        <div className="flex  items-center justify-center pt-3">
          <img src={aryu_logo} alt="" className="w-20 mt-6" />
          {/* <img src={medicsresearch_logo} alt="" /> */}
        </div>

        <p className="font-bold text-2xl md:text-4xl text-[#0050aa]  text-center pt-10">
          HR MANAGEMENT SYSTEM
        </p>

        <div className="flex items-center flex-wrap-reverse justify-center ">
          <div className="lg:basis-[50%] flex flex-col items-center justify-center gap-3">
            <p className="text-[#0050aa] font-bold text-2xl md:text-4xl">
              LOGIN
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex w-full md:w-[450px] gap-3 items-center bg-purple-50 px-5 py-4 rounded-2xl">
                <LuUser className="text-2xl text-gray-600" />
                <input
                  type="text"
                  placeholder="Username"
                  name="Username"
                  id="Username"
                  value={email_address}
                  onChange={(e) => setEmail_address(e.target.value)}
                  className="border-none outline-none bg-transparent w-full text-black placeholder-gray-500"
                />
              </div>
              {/* {requiredError.email_address && (
                <p className="text-red-500 text-sm">{requiredError.email_address}</p>
              )} */}

              <div className="flex w-full md:w-[450px] gap-3  bg-purple-50 px-5 py-4 rounded-2xl">
                <SlLock className="text-2xl text-gray-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="Password"
                  id="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-none outline-none bg-transparent w-full text-black placeholder-gray-500"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer text-gray-600"
                >
                  {showPassword ? (
                    <FaEye className="text-2xl" />
                  ) : (
                    <FaEyeSlash className="text-2xl" />
                  )}
                </span>
              </div>
              {/* {requiredError.password && (
              <p className="text-red-500 text-sm text-start">{requiredError.password}</p>
            )} */}
            </div>

            <div className="recaptacha-login ">
              {/* <ReCAPTCHA
                // sitekey="6Lf_dIMrAAAAAAAZI8KS0KRRyRk7NzMNRyXdgtfv" //live site key

                sitekey="6LcendQqAAAAAEjG8NDVrTcYBiFZG1M24ILVt9cn" //local site key

                onChange={handleCaptchaChange}
              /> */}
            </div>
            {requiredError && (
              <p className="text-red-500 text-sm text-start">
                {requiredError}
              </p>
            )}
            <button
              onClick={onCLickLogin}
              // disabled={!captchaValue}
              // className="font-semibold  mt-3  bg-gradient-to-r from-[#004faac3] to-[#0050aa] px-8 py-3 rounded-full text-white hover:scale-105 duration-300"

              className={`${
                true
                  ? "bg-gradient-to-r from-[#004faac3] to-[#0050aa] text-white"
                  : "bg-gray-300 text-gray-700"
              } font-semibold mt-3 text-sm  px-8 py-3 rounded-full  hover:scale-105 duration-300 `}
            >
              Login Now
            </button>
          </div>

          <div className="basis-[50%]  ">
            <img src={login_image} alt="" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
