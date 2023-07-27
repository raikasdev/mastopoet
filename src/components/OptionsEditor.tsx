import { InteractionsPreference, Options, Theme } from "../config";

interface OptionsProps {
  options: Options;
  setOptions: (options: Options) => void;
}

const colorPresets = [
  "linear-gradient(to bottom right, #fc5c7d, #6a82fb)",
  "linear-gradient(to bottom right, #FF61D2, #FE9090)",
  "linear-gradient(to bottom right, #FD8451, #FFBD6F)",
  "linear-gradient(to bottom right, #00C0FF, #4218B8)",
  "linear-gradient(to bottom right, #FDFCFB, #E2D1C3)",
  "linear-gradient(to bottom right, #FF3E9D, #0E1F40)",
  "linear-gradient(to bottom right, #12c2e9, #c471ed, #f64f59)",
];

export default function OptionsEditor({ options, setOptions }: OptionsProps) {
  return (
    <div className="options-editor">
      <div className="option">
        <label htmlFor="theme-select">Theme</label>
        <select
          name="theme-select"
          id="theme-select"
          value={options.theme}
          onChange={(event) =>
            setOptions({
              ...options,
              theme: event.currentTarget.value as Theme,
            })
          }
        >
          <option value="bird-ui">Bird UI (Dark)</option>
          <option value="bird-ui-light">Bird UI (Light)</option>
          <option value="mastodon">Mastodon (Dark)</option>
          <option value="mastodon-white-interactions">
            Mastodon (Dark + light interactions)
          </option>
          <option value="mastodon-light">Mastodon (Light)</option>
        </select>
      </div>
      <div className="option">
        <label htmlFor="interactions-select">Interactions appearance</label>
        <select
          name="interactions-select"
          id="interactions-select"
          value={options.interactions}
          onChange={(event) =>
            setOptions({
              ...options,
              interactions: event.currentTarget.value as InteractionsPreference,
            })
          }
        >
          <option value="feed">Feed (icons)</option>
          <option value="normal">Normal (text)</option>
          <option value="normal no-replies">Normal (text, no replies)</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>
      <div className="option">
        <label htmlFor="color-grid">Background</label>
        <div className="color-grid" id="color-grid">
          {colorPresets.map((color, index) => (
            <button
              className="color"
              key={color}
              style={{
                background: color,
              }}
              onClick={() => setOptions({ ...options, background: color })}
              aria-label={`Change color gradient to option ${index + 1}`}
            />
          ))}
          <button
            className="color"
            style={{
              background: "transparent",
            }}
            onClick={() => {
              const background = prompt(
                `Set the background manually by providing value for 'background' prop.\nYou can find gradients on websites like uigradients.com`,
              );
              if (!background) return;
              setOptions({ ...options, background });
            }}
            aria-label="Set custom gradient"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-color-picker"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              stroke-LLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M11 7l6 6"></path>
              <path d="M4 16l11.7 -11.7a1 1 0 0 1 1.4 0l2.6 2.6a1 1 0 0 1 0 1.4l-11.7 11.7h-4v-4z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
