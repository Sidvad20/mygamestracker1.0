import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

const defaultGames = [
  { id: 1, title: "Zelda: Breath of the Wild", platform: "Switch", status: "Completed" },
  { id: 2, title: "God of War Ragnarok", platform: "PS5", status: "Playing" },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white min-h-screen">
      <header className="fixed w-full bg-black z-50 top-0 left-0 h-16 flex items-center px-5 justify-between">
        <h1 className="text-xl font-bold">mygamestracker</h1>
        <nav>
          <Link to="/" className="text-white hover:underline">Home</Link>
        </nav>
      </header>
      <main className="min-h-screen pt-16">
        <section
          className="relative text-green-100 min-h-[calc(100vh-64px)]"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container max-w-screen-2xl mx-auto flex px-5 py-24 md:flex-row flex-col items-center h-full">
            <div className="text-left z-10">
              <h1 className="text-5xl font-bold text-white">MyGamesTracker</h1>
              <p className="text-lg mt-4 text-gray-200">
                Keep track of your video game progress, achievements, and milestones—all in one place.
              </p>
              <div className="mt-6 space-x-4">
                <button
                  onClick={() => navigate("/tracker")}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                >
                  Start Tracking
                </button>
                <button
                  onClick={() => navigate("/gta-tracker")}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                >
                  GTA 5 Vehicle Tracker
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-black py-10 px-5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h2 className="font-bold text-white">mygamestracker</h2>
            <p className="text-gray-400 mt-2">Track your personal gaming progress with mygamestracker.</p>
          </div>
          <div>
            <h2 className="font-bold text-white">Navigation</h2>
            <ul className="mt-2 space-y-1">
              <li><Link to="/" className="text-gray-400 hover:underline">Home</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Tracker() {
  const [games, setGames] = useState(() => {
    const saved = localStorage.getItem("games");
    return saved ? JSON.parse(saved) : defaultGames;
  });
  const [newGame, setNewGame] = useState({ title: "", platform: "", status: "Backlog" });

  useEffect(() => {
    localStorage.setItem("games", JSON.stringify(games));
  }, [games]);

  const addGame = () => {
    if (newGame.title) {
      setGames([...games, { ...newGame, id: Date.now() }]);
      setNewGame({ title: "", platform: "", status: "Backlog" });
    }
  };

  return (
    <div className="p-4 pt-16 min-h-screen bg-gray-800 text-white">
      <div>
        <input
          value={newGame.title}
          onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
          placeholder="Title"
          className="p-2 mb-2 border rounded bg-gray-700 text-white"
        />
        <input
          value={newGame.platform}
          onChange={(e) => setNewGame({ ...newGame, platform: e.target.value })}
          placeholder="Platform"
          className="p-2 mb-2 border rounded bg-gray-700 text-white"
        />
        <button onClick={addGame} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
          Add Game
        </button>
      </div>
      <div className="mt-4">
        {games.map(game => (
          <div key={game.id} className="mb-2 p-2 bg-gray-700 rounded">
            {game.title} ({game.platform}) - {game.status}
          </div>
        ))}
      </div>
    </div>
  );
}

function GtaTracker() {
  return (
    <div className="p-4 pt-16 min-h-screen bg-gray-800 text-white text-center">
      <h1 className="text-2xl font-bold mb-4">GTA 5 Vehicle Tracker</h1>
      <p>Coming soon! Add your GTA 5 vehicles here.</p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/gta-tracker" element={<GtaTracker />} />
      </Routes>
    </Router>
  );
}