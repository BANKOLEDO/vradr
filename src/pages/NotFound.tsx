import { Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { Navbar } from "../components/Navbar";
import { ThemeToggle } from "../components/ThemeToggle";

export default function NotFound() {
  return (
    <div className="nf-wrap">
      <Navbar variant="landing" right={<ThemeToggle />} />
      <div className="nf-body">
        <div className="nf-art">
          <div className="nf-globe"><GlobeAltIcon width={40} height={40} /></div>
          <span className="nf-code">404</span>
        </div>
        <h1 className="nf-title">This page isn't taking off.</h1>
        <p className="nf-desc">
          The route you're looking for doesn't exist. Or visa lines got to it first.
        </p>
        <Link to="/" className="btn btn-primary nf-btn">
          <ArrowLeftIcon width={15} height={15} /> Back to home
        </Link>
      </div>
    </div>
  );
}