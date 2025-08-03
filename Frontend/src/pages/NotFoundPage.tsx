import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="font-[Inter] flex flex-col justify-center min-h-screen items-center bg-gray-50 px-4 py-10">
      <img
        src="/NotFoundPage.webp"
        alt="404 Not Found"
        className="w-full max-w-md"
      />
      <p className="text-lg text-purple-600 mb-6 text-center max-w-md">
        Sorry, the page you're looking for doesn't exist or was moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-md bg-purple-500 text-white hover:bg-purple-800 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
