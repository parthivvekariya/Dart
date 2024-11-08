-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 18, 2024 at 10:48 AM
-- Server version: 10.5.20-MariaDB
-- PHP Version: 7.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `id21062182_parthiv`
--
CREATE DATABASE IF NOT EXISTS `id21062182_parthiv` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `id21062182_parthiv`;

-- --------------------------------------------------------

--
-- Table structure for table `one_stop_Categorie`
--

CREATE TABLE `one_stop_Categorie` (
  `id` int(11) NOT NULL,
  `Categorie_image` varchar(255) NOT NULL,
  `Categorie_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `one_stop_Categorie`
--

INSERT INTO `one_stop_Categorie` VALUES
(1, 'https://roasting-conflict.000webhostapp.com/API/one_stop/Categories/Categories_images/vegitables.jpg', 'Vegetsbles'),
(2, 'https://roasting-conflict.000webhostapp.com/API/one_stop/Categories/Categories_images/frutes.jpg', 'Fruits');

-- --------------------------------------------------------

--
-- Table structure for table `one_stop_item`
--

CREATE TABLE `one_stop_item` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `item_image` varchar(255) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `item_price` varchar(255) NOT NULL,
  `item_quantity` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `one_stop_item`
--

INSERT INTO `one_stop_item` VALUES
(1, 1, 'https://roasting-conflict.000webhostapp.com/API/one_stop/items/images/broccoli.jpg', 'broccoli', '20', 'kg'),
(2, 1, 'https://roasting-conflict.000webhostapp.com/API/one_stop/items/images/cabbage.jpg', 'cabbage', '10', 'piece'),
(3, 1, 'https://roasting-conflict.000webhostapp.com/API/one_stop/items/images/carrots.jpg', 'carrot', '30', 'kg'),
(4, 1, 'https://roasting-conflict.000webhostapp.com/API/one_stop/items/images/cucumber.jpg', 'cucumber', '20', 'kg'),
(5, 1, 'https://roasting-conflict.000webhostapp.com/API/one_stop/items/images/tomato.jpg', 'tomato', '30', 'kg'),
(6, 2, 'https://roasting-conflict.000webhostapp.com/API/one_stop/items/images/apple.jpg', 'apple', '15', 'kg'),
(7, 2, 'https://roasting-conflict.000webhostapp.com/API/one_stop/items/images/banana.jpg', 'banana', '20', 'derzon'),
(8, 2, 'https://roasting-conflict.000webhostapp.com/API/one_stop/items/images/green%20banana.jpg', 'green banana', '20', 'derzon'),
(9, 2, 'https://roasting-conflict.000webhostapp.com/API/one_stop/items/images/mengo.jpg', 'mengo', '30', 'kg'),
(10, 2, 'https://roasting-conflict.000webhostapp.com/API/one_stop/items/images/vstrobery.jpg', 'strobery', '10', 'derzon'),
(11, 2, 'https://roasting-conflict.000webhostapp.com/API/one_stop/items/images/watermelon.jpg', 'watermelon', '10', 'piece');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `number` varchar(50) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `paymentMethod` varchar(50) DEFAULT NULL,
  `deliveryOption` varchar(50) DEFAULT NULL,
  `orderNotes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` VALUES
(6, '2222222228', 'Parthiv Vekariya ', 'near jk pan, om nagar circle, New 150ft ringroad, mavdi - rajkot 360004', 'COD', 'By courier', '', '2024-07-16 12:29:15'),
(7, '', '', '', 'COD', 'By courier', '', '2024-07-16 18:05:33'),
(8, '7285015414', 'khushal Patel', 'ambardi', 'COD', 'I\'ll pick it up myself', 'op', '2024-07-16 18:06:38'),
(9, '9510784188', 'pilo', 'Rajkot', 'COD', 'By courier', '', '2024-07-17 06:51:50'),
(10, '', '', '', 'Card', 'By courier', '', '2024-07-17 14:57:00'),
(11, '', 'fruit lover', 'rajkot', 'COD', 'By courier', '', '2024-07-17 18:49:00'),
(12, '', 'fruit lover', 'rajkot', 'COD', 'I\'ll pick it up myself', '', '2024-07-17 18:49:27'),
(13, '', 'fruit lover', 'rajkot', 'COD', 'I\'ll pick it up myself', '', '2024-07-17 18:49:29');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `total_price` double DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` VALUES
(11, 6, 6, 'apple', 1, 15, '2024-07-16 12:29:15'),
(12, 6, 7, 'banana', 1, 20, '2024-07-16 12:29:15'),
(13, 7, 1, 'broccoli', 1, 20, '2024-07-16 18:05:33'),
(14, 7, 2, 'cabbage', 1, 10, '2024-07-16 18:05:33'),
(15, 7, 3, 'carrot', 1, 30, '2024-07-16 18:05:33'),
(16, 7, 4, 'cucumber', 1, 20, '2024-07-16 18:05:33'),
(17, 7, 5, 'tomato', 4, 120, '2024-07-16 18:05:33'),
(18, 7, 6, 'apple', 3, 45, '2024-07-16 18:05:33'),
(19, 7, 7, 'banana', 4, 80, '2024-07-16 18:05:33'),
(20, 7, 9, 'mengo', 4, 120, '2024-07-16 18:05:33'),
(21, 7, 10, 'strobery', 4, 40, '2024-07-16 18:05:33'),
(22, 7, 11, 'watermelon', 4, 40, '2024-07-16 18:05:33'),
(23, 8, 1, 'broccoli', 1, 20, '2024-07-16 18:06:38'),
(24, 8, 2, 'cabbage', 1, 10, '2024-07-16 18:06:38'),
(25, 8, 3, 'carrot', 1, 30, '2024-07-16 18:06:38'),
(26, 8, 4, 'cucumber', 1, 20, '2024-07-16 18:06:38'),
(27, 8, 5, 'tomato', 4, 120, '2024-07-16 18:06:38'),
(28, 8, 6, 'apple', 3, 45, '2024-07-16 18:06:38'),
(29, 8, 7, 'banana', 4, 80, '2024-07-16 18:06:38'),
(30, 8, 9, 'mengo', 4, 120, '2024-07-16 18:06:38'),
(31, 8, 10, 'strobery', 4, 40, '2024-07-16 18:06:38'),
(32, 8, 11, 'watermelon', 4, 40, '2024-07-16 18:06:38'),
(33, 9, 7, 'banana', 8, 160, '2024-07-17 06:51:50'),
(34, 9, 9, 'mengo', 10, 300, '2024-07-17 06:51:50'),
(35, 9, 11, 'watermelon', 6, 60, '2024-07-17 06:51:50'),
(36, 11, 5, 'tomato', 50, 1500, '2024-07-17 18:49:00'),
(37, 11, 7, 'banana', 50, 1000, '2024-07-17 18:49:00'),
(38, 11, 9, 'mengo', 93, 2790, '2024-07-17 18:49:00'),
(39, 11, 10, 'strobery', 42, 420, '2024-07-17 18:49:00'),
(40, 12, 5, 'tomato', 50, 1500, '2024-07-17 18:49:27'),
(41, 12, 7, 'banana', 50, 1000, '2024-07-17 18:49:27'),
(42, 12, 9, 'mengo', 93, 2790, '2024-07-17 18:49:27'),
(43, 12, 10, 'strobery', 42, 420, '2024-07-17 18:49:27'),
(44, 13, 5, 'tomato', 50, 1500, '2024-07-17 18:49:29'),
(45, 13, 7, 'banana', 50, 1000, '2024-07-17 18:49:29'),
(46, 13, 9, 'mengo', 93, 2790, '2024-07-17 18:49:29'),
(47, 13, 10, 'strobery', 42, 420, '2024-07-17 18:49:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `one_stop_Categorie`
--
ALTER TABLE `one_stop_Categorie`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `one_stop_item`
--
ALTER TABLE `one_stop_item`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `one_stop_Categorie`
--
ALTER TABLE `one_stop_Categorie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `one_stop_item`
--
ALTER TABLE `one_stop_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
