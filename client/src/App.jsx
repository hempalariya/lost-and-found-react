import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./utils/AppLayout";
import Home from "./utils/Home";
import Register from "./features/auth/Register";
import Login from "./features/auth/Login";
import Report from "./features/report/Report";
import ReportDetails from "./features/report/ReportDetails";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/report",
        element: <Report />,
      },
      {
        path: "/report/:id",
        element: <ReportDetails />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
