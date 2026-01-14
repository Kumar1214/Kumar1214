-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 26, 2025 at 01:54 PM
-- Server version: 10.11.15-MariaDB-cll-lve
-- PHP Version: 8.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gaugyanc_gaugyanworld`
--

-- --------------------------------------------------------

--
-- Table structure for table `Banners`
--

CREATE TABLE `Banners` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `linkUrl` varchar(255) DEFAULT NULL,
  `buttonText` varchar(255) DEFAULT NULL,
  `placement` enum('courses','exams','quiz','knowledgebase','music','podcast','meditation','home','shop') NOT NULL,
  `order` int(11) DEFAULT 0,
  `isActive` tinyint(1) DEFAULT 1,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `backgroundColor` varchar(255) DEFAULT '#1E3A8A',
  `textColor` varchar(255) DEFAULT '#FFFFFF',
  `createdBy` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Banners`
--

INSERT INTO `Banners` (`id`, `title`, `description`, `imageUrl`, `linkUrl`, `buttonText`, `placement`, `order`, `isActive`, `startDate`, `endDate`, `backgroundColor`, `textColor`, `createdBy`, `createdAt`, `updatedAt`) VALUES
(1, 'Welcome to GauGyan', 'Explore the world of Vedic Wisdom and Sustainable Living.', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200', '/courses', 'Explore Courses', 'home', 1, 1, '2025-12-25 08:25:15', NULL, '#1E3A8A', '#FFFFFF', 1, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(2, 'Shop Organic Products', 'Pure, authentic, and organic products directly from Gaushalas.', 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&q=80&w=1200', '/shop', 'Shop Now', 'home', 2, 1, '2025-12-25 08:25:15', NULL, '#064E3B', '#FFFFFF', 1, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(3, 'Welcome Banner', NULL, 'https://via.placeholder.com/1200x300', NULL, NULL, '', 0, 1, NULL, NULL, '#1E3A8A', '#FFFFFF', NULL, '2025-12-25 14:49:51', '2025-12-25 14:49:51'),
(4, 'Welcome Banner', NULL, 'https://via.placeholder.com/1200x300', NULL, NULL, '', 0, 1, NULL, NULL, '#1E3A8A', '#FFFFFF', NULL, '2025-12-25 14:51:13', '2025-12-25 14:51:13'),
(5, 'Welcome Banner', NULL, 'https://via.placeholder.com/1200x300', NULL, NULL, '', 0, 1, NULL, NULL, '#1E3A8A', '#FFFFFF', NULL, '2025-12-25 14:51:46', '2025-12-25 14:51:46'),
(6, 'Welcome Banner', NULL, 'https://via.placeholder.com/1200x300', NULL, NULL, '', 0, 1, NULL, NULL, '#1E3A8A', '#FFFFFF', NULL, '2025-12-25 14:52:21', '2025-12-25 14:52:21');

-- --------------------------------------------------------

--
-- Table structure for table `Carts`
--

CREATE TABLE `Carts` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`items`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `CommunityPosts`
--

CREATE TABLE `CommunityPosts` (
  `id` int(11) NOT NULL,
  `authorId` int(11) NOT NULL,
  `content` text NOT NULL,
  `media` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`media`)),
  `likes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`likes`)),
  `comments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`comments`)),
  `isPublished` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ContactMessages`
--

CREATE TABLE `ContactMessages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied') DEFAULT 'new',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `CourseCategories`
--

CREATE TABLE `CourseCategories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `CourseCategories`
--

INSERT INTO `CourseCategories` (`id`, `name`, `description`, `icon`, `image`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'Ayurveda', 'Traditional Indian Medicine', '?', NULL, 1, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(2, 'Yoga', 'Physical, mental, and spiritual practices', '?', NULL, 1, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(3, 'Vedic Studies', 'Ancient scriptures and philosophy', '?', NULL, 1, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(4, 'Organic Farming', 'Sustainable agriculture', '?', NULL, 1, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(5, 'Cow Care', 'Gau Seva and maintenance', '?', NULL, 1, '2025-12-25 08:25:15', '2025-12-25 08:25:15');

-- --------------------------------------------------------

--
-- Table structure for table `Courses`
--

CREATE TABLE `Courses` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `instructorId` int(11) NOT NULL,
  `category` enum('Ayurveda','Yoga','Vedic Studies','Language','Spirituality','Agriculture','Web Development','Business','Yoga & Meditation') NOT NULL,
  `level` enum('All Levels','Beginner','Intermediate','Advanced') DEFAULT 'All Levels',
  `price` decimal(10,2) DEFAULT 0.00,
  `originalPrice` decimal(10,2) DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 0,
  `isActive` tinyint(1) DEFAULT 1,
  `image` varchar(255) DEFAULT 'no-photo.jpg',
  `youtubeUrl` varchar(255) DEFAULT NULL,
  `syllabus` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`syllabus`)),
  `includes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`includes`)),
  `whatLearns` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`whatLearns`)),
  `reviews` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`reviews`)),
  `rating` float DEFAULT 0,
  `numReviews` int(11) DEFAULT 0,
  `students` int(11) DEFAULT 0,
  `randomizeOptions` tinyint(1) DEFAULT 0,
  `isPublished` tinyint(1) DEFAULT 0,
  `studyMaterial` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`studyMaterial`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `chapters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`chapters`)),
  `faqs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`faqs`)),
  `questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`questions`))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Courses`
--

