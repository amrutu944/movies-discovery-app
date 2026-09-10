const MOCK_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
];

const MOCK_MOVIES = [
  {
    id: 550,
    title: 'Fight Club',
    original_title: 'Fight Club',
    overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdrop_path: '/hZkgoQY85KGWToQhLmHoGJkjY2u.jpg',
    release_date: '1999-10-15',
    vote_average: 8.4,
    vote_count: 27000,
    popularity: 92.5,
    genre_ids: [18, 53],
    genres: [{ id: 18, name: 'Drama' }, { id: 53, name: 'Thriller' }],
    runtime: 139,
    tagline: 'Mischief. Mayhem. Soap.',
    budget: 63000000,
    revenue: 100853753,
    credits: {
      cast: [
        { id: 287, name: 'Brad Pitt', character: 'Tyler Durden', profile_path: '/cckcYc2vMseE9yR2qwPhfVJv6w1.jpg' },
        { id: 819, name: 'Edward Norton', character: 'The Narrator', profile_path: '/53vL9v3fHhU3iR2X7G1f0kM1V4k.jpg' },
        { id: 1283, name: 'Helena Bonham Carter', character: 'Marla Singer', profile_path: '/kW9vH5kK9r4x0w20r9X1f0kM1V4k.jpg' },
      ],
      crew: [{ id: 7467, name: 'David Fincher', job: 'Director' }],
    },
    videos: { results: [{ site: 'YouTube', type: 'Trailer', key: 'qtRKdVC-V4E' }] },
  },
  {
    id: 27205,
    title: 'Inception',
    original_title: 'Inception',
    overview: 'Cobb, a skilled thief who steals corporate secrets through dream-sharing technology, is given the inverse task of planting an idea into the mind of a C.E.O.',
    poster_path: '/oYuLE1hL722Cac2LE9vGvV2g9Wf.jpg',
    backdrop_path: '/8ZTVqvKDQ8emSGUEMjsS4yHAiKQ.jpg',
    release_date: '2010-07-15',
    vote_average: 8.4,
    vote_count: 34000,
    popularity: 140.2,
    genre_ids: [28, 878, 12],
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }, { id: 12, name: 'Adventure' }],
    runtime: 148,
    tagline: 'Your mind is the scene of the crime.',
    budget: 160000000,
    revenue: 825532764,
    credits: {
      cast: [
        { id: 6193, name: 'Leonardo DiCaprio', character: 'Dom Cobb', profile_path: '/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg' },
        { id: 24045, name: 'Joseph Gordon-Levitt', character: 'Arthur' },
        { id: 2524, name: 'Tom Hardy', character: 'Eames' },
      ],
      crew: [{ id: 525, name: 'Christopher Nolan', job: 'Director' }],
    },
    videos: { results: [{ site: 'YouTube', type: 'Trailer', key: 'YoHD9XEInc0' }] },
  },
  {
    id: 155,
    title: 'The Dark Knight',
    original_title: 'The Dark Knight',
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: '/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    release_date: '2008-07-16',
    vote_average: 8.5,
    vote_count: 31000,
    popularity: 130.8,
    genre_ids: [18, 28, 80, 53],
    genres: [{ id: 18, name: 'Drama' }, { id: 28, name: 'Action' }, { id: 80, name: 'Crime' }],
    runtime: 152,
    tagline: 'Welcome to a world without rules.',
    credits: {
      cast: [
        { id: 3894, name: 'Christian Bale', character: 'Bruce Wayne / Batman' },
        { id: 1810, name: 'Heath Ledger', character: 'Joker' },
      ],
      crew: [{ id: 525, name: 'Christopher Nolan', job: 'Director' }],
    },
    videos: { results: [{ site: 'YouTube', type: 'Trailer', key: 'EXeTwQWrcwY' }] },
  },
  {
    id: 157336,
    title: 'Interstellar',
    original_title: 'Interstellar',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/xJHokMbljvjADYdit5fK5VQsX2f.jpg',
    release_date: '2014-11-05',
    vote_average: 8.4,
    vote_count: 32000,
    popularity: 150.4,
    genre_ids: [12, 18, 878],
    genres: [{ id: 12, name: 'Adventure' }, { id: 18, name: 'Drama' }, { id: 878, name: 'Science Fiction' }],
    runtime: 169,
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    credits: {
      cast: [
        { id: 10296, name: 'Matthew McConaughey', character: 'Cooper' },
        { id: 1813, name: 'Anne Hathaway', character: 'Brand' },
      ],
      crew: [{ id: 525, name: 'Christopher Nolan', job: 'Director' }],
    },
    videos: { results: [{ site: 'YouTube', type: 'Trailer', key: 'zSWdZVtXT7E' }] },
  },
  {
    id: 872585,
    title: 'Oppenheimer',
    original_title: 'Oppenheimer',
    overview: 'The story of J. Robert Oppenheimer\'s role in the development of the atomic bomb during World War II.',
    poster_path: '/8Gxv8gSFCU0XGDykEGvC271ugvc.jpg',
    backdrop_path: '/fm6K8OfiUpDJyCCF423iDhv9B2W.jpg',
    release_date: '2023-07-19',
    vote_average: 8.1,
    vote_count: 8500,
    popularity: 180.5,
    genre_ids: [18, 36],
    genres: [{ id: 18, name: 'Drama' }, { id: 36, name: 'History' }],
    runtime: 180,
    tagline: 'The world forever changes.',
    credits: {
      cast: [
        { id: 2037, name: 'Cillian Murphy', character: 'J. Robert Oppenheimer' },
        { id: 5081, name: 'Emily Blunt', character: 'Katherine Oppenheimer' },
      ],
      crew: [{ id: 525, name: 'Christopher Nolan', job: 'Director' }],
    },
    videos: { results: [{ site: 'YouTube', type: 'Trailer', key: 'uYPbbksJxIg' }] },
  },
  {
    id: 693134,
    title: 'Dune: Part Two',
    original_title: 'Dune: Part Two',
    overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    poster_path: '/1pdfLPoWBkR0mFm8bV88399m3q6.jpg',
    backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s52SuTx.jpg',
    release_date: '2024-02-27',
    vote_average: 8.2,
    vote_count: 5100,
    popularity: 195.0,
    genre_ids: [878, 12],
    genres: [{ id: 878, name: 'Science Fiction' }, { id: 12, name: 'Adventure' }],
    runtime: 166,
    tagline: 'Long live the fighters.',
    credits: {
      cast: [
        { id: 1190668, name: 'Timothée Chalamet', character: 'Paul Atreides' },
        { id: 505710, name: 'Zendaya', character: 'Chani' },
      ],
      crew: [{ id: 10828, name: 'Denis Villeneuve', job: 'Director' }],
    },
    videos: { results: [{ site: 'YouTube', type: 'Trailer', key: 'Way9Dexny3w' }] },
  },
  {
    id: 496243,
    title: 'Parasite',
    original_title: 'Gisaengchung',
    overview: 'All unemployed, Ki-taek\'s family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.',
    poster_path: '/7IiT9ZwsfuURWUYmme73t21.jpg',
    backdrop_path: '/hiKmpZMGZ0aA3WUd2D29eejC3oJ.jpg',
    release_date: '2019-05-30',
    vote_average: 8.5,
    vote_count: 17500,
    popularity: 110.0,
    genre_ids: [35, 53, 18],
    genres: [{ id: 35, name: 'Comedy' }, { id: 53, name: 'Thriller' }, { id: 18, name: 'Drama' }],
    runtime: 132,
    tagline: 'Act like you own the place.',
    credits: {
      cast: [
        { id: 63456, name: 'Song Kang-ho', character: 'Kim Ki-taek' },
        { id: 1256334, name: 'Lee Sun-kyun', character: 'Park Dong-ik' },
      ],
      crew: [{ id: 21684, name: 'Bong Joon-ho', job: 'Director' }],
    },
    videos: { results: [{ site: 'YouTube', type: 'Trailer', key: '5xH0HfJHsaY' }] },
  },
  {
    id: 129,
    title: 'Spirited Away',
    original_title: 'Sen to Chihiro no Kamikakushi',
    overview: 'A young girl, Sen, wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
    poster_path: '/39wmItE2YWjSnoB2vYwPZtZ9ScE.jpg',
    backdrop_path: '/mD1n1j11k1f9.jpg',
    release_date: '2001-07-20',
    vote_average: 8.5,
    vote_count: 16000,
    popularity: 105.0,
    genre_ids: [16, 10751, 14],
    genres: [{ id: 16, name: 'Animation' }, { id: 10751, name: 'Family' }, { id: 14, name: 'Fantasy' }],
    runtime: 125,
    tagline: 'The tunnel led to a world beyond imagination.',
    credits: {
      cast: [{ id: 19588, name: 'Rumi Hiiragi', character: 'Chihiro (voice)' }],
      crew: [{ id: 608, name: 'Hayao Miyazaki', job: 'Director' }],
    },
    videos: { results: [{ site: 'YouTube', type: 'Trailer', key: 'ByXuk9QqQkk' }] },
  },
  {
    id: 324857,
    title: 'Spider-Man: Into the Spider-Verse',
    original_title: 'Spider-Man: Into the Spider-Verse',
    overview: 'Teen Miles Morales becomes the Spider-Man of his universe and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.',
    poster_path: '/iiEvwBgt.jpg',
    backdrop_path: '/7d6wA.jpg',
    release_date: '2018-12-06',
    vote_average: 8.4,
    vote_count: 15000,
    popularity: 125.0,
    genre_ids: [16, 28, 12, 878],
    genres: [{ id: 16, name: 'Animation' }, { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }],
    runtime: 117,
    tagline: 'Enter a universe where more than one wears the mask.',
    credits: {
      cast: [{ id: 136347, name: 'Shameik Moore', character: 'Miles Morales (voice)' }],
      crew: [{ id: 133502, name: 'Bob Persichetti', job: 'Director' }],
    },
    videos: { results: [{ site: 'YouTube', type: 'Trailer', key: 'g4Hbz2jLXvQ' }] },
  },
  {
    id: 603,
    title: 'The Matrix',
    original_title: 'The Matrix',
    overview: 'Set in the 22nd century, The Matrix tells the story of a computer hacker who learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdrop_path: '/ic0g6B.jpg',
    release_date: '1999-03-30',
    vote_average: 8.2,
    vote_count: 24000,
    popularity: 95.0,
    genre_ids: [28, 878],
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }],
    runtime: 136,
    tagline: 'Welcome to the Real World.',
    credits: {
      cast: [
        { id: 6384, name: 'Keanu Reeves', character: 'Neo' },
        { id: 2975, name: 'Laurence Fishburne', character: 'Morpheus' },
      ],
      crew: [{ id: 9339, name: 'Lana Wachowski', job: 'Director' }],
    },
    videos: { results: [{ site: 'YouTube', type: 'Trailer', key: 'vKQi3bBA1y8' }] },
  },
  {
    id: 19995,
    title: 'Avatar',
    original_title: 'Avatar',
    overview: 'In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.',
    poster_path: '/kyeqWdyUXW608qlYkR30m2Z3Efd.jpg',
    backdrop_path: '/vL5LR6V.jpg',
    release_date: '2009-12-15',
    vote_average: 7.6,
    vote_count: 31000,
    popularity: 115.0,
    genre_ids: [28, 12, 14, 878],
    genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 878, name: 'Science Fiction' }],
    runtime: 162,
    tagline: 'Enter the world of Pandora.',
    credits: {
      cast: [{ id: 65731, name: 'Sam Worthington', character: 'Jake Sully' }],
      crew: [{ id: 2710, name: 'James Cameron', job: 'Director' }],
    },
    videos: { results: [{ site: 'YouTube', type: 'Trailer', key: '5PSNL1qE6VY' }] },
  },
  {
    id: 98,
    title: 'Gladiator',
    original_title: 'Gladiator',
    overview: 'In the year 180, the death of emperor Marcus Aurelius throws the Roman Empire into chaos. Maximus, one of the Roman army\'s most capable generals, is betrayed by the corrupt prince Commodus.',
    poster_path: '/ty8T3AchIsmIIoAcReqOSyFjOhw.jpg',
    backdrop_path: '/z7.jpg',
    release_date: '2000-05-01',
    vote_average: 8.2,
    vote_count: 18000,
    popularity: 90.0,
    genre_ids: [28, 12, 18],
    genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 18, name: 'Drama' }],
    runtime: 155,
    tagline: 'What we do in life echoes in eternity.',
    credits: {
      cast: [{ id: 934, name: 'Russell Crowe', character: 'Maximus Decimus Meridius' }],
      crew: [{ id: 578, name: 'Ridley Scott', job: 'Director' }],
    },
    videos: { results: [{ site: 'YouTube', type: 'Trailer', key: 'P5ieIbInF5s' }] },
  }
];

