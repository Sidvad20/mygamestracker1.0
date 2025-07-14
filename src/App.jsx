import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

const defaultGames = [
  { id: 1, title: "Zelda: Breath of the Wild", platform: "Switch", status: "Completed" },
  { id: 2, title: "God of War Ragnarok", platform: "PS5", status: "Playing" },
];
const defaultVehicles = [
  { id: 1, name: "Adder", model: "Supercar", location: "Los Santos" },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white min-h-screen">
      <header className="fixed w-full bg-black z-50 top-0 left-0 h-16 flex items-center px-5 justify-between">
        <h1 className="text-xl font-bold">mygamestracker</h1>
        <nav className="space-x-4">
          <Link to="/" className="text-white hover:text-gray-300">Home</Link>
          <Link to="/tracker" className="text-white hover:text-gray-300">Tracker</Link>
          <Link to="/gta-tracker" className="text-white hover:text-gray-300">GTA Tracker</Link>
        </nav>
      </header>
      <main className="min-h-screen pt-16">
        <section
          className="relative text-green-100 min-h-[calc(100vh-64px)]"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg')",
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
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  Start Tracking
                </button>
                <button
                  onClick={() => navigate("/gta-tracker")}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
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
              <li><Link to="/" className="text-gray-400 hover:text-gray-200">Home</Link></li>
              <li><Link to="/tracker" className="text-gray-400 hover:text-gray-200">Tracker</Link></li>
              <li><Link to="/gta-tracker" className="text-gray-400 hover:text-gray-200">GTA Tracker</Link></li>
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
  const [editingId, setEditingId] = useState(null);
  const [editGame, setEditGame] = useState({ title: "", platform: "", status: "" });
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    localStorage.setItem("games", JSON.stringify(games));
  }, [games]);

  const addGame = () => {
    if (newGame.title) {
      setGames([...games, { ...newGame, id: Date.now() }]);
      setNewGame({ title: "", platform: "", status: "Backlog" });
      setSuggestions([]);
    }
  };

  const deleteGame = (id) => {
    setGames(games.filter(game => game.id !== id));
  };

  const startEdit = (game) => {
    setEditingId(game.id);
    setEditGame({ ...game });
  };

  const saveEdit = () => {
    setGames(games.map(game => game.id === editingId ? editGame : game));
    setEditingId(null);
    setEditGame({ title: "", platform: "", status: "" });
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    const apiKey = process.env.REACT_APP_RAWG_API_KEY;
    const response = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&search=${query}&page_size=5`);
    const data = await response.json();
    setSuggestions(data.results || []);
  };

  return (
    <div className="p-4 pt-16 min-h-screen bg-gray-800 text-white">
      <div className="mb-4">
        <input
          value={newGame.title}
          onChange={(e) => {
            setNewGame({ ...newGame, title: e.target.value });
            fetchSuggestions(e.target.value);
          }}
          placeholder="Title"
          className="p-2 mb-2 border rounded bg-gray-700 text-white w-full"
        />
        {suggestions.length > 0 && (
          <div className="absolute bg-gray-700 rounded mt-1 w-full max-h-40 overflow-y-auto z-10">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                onClick={() => {
                  setNewGame({ ...newGame, title: suggestion.name, platform: suggestion.platforms[0]?.platform.name || "" });
                  setSuggestions([]);
                }}
                className="p-2 hover:bg-gray-600 cursor-pointer"
              >
                {suggestion.name}
              </div>
            ))}
          </div>
        )}
        <input
          value={newGame.platform}
          onChange={(e) => setNewGame({ ...newGame, platform: e.target.value })}
          placeholder="Platform"
          className="p-2 mb-2 border rounded bg-gray-700 text-white w-full"
        />
        <select
          value={newGame.status}
          onChange={(e) => setNewGame({ ...newGame, status: e.target.value })}
          className="p-2 mb-2 border rounded bg-gray-700 text-white w-full"
        >
          <option value="Backlog">Backlog</option>
          <option value="Playing">Playing</option>
          <option value="Completed">Completed</option>
        </select>
        <button onClick={addGame} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full">
          Add Game
        </button>
      </div>
      <div className="mt-4">
        {games.map(game => (
          <div key={game.id} className="mb-2 p-2 bg-gray-700 rounded flex justify-between items-center">
            {editingId === game.id ? (
              <div className="w-full">
                <input
                  value={editGame.title}
                  onChange={(e) => setEditGame({ ...editGame, title: e.target.value })}
                  className="p-1 border rounded bg-gray-600 text-white w-full mb-1"
                />
                <input
                  value={editGame.platform}
                  onChange={(e) => setEditGame({ ...editGame, platform: e.target.value })}
                  className="p-1 border rounded bg-gray-600 text-white w-full mb-1"
                />
                <select
                  value={editGame.status}
                  onChange={(e) => setEditGame({ ...editGame, status: e.target.value })}
                  className="p-1 border rounded bg-gray-600 text-white w-full mb-1"
                >
                  <option value="Backlog">Backlog</option>
                  <option value="Playing">Playing</option>
                  <option value="Completed">Completed</option>
                </select>
                <button onClick={saveEdit} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded mr-2">
                  Save
                </button>
              </div>
            ) : (
              <div className="flex-1">
                {game.title} ({game.platform}) - {game.status}
              </div>
            )}
            <div>
              {editingId !== game.id && (
                <>
                  <button onClick={() => startEdit(game)} className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded mr-2">
                    Edit
                  </button>
                  <button onClick={() => deleteGame(game.id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded">
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GtaTracker() {
  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem("vehicles");
    return saved ? JSON.parse(saved) : defaultVehicles;
  });
  const [newVehicle, setNewVehicle] = useState({ name: "", model: "", location: "" });

  useEffect(() => {
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
  }, [vehicles]);

  const addVehicle = () => {
    if (newVehicle.name) {
      setVehicles([...vehicles, { ...newVehicle, id: Date.now() }]);
      setNewVehicle({ name: "", model: "", location: "" });
    }
  };

  return (
    <div className="p-4 pt-16 min-h-screen bg-gray-800 text-white">
      <div className="mb-4">
        <input
          value={newVehicle.name}
          onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
          placeholder="Name"
          className="p-2 mb-2 border rounded bg-gray-700 text-white w-full"
        />
        <input
          value={newVehicle.model}
          onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
          placeholder="Model"
          className="p-2 mb-2 border rounded bg-gray-700 text-white w-full"
        />
        <input
          value={newVehicle.location}
          onChange={(e) => setNewVehicle({ ...newVehicle, location: e.target.value })}
          placeholder="Location"
          className="p-2 mb-2 border rounded bg-gray-700 text-white w-full"
        />
        <button onClick={addVehicle} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full">
          Add Vehicle
        </button>
      </div>
      <div className="mt-4">
        {vehicles.map(vehicle => (
          <div key={vehicle.id} className="mb-2 p-2 bg-gray-700 rounded">
            {vehicle.name} ({vehicle.model}) - {vehicle.location}
          </div>
        ))}
      </div>
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