import React from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import "./util/http";
import IndexRouter from "./router/IndexRouter";

const root = document.getElementById("root");
const rootInstance = createRoot(root);
rootInstance.render(<IndexRouter />);
