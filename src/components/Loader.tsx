// components/Loader.tsx
export default function Loader() {
  return (
    <div role="status" className="flex justify-center items-center w-full h-full">
      <svg
        aria-hidden="true"
        className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591..."
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038..."
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
