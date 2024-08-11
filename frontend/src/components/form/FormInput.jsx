import React from "react";

export default function FormInput({ name, placeholder, label, ...rest }) {
  return (
    <div className="flex flex-col-reverse">
      <input
        id={name}
        name={name}
        className="bg-transparent rounded border-2 dark:border-dark-subtle border-light-subtle
              text-lg w-full outline-none dark:focus:border-white p-1 focus:border-primary dark:text-white peer transition
              "
        placeholder={placeholder}
        {...rest}
      />
      <label
        className="font-semibold dark:text-dark-subtle text-light-subtle dark:peer-focus:text-white 
        self-start peer-focus:text-primary "
        htmlFor={name}
      >
        {label}
      </label>
    </div>
  );
}
