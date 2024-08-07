import React from "react";
import { IoIosSunny } from "react-icons/io";
import Container from "../Container";

export default function Navbar() {
  return (
    <div className="bg-secondary shadow-sm shadow-gray-500">
      <Container>
        <div className="flex justify-between items-center">
          <img
            src="./logo-dark.png"
            height="100px"
            width="100px"
            className="h-18 w-35"
          />
          <ul className="flex items-center space-x-4">
            <li>
              <button className="bg-dark-subtle p-1 rounded">
                <IoIosSunny className="text-secondary" size={24} />
              </button>
            </li>
            <li>
              <input
                type="text"
                className="border-2 border-dark-subtle p-1 
                rounded bg-transparent text-xl outline-none
                 focus:border-white transition text-white"
                placeholder="Search..."
              />
            </li>
            <li className="text-white font-semibold text-lg">Login</li>
          </ul>
        </div>
      </Container>
    </div>
  );
}
