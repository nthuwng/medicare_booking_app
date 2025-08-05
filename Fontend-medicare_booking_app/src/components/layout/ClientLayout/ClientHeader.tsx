
import { Link } from "react-router-dom";

const ClientHeader = () => {
  return (
    <>
      <header className="w-[100%] h-[70px] flex justify-center items-center ">
        <div className=" w-[85%] flex justify-between items-center">
          <div>
            <div>Logo</div>
          </div>
          <nav className="flex justify-between items-center gap-5">
            <div>
              <Link to="/">
                <div className="flex">
                  <span className="font-medium">Home</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ margin: "5px 0px 0px 5px" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </Link>
            </div>

            <div>
              <Link to="/about">
                <div className="flex">
                  <span className="font-medium">About</span>
                  <svg
                    className="w-4 h-4 mt-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ margin: "5px 0px 0px 5px" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </Link>
            </div>

            <div>
              <Link to="/about">
                <div className="flex">
                  <span className="font-medium">Contact</span>
                  <svg
                    className="w-4 h-4 mt-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ margin: "5px 0px 0px 5px" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </nav>

          <div className="flex">
            <div className="mr-[5px] ">
              <Link to="/login">
                <button className="w-[80px] bg-blue-600 text-white py-1 rounded-md hover:bg-orange-500 cursor-pointer">
                  Login
                </button>
              </Link>
            </div>
            <div>
              <Link to="/register">
                <button className="w-[80px] bg-zinc-900 text-white py-1 rounded-md hover:bg-orange-500 cursor-pointer">
                  Register
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default ClientHeader;