INSERT INTO `Courses` (`id`, `title`, `slug`, `description`, `instructorId`, `category`, `level`, `price`, `originalPrice`, `endDate`, `featured`, `isActive`, `image`, `youtubeUrl`, `syllabus`, `includes`, `whatLearns`, `reviews`, `rating`, `numReviews`, `students`, `randomizeOptions`, `isPublished`, `studyMaterial`, `createdAt`, `updatedAt`, `chapters`, `faqs`, `questions`) VALUES
(1, 'Introduction to Ayurveda', NULL, 'Learn the fundamentals of Ayurvedic medicine and lifestyle', 2, 'Ayurveda', 'Beginner', 999.00, 1499.00, NULL, 0, 1, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b', NULL, '[]', '[]', '[]', '[]', 4.5, 0, 150, 0, 1, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL, NULL, NULL),
(2, 'Advanced Yoga Philosophy', NULL, 'Deep dive into the philosophical aspects of Yoga', 2, 'Yoga', 'Advanced', 1499.00, NULL, NULL, 0, 1, 'https://images.unsplash.com/photo-1506126613408-eca07ce68773', NULL, '[]', '[]', '[]', '[]', 4.8, 0, 89, 0, 1, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL, NULL, NULL),
(3, 'Vedic Mathematics Masterclass', NULL, 'Unlock the power of mental math with ancient Vedic techniques.', 2, 'Vedic Studies', 'Intermediate', 799.00, 1299.00, NULL, 0, 1, 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400', NULL, '[]', '[]', '[]', '[]', 4.7, 0, 210, 0, 1, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL, NULL, NULL),
(4, 'web development beginner', 'web-development-beginner', '<p>test</p>', 1, 'Web Development', 'Beginner', 10.00, NULL, NULL, 0, 1, '/uploads/images/1766670401725-Explore Courses, Quizes & Exams (1).png', '', '[]', '[]', '[]', '[]', 0, 0, 0, 0, 0, '[]', '2025-12-25 12:30:06', '2025-12-25 13:46:47', NULL, NULL, NULL),
(5, 'Scripted Course 101', 'scripted-course-101', 'Created via automation script', 1, '', 'Beginner', 99.00, NULL, NULL, 0, 1, 'no-photo.jpg', NULL, '[]', '[]', '[]', '[]', 0, 0, 0, 0, 0, '[]', '2025-12-25 14:48:41', '2025-12-25 14:48:41', NULL, NULL, NULL),
(8, 'Scripted Course 1766674307042', 'scripted-course-1766674307042', 'Created via automation script', 1, 'Web Development', 'Beginner', 99.00, NULL, NULL, 0, 1, 'no-photo.jpg', NULL, '[]', '[]', '[]', '[]', 0, 0, 0, 0, 0, '[]', '2025-12-25 14:51:46', '2025-12-25 14:51:46', NULL, NULL, NULL),
(9, 'Scripted Course 1766674341670', 'scripted-course-1766674341670', 'Created via automation script', 1, 'Web Development', 'Beginner', 99.00, NULL, NULL, 0, 1, 'no-photo.jpg', NULL, '[]', '[]', '[]', '[]', 0, 0, 0, 0, 0, '[]', '2025-12-25 14:52:21', '2025-12-25 14:52:21', NULL, NULL, NULL),
(10, 'Test Course 1766675335864', 'test-course-1766675335864', 'Auto-generated test course', 1, 'Ayurveda', 'Beginner', 0.00, NULL, NULL, 0, 1, 'no-photo.jpg', NULL, '[]', '[]', '[]', '[]', 0, 0, 0, 0, 0, '[]', '2025-12-25 15:08:55', '2025-12-25 15:08:55', NULL, NULL, NULL),
(11, 'Test Course 1766675499705', 'test-course-1766675499705', 'Auto-generated test course', 1, 'Ayurveda', 'Beginner', 0.00, NULL, NULL, 0, 1, 'no-photo.jpg', NULL, '[]', '[]', '[]', '[]', 0, 0, 0, 0, 0, '[]', '2025-12-25 15:11:39', '2025-12-25 15:11:39', NULL, NULL, NULL),
(12, 'Test Course 1766675556379', 'test-course-1766675556379', 'Auto-generated test course', 1, 'Ayurveda', 'Beginner', 0.00, NULL, NULL, 0, 1, 'no-photo.jpg', NULL, '[]', '[]', '[]', '[]', 0, 0, 0, 0, 0, '[]', '2025-12-25 15:12:35', '2025-12-25 15:12:35', NULL, NULL, NULL),
(13, 'Test Course 1766676349180', 'test-course-1766676349180', 'Auto-generated test course', 1, 'Ayurveda', 'Beginner', 0.00, NULL, NULL, 0, 1, 'no-photo.jpg', NULL, '[]', '[]', '[]', '[]', 0, 0, 0, 0, 0, '[]', '2025-12-25 15:25:48', '2025-12-25 15:25:48', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Cows`
--

CREATE TABLE `Cows` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `breed` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `description` text DEFAULT NULL,
  `healthStatus` varchar(255) DEFAULT NULL,
  `healthRecords` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`healthRecords`)),
  `currentLocation` varchar(255) DEFAULT NULL,
  `adoptionStatus` varchar(255) DEFAULT NULL,
  `adoptedBy` int(11) DEFAULT NULL,
  `adoptionDate` datetime DEFAULT NULL,
  `monthlyCost` decimal(10,2) DEFAULT NULL,
  `specialNeeds` varchar(255) DEFAULT NULL,
  `story` text DEFAULT NULL,
  `ownerId` int(11) DEFAULT NULL,
  `gaushalaProfileId` int(11) DEFAULT NULL,
  `milkProduction` varchar(255) DEFAULT NULL,
  `temperament` varchar(255) DEFAULT NULL,
  `vaccinated` tinyint(1) DEFAULT NULL,
  `lastVaccinationDate` datetime DEFAULT NULL,
  `featured` tinyint(1) DEFAULT NULL,
  `views` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Cows`
--

INSERT INTO `Cows` (`id`, `name`, `breed`, `age`, `gender`, `color`, `image`, `images`, `description`, `healthStatus`, `healthRecords`, `currentLocation`, `adoptionStatus`, `adoptedBy`, `adoptionDate`, `monthlyCost`, `specialNeeds`, `story`, `ownerId`, `gaushalaProfileId`, `milkProduction`, `temperament`, `vaccinated`, `lastVaccinationDate`, `featured`, `views`, `createdAt`, `updatedAt`) VALUES
(1, 'Kamdhenu', 'Gir', 5, 'Female', 'White with brown patches', 'https://images.unsplash.com/photo-1516467508483-a7212febe31a', '[]', 'Gentle and calm cow, excellent milk producer', 'Excellent', '[]', 'Gaugyan Gaushala, Vrindavan', 'available', NULL, NULL, 3000.00, NULL, NULL, 5, 1, '12 liters/day', 'Calm', 1, NULL, 1, NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(2, 'Nandi', 'Sahiwal', 3, 'Male', 'Brown', 'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0', '[]', 'Strong and healthy bull', 'Good', '[]', 'Gaugyan Gaushala, Vrindavan', 'available', NULL, NULL, 2500.00, NULL, NULL, 5, 1, NULL, 'Active', 1, NULL, NULL, NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(3, 'Gauri', 'Tharparkar', 4, 'Female', 'White', 'https://images.unsplash.com/photo-1546445317-29f4545e9d53', '[]', 'Beautiful white cow, very friendly', 'Good', '[]', 'Gaugyan Gaushala, Vrindavan', 'adopted', NULL, NULL, 2800.00, NULL, NULL, 5, 1, '10 liters/day', 'Friendly', 1, NULL, NULL, NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(4, 'Cow 4', 'Red Sindhi', 5, 'Female', 'Mixed', 'https://images.unsplash.com/photo-1500000000004', '[]', 'A lovely cow needing care and support.', 'Good', '[]', 'Gaugyan Gaushala, Vrindavan', 'sponsored', NULL, NULL, 2292.00, NULL, NULL, 5, 1, NULL, 'Active', 1, NULL, NULL, NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(5, 'Cow 5', 'Gir', 9, 'Female', 'Mixed', 'https://images.unsplash.com/photo-1500000000005', '[]', 'A lovely cow needing care and support.', 'Good', '[]', 'Gaugyan Gaushala, Vrindavan', 'sponsored', NULL, NULL, 2179.00, NULL, NULL, 5, 1, NULL, 'Shy', 1, NULL, NULL, NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(6, 'Cow 6', 'Gir', 10, 'Female', 'Mixed', 'https://images.unsplash.com/photo-1500000000006', '[]', 'A lovely cow needing care and support.', 'Good', '[]', 'Gaugyan Gaushala, Vrindavan', 'sponsored', NULL, NULL, 1880.00, NULL, NULL, 5, 1, NULL, 'Shy', 1, NULL, NULL, NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(7, 'Cow 7', 'Rathi', 9, 'Female', 'Mixed', 'https://images.unsplash.com/photo-1500000000007', '[]', 'A lovely cow needing care and support.', 'Good', '[]', 'Gaugyan Gaushala, Vrindavan', 'available', NULL, NULL, 3287.00, NULL, NULL, 5, 1, NULL, 'Friendly', 1, NULL, NULL, NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(8, 'Cow 8', 'Rathi', 6, 'Female', 'Mixed', 'https://images.unsplash.com/photo-1500000000008', '[]', 'A lovely cow needing care and support.', 'Good', '[]', 'Gaugyan Gaushala, Vrindavan', 'sponsored', NULL, NULL, 2745.00, NULL, NULL, 5, 1, NULL, 'Friendly', 1, NULL, NULL, NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(9, 'Cow 9', 'Tharparkar', 7, 'Male', 'Mixed', 'https://images.unsplash.com/photo-1500000000009', '[]', 'A lovely cow needing care and support.', 'Good', '[]', 'Gaugyan Gaushala, Vrindavan', 'sponsored', NULL, NULL, 2590.00, NULL, NULL, 5, 1, NULL, 'Calm', 1, NULL, NULL, NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(10, 'Cow 10', 'Hariana', 5, 'Male', 'Mixed', 'https://images.unsplash.com/photo-1500000000010', '[]', 'A lovely cow needing care and support.', 'Good', '[]', 'Gaugyan Gaushala, Vrindavan', 'available', NULL, NULL, 2038.00, NULL, NULL, 5, 1, NULL, 'Active', 1, NULL, NULL, NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(11, 'Cow 11', 'Rathi', 3, 'Female', 'Mixed', 'https://images.unsplash.com/photo-1500000000011', '[]', 'A lovely cow needing care and support.', 'Good', '[]', 'Gaugyan Gaushala, Vrindavan', 'sponsored', NULL, NULL, 2465.00, NULL, NULL, 5, 1, NULL, 'Shy', 1, NULL, NULL, NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(12, 'Cow 12', 'Red Sindhi', 2, 'Female', 'Mixed', 'https://images.unsplash.com/photo-1500000000012', '[]', 'A lovely cow needing care and support.', 'Good', '[]', 'Gaugyan Gaushala, Vrindavan', 'sponsored', NULL, NULL, 1604.00, NULL, NULL, 5, 1, NULL, 'Active', 1, NULL, NULL, NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(13, 'Cow 13', 'Gir', 4, 'Female', 'Mixed', 'https://images.unsplash.com/photo-1500000000013', '[]', 'A lovely cow needing care and support.', 'Good', '[]', 'Gaugyan Gaushala, Vrindavan', 'sponsored', NULL, NULL, 2897.00, NULL, NULL, 5, 1, NULL, 'Calm', 1, NULL, NULL, NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(14, 'Cow 14', 'Kankrej', 1, 'Female', 'Mixed', 'https://images.unsplash.com/photo-1500000000014', '[]', 'A lovely cow needing care and support.', 'Good', '[]', 'Gaugyan Gaushala, Vrindavan', 'sponsored', NULL, NULL, 2698.00, NULL, NULL, 5, 1, NULL, 'Calm', 1, NULL, NULL, NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(15, 'Cow 15', 'Tharparkar', 5, 'Female', 'Mixed', 'https://images.unsplash.com/photo-1500000000015', '[]', 'A lovely cow needing care and support.', 'Good', '[]', 'Gaugyan Gaushala, Vrindavan', 'sponsored', NULL, NULL, 3237.00, NULL, NULL, 5, 1, NULL, 'Shy', 1, NULL, NULL, NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15');

-- --------------------------------------------------------

--
-- Table structure for table `Exams`
--

CREATE TABLE `Exams` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `courseId` int(11) DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `level` enum('Beginner','Intermediate','Advanced') DEFAULT 'Beginner',
  `difficulty` enum('Easy','Medium','Hard','Intermediate') DEFAULT 'Medium',
  `questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`questions`)),
  `duration` int(11) NOT NULL,
  `totalMarks` int(11) DEFAULT 0,
  `passingMarks` int(11) NOT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  `image` varchar(255) DEFAULT 'https://placehold.co/600x400',
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `resultDate` datetime DEFAULT NULL,
  `participants` varchar(255) DEFAULT '0',
  `instructions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`instructions`)),
  `prizes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`prizes`)),
  `winners` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`winners`)),
  `featured` tinyint(1) DEFAULT 0,
  `isActive` tinyint(1) DEFAULT 1,
  `attempts` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attempts`)),
  `createdBy` int(11) DEFAULT NULL,
  `studyMaterial` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`studyMaterial`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Exams`
--

INSERT INTO `Exams` (`id`, `title`, `description`, `courseId`, `category`, `level`, `difficulty`, `questions`, `duration`, `totalMarks`, `passingMarks`, `price`, `image`, `startDate`, `endDate`, `resultDate`, `participants`, `instructions`, `prizes`, `winners`, `featured`, `isActive`, `attempts`, `createdBy`, `studyMaterial`, `createdAt`, `updatedAt`) VALUES
(1, 'Ayurveda Fundamentals - Final Exam', 'Test your knowledge of basic Ayurvedic principles', NULL, 'Ayurveda', 'Beginner', 'Medium', '[{\"question\":\"What are the three doshas in Ayurveda?\",\"options\":[\"Vata, Pitta, Kapha\",\"Fire, Water, Earth\",\"Mind, Body, Soul\",\"Hot, Cold, Neutral\"],\"correctAnswer\":0,\"explanation\":\"The three doshas are Vata, Pitta, and Kapha\",\"marks\":2},{\"question\":\"Which dosha is associated with the fire element?\",\"options\":[\"Vata\",\"Pitta\",\"Kapha\",\"None\"],\"correctAnswer\":1,\"explanation\":\"Pitta dosha is associated with fire and water elements\",\"marks\":2}]', 30, 4, 2, 0.00, 'https://placehold.co/600x400', '2025-12-25 08:25:15', NULL, NULL, '0', '[]', '[]', '[]', 1, 1, '[]', 2, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(2, 'Yoga Philosophy Advanced', 'Advanced concepts of Yoga Sutras', NULL, 'Yoga', 'Advanced', 'Medium', '[{\"question\":\"Who compiled the Yoga Sutras?\",\"options\":[\"Patanjali\",\"Vyasa\",\"Kapila\",\"Shankaracharya\"],\"correctAnswer\":0,\"explanation\":\"Sage Patanjali compiled the Yoga Sutras.\",\"marks\":5}]', 60, 5, 3, 0.00, 'https://placehold.co/600x400', '2025-12-25 08:25:15', NULL, NULL, '0', '[]', '[]', '[]', 1, 1, '[]', 2, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(3, 'Scripted Final Exam', 'Final exam for the scripted course', 9, 'Web Development', 'Beginner', 'Medium', '[8]', 60, 1, 40, 0.00, 'https://placehold.co/600x400', '2025-12-25 14:52:21', NULL, NULL, '0', '[]', '[]', '[]', 0, 1, '[]', 1, '[]', '2025-12-25 14:52:21', '2025-12-25 14:52:21'),
(4, 'Test Exam 1766675499780', 'Auto-generated test exam', NULL, 'Ayurveda', 'Beginner', 'Medium', '[]', 60, 0, 50, 0.00, 'https://placehold.co/600x400', '2025-12-25 15:11:39', '2025-12-26 15:11:39', '2025-12-27 15:11:39', '0', '[]', '[]', '[]', 0, 1, '[]', 1, '[]', '2025-12-25 15:11:39', '2025-12-25 15:11:39'),
(5, 'Test Exam 1766675556451', 'Auto-generated test exam', NULL, 'Ayurveda', 'Beginner', 'Medium', '[]', 60, 0, 50, 0.00, 'https://placehold.co/600x400', '2025-12-25 15:12:36', '2025-12-26 15:12:36', '2025-12-27 15:12:36', '0', '[]', '[]', '[]', 0, 1, '[]', 1, '[]', '2025-12-25 15:12:35', '2025-12-25 15:12:35'),
(6, 'Test Exam 1766676349265', 'Auto-generated test exam', NULL, 'Ayurveda', 'Beginner', 'Medium', '[]', 60, 0, 50, 0.00, 'https://placehold.co/600x400', '2025-12-25 15:25:49', '2025-12-26 15:25:49', '2025-12-27 15:25:49', '0', '[]', '[]', '[]', 0, 1, '[]', 1, '[]', '2025-12-25 15:25:48', '2025-12-25 15:25:48');

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied') DEFAULT 'new',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `name`, `email`, `subject`, `message`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Feedback User', 'feedback@test.com', 'Great Site', 'I love the content!', 'new', '2025-12-25 14:49:52', '2025-12-25 14:49:52'),
(2, 'Feedback User', 'feedback@test.com', 'Great Site', 'I love the content!', 'new', '2025-12-25 14:51:14', '2025-12-25 14:51:14'),
(3, 'Feedback User', 'feedback@test.com', 'Great Site', 'I love the content!', 'new', '2025-12-25 14:51:47', '2025-12-25 14:51:47'),
(4, 'Feedback User', 'feedback@test.com', 'Great Site', 'I love the content!', 'new', '2025-12-25 14:52:22', '2025-12-25 14:52:22'),
(5, 'eric smith', 'myericsmith@gmail.com', 'test', 'test', 'new', '2025-12-25 15:02:19', '2025-12-25 15:02:19');

-- --------------------------------------------------------

--
-- Table structure for table `GaushalaProfiles`
--

CREATE TABLE `GaushalaProfiles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `location` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`location`)),
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `established` varchar(255) DEFAULT NULL,
  `timings` varchar(255) DEFAULT NULL,
  `cowsCount` int(11) DEFAULT NULL,
  `staffCount` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `ownerId` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `GaushalaProfiles`
--

INSERT INTO `GaushalaProfiles` (`id`, `name`, `city`, `state`, `address`, `location`, `phone`, `email`, `description`, `established`, `timings`, `cowsCount`, `staffCount`, `image`, `ownerId`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Shri Krishna Gaushala', 'Vrindavan', 'Uttar Pradesh', 'Parikrama Marg, Vrindavan', '{}', '9876543210', 'contact@krishnagaushala.com', 'A dedicated sanctuary', NULL, NULL, 520, NULL, NULL, 5, 'active', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(2, 'Scripted Gaushala', 'Vrindavan', 'UP', NULL, '{}', NULL, 'gaushala@script.com', 'A sanctuary for cows.', NULL, NULL, NULL, NULL, NULL, 1, 'active', '2025-12-25 14:48:41', '2025-12-25 14:48:41'),
(3, 'Scripted Gaushala', 'Vrindavan', 'UP', NULL, '{}', NULL, 'gaushala@script.com', 'A sanctuary for cows.', NULL, NULL, NULL, NULL, NULL, 1, 'active', '2025-12-25 14:49:51', '2025-12-25 14:49:51'),
(4, 'Scripted Gaushala', 'Vrindavan', 'UP', NULL, '{}', NULL, 'gaushala@script.com', 'A sanctuary for cows.', NULL, NULL, NULL, NULL, NULL, 1, 'active', '2025-12-25 14:51:13', '2025-12-25 14:51:13'),
(5, 'Scripted Gaushala', 'Vrindavan', 'UP', NULL, '{}', NULL, 'gaushala@script.com', 'A sanctuary for cows.', NULL, NULL, NULL, NULL, NULL, 1, 'active', '2025-12-25 14:51:46', '2025-12-25 14:51:46'),
(6, 'Scripted Gaushala', 'Vrindavan', 'UP', NULL, '{}', NULL, 'gaushala@script.com', 'A sanctuary for cows.', NULL, NULL, NULL, NULL, NULL, 1, 'active', '2025-12-25 14:52:21', '2025-12-25 14:52:21');

-- --------------------------------------------------------

--
-- Table structure for table `Knowledgebases`
--

CREATE TABLE `Knowledgebases` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `content` text DEFAULT NULL,
  `videoUrl` varchar(255) DEFAULT NULL,
  `videoName` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT 'default-kb-image.jpg',
  `author` varchar(255) NOT NULL,
  `authorId` int(11) DEFAULT NULL,
  `status` enum('active','inactive','draft','pending') DEFAULT 'pending',
  `views` int(11) DEFAULT 0,
  `helpful` int(11) DEFAULT 0,
  `notHelpful` int(11) DEFAULT 0,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `relatedArticleIds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`relatedArticleIds`)),
  `lastUpdated` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Knowledgebases`
--

INSERT INTO `Knowledgebases` (`id`, `title`, `category`, `description`, `content`, `videoUrl`, `videoName`, `image`, `author`, `authorId`, `status`, `views`, `helpful`, `notHelpful`, `tags`, `relatedArticleIds`, `lastUpdated`, `createdAt`, `updatedAt`) VALUES
(1, 'Benefits of Cow Milk in Ayurveda', 'Ayurveda', 'Comprehensive guide to the medicinal properties of cow milk according to Ayurvedic texts', '<p>Cow milk has been revered in Ayurveda for its numerous health benefits...</p>', NULL, NULL, 'default-kb-image.jpg', 'Dr. Rajesh Sharma', 2, 'active', 1800, 145, 0, '[\"ayurveda\",\"nutrition\",\"cow products\"]', '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(2, 'Understanding the 8 Limbs of Yoga', 'Yoga', 'A detailed explanation of Ashtanga Yoga philosophy', '<p>Patanjali\'s Yoga Sutras describe the eightfold path of yoga...</p>', NULL, NULL, 'default-kb-image.jpg', 'Priya Desai', 2, 'active', 2500, 210, 0, '[\"yoga\",\"philosophy\",\"patanjali\"]', '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(3, 'Vedic Mathematics: Sutras Explained', 'Vedic Mathematics', 'Introduction to the 16 sutras of Vedic Math', '<p>Vedic Mathematics is a system of reasoning and mathematical working...</p>', NULL, NULL, 'default-kb-image.jpg', 'Acharya Gupta', 2, 'active', 1200, 95, 0, '[\"math\",\"vedic\",\"education\"]', '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(4, 'Knowledge Article 4: Deep Dive', 'Vedic Astrology', 'An in-depth look at this important topic.', '<p>Detailed content for article 4 goes here. It covers various aspects of the subject.</p>', NULL, NULL, 'default-kb-image.jpg', 'Priya Desai', 2, 'active', 2556, 92, 0, '[\"education\",\"knowledge\",\"learning\"]', '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(5, 'Knowledge Article 5: Deep Dive', 'Other', 'An in-depth look at this important topic.', '<p>Detailed content for article 5 goes here. It covers various aspects of the subject.</p>', NULL, NULL, 'default-kb-image.jpg', 'Acharya Gupta', 2, 'active', 168, 139, 0, '[\"education\",\"knowledge\",\"learning\"]', '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(6, 'Knowledge Article 6: Deep Dive', 'Podcasts', 'An in-depth look at this important topic.', '<p>Detailed content for article 6 goes here. It covers various aspects of the subject.</p>', NULL, NULL, 'default-kb-image.jpg', 'Acharya Gupta', 2, 'active', 1996, 247, 0, '[\"education\",\"knowledge\",\"learning\"]', '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(7, 'Knowledge Article 7: Deep Dive', 'Spirituality', 'An in-depth look at this important topic.', '<p>Detailed content for article 7 goes here. It covers various aspects of the subject.</p>', NULL, NULL, 'default-kb-image.jpg', 'Acharya Gupta', 2, 'active', 2076, 187, 0, '[\"education\",\"knowledge\",\"learning\"]', '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(8, 'Knowledge Article 8: Deep Dive', 'News', 'An in-depth look at this important topic.', '<p>Detailed content for article 8 goes here. It covers various aspects of the subject.</p>', NULL, NULL, 'default-kb-image.jpg', 'Swami Anand', 2, 'active', 540, 290, 0, '[\"education\",\"knowledge\",\"learning\"]', '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(9, 'Knowledge Article 9: Deep Dive', 'Vedic Mathematics', 'An in-depth look at this important topic.', '<p>Detailed content for article 9 goes here. It covers various aspects of the subject.</p>', NULL, NULL, 'default-kb-image.jpg', 'Priya Desai', 2, 'active', 269, 139, 0, '[\"education\",\"knowledge\",\"learning\"]', '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(10, 'Knowledge Article 10: Deep Dive', 'Vedic Mathematics', 'An in-depth look at this important topic.', '<p>Detailed content for article 10 goes here. It covers various aspects of the subject.</p>', NULL, NULL, 'default-kb-image.jpg', 'Dr. Rajesh Sharma', 2, 'active', 2564, 51, 0, '[\"education\",\"knowledge\",\"learning\"]', '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', '2025-12-25 08:25:15');

-- --------------------------------------------------------

--
-- Table structure for table `Media`
--

CREATE TABLE `Media` (
  `id` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `originalName` varchar(255) NOT NULL,
  `mimeType` varchar(255) NOT NULL,
  `size` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `storageProvider` enum('local','aws','gcloud') DEFAULT 'local',
  `uploadedBy` int(11) NOT NULL,
  `folder` varchar(255) DEFAULT 'general',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Media`
--

INSERT INTO `Media` (`id`, `filename`, `originalName`, `mimeType`, `size`, `url`, `storageProvider`, `uploadedBy`, `folder`, `createdAt`, `updatedAt`) VALUES
(1, '1766654915890-Explore Courses, Quizes & Exams (1).png', 'Explore Courses, Quizes & Exams (1).png', 'image/png', 259469, '/uploads/images/1766654915890-Explore Courses, Quizes & Exams (1).png', 'local', 1, 'images', '2025-12-25 09:28:35', '2025-12-25 09:28:35'),
(2, '1766654954328-Explore Courses, Quizes & Exams (1).png', 'Explore Courses, Quizes & Exams (1).png', 'image/png', 259469, '/uploads/images/1766654954328-Explore Courses, Quizes & Exams (1).png', 'local', 1, 'images', '2025-12-25 09:29:14', '2025-12-25 09:29:14'),
(3, '1766654963134-screencapture-rs3-mbi-serverhostgroup-2083-cpsess1765615036-frontend-jupiter-lveversion-nodejs-selector-html-tt-2025-12-20-22_18_36.png', 'screencapture-rs3-mbi-serverhostgroup-2083-cpsess1765615036-frontend-jupiter-lveversion-nodejs-selector-html-tt-2025-12-20-22_18_36.png', 'image/png', 216222, '/uploads/images/1766654963134-screencapture-rs3-mbi-serverhostgroup-2083-cpsess1765615036-frontend-jupiter-lveversion-nodejs-selector-html-tt-2025-12-20-22_18_36.png', 'local', 1, 'images', '2025-12-25 09:29:23', '2025-12-25 09:29:23'),
(4, '1766661168904-Explore Courses, Quizes & Exams (1).png', 'Explore Courses, Quizes & Exams (1).png', 'image/png', 259469, '/uploads/images/1766661168904-Explore Courses, Quizes & Exams (1).png', 'local', 1, 'images', '2025-12-25 11:12:48', '2025-12-25 11:12:48'),
(5, '1766665802167-Explore Courses, Quizes & Exams (1).png', 'Explore Courses, Quizes & Exams (1).png', 'image/png', 259469, '/uploads/images/1766665802167-Explore Courses, Quizes & Exams (1).png', 'local', 1, 'images', '2025-12-25 12:30:02', '2025-12-25 12:30:02'),
(6, '1766670401725-Explore Courses, Quizes & Exams (1).png', 'Explore Courses, Quizes & Exams (1).png', 'image/png', 259469, '/uploads/images/1766670401725-Explore Courses, Quizes & Exams (1).png', 'local', 1, 'images', '2025-12-25 13:46:41', '2025-12-25 13:46:41');

-- --------------------------------------------------------

--
-- Table structure for table `MeditationCategories`
--

CREATE TABLE `MeditationCategories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Meditations`
--

CREATE TABLE `Meditations` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `type` varchar(255) NOT NULL,
  `difficulty` enum('Beginner','Intermediate','Advanced') NOT NULL,
  `duration` varchar(255) NOT NULL,
  `audioUrl` varchar(255) DEFAULT NULL,
  `videoUrl` varchar(255) DEFAULT NULL,
  `coverImage` varchar(255) DEFAULT 'default-meditation-cover.jpg',
  `instructor` varchar(255) DEFAULT NULL,
  `series` varchar(255) DEFAULT NULL,
  `benefits` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`benefits`)),
  `instructions` text DEFAULT NULL,
  `playCount` int(11) DEFAULT 0,
  `likes` int(11) DEFAULT 0,
  `rating` float DEFAULT 0,
  `numRatings` int(11) DEFAULT 0,
  `status` enum('draft','published','archived','pending') DEFAULT 'pending',
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `language` varchar(255) DEFAULT 'Hindi',
  `uploadedBy` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `sessions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`sessions`))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Meditations`
--

INSERT INTO `Meditations` (`id`, `title`, `description`, `type`, `difficulty`, `duration`, `audioUrl`, `videoUrl`, `coverImage`, `instructor`, `series`, `benefits`, `instructions`, `playCount`, `likes`, `rating`, `numRatings`, `status`, `tags`, `language`, `uploadedBy`, `createdAt`, `updatedAt`, `sessions`) VALUES
(1, 'Morning Pranayama', 'Start your day with energizing breathing exercises', 'Breathing', 'Beginner', '15:00', 'https://example.com/meditation/morning-pranayama.mp3', 'https://youtube.com/watch?v=example', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773', 'Dr. Rajesh Sharma', NULL, '[]', NULL, 1500, 420, 4.8, 0, 'published', '[]', 'Hindi', 2, '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL),
(2, 'Deep Sleep Nidra', 'Guided yoga nidra for deep relaxation and sleep', 'Body Scan', 'Beginner', '30:00', 'https://example.com/meditation/sleep-nidra.mp3', NULL, 'https://images.unsplash.com/photo-1511379938547-c1f69419868d', 'Priya Desai', NULL, '[]', NULL, 2200, 650, 4.9, 0, 'published', '[]', 'Hindi', 2, '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL),
(3, 'Chakra Balancing', 'Visualize and balance your seven chakras', 'Visualization', 'Intermediate', '25:00', 'https://example.com/meditation/chakra.mp3', NULL, 'https://images.unsplash.com/photo-1545389336-cf090694435e', 'Swami Anand', NULL, '[]', NULL, 1100, 300, 4.7, 0, 'published', '[]', 'Hindi', 2, '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL),
(4, 'Meditation Session 4', 'A calming session to help you find inner peace and clarity.', 'Breathing', 'Intermediate', '14:00', 'https://example.com/meditation/session-4.mp3', NULL, 'https://images.unsplash.com/photo-1500000000004', 'Guru Mahesh', NULL, '[]', NULL, 451, 76, 3.9, 0, 'pending', '[]', 'Hindi', 2, '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL),
(5, 'Meditation Session 5', 'A calming session to help you find inner peace and clarity.', 'Music', 'Beginner', '28:00', 'https://example.com/meditation/session-5.mp3', NULL, 'https://images.unsplash.com/photo-1500000000005', 'Dr. Rajesh Sharma', NULL, '[]', NULL, 184, 67, 4.6, 0, 'published', '[]', 'Hindi', 2, '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL),
(6, 'Meditation Session 6', 'A calming session to help you find inner peace and clarity.', 'Mantra', 'Intermediate', '23:00', 'https://example.com/meditation/session-6.mp3', NULL, 'https://images.unsplash.com/photo-1500000000006', 'Guru Mahesh', NULL, '[]', NULL, 735, 56, 4, 0, 'published', '[]', 'Hindi', 2, '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL),
(7, 'Meditation Session 7', 'A calming session to help you find inner peace and clarity.', 'Music', 'Advanced', '29:00', 'https://example.com/meditation/session-7.mp3', NULL, 'https://images.unsplash.com/photo-1500000000007', 'Swami Anand', NULL, '[]', NULL, 860, 52, 4.7, 0, 'published', '[]', 'Hindi', 2, '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL),
(8, 'Meditation Session 8', 'A calming session to help you find inner peace and clarity.', 'Body Scan', 'Intermediate', '23:00', 'https://example.com/meditation/session-8.mp3', NULL, 'https://images.unsplash.com/photo-1500000000008', 'Swami Anand', NULL, '[]', NULL, 1417, 22, 4.1, 0, 'published', '[]', 'Hindi', 2, '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL),
(9, 'Meditation Session 9', 'A calming session to help you find inner peace and clarity.', 'Mantra', 'Advanced', '22:00', 'https://example.com/meditation/session-9.mp3', NULL, 'https://images.unsplash.com/photo-1500000000009', 'Swami Anand', NULL, '[]', NULL, 1414, 78, 3.4, 0, 'published', '[]', 'Hindi', 2, '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL),
(10, 'Meditation Session 10', 'A calming session to help you find inner peace and clarity.', 'Visualization', 'Intermediate', '11:00', 'https://example.com/meditation/session-10.mp3', NULL, 'https://images.unsplash.com/photo-1500000000010', 'Dr. Rajesh Sharma', NULL, '[]', NULL, 1362, 32, 3.5, 0, 'published', '[]', 'Hindi', 2, '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL),
(11, 'Scripted Zen', 'Relaxation session', 'Guided', 'Beginner', '15:00', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', NULL, 'default-meditation-cover.jpg', 'Guru AI', NULL, '[]', NULL, 0, 0, 0, 0, 'pending', '[]', 'Hindi', 1, '2025-12-25 14:49:51', '2025-12-25 14:49:51', NULL),
(12, 'Scripted Zen', 'Relaxation session', 'Guided', 'Beginner', '15:00', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', NULL, 'default-meditation-cover.jpg', 'Guru AI', NULL, '[]', NULL, 0, 0, 0, 0, 'pending', '[]', 'Hindi', 1, '2025-12-25 14:51:13', '2025-12-25 14:51:13', NULL),
(13, 'Scripted Zen', 'Relaxation session', 'Guided', 'Beginner', '15:00', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', NULL, 'default-meditation-cover.jpg', 'Guru AI', NULL, '[]', NULL, 0, 0, 0, 0, 'pending', '[]', 'Hindi', 1, '2025-12-25 14:51:46', '2025-12-25 14:51:46', NULL),
(14, 'Scripted Zen', 'Relaxation session', 'Guided', 'Beginner', '15:00', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', NULL, 'default-meditation-cover.jpg', 'Guru AI', NULL, '[]', NULL, 0, 0, 0, 0, 'pending', '[]', 'Hindi', 1, '2025-12-25 14:52:21', '2025-12-25 14:52:21', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Music`
--

CREATE TABLE `Music` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `artist` varchar(255) NOT NULL,
  `album` varchar(255) DEFAULT NULL,
  `genre` varchar(255) NOT NULL,
  `mood` varchar(255) DEFAULT NULL,
  `audioUrl` varchar(255) NOT NULL,
  `coverArt` varchar(255) DEFAULT 'default-music-cover.jpg',
  `duration` varchar(255) NOT NULL,
  `lyrics` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `playCount` int(11) DEFAULT 0,
  `likes` int(11) DEFAULT 0,
  `rating` float DEFAULT 0,
  `numRatings` int(11) DEFAULT 0,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `uploadedBy` int(11) DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `language` varchar(255) DEFAULT 'Hindi',
  `releaseDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Music`
--

INSERT INTO `Music` (`id`, `title`, `artist`, `album`, `genre`, `mood`, `audioUrl`, `coverArt`, `duration`, `lyrics`, `description`, `playCount`, `likes`, `rating`, `numRatings`, `status`, `uploadedBy`, `tags`, `language`, `releaseDate`, `createdAt`, `updatedAt`) VALUES
(1, 'Om Namah Shivaya', 'Pandit Hariprasad', 'Divine Chants', 'Mantra', 'Meditative', 'https://example.com/audio/om-namah-shivaya.mp3', 'https://images.unsplash.com/photo-1507838153414-b4b713384a76', '05:30', NULL, NULL, 1250, 340, 4.7, 0, 'approved', 3, '[]', 'Sanskrit', NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(2, 'Gayatri Mantra', 'Pandit Hariprasad', 'Vedic Mantras', 'Mantra', 'Devotional', 'https://example.com/audio/gayatri-mantra.mp3', 'https://images.unsplash.com/photo-1514496959998-c01c40915c5f', '05:30', NULL, NULL, 2100, 580, 4.9, 0, 'approved', 3, '[]', 'Sanskrit', NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(3, 'Morning Raga', 'Ustad Zakir', 'Sunrise Melodies', 'Mantra', 'Peaceful', 'https://example.com/audio/morning-raga.mp3', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d', '05:30', NULL, NULL, 890, 120, 4.5, 0, 'approved', 3, '[]', 'Instrumental', NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(4, 'Krishna Flute', 'Divine Sounds', 'Krishna Leela', 'Mantra', 'Relaxing', 'https://example.com/audio/krishna-flute.mp3', 'https://images.unsplash.com/photo-1519681393784-d120267933ba', '05:30', NULL, NULL, 3400, 900, 4.8, 0, 'approved', 3, '[]', 'Instrumental', NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(5, 'Hanuman Chalisa', 'Hari Om Sharan', 'Bhakti Sangrah', 'Mantra', 'Devotional', 'https://example.com/audio/hanuman-chalisa.mp3', 'https://images.unsplash.com/photo-1564344197-06c6e7683668', '05:30', NULL, NULL, 5600, 1500, 5, 0, 'approved', 3, '[]', 'Hindi', NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(6, 'Track 6 - Divine Melody', 'Ustad Zakir', 'Album Vol 2', 'Mantra', 'Devotional', 'https://example.com/audio/track-6.mp3', 'https://images.unsplash.com/photo-1500000000006', '05:30', NULL, NULL, 2312, 33, 4.5, 0, 'pending', 3, '[]', 'Hindi', NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(7, 'Track 7 - Divine Melody', 'Kaushiki Chakraborty', 'Album Vol 2', 'Mantra', 'Uplifting', 'https://example.com/audio/track-7.mp3', 'https://images.unsplash.com/photo-1500000000007', '05:30', NULL, NULL, 3931, 329, 3.9, 0, 'approved', 3, '[]', 'Sanskrit', NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(8, 'Track 8 - Divine Melody', 'Ravi Shankar', 'Album Vol 2', 'Mantra', 'Energetic', 'https://example.com/audio/track-8.mp3', 'https://images.unsplash.com/photo-1500000000008', '05:30', NULL, NULL, 3674, 417, 3.9, 0, 'approved', 3, '[]', 'Hindi', NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(9, 'Track 9 - Divine Melody', 'Hari Om Sharan', 'Album Vol 2', 'Mantra', 'Relaxing', 'https://example.com/audio/track-9.mp3', 'https://images.unsplash.com/photo-1500000000009', '05:30', NULL, NULL, 2513, 442, 3.5, 0, 'pending', 3, '[]', 'Sanskrit', NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(10, 'Track 10 - Divine Melody', 'Kaushiki Chakraborty', 'Album Vol 3', 'Mantra', 'Relaxing', 'https://example.com/audio/track-10.mp3', 'https://images.unsplash.com/photo-1500000000010', '05:30', NULL, NULL, 4640, 457, 4.5, 0, 'approved', 3, '[]', 'Sanskrit', NULL, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(11, 'Scripted Song', 'AI Composer', NULL, 'Classical', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'https://via.placeholder.com/150', '3:00', NULL, NULL, 0, 0, 0, 0, 'pending', 1, '[]', 'Hindi', NULL, '2025-12-25 14:48:41', '2025-12-25 14:48:41'),
(12, 'Scripted Song', 'AI Composer', 'AI Hits', 'Classical', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'https://via.placeholder.com/150', '3:00', NULL, NULL, 0, 0, 0, 0, 'approved', 1, '[]', 'English', NULL, '2025-12-25 14:49:51', '2025-12-25 14:51:13'),
(13, 'Scripted Song', 'AI Composer', 'AI Hits', 'Classical', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'https://via.placeholder.com/150', '3:00', NULL, NULL, 0, 0, 0, 0, 'approved', 1, '[]', 'English', NULL, '2025-12-25 14:51:13', '2025-12-25 14:51:46'),
(14, 'Scripted Song', 'AI Composer', 'AI Hits', 'Classical', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'https://via.placeholder.com/150', '3:00', NULL, NULL, 0, 0, 0, 0, 'approved', 1, '[]', 'English', NULL, '2025-12-25 14:51:46', '2025-12-25 14:52:21'),
(15, 'Scripted Song', 'AI Composer', 'AI Hits', 'Classical', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'https://via.placeholder.com/150', '3:00', NULL, NULL, 0, 0, 0, 0, 'pending', 1, '[]', 'English', NULL, '2025-12-25 14:52:21', '2025-12-25 14:52:21');

-- --------------------------------------------------------

--
-- Table structure for table `MusicAlbums`
--

CREATE TABLE `MusicAlbums` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `MusicCategories`
--

CREATE TABLE `MusicCategories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `MusicGenres`
--

CREATE TABLE `MusicGenres` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `MusicMoods`
--

CREATE TABLE `MusicMoods` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `News`
--

CREATE TABLE `News` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `excerpt` text NOT NULL,
  `content` text NOT NULL,
  `category` varchar(255) NOT NULL,
  `featuredImage` varchar(255) DEFAULT 'default-news-image.jpg',
  `author` varchar(255) NOT NULL,
  `authorId` int(11) DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `status` enum('draft','published','archived','pending') DEFAULT 'pending',
  `publishDate` datetime DEFAULT NULL,
  `views` int(11) DEFAULT 0,
  `likes` int(11) DEFAULT 0,
  `featured` tinyint(1) DEFAULT 0,
  `metaDescription` text DEFAULT NULL,
  `metaKeywords` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metaKeywords`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `News`
--

INSERT INTO `News` (`id`, `title`, `excerpt`, `content`, `category`, `featuredImage`, `author`, `authorId`, `tags`, `status`, `publishDate`, `views`, `likes`, `featured`, `metaDescription`, `metaKeywords`, `createdAt`, `updatedAt`) VALUES
(1, 'Ancient Ayurvedic Practices Gain Modern Recognition', 'Traditional Ayurvedic treatments are being validated by modern scientific research', '<p>Recent studies have shown the effectiveness of traditional Ayurvedic practices...</p>', 'Ayurveda', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528', 'Admin User', 1, '[\"ayurveda\",\"health\",\"research\"]', 'published', '2025-12-25 08:25:15', 3200, 180, 0, NULL, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(2, 'International Yoga Day Celebrations', 'Millions join together to celebrate the gift of Yoga', '<p>From New Delhi to New York, the world united in breath and movement...</p>', 'Yoga', 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0', 'Priya Desai', 1, '[\"yoga\",\"events\",\"global\"]', 'published', '2025-12-25 08:25:15', 5400, 420, 0, NULL, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(3, 'New Gaushala Opens in Vrindavan', 'A state-of-the-art facility for cow protection and care', '<p>The new facility will house over 500 cows and provide organic fodder...</p>', 'Gaushala', 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e', 'Gaushala Admin', 1, '[\"gaushala\",\"cow protection\",\"vrindavan\"]', 'published', '2025-12-25 08:25:15', 2100, 350, 0, NULL, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(4, 'News Update 4: Important Developments', 'Breaking news and updates from the world of spirituality and wellness.', '<p>This is the content for news article 4. It discusses important topics relevant to our community.</p>', 'Cultural', 'https://images.unsplash.com/photo-1500000000004', 'Dr. Rajesh Sharma', 1, '[\"news\",\"update\",\"community\"]', 'published', '2025-12-25 08:25:15', 4857, 108, 0, NULL, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(5, 'News Update 5: Important Developments', 'Breaking news and updates from the world of spirituality and wellness.', '<p>This is the content for news article 5. It discusses important topics relevant to our community.</p>', 'Ayurveda', 'https://images.unsplash.com/photo-1500000000005', 'Priya Desai', 1, '[\"news\",\"update\",\"community\"]', 'published', '2025-12-25 08:25:15', 3129, 473, 0, NULL, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(6, 'News Update 6: Important Developments', 'Breaking news and updates from the world of spirituality and wellness.', '<p>This is the content for news article 6. It discusses important topics relevant to our community.</p>', 'Events', 'https://images.unsplash.com/photo-1500000000006', 'Admin User', 1, '[\"news\",\"update\",\"community\"]', 'published', '2025-12-25 08:25:15', 2953, 388, 0, NULL, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(7, 'News Update 7: Important Developments', 'Breaking news and updates from the world of spirituality and wellness.', '<p>This is the content for news article 7. It discusses important topics relevant to our community.</p>', 'Community', 'https://images.unsplash.com/photo-1500000000007', 'Priya Desai', 1, '[\"news\",\"update\",\"community\"]', 'published', '2025-12-25 08:25:15', 4115, 473, 0, NULL, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(8, 'News Update 8: Important Developments', 'Breaking news and updates from the world of spirituality and wellness.', '<p>This is the content for news article 8. It discusses important topics relevant to our community.</p>', 'Yoga', 'https://images.unsplash.com/photo-1500000000008', 'Priya Desai', 1, '[\"news\",\"update\",\"community\"]', 'published', '2025-12-25 08:25:15', 3179, 339, 0, NULL, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(9, 'News Update 9: Important Developments', 'Breaking news and updates from the world of spirituality and wellness.', '<p>This is the content for news article 9. It discusses important topics relevant to our community.</p>', 'Gaushala', 'https://images.unsplash.com/photo-1500000000009', 'Dr. Rajesh Sharma', 1, '[\"news\",\"update\",\"community\"]', 'published', '2025-12-25 08:25:15', 4300, 303, 0, NULL, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(10, 'News Update 10: Important Developments', 'Breaking news and updates from the world of spirituality and wellness.', '<p>This is the content for news article 10. It discusses important topics relevant to our community.</p>', 'Spiritual', 'https://images.unsplash.com/photo-1500000000010', 'Admin User', 1, '[\"news\",\"update\",\"community\"]', 'published', '2025-12-25 08:25:15', 4685, 53, 0, NULL, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(11, 'Breaking: Automation Test Successful', 'Automation script works!', 'This news article was created by an automated script.', 'Updates', 'default-news-image.jpg', 'Admin User', 1, '[\"tech\",\"test\"]', 'pending', '2025-12-25 14:49:51', 0, 0, 0, NULL, '[]', '2025-12-25 14:49:51', '2025-12-25 14:49:51'),
(12, 'Breaking: Automation Test Successful', 'Automation script works!', 'This news article was created by an automated script.', 'Updates', 'default-news-image.jpg', 'Admin User', 1, '[\"tech\",\"test\"]', 'pending', '2025-12-25 14:51:13', 0, 0, 0, NULL, '[]', '2025-12-25 14:51:13', '2025-12-25 14:51:13'),
(13, 'Breaking: Automation Test Successful', 'Automation script works!', 'This news article was created by an automated script.', 'Updates', 'default-news-image.jpg', 'Admin User', 1, '[\"tech\",\"test\"]', 'pending', '2025-12-25 14:51:46', 0, 0, 0, NULL, '[]', '2025-12-25 14:51:46', '2025-12-25 14:51:46'),
(14, 'Breaking: Automation Test Successful', 'Automation script works!', 'This news article was created by an automated script.', 'Updates', 'default-news-image.jpg', 'Admin User', 1, '[\"tech\",\"test\"]', 'pending', '2025-12-25 14:52:21', 0, 0, 0, NULL, '[]', '2025-12-25 14:52:21', '2025-12-25 14:52:21');

-- --------------------------------------------------------

--
-- Table structure for table `Notifications`
--

CREATE TABLE `Notifications` (
  `id` int(11) NOT NULL,
  `recipient` int(11) NOT NULL,
  `message` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT 'info',
  `read` tinyint(1) DEFAULT 0,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Notifications`
--

INSERT INTO `Notifications` (`id`, `recipient`, `message`, `type`, `read`, `data`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'New User Registered: Test Admin', 'info', 1, '{\"userId\":7,\"email\":\"testadmin@gaugyan.com\",\"role\":\"admin\"}', '2025-12-25 13:17:15', '2025-12-25 13:28:29'),
(2, 7, 'New User Registered: Test Admin', 'info', 0, '{\"userId\":7,\"email\":\"testadmin@gaugyan.com\",\"role\":\"admin\"}', '2025-12-25 13:17:15', '2025-12-25 13:17:15');

-- --------------------------------------------------------

--
-- Table structure for table `Orders`
--

CREATE TABLE `Orders` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `orderItems` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`orderItems`)),
  `shippingAddress` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`shippingAddress`)),
  `paymentMethod` varchar(255) NOT NULL,
  `paymentResult` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`paymentResult`)),
  `itemsPrice` decimal(10,2) DEFAULT 0.00,
  `taxPrice` decimal(10,2) DEFAULT 0.00,
  `shippingPrice` decimal(10,2) DEFAULT 0.00,
  `totalPrice` decimal(10,2) DEFAULT 0.00,
  `isPaid` tinyint(1) DEFAULT 0,
  `paidAt` datetime DEFAULT NULL,
  `isDelivered` tinyint(1) DEFAULT 0,
  `deliveredAt` datetime DEFAULT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `vendorId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Pages`
--

CREATE TABLE `Pages` (
  `id` int(11) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `metaTitle` varchar(255) DEFAULT NULL,
  `metaDescription` text DEFAULT NULL,
  `sections` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`sections`)),
  `isPublished` tinyint(1) DEFAULT 0,
  `publishedAt` datetime DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PodcastCategories`
--

CREATE TABLE `PodcastCategories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Podcasts`
--

CREATE TABLE `Podcasts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `series` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `host` varchar(255) NOT NULL,
  `guest` varchar(255) DEFAULT NULL,
  `audioUrl` varchar(255) NOT NULL,
  `coverArt` varchar(255) DEFAULT 'default-podcast-cover.jpg',
  `youtubeUrl` varchar(255) DEFAULT NULL,
  `duration` varchar(255) NOT NULL,
  `episodeNumber` int(11) DEFAULT NULL,
  `season` int(11) DEFAULT NULL,
  `showNotes` text DEFAULT NULL,
  `transcript` text DEFAULT NULL,
  `playCount` int(11) DEFAULT 0,
  `likes` int(11) DEFAULT 0,
  `rating` float DEFAULT 0,
  `numRatings` int(11) DEFAULT 0,
  `status` enum('draft','published','archived','pending') DEFAULT 'pending',
  `publishDate` datetime DEFAULT NULL,
  `uploadedBy` int(11) DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `language` varchar(255) DEFAULT 'Hindi',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Podcasts`
--

INSERT INTO `Podcasts` (`id`, `title`, `description`, `series`, `category`, `host`, `guest`, `audioUrl`, `coverArt`, `youtubeUrl`, `duration`, `episodeNumber`, `season`, `showNotes`, `transcript`, `playCount`, `likes`, `rating`, `numRatings`, `status`, `publishDate`, `uploadedBy`, `tags`, `language`, `createdAt`, `updatedAt`) VALUES
(1, 'The Power of Meditation', 'Exploring the transformative effects of daily meditation practice', 'Spiritual Wisdom', 'Spirituality', 'Dr. Rajesh Sharma', NULL, 'https://example.com/podcast/meditation-power.mp3', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc', NULL, '45:30', 1, 1, NULL, NULL, 850, 210, 4.6, 0, 'published', '2025-12-25 08:25:15', 2, '[]', 'Hindi', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(2, 'Ayurveda for Modern Life', 'How to apply ancient Ayurvedic principles in today\'s busy world', 'Ayurveda Today', 'Ayurveda', 'Dr. Priya Patel', NULL, 'https://example.com/podcast/ayurveda-modern.mp3', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b', NULL, '38:15', 1, 1, NULL, NULL, 1200, 350, 4.8, 0, 'published', '2025-12-25 08:25:15', 2, '[]', 'Hindi', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(3, 'Understanding Karma', 'Deep dive into the law of cause and effect', 'Spiritual Wisdom', 'Spirituality', 'Swami Anand', NULL, 'https://example.com/podcast/karma.mp3', 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5', NULL, '50:00', 2, 1, NULL, NULL, 980, 280, 4.7, 0, 'published', '2025-12-25 08:25:15', 2, '[]', 'Hindi', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(4, 'Episode 4: Wisdom of the Ages', 'A fascinating discussion on ancient wisdom and its relevance today.', 'Ayurveda Today', 'Ayurveda', 'Swami Anand', NULL, 'https://example.com/podcast/episode-4.mp3', 'https://images.unsplash.com/photo-1500000000004', NULL, '29:01', 4, 1, NULL, NULL, 1861, 168, 3.5, 0, 'published', '2025-12-25 08:25:15', 2, '[]', 'Hindi', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(5, 'Episode 5: Wisdom of the Ages', 'A fascinating discussion on ancient wisdom and its relevance today.', 'Yoga Life', 'Mythology', 'Dr. Rajesh Sharma', NULL, 'https://example.com/podcast/episode-5.mp3', 'https://images.unsplash.com/photo-1500000000005', NULL, '23:24', 5, 1, NULL, NULL, 1682, 167, 4, 0, 'pending', '2025-12-25 08:25:15', 2, '[]', 'Hindi', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(6, 'Episode 6: Wisdom of the Ages', 'A fascinating discussion on ancient wisdom and its relevance today.', 'Vedic Tales', 'Culture', 'Swami Anand', NULL, 'https://example.com/podcast/episode-6.mp3', 'https://images.unsplash.com/photo-1500000000006', NULL, '30:14', 6, 1, NULL, NULL, 296, 137, 4.6, 0, 'published', '2025-12-25 08:25:15', 2, '[]', 'Hindi', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(7, 'Episode 7: Wisdom of the Ages', 'A fascinating discussion on ancient wisdom and its relevance today.', 'Ayurveda Today', 'Yoga Philosophy', 'Guru Mahesh', NULL, 'https://example.com/podcast/episode-7.mp3', 'https://images.unsplash.com/photo-1500000000007', NULL, '47:24', 7, 1, NULL, NULL, 889, 102, 3.3, 0, 'published', '2025-12-25 08:25:15', 2, '[]', 'Hindi', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(8, 'Episode 8: Wisdom of the Ages', 'A fascinating discussion on ancient wisdom and its relevance today.', 'Cultural Insights', 'Vedic Wisdom', 'Acharya Gupta', NULL, 'https://example.com/podcast/episode-8.mp3', 'https://images.unsplash.com/photo-1500000000008', NULL, '25:08', 8, 1, NULL, NULL, 1635, 19, 4.6, 0, 'published', '2025-12-25 08:25:15', 2, '[]', 'Hindi', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(9, 'Episode 9: Wisdom of the Ages', 'A fascinating discussion on ancient wisdom and its relevance today.', 'Ayurveda Today', 'Yoga Philosophy', 'Swami Anand', NULL, 'https://example.com/podcast/episode-9.mp3', 'https://images.unsplash.com/photo-1500000000009', NULL, '47:16', 9, 1, NULL, NULL, 1759, 66, 4.5, 0, 'published', '2025-12-25 08:25:15', 2, '[]', 'Hindi', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(10, 'Episode 10: Wisdom of the Ages', 'A fascinating discussion on ancient wisdom and its relevance today.', 'Ayurveda Today', 'Spirituality', 'Dr. Priya Patel', NULL, 'https://example.com/podcast/episode-10.mp3', 'https://images.unsplash.com/photo-1500000000010', NULL, '43:42', 10, 1, NULL, NULL, 1579, 175, 3.1, 0, 'published', '2025-12-25 08:25:15', 2, '[]', 'Hindi', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(11, 'Scripted Podcast Ep 1', 'Talking about automation', 'Tech Talks', 'Technology', 'AI Host', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'default-podcast-cover.jpg', NULL, '10:00', NULL, NULL, NULL, NULL, 0, 0, 0, 0, 'published', '2025-12-25 14:49:51', 1, '[]', 'Hindi', '2025-12-25 14:49:51', '2025-12-25 14:49:51'),
(12, 'Scripted Podcast Ep 1', 'Talking about automation', 'Tech Talks', 'Technology', 'AI Host', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'default-podcast-cover.jpg', NULL, '10:00', NULL, NULL, NULL, NULL, 0, 0, 0, 0, 'published', '2025-12-25 14:51:13', 1, '[]', 'Hindi', '2025-12-25 14:51:13', '2025-12-25 14:51:13'),
(13, 'Scripted Podcast Ep 1', 'Talking about automation', 'Tech Talks', 'Technology', 'AI Host', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'default-podcast-cover.jpg', NULL, '10:00', NULL, NULL, NULL, NULL, 0, 0, 0, 0, 'published', '2025-12-25 14:51:46', 1, '[]', 'Hindi', '2025-12-25 14:51:46', '2025-12-25 14:51:46'),
(14, 'Scripted Podcast Ep 1', 'Talking about automation', 'Tech Talks', 'Technology', 'AI Host', NULL, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'default-podcast-cover.jpg', NULL, '10:00', NULL, NULL, NULL, NULL, 0, 0, 0, 0, 'published', '2025-12-25 14:52:21', 1, '[]', 'Hindi', '2025-12-25 14:52:21', '2025-12-25 14:52:21');

-- --------------------------------------------------------

--
-- Table structure for table `PodcastSeries`
--

CREATE TABLE `PodcastSeries` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Products`
--

CREATE TABLE `Products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `category` enum('Puja Items','Books','Ayurvedic Products','Organic Food','Clothing','Handicrafts','Cow Products','Other') NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `originalPrice` decimal(10,2) DEFAULT NULL,
  `discount` int(11) DEFAULT 0,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `vendorId` int(11) NOT NULL,
  `vendorName` varchar(255) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `sku` varchar(255) DEFAULT NULL,
  `weight` varchar(255) DEFAULT NULL,
  `dimensions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dimensions`)),
  `reviews` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`reviews`)),
  `rating` float DEFAULT 0,
  `numReviews` int(11) DEFAULT 0,
  `soldCount` int(11) DEFAULT 0,
  `featured` tinyint(1) DEFAULT 0,
  `status` enum('active','inactive','out_of_stock','pending_approval') DEFAULT 'pending_approval',
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `variants` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`variants`)),
  `specifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specifications`)),
  `shippingInfo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`shippingInfo`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Products`
--

INSERT INTO `Products` (`id`, `name`, `slug`, `description`, `category`, `price`, `originalPrice`, `discount`, `images`, `vendorId`, `vendorName`, `stock`, `sku`, `weight`, `dimensions`, `reviews`, `rating`, `numReviews`, `soldCount`, `featured`, `status`, `tags`, `variants`, `specifications`, `shippingInfo`, `createdAt`, `updatedAt`) VALUES
(1, 'Pure Desi Ghee', NULL, 'Authentic A2 Gir Cow Ghee', 'Organic Food', 1499.00, 1899.00, 0, '[\"https://images.unsplash.com/photo-1631451095765-2c91616fc9e6\"]', 4, NULL, 50, NULL, NULL, '{}', '[]', 4.9, 0, 0, 0, 'active', '[]', '[]', '[]', '{}', '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(2, 'Organic Tulsi Honey', NULL, 'Raw, unprocessed honey', 'Organic Food', 599.00, 799.00, 0, '[\"https://images.unsplash.com/photo-1587049352846-4a222e784d38\"]', 4, NULL, 100, NULL, NULL, '{}', '[]', 4.8, 0, 0, 0, 'active', '[]', '[]', '[]', '{}', '2025-12-25 08:25:15', '2025-12-25 08:25:15');

-- --------------------------------------------------------

--
-- Table structure for table `Questions`
--

CREATE TABLE `Questions` (
  `id` int(11) NOT NULL,
  `text` text NOT NULL,
  `type` enum('multiple-choice','true-false','essay','short-answer','fill-in-the-blank') DEFAULT 'multiple-choice',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `correctAnswer` varchar(255) DEFAULT NULL,
  `explanation` text DEFAULT NULL,
  `difficulty` enum('Easy','Medium','Hard') DEFAULT 'Medium',
  `marks` int(11) DEFAULT 1,
  `category` varchar(255) NOT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `createdBy` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Questions`
--

INSERT INTO `Questions` (`id`, `text`, `type`, `options`, `correctAnswer`, `explanation`, `difficulty`, `marks`, `category`, `tags`, `createdBy`, `createdAt`, `updatedAt`) VALUES
(1, 'What is the primary purpose of Yoga?', 'multiple-choice', '[\"Physical Fitness\",\"Mental Peace\",\"Union of Body, Mind, and Soul\",\"Weight Loss\"]', '2', NULL, 'Easy', 1, 'Yoga', '[]', 2, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(2, 'Which Veda is known as the book of Ayurveda?', 'multiple-choice', '[\"Rigveda\",\"Yajurveda\",\"Samaveda\",\"Atharvaveda\"]', '3', NULL, 'Medium', 2, 'Ayurveda', '[]', 2, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(3, 'Cow dung is used in organic farming as a natural fertilizer.', 'true-false', '[]', 'true', NULL, 'Easy', 1, 'Organic Farming', '[]', 2, '2025-12-25 08:25:15', '2025-12-25 08:25:15'),
(4, 'What is the capital of France?', 'multiple-choice', '[\"London\",\"Paris\",\"Berlin\",\"Madrid\"]', 'Paris', NULL, 'Medium', 1, 'Geography', '[]', 1, '2025-12-25 14:48:41', '2025-12-25 14:48:41'),
(5, 'What is the capital of France?', 'multiple-choice', '[\"London\",\"Paris\",\"Berlin\",\"Madrid\"]', 'Paris', NULL, 'Medium', 1, 'Geography', '[]', 1, '2025-12-25 14:49:51', '2025-12-25 14:49:51'),
(6, 'What is the capital of France?', 'multiple-choice', '[\"London\",\"Paris\",\"Berlin\",\"Madrid\"]', 'Paris', NULL, 'Medium', 1, 'Geography', '[]', 1, '2025-12-25 14:51:12', '2025-12-25 14:51:12'),
(7, 'What is the capital of France?', 'multiple-choice', '[\"London\",\"Paris\",\"Berlin\",\"Madrid\"]', 'Paris', NULL, 'Medium', 1, 'Geography', '[]', 1, '2025-12-25 14:51:46', '2025-12-25 14:51:46'),
(8, 'What is the capital of France?', 'multiple-choice', '[\"London\",\"Paris\",\"Berlin\",\"Madrid\"]', 'Paris', NULL, 'Medium', 1, 'Geography', '[]', 1, '2025-12-25 14:52:21', '2025-12-25 14:52:21');

-- --------------------------------------------------------

--
-- Table structure for table `Quizzes`
--

CREATE TABLE `Quizzes` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `courseId` int(11) DEFAULT NULL,
  `chapter` varchar(255) DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `difficulty` enum('Easy','Medium','Hard') NOT NULL,
  `questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`questions`)),
  `timeLimit` int(11) DEFAULT 0,
  `totalPoints` int(11) DEFAULT 0,
  `passingScore` int(11) DEFAULT 60,
  `allowRetake` tinyint(1) DEFAULT 1,
  `showCorrectAnswers` tinyint(1) DEFAULT 1,
  `randomizeQuestions` tinyint(1) DEFAULT 0,
  `randomizeOptions` tinyint(1) DEFAULT 0,
  `featured` tinyint(1) DEFAULT 0,
  `isPublished` tinyint(1) DEFAULT 0,
  `attempts` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attempts`)),
  `totalAttempts` int(11) DEFAULT 0,
  `averageScore` float DEFAULT 0,
  `createdBy` int(11) DEFAULT NULL,
  `studyMaterial` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`studyMaterial`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `prizes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`prizes`)),
  `winners` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`winners`))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Quizzes`
--

INSERT INTO `Quizzes` (`id`, `title`, `description`, `courseId`, `chapter`, `category`, `difficulty`, `questions`, `timeLimit`, `totalPoints`, `passingScore`, `allowRetake`, `showCorrectAnswers`, `randomizeQuestions`, `randomizeOptions`, `featured`, `isPublished`, `attempts`, `totalAttempts`, `averageScore`, `createdBy`, `studyMaterial`, `createdAt`, `updatedAt`, `prizes`, `winners`) VALUES
(1, 'Quick Yoga Quiz', 'Test your basic yoga knowledge', NULL, NULL, 'Yoga', 'Easy', '[{\"question\":\"What does \\\"Namaste\\\" mean?\",\"options\":[\"Hello\",\"I bow to you\",\"Goodbye\",\"Thank you\"],\"correctAnswer\":1,\"explanation\":\"Namaste means \\\"I bow to the divine in you\\\"\",\"points\":10}]', 5, 10, 60, 1, 1, 0, 0, 1, 1, '[]', 0, 0, 2, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL, NULL),
(2, 'Vedic Math Challenge', 'Speed calculation challenge', NULL, NULL, 'Vedic Mathematics', 'Medium', '[{\"question\":\"What is the base for \\\"Nikhilam\\\" method?\",\"options\":[\"10\",\"100\",\"1000\",\"All of the above\"],\"correctAnswer\":3,\"explanation\":\"Nikhilam method uses powers of 10 as base.\",\"points\":10}]', 10, 10, 50, 1, 1, 0, 0, 1, 1, '[]', 0, 0, 2, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL, NULL),
(3, 'Scripted Quiz 1', 'A test quiz', NULL, NULL, 'General Knowledge', 'Easy', '[6]', 30, 10, 60, 1, 1, 0, 0, 0, 0, '[]', 0, 0, 1, '[]', '2025-12-25 14:51:13', '2025-12-25 14:51:13', NULL, NULL),
(4, 'Scripted Quiz 1', 'A test quiz', NULL, NULL, 'General Knowledge', 'Easy', '[7]', 30, 10, 60, 1, 1, 0, 0, 0, 0, '[]', 0, 0, 1, '[]', '2025-12-25 14:51:46', '2025-12-25 14:51:46', NULL, NULL),
(5, 'Scripted Quiz 1', 'A test quiz', NULL, NULL, 'General Knowledge', 'Easy', '[8]', 30, 10, 60, 1, 1, 0, 0, 0, 0, '[]', 0, 0, 1, '[]', '2025-12-25 14:52:21', '2025-12-25 14:52:21', NULL, NULL),
(6, 'Test Quiz 1766675499856', 'Auto-generated test quiz', NULL, NULL, 'General Knowledge', 'Easy', '[]', 0, 0, 5, 1, 1, 0, 0, 0, 0, '[]', 0, 0, 1, '[]', '2025-12-25 15:11:39', '2025-12-25 15:11:39', NULL, NULL),
(7, 'Test Quiz 1766675556528', 'Auto-generated test quiz', NULL, NULL, 'General Knowledge', 'Easy', '[]', 0, 0, 5, 1, 1, 0, 0, 0, 0, '[]', 0, 0, 1, '[]', '2025-12-25 15:12:36', '2025-12-25 15:12:36', NULL, NULL),
(8, 'Test Quiz 1766676349341', 'Auto-generated test quiz', NULL, NULL, 'General Knowledge', 'Easy', '[]', 0, 0, 5, 1, 1, 0, 0, 0, 0, '[]', 0, 0, 1, '[]', '2025-12-25 15:25:48', '2025-12-25 15:25:48', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Roles`
--

CREATE TABLE `Roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `isSystem` tinyint(1) DEFAULT 0,
  `color` varchar(255) DEFAULT '#6B7280',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Settings`
--

CREATE TABLE `Settings` (
  `id` int(11) NOT NULL,
  `category` varchar(255) NOT NULL,
  `settings` text NOT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Settings`
--

INSERT INTO `Settings` (`id`, `category`, `settings`, `updatedBy`, `createdAt`, `updatedAt`) VALUES
(1, 'general', '{\"siteName\":\"GauGyan World (Updated via Script)\",\"siteEmail\":\"admin@gaugyanworld.org\"}', NULL, '2025-12-25 14:48:42', '2025-12-25 14:48:42');

-- --------------------------------------------------------

--
-- Table structure for table `StorageConfigs`
--

CREATE TABLE `StorageConfigs` (
  `id` int(11) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`config`)),
  `isActive` tinyint(1) DEFAULT 0,
  `updatedBy` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Transactions`
--

CREATE TABLE `Transactions` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `type` enum('credit','debit') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` enum('INR','GG') DEFAULT 'INR',
  `description` varchar(255) NOT NULL,
  `status` enum('pending','completed','failed') DEFAULT 'completed',
  `date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','instructor','admin','gaushala_owner','artist','vendor') DEFAULT 'user',
  `mobile` varchar(255) DEFAULT NULL,
  `detail` text DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `profilePicture` varchar(255) DEFAULT NULL,
  `facebookUrl` varchar(255) DEFAULT NULL,
  `youtubeUrl` varchar(255) DEFAULT NULL,
  `twitterUrl` varchar(255) DEFAULT NULL,
  `linkedinUrl` varchar(255) DEFAULT NULL,
  `isVerified` tinyint(1) DEFAULT 0,
  `status` enum('active','inactive') DEFAULT 'active',
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordExpire` datetime DEFAULT NULL,
  `walletBalance` decimal(10,2) DEFAULT 0.00,
  `coinBalance` int(11) DEFAULT 0,
  `wishlist` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`wishlist`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `enrolledCourses` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`enrolledCourses`))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `name`, `email`, `password`, `role`, `mobile`, `detail`, `address`, `country`, `state`, `city`, `pincode`, `profilePicture`, `facebookUrl`, `youtubeUrl`, `twitterUrl`, `linkedinUrl`, `isVerified`, `status`, `resetPasswordToken`, `resetPasswordExpire`, `walletBalance`, `coinBalance`, `wishlist`, `createdAt`, `updatedAt`, `enrolledCourses`) VALUES
(1, 'Admin User', 'admin@gaugyan.com', '$2a$10$sffiOoe22TJ6P4mR46ceWOOXkqWDc43G7G4ntwILJfGtpkYmqVLgq', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'active', NULL, NULL, 0.00, 0, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL),
(2, 'Dr. Rajesh Sharma', 'rajesh@gaugyan.com', '$2a$10$sffiOoe22TJ6P4mR46ceWOOXkqWDc43G7G4ntwILJfGtpkYmqVLgq', 'instructor', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'active', NULL, NULL, 0.00, 0, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL),
(3, 'Pandit Hariprasad', 'pandit@gaugyan.com', '$2a$10$sffiOoe22TJ6P4mR46ceWOOXkqWDc43G7G4ntwILJfGtpkYmqVLgq', 'artist', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'active', NULL, NULL, 0.00, 0, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL),
(4, 'Organic Farms India', 'vendor1@gaugyan.com', '$2a$10$sffiOoe22TJ6P4mR46ceWOOXkqWDc43G7G4ntwILJfGtpkYmqVLgq', 'vendor', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'active', NULL, NULL, 0.00, 0, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL),
(5, 'Gaushala Owner', 'gaushala@gaugyan.com', '$2a$10$sffiOoe22TJ6P4mR46ceWOOXkqWDc43G7G4ntwILJfGtpkYmqVLgq', 'gaushala_owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'active', NULL, NULL, 0.00, 0, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL),
(6, 'Regular User', 'user@gaugyan.com', '$2a$10$sffiOoe22TJ6P4mR46ceWOOXkqWDc43G7G4ntwILJfGtpkYmqVLgq', 'user', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'active', NULL, NULL, 0.00, 0, '[]', '2025-12-25 08:25:15', '2025-12-25 08:25:15', NULL),
(7, 'Test Admin', 'testadmin@gaugyan.com', '$2a$10$j2Cop/CdLBsTbTHzbrYvs.VlMcENo3BJe1TIWJ1SFe6GSp6Ynbgoq', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'active', NULL, NULL, 0.00, 0, '[]', '2025-12-25 13:17:15', '2025-12-25 13:17:15', NULL),
(8, 'eric smith', 'myericsmith@gmail.com', '$2a$10$tJdgZUxc8vFZrX6gHlM6/eH8bG2hZH8Dns35q7OlOzOteriJPY60S', 'admin', '9990787751', NULL, ', , , , ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'active', NULL, NULL, 0.00, 0, '[]', '2025-12-25 13:44:59', '2025-12-25 13:44:59', NULL),
(9, 'Test Student', 'student_fix@test.com', '$2a$10$0ggZ829DypveJnkIidoB7uy2.Cu5pfZMbcAVQ47NhwT7dxYvGzRRq', '', '9876543210', NULL, ', , , , ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'active', NULL, NULL, 0.00, 0, '[]', '2025-12-25 14:30:17', '2025-12-25 14:30:17', NULL),
(10, 'Test Student Script', 'student_script_1766674121821@test.com', '$2a$10$3ChJ7dEpznrqD4Q2GUprRuQz/0hV2ai326.i.UUyH0tEtOh4OZ50.', 'user', '1111111111', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'active', NULL, NULL, 0.00, 0, '[]', '2025-12-25 14:48:41', '2025-12-25 14:48:41', NULL),
(11, 'Test Instructor Script', 'instructor_script_1766674121936@test.com', '$2a$10$R/lrMsQEUsxxqLD9I9xR6.5nGMDYB3bbPJsxMtIuxlcNDIt7SrB/u', 'instructor', '2222222222', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'active', NULL, NULL, 0.00, 0, '[]', '2025-12-25 14:48:41', '2025-12-25 14:48:41', NULL),
(12, 'Test Student Script', 'student_script_1766674191478@test.com', '$2a$10$uDFpqa4/RTo2LAW.vdwkFuyAPj3mKH0ZrPhulyH7C1UfefcVBQfM.', 'user', '1111111111', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'active', NULL, NULL, 0.00, 0, '[]', '2025-12-25 14:49:50', '2025-12-25 14:49:50', NULL),
(13, 'Test Instructor Script', 'instructor_script_1766674191586@test.com', '$2a$10$xri1KZc9tlJDjlHEApG7D.GSBsjFlifYx3HprPUHHzLycxo3Q8h16', 'instructor', '2222222222', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'active', NULL, NULL, 0.00, 0, '[]', '2025-12-25 14:49:51', '2025-12-25 14:49:51', NULL),
(14, 'Test Student Script', 'student_script_1766674273164@test.com', '$2a$10$YQ44Fy4rjlrR3FATKr8Xk.PeJzB//PF/6Js25Z4CjZ37mE.d6AhS.', 'user', '1111111111', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'active', NULL, NULL, 0.00, 0, '[]', '2025-12-25 14:51:12', '2025-12-25 14:51:12', NULL),
(15, 'Test Instructor Script', 'instructor_script_1766674273290@test.com', '$2a$10$Qxp2LugwL1y6AEaaE5wJn.xrJWvBkZ4SY/5IlZHZb5w5t2ytIDVYq', 'instructor', '2222222222', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'active', NULL, NULL, 0.00, 0, '[]', '2025-12-25 14:51:12', '2025-12-25 14:51:13', NULL),
(16, 'Test Student Script', 'student_script_1766674306793@test.com', '$2a$10$2SfuIQMJ9kiHxKMaOAUaGupX9Tif3i4DNE.Grt0z.gZmnJWsZKZ.a', 'user', '1111111111', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'active', NULL, NULL, 0.00, 0, '[]', '2025-12-25 14:51:46', '2025-12-25 14:51:46', NULL),
(17, 'Test Instructor Script', 'instructor_script_1766674306901@test.com', '$2a$10$qpwHvkpQcgLVHcOuftS9VuE6UhNay4SOqW3i3ErCadHoUWw3En2dy', 'instructor', '2222222222', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'active', NULL, NULL, 0.00, 0, '[]', '2025-12-25 14:51:46', '2025-12-25 14:51:46', NULL),
(18, 'Test Student Script', 'student_script_1766674341422@test.com', '$2a$10$.d86PSkvaLGaS3MVbpRtX.8MXAdT0/q0zp0wNbjJxp4RXr4WWuyIe', 'user', '1111111111', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'active', NULL, NULL, 0.00, 0, '[]', '2025-12-25 14:52:20', '2025-12-25 14:52:20', NULL),
(19, 'Test Instructor Script', 'instructor_script_1766674341532@test.com', '$2a$10$shfXMHujgO7ucr97EbNGYeMq1pGRkhm/GGxy1VxEtc6.vN0fa/xaq', 'instructor', '2222222222', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'active', NULL, NULL, 0.00, 0, '[]', '2025-12-25 14:52:21', '2025-12-25 14:52:21', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `VendorProfiles`
--

CREATE TABLE `VendorProfiles` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `storeName` varchar(255) NOT NULL,
  `storeDescription` text NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `banner` varchar(255) DEFAULT NULL,
  `address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`address`)),
  `contactEmail` varchar(255) DEFAULT NULL,
  `contactPhone` varchar(255) DEFAULT NULL,
  `gstNumber` varchar(255) DEFAULT NULL,
  `bankAccount` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`bankAccount`)),
  `isVerified` tinyint(1) DEFAULT 0,
  `status` enum('pending','approved','rejected','suspended') DEFAULT 'pending',
  `commissionRate` decimal(5,2) DEFAULT 10.00,
  `rating` float DEFAULT 0,
  `numReviews` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `VendorProfiles`
--

INSERT INTO `VendorProfiles` (`id`, `userId`, `storeName`, `storeDescription`, `logo`, `banner`, `address`, `contactEmail`, `contactPhone`, `gstNumber`, `bankAccount`, `isVerified`, `status`, `commissionRate`, `rating`, `numReviews`, `createdAt`, `updatedAt`) VALUES
(1, 4, 'Organic Farms India', 'Pure, authentic organic products.', NULL, NULL, '{}', 'vendor1@gaugyan.com', NULL, NULL, NULL, 0, 'approved', 10.00, 0, 0, '2025-12-25 08:25:15', '2025-12-25 08:25:15');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Banners`
--
ALTER TABLE `Banners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `banners_placement_is_active_order` (`placement`,`isActive`,`order`),
  ADD KEY `createdBy` (`createdBy`);

--
-- Indexes for table `Carts`
--
ALTER TABLE `Carts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`);

--
-- Indexes for table `CommunityPosts`
--
ALTER TABLE `CommunityPosts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `authorId` (`authorId`);

--
-- Indexes for table `ContactMessages`
--
ALTER TABLE `ContactMessages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `CourseCategories`
--
ALTER TABLE `CourseCategories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `name_10` (`name`);

--
-- Indexes for table `Courses`
--
ALTER TABLE `Courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `slug_2` (`slug`),
  ADD UNIQUE KEY `slug_3` (`slug`),
  ADD UNIQUE KEY `slug_4` (`slug`),
  ADD UNIQUE KEY `slug_5` (`slug`),
  ADD UNIQUE KEY `slug_6` (`slug`),
  ADD UNIQUE KEY `slug_7` (`slug`),
  ADD UNIQUE KEY `slug_8` (`slug`),
  ADD UNIQUE KEY `slug_9` (`slug`),
  ADD UNIQUE KEY `slug_10` (`slug`),
  ADD UNIQUE KEY `slug_11` (`slug`),
  ADD KEY `instructorId` (`instructorId`);

--
-- Indexes for table `Cows`
--
ALTER TABLE `Cows`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ownerId` (`ownerId`),
  ADD KEY `gaushalaProfileId` (`gaushalaProfileId`);

--
-- Indexes for table `Exams`
--
ALTER TABLE `Exams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courseId` (`courseId`),
  ADD KEY `createdBy` (`createdBy`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `GaushalaProfiles`
--
ALTER TABLE `GaushalaProfiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ownerId` (`ownerId`);

--
-- Indexes for table `Knowledgebases`
--
ALTER TABLE `Knowledgebases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `authorId` (`authorId`);

--
-- Indexes for table `Media`
--
ALTER TABLE `Media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uploadedBy` (`uploadedBy`);

--
-- Indexes for table `MeditationCategories`
--
ALTER TABLE `MeditationCategories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `name_10` (`name`);

--
-- Indexes for table `Meditations`
--
ALTER TABLE `Meditations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uploadedBy` (`uploadedBy`);

--
-- Indexes for table `Music`
--
ALTER TABLE `Music`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uploadedBy` (`uploadedBy`);

--
-- Indexes for table `MusicAlbums`
--
ALTER TABLE `MusicAlbums`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `name_10` (`name`);

--
-- Indexes for table `MusicCategories`
--
ALTER TABLE `MusicCategories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `name_10` (`name`);

--
-- Indexes for table `MusicGenres`
--
ALTER TABLE `MusicGenres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `name_10` (`name`);

--
-- Indexes for table `MusicMoods`
--
ALTER TABLE `MusicMoods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `name_10` (`name`);

--
-- Indexes for table `News`
--
ALTER TABLE `News`
  ADD PRIMARY KEY (`id`),
  ADD KEY `authorId` (`authorId`);

--
-- Indexes for table `Notifications`
--
ALTER TABLE `Notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recipient` (`recipient`);

--
-- Indexes for table `Orders`
--
ALTER TABLE `Orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `vendorId` (`vendorId`);

--
-- Indexes for table `Pages`
--
ALTER TABLE `Pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `slug_2` (`slug`),
  ADD UNIQUE KEY `slug_3` (`slug`),
  ADD UNIQUE KEY `slug_4` (`slug`),
  ADD UNIQUE KEY `slug_5` (`slug`),
  ADD UNIQUE KEY `slug_6` (`slug`),
  ADD UNIQUE KEY `slug_7` (`slug`),
  ADD UNIQUE KEY `slug_8` (`slug`),
  ADD UNIQUE KEY `slug_9` (`slug`),
  ADD UNIQUE KEY `slug_10` (`slug`),
  ADD UNIQUE KEY `slug_11` (`slug`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `PodcastCategories`
--
ALTER TABLE `PodcastCategories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `name_10` (`name`);

--
-- Indexes for table `Podcasts`
--
ALTER TABLE `Podcasts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uploadedBy` (`uploadedBy`);

--
-- Indexes for table `PodcastSeries`
--
ALTER TABLE `PodcastSeries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `name_10` (`name`);

--
-- Indexes for table `Products`
--
ALTER TABLE `Products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD UNIQUE KEY `slug_2` (`slug`),
  ADD UNIQUE KEY `slug_3` (`slug`),
  ADD UNIQUE KEY `sku_2` (`sku`),
  ADD UNIQUE KEY `sku_3` (`sku`),
  ADD UNIQUE KEY `slug_4` (`slug`),
  ADD UNIQUE KEY `sku_4` (`sku`),
  ADD UNIQUE KEY `slug_5` (`slug`),
  ADD UNIQUE KEY `sku_5` (`sku`),
  ADD UNIQUE KEY `slug_6` (`slug`),
  ADD UNIQUE KEY `sku_6` (`sku`),
  ADD UNIQUE KEY `slug_7` (`slug`),
  ADD UNIQUE KEY `sku_7` (`sku`),
  ADD UNIQUE KEY `slug_8` (`slug`),
  ADD UNIQUE KEY `sku_8` (`sku`),
  ADD UNIQUE KEY `slug_9` (`slug`),
  ADD UNIQUE KEY `sku_9` (`sku`),
  ADD UNIQUE KEY `slug_10` (`slug`),
  ADD UNIQUE KEY `sku_10` (`sku`),
  ADD UNIQUE KEY `slug_11` (`slug`),
  ADD UNIQUE KEY `sku_11` (`sku`),
  ADD KEY `products_status_category_price` (`status`,`category`,`price`),
  ADD KEY `products_vendor_id` (`vendorId`);

--
-- Indexes for table `Questions`
--
ALTER TABLE `Questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `createdBy` (`createdBy`);

--
-- Indexes for table `Quizzes`
--
ALTER TABLE `Quizzes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courseId` (`courseId`),
  ADD KEY `createdBy` (`createdBy`);

--
-- Indexes for table `Roles`
--
ALTER TABLE `Roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `name_10` (`name`);

--
-- Indexes for table `Settings`
--
ALTER TABLE `Settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `category` (`category`),
  ADD UNIQUE KEY `category_2` (`category`),
  ADD UNIQUE KEY `category_3` (`category`),
  ADD UNIQUE KEY `category_4` (`category`),
  ADD UNIQUE KEY `category_5` (`category`),
  ADD UNIQUE KEY `category_6` (`category`),
  ADD UNIQUE KEY `category_7` (`category`),
  ADD UNIQUE KEY `category_8` (`category`),
  ADD UNIQUE KEY `category_9` (`category`),
  ADD UNIQUE KEY `category_10` (`category`),
  ADD UNIQUE KEY `category_11` (`category`),
  ADD UNIQUE KEY `category_12` (`category`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `StorageConfigs`
--
ALTER TABLE `StorageConfigs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `provider` (`provider`),
  ADD UNIQUE KEY `provider_2` (`provider`),
  ADD UNIQUE KEY `provider_3` (`provider`),
  ADD UNIQUE KEY `provider_4` (`provider`),
  ADD UNIQUE KEY `provider_5` (`provider`),
  ADD UNIQUE KEY `provider_6` (`provider`),
  ADD UNIQUE KEY `provider_7` (`provider`),
  ADD UNIQUE KEY `provider_8` (`provider`),
  ADD UNIQUE KEY `provider_9` (`provider`),
  ADD UNIQUE KEY `provider_10` (`provider`),
  ADD UNIQUE KEY `provider_11` (`provider`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `Transactions`
--
ALTER TABLE `Transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`);

--
-- Indexes for table `VendorProfiles`
--
ALTER TABLE `VendorProfiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`),
  ADD UNIQUE KEY `storeName` (`storeName`),
  ADD UNIQUE KEY `storeName_2` (`storeName`),
  ADD UNIQUE KEY `storeName_3` (`storeName`),
  ADD UNIQUE KEY `storeName_4` (`storeName`),
  ADD UNIQUE KEY `storeName_5` (`storeName`),
  ADD UNIQUE KEY `storeName_6` (`storeName`),
  ADD UNIQUE KEY `storeName_7` (`storeName`),
  ADD UNIQUE KEY `storeName_8` (`storeName`),
  ADD UNIQUE KEY `storeName_9` (`storeName`),
  ADD UNIQUE KEY `storeName_10` (`storeName`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Banners`
--
ALTER TABLE `Banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Carts`
--
ALTER TABLE `Carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `CommunityPosts`
--
ALTER TABLE `CommunityPosts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ContactMessages`
--
ALTER TABLE `ContactMessages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `CourseCategories`
--
ALTER TABLE `CourseCategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Courses`
--
ALTER TABLE `Courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `Cows`
--
ALTER TABLE `Cows`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `Exams`
--
ALTER TABLE `Exams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `GaushalaProfiles`
--
ALTER TABLE `GaushalaProfiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Knowledgebases`
--
ALTER TABLE `Knowledgebases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Media`
--
ALTER TABLE `Media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `MeditationCategories`
--
ALTER TABLE `MeditationCategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Meditations`
--
ALTER TABLE `Meditations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `Music`
--
ALTER TABLE `Music`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `MusicAlbums`
--
ALTER TABLE `MusicAlbums`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `MusicCategories`
--
ALTER TABLE `MusicCategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `MusicGenres`
--
ALTER TABLE `MusicGenres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `MusicMoods`
--
ALTER TABLE `MusicMoods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `News`
--
ALTER TABLE `News`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `Notifications`
--
ALTER TABLE `Notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Orders`
--
ALTER TABLE `Orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Pages`
--
ALTER TABLE `Pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PodcastCategories`
--
ALTER TABLE `PodcastCategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Podcasts`
--
ALTER TABLE `Podcasts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `PodcastSeries`
--
ALTER TABLE `PodcastSeries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Products`
--
ALTER TABLE `Products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Questions`
--
ALTER TABLE `Questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `Quizzes`
--
ALTER TABLE `Quizzes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `Roles`
--
ALTER TABLE `Roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Settings`
--
ALTER TABLE `Settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `StorageConfigs`
--
ALTER TABLE `StorageConfigs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Transactions`
--
ALTER TABLE `Transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `VendorProfiles`
--
ALTER TABLE `VendorProfiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Banners`
--
ALTER TABLE `Banners`
  ADD CONSTRAINT `Banners_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Carts`
--
ALTER TABLE `Carts`
  ADD CONSTRAINT `Carts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `CommunityPosts`
--
ALTER TABLE `CommunityPosts`
  ADD CONSTRAINT `CommunityPosts_ibfk_1` FOREIGN KEY (`authorId`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Courses`
--
ALTER TABLE `Courses`
  ADD CONSTRAINT `Courses_ibfk_1` FOREIGN KEY (`instructorId`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Cows`
--
ALTER TABLE `Cows`
  ADD CONSTRAINT `Cows_ibfk_19` FOREIGN KEY (`ownerId`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `Cows_ibfk_20` FOREIGN KEY (`gaushalaProfileId`) REFERENCES `GaushalaProfiles` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Exams`
--
ALTER TABLE `Exams`
  ADD CONSTRAINT `Exams_ibfk_19` FOREIGN KEY (`courseId`) REFERENCES `Courses` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `Exams_ibfk_20` FOREIGN KEY (`createdBy`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `GaushalaProfiles`
--
ALTER TABLE `GaushalaProfiles`
  ADD CONSTRAINT `GaushalaProfiles_ibfk_1` FOREIGN KEY (`ownerId`) REFERENCES `Users` (`id`);

--
-- Constraints for table `Knowledgebases`
--
ALTER TABLE `Knowledgebases`
  ADD CONSTRAINT `Knowledgebases_ibfk_1` FOREIGN KEY (`authorId`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Media`
--
ALTER TABLE `Media`
  ADD CONSTRAINT `Media_ibfk_1` FOREIGN KEY (`uploadedBy`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Meditations`
--
ALTER TABLE `Meditations`
  ADD CONSTRAINT `Meditations_ibfk_1` FOREIGN KEY (`uploadedBy`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Music`
--
ALTER TABLE `Music`
  ADD CONSTRAINT `Music_ibfk_1` FOREIGN KEY (`uploadedBy`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `News`
--
ALTER TABLE `News`
  ADD CONSTRAINT `News_ibfk_1` FOREIGN KEY (`authorId`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Notifications`
--
ALTER TABLE `Notifications`
  ADD CONSTRAINT `Notifications_ibfk_1` FOREIGN KEY (`recipient`) REFERENCES `Users` (`id`);

--
-- Constraints for table `Orders`
--
ALTER TABLE `Orders`
  ADD CONSTRAINT `Orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `Orders_ibfk_2` FOREIGN KEY (`vendorId`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Pages`
--
ALTER TABLE `Pages`
  ADD CONSTRAINT `Pages_ibfk_1` FOREIGN KEY (`updatedBy`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Podcasts`
--
ALTER TABLE `Podcasts`
  ADD CONSTRAINT `Podcasts_ibfk_1` FOREIGN KEY (`uploadedBy`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Products`
--
ALTER TABLE `Products`
  ADD CONSTRAINT `Products_ibfk_1` FOREIGN KEY (`vendorId`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Questions`
--
ALTER TABLE `Questions`
  ADD CONSTRAINT `Questions_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Quizzes`
--
ALTER TABLE `Quizzes`
  ADD CONSTRAINT `Quizzes_ibfk_19` FOREIGN KEY (`courseId`) REFERENCES `Courses` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `Quizzes_ibfk_20` FOREIGN KEY (`createdBy`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Settings`
--
ALTER TABLE `Settings`
  ADD CONSTRAINT `Settings_ibfk_1` FOREIGN KEY (`updatedBy`) REFERENCES `Users` (`id`);

--
-- Constraints for table `StorageConfigs`
--
ALTER TABLE `StorageConfigs`
  ADD CONSTRAINT `StorageConfigs_ibfk_1` FOREIGN KEY (`updatedBy`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Transactions`
--
ALTER TABLE `Transactions`
  ADD CONSTRAINT `Transactions_ibfk_1` FOREIGN KEY (`user`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `VendorProfiles`
--
ALTER TABLE `VendorProfiles`
  ADD CONSTRAINT `VendorProfiles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
