import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="font-[Inter] flex flex-col justify-center min-h-screen items-center bg-gray-50 px-4 py-10">
      <img
        src="/NotFoundPage.webp"
        alt="404 Not Found"
        className="w-full max-w-md"
      />
      <p className="text-lg text-[#ba68c8] mb-6 text-center max-w-md">
        Sorry, the page you're looking for doesn't exist or was moved.
      </p>
      <Link
        to="/"
        className="px-4 py-2.5 rounded-md bg-[#ba68c8] text-white hover:bg-[#ba68c8]/90 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
