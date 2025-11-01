import React, { useState } from "react";
import Button from "../../utils/Button";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "./userSlice";

const inputStyle =
  " w-full border border-blue-300 mb-5 rounded-md text-lg px-3 py-2";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, message, error } = useSelector((state) => state.user);

  console.log(loading, error, user);

  const [form, setForm] = useState({
    userName: "",
    email: "",
    number: "",
    password: "",
  });

  function handleRegister(e) {
    e.preventDefault();
    dispatch(registerUser(form))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch(() => {});
  }

  return (
    <div className="px-10 flex flex-col gap-3 items-center justify-center h-full md:w-130 m-auto">
      <form action="" onSubmit={handleRegister}>
        <input
          type="text"
          required
          onChange={(e) => {
            setForm({ ...form, userName: e.target.value });
          }}
          className={inputStyle}
          placeholder="Username"
        />
        <input
          required
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
          }}
          className={inputStyle}
          type="email"
          placeholder="email"
        />
        <input
          type="text"
          className={inputStyle}
          required
          onChange={(e) => {
            setForm({ ...form, number: e.target.value });
          }}
          placeholder="Mobile number"
        />
        <input
          required
          onChange={(e) => {
            setForm({ ...form, password: e.target.value });
          }}
          type="password"
          className={inputStyle}
          placeholder="Password"
        />
        <Button type={"submit"} className={"bg-blue-500 w-full text-blue-100"}>
          Register
        </Button>
      </form>
      <div className="text-lg text-center">
        <p>
          Already have an account{" "}
          <Link to={"/Login"} className="text-blue-500 underline">
            LogIn
          </Link>
        </p>
      </div>
    </div>
  );
}