function getMockGenres() {
  return { genres: MOCK_GENRES };
}

function getMockTrending() {
  return { page: 1, total_pages: 1, total_results: MOCK_MOVIES.length, results: MOCK_MOVIES };
}

function discoverMockMovies({ with_genres, primary_release_year, sort_by, page = 1 }) {
  let list = [...MOCK_MOVIES];

  if (with_genres) {
    const genreId = Number(with_genres);
    list = list.filter((m) => m.genre_ids.includes(genreId));
  }

  if (primary_release_year) {
    const yearStr = String(primary_release_year);
    list = list.filter((m) => m.release_date && m.release_date.startsWith(yearStr));
  }

  if (sort_by === 'vote_average.desc') {
    list.sort((a, b) => b.vote_average - a.vote_average);
  } else if (sort_by === 'release_date.desc') {
    list.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
  } else if (sort_by === 'release_date.asc') {
    list.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
  } else if (sort_by === 'original_title.asc') {
    list.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // popularity
    list.sort((a, b) => b.popularity - a.popularity);
  }

  const pageSize = 10;
  const totalPages = Math.ceil(list.length / pageSize) || 1;
  const pageNum = Math.min(Number(page) || 1, totalPages);
  const startIndex = (pageNum - 1) * pageSize;
  const paginatedResults = list.slice(startIndex, startIndex + pageSize);

  return {
    page: pageNum,
    total_pages: totalPages,
    total_results: list.length,
    results: paginatedResults,
  };
}

function searchMockMovies({ query, page = 1 }) {
  const q = (query || '').toLowerCase();
  const list = MOCK_MOVIES.filter(
    (m) => m.title.toLowerCase().includes(q) || m.overview.toLowerCase().includes(q)
  );

  const pageSize = 10;
  const totalPages = Math.ceil(list.length / pageSize) || 1;
  const pageNum = Math.min(Number(page) || 1, totalPages);
  const startIndex = (pageNum - 1) * pageSize;

  return {
    page: pageNum,
    total_pages: totalPages,
    total_results: list.length,
    results: list.slice(startIndex, startIndex + pageSize),
  };
}

function getMockMovieDetails(id) {
  const numId = Number(id);
  const found = MOCK_MOVIES.find((m) => m.id === numId) || MOCK_MOVIES[0];
  const similar = MOCK_MOVIES.filter((m) => m.id !== found.id).slice(0, 4);

  return {
    ...found,
    similar: { results: similar },
  };
}

module.exports = {
  getMockGenres,
  getMockTrending,
  discoverMockMovies,
  searchMockMovies,
  getMockMovieDetails,
};
