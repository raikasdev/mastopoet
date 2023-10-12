import { Route } from "wouter";

// Main styles
import "./styles/App.scss";

// Themes
import "./themes/BirdUi.scss";
import "./themes/Mastodon.scss";

// Routes
import IndexPage from "./routes";
import EmbedPage from "./routes/embed";

function App() {
  return (
    <>
      <Route path="/">
        <IndexPage />
      </Route>
      <Route path="/embed">
        <EmbedPage />
      </Route>
    </>
  );
}

export default App;
