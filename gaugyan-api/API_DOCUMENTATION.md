# Gaugyan API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Courses](#courses)
4. [Exams](#exams)
5. [Quizzes](#quizzes)
6. [Marketplace](#marketplace)
7. [Entertainment](#entertainment)
8. [Content Management](#content-management)
9. [Admin Panel](#admin-panel)

## Authentication

### Login
**POST** `/api/v1/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Signup
**POST** `/api/v1/auth/signup`
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "accountType": "user" // Options: user, instructor, vendor, gaushalaowner, artist, admin
}
```

### Get Current User
**GET** `/api/v1/auth/me`
*Requires authentication*

### Refresh Token
**POST** `/api/v1/auth/refresh`
```json
{
  "refreshToken": "refresh_token_here"
}
```

## User Management

### Get All Users (Admin Only)
**GET** `/api/users`
*Requires admin authentication*

### Get User by ID
**GET** `/api/users/:id`
*Requires authentication*

### Update User
**PUT** `/api/users/:id`
*Requires authentication*

### Delete User (Admin Only)
**DELETE** `/api/users/:id`
*Requires admin authentication*

### Toggle Wishlist Item
**POST** `/api/users/wishlist/toggle`
*Requires authentication*
```json
{
  "productId": "product_id_here"
}
```

### Get User Wishlist
**GET** `/api/users/wishlist`
*Requires authentication*

## Courses

### Get All Courses
**GET** `/api/courses`
Query Parameters:
- search: Search term
- category: Filter by category
- level: Filter by level
- instructor: Filter by instructor ID
- sort: Sorting option (price_asc, price_desc, rating, popular)
- page: Page number (default: 1)
- limit: Items per page (default: 10)

### Get Course by ID
**GET** `/api/courses/:id`

### Create Course
**POST** `/api/courses`
*Requires instructor or admin authentication*

### Update Course
**PUT** `/api/courses/:id`
*Requires instructor (own course) or admin authentication*

### Delete Course
**DELETE** `/api/courses/:id`
*Requires instructor (own course) or admin authentication*

## Exams

### Get All Exams
**GET** `/api/exams`

### Get Exam by ID
**GET** `/api/exams/:id`

### Create Exam
**POST** `/api/exams`
*Requires instructor or admin authentication*

### Update Exam
**PUT** `/api/exams/:id`
*Requires instructor (own exam) or admin authentication*

### Delete Exam
**DELETE** `/api/exams/:id`
*Requires instructor (own exam) or admin authentication*

## Quizzes

### Get All Quizzes
**GET** `/api/quizzes`

### Get Quiz by ID
**GET** `/api/quizzes/:id`

### Create Quiz
**POST** `/api/quizzes`
*Requires instructor or admin authentication*

### Update Quiz
**PUT** `/api/quizzes/:id`
*Requires instructor (own quiz) or admin authentication*

### Delete Quiz
**DELETE** `/api/quizzes/:id`
*Requires instructor (own quiz) or admin authentication*

## Marketplace

### Get All Products
**GET** `/api/products`
Query Parameters:
- search: Search term
- category: Filter by category
- minPrice: Minimum price
- maxPrice: Maximum price
- vendor: Filter by vendor ID
- status: Filter by status
- sort: Sorting option (price_asc, price_desc, rating, popular)
- page: Page number (default: 1)
- limit: Items per page (default: 10)

### Get Product by ID
**GET** `/api/products/:id`

### Create Product
**POST** `/api/products`
*Requires vendor or admin authentication*

### Update Product
**PUT** `/api/products/:id`
*Requires vendor (own product) or admin authentication*

### Delete Product
**DELETE** `/api/products/:id`
*Requires vendor (own product) or admin authentication*

## Entertainment

### Music

#### Get All Music
**GET** `/api/music`
Query Parameters:
- genre: Filter by genre
- mood: Filter by mood
- status: Filter by status
- search: Search term

#### Get Music by ID
**GET** `/api/music/:id`

#### Create Music
**POST** `/api/music`
*Requires artist or admin authentication*

#### Update Music
**PUT** `/api/music/:id`
*Requires artist or admin authentication*

#### Delete Music
**DELETE** `/api/music/:id`
*Requires artist or admin authentication*

### Podcasts

#### Get All Podcasts
**GET** `/api/podcasts`
Query Parameters:
- category: Filter by category
- series: Filter by series
- status: Filter by status
- search: Search term

#### Get Podcast by ID
**GET** `/api/podcasts/:id`

#### Create Podcast
**POST** `/api/podcasts`
*Requires artist or admin authentication*

#### Update Podcast
**PUT** `/api/podcasts/:id`
*Requires artist or admin authentication*

#### Delete Podcast
**DELETE** `/api/podcasts/:id`
*Requires artist or admin authentication*

### Meditation

#### Get All Meditation
**GET** `/api/meditation`
Query Parameters:
- type: Filter by type
- difficulty: Filter by difficulty
- status: Filter by status
- search: Search term

#### Get Meditation by ID
**GET** `/api/meditation/:id`

#### Create Meditation
**POST** `/api/meditation`
*Requires artist or admin authentication*

#### Update Meditation
**PUT** `/api/meditation/:id`
*Requires artist or admin authentication*

#### Delete Meditation
**DELETE** `/api/meditation/:id`
*Requires artist or admin authentication*

## Content Management

### News

#### Get All News
**GET** `/api/news`
Query Parameters:
- category: Filter by category
- status: Filter by status

#### Get News by ID
**GET** `/api/news/:id`

#### Create News
**POST** `/api/news`
*Requires editor or admin authentication*

#### Update News
**PUT** `/api/news/:id`
*Requires editor or admin authentication*

#### Delete News
**DELETE** `/api/news/:id`
*Requires editor or admin authentication*

### Knowledgebase

#### Get All Articles
**GET** `/api/v1/content/knowledgebase`
Query Parameters:
- category: Filter by category
- status: Filter by status

#### Get Article by ID
**GET** `/api/v1/content/knowledgebase/:id`

#### Create Article
**POST** `/api/v1/content/knowledgebase`
*Requires instructor or admin authentication*

#### Update Article
**PUT** `/api/v1/content/knowledgebase/:id`
*Requires instructor or admin authentication*

#### Delete Article
**DELETE** `/api/v1/content/knowledgebase/:id`
*Requires admin authentication*

## Admin Panel

### Get Dashboard Stats
**GET** `/api/admin/stats`
*Requires admin authentication*

### User Management
**GET** `/api/admin/users`
*Requires admin authentication*

**GET** `/api/admin/users/:id`
*Requires admin authentication*

**PUT** `/api/admin/users/:id`
*Requires admin authentication*

**DELETE** `/api/admin/users/:id`
*Requires admin authentication*

### Content Management
**GET** `/api/admin/courses`
*Requires admin authentication*

**GET** `/api/admin/exams`
*Requires admin authentication*

**GET** `/api/admin/quizzes`
*Requires admin authentication*

**GET** `/api/admin/products`
*Requires admin authentication*

**GET** `/api/admin/gaushalas`
*Requires admin authentication*

**GET** `/api/admin/music`
*Requires admin authentication*

**GET** `/api/admin/podcasts`
*Requires admin authentication*

**GET** `/api/admin/meditation`
*Requires admin authentication*

**GET** `/api/admin/news`
*Requires admin authentication*

**GET** `/api/admin/knowledgebase`
*Requires admin authentication*