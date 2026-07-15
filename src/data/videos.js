// Demo catalogue. Replace `src` with your own hosted/CDN video URLs in production.
// The sample clips below are freely licensed (Creative Commons) test videos
// commonly used for player demos.
const videos = [
  {
    id: 'v1',
    title: 'Introduction to Web Development',
    instructor: 'Dr. Anitha Rao',
    category: 'Web Development',
    duration: '9:56',
    thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: 'A foundational walkthrough of how the modern web works, from HTML to deployment.',
  },
  {
    id: 'v2',
    title: 'Data Structures: Trees & Graphs',
    instructor: 'Prof. Karthik Iyer',
    category: 'Computer Science',
    duration: '12:14',
    thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    description: 'Core tree and graph traversal techniques every engineer should know.',
  },
  {
    id: 'v3',
    title: 'Intro to Machine Learning',
    instructor: 'Dr. Meera Nair',
    category: 'AI / ML',
    duration: '10:53',
    thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: 'Supervised vs unsupervised learning, explained with real-world examples.',
  },
  {
    id: 'v4',
    title: 'Cloud Fundamentals',
    instructor: 'Er. Sandeep Verma',
    category: 'Cloud Computing',
    duration: '15:00',
    thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    description: 'Compute, storage, and networking basics across major cloud providers.',
  },
]

export default videos
