import { Link } from 'react-router'; //

const moviesInTheaters = [
  {
    id: 1,
    title: "Hugo and the Philosopher's Stone",
    genre: 'Action/Adventure',
    description: 'An exciting journey into an unknown world.',
    posterUrl: 'https://placehold.co/300x450?text=Movie+Poster+1',
  },
  {
    id: 2,
    title: 'Hugo the Dancing Clown',
    genre: 'Horror',
    description: "It, also known as Hugo 'Bob' Gray and Pennywise the Dancing Clown",
    posterUrl: 'https://placehold.co/300x450?text=Movie+Poster+2',
  },
  {
    id: 3,
    title: "Hugo's Drama",
    genre: 'Drama',
    description: 'A thought provoking story about overcoming.',
    posterUrl: 'https://placehold.co/300x450?text=Movie+Poster+3',
  },
  {
    id: 4,
    title: 'Hugo Beyond the Stars',
    genre: 'Sci-Fi',
    description: 'Explore the ends of the universe and discover new worlds.',
    posterUrl: 'https://placehold.co/300x450?text=Movie+Poster+4',
  },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="bg-gradient-to-r from-red-600 to-red-800 dark:from-red-900 dark:to-red-950 text-white shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-2">
              <img
                class="w-8 h-8 mr-2"
                src="/src/assets/cinehugo.svg"
                alt="logo"
              />
              <span className="text-3xl font-bold tracking-tight">CineHugo</span>
            </Link>

            <nav className="flex items-center space-x-4">
              <Link
                to="/login"
                className="flex items-center text-lg px-4 py-2 rounded-md hover:bg-red-700 dark:hover:bg-red-800 transition duration-150"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-lg bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-950 focus:ring-blue-400"
              >
                Register
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-center mb-12 text-red-700 dark:text-white">
          Now Playing
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {moviesInTheaters.map((movie) => (
            <div
              key={movie.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={movie.posterUrl}
                alt={`Poster do filme ${movie.title}`}
                className="w-full h-auto object-cover aspect-[2/3]"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 truncate" title={movie.title}>
                  {movie.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{movie.genre}</p>
                <p className="text-gray-700 dark:text-gray-300 mb-6 h-16 overflow-hidden text-ellipsis">
                  {movie.description}
                </p>
                <Link 
                  to={'login'} 
                  className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 dark:bg-red-900 dark:hover:bg-red-950 text-white font-bold py-3 px-4 rounded-lg transition duration-150"
                >
                  Buy Ticket
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-gray-800 dark:bg-gray-950 text-gray-400 py-8 mt-16 text-center">
        <p>&copy; {new Date().getFullYear()} CineHugo.</p>
      </footer>
    </div>
  );
}

export default HomePage;