export default function MobileAlert() {
  return (
    <div className="hide-desktop alert">
      <span className="alert-title">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-devices-off"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M13 9a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v8m-1 3h-6a1 1 0 0 1 -1 -1v-6"></path>
          <path d="M18 8v-3a1 1 0 0 0 -1 -1h-9m-4 0a1 1 0 0 0 -1 1v12a1 1 0 0 0 1 1h9"></path>
          <path d="M16 9h2"></path>
          <path d="M3 3l18 18"></path>
        </svg>
        <strong>Not optimized for mobile devices</strong>
      </span>
      <p>
        Sorry! Mastopoet is not optimized for mobile devices yet. Custom
        backgrounds have been disabled.
      </p>
    </div>
  );
}
