// src/lib/dummy-data.ts
export const dummyCategories = [
  { id: '1', name: 'Technology', slug: 'technology' },
  { id: '2', name: 'Business', slug: 'business' },
  { id: '3', name: 'Health', slug: 'health' },
]

// export const dummyArticles = [
//   {
//     id: '1',
//     title: 'Getting Started with Next.js',
//     content: 'Lorem ipsum dolor sit amet...',
//     category: dummyCategories[0],
//     image: '/placeholder.jpg',
//     createdAt: '2023-01-01',
//   },
//   // More articles...
// ]

export const dummyArticles = [
  {
    id: '1',
    title: 'First Article',
    content: 'This is the content of the first article.',
    category: dummyCategories[0],
    image: '/images/article1.jpg',
    createdAt: '2024-06-01T12:00:00Z',
    slug: 'first-article',
    updatedAt: '2024-06-03T12:00:00Z'
  },
  {
    id: '2',
    title: 'Second Article',
    content: 'This is the content of the second article.',
    category: dummyCategories[1],
    image: '/images/article2.jpg',
    createdAt: '2024-06-02T12:00:00Z',
    slug: 'second-article',
    updatedAt: '2024-06-04T12:00:00Z'
  }
  // ...more articles, each with slug and updatedAt
]