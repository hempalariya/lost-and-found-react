import React, { useState } from "react";
import Button from "../../utils/Button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./userSlice";

const inputStyle =
  "w-full border border-blue-300 mb-5 rounded-md text-lg px-3 py-2";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.user);


  const [form, setForm] = useState({ email: "", password: "" });

  function handleLogin(e) {
    e.preventDefault();
    dispatch(loginUser(form))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch(() => {});
  }
  return (
    <div className="flex flex-col gap-3 items-center justify-center h-full md:w-130 m-auto">
      <form onSubmit={handleLogin}>
        <input
          type="text"
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
          }}
          className={inputStyle}
          placeholder="Username"
        />
        <input
          type="password"
          onChange={(e) => {
            setForm({ ...form, password: e.target.value });
          }}
          className={inputStyle}
          placeholder="Password"
        />
        <Button type={"submit"} className={"bg-blue-500 w-full text-blue-100"}>
          Log in
        </Button>
      </form>
      <div className="text-lg text-center">
        <p>
          Don't have an account?{" "}
          <Link to={"/register"} className="text-blue-500 underline">
            Create Account
          </Link>
        </p>
        <p>
          Forgotten password{" "}
          <Link className="text-blue-500 underline">Click Here</Link>
        </p>
      </div>
    </div>
  );
}

//localhost:5000/api/v1/auth/login
