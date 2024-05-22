"use client";

/*
 * React Router components are "client components" because they require the
 * context API. However, React Router does not use the "use client" directive
 * internally so React Router components must be re-exported from a file with
 * the "use client" directive.
 */

export { Link } from "react-router-dom";
