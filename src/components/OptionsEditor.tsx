import { InteractionsPreference, Options, Theme } from "../config";

interface OptionsProps {
  options: Options;
  setOptions: (options: Options) => void;
}

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
          <option value="bird-ui-light" disabled>
            Bird UI (Light)
          </option>
          <option value="mastodon" disabled>
            Mastodon (Dark)
          </option>
          <option value="mastodon-light" disabled>
            Mastodon (Light)
          </option>
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
    </div>
  );
}
