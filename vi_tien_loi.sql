-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost
-- Thời gian đã tạo: Th5 15, 2022 lúc 01:10 PM
-- Phiên bản máy phục vụ: 10.4.24-MariaDB
-- Phiên bản PHP: 7.4.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `vi_tien_loi`
--
CREATE DATABASE IF NOT EXISTS `vi_tien_loi` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `vi_tien_loi`;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `account`
--

CREATE TABLE `account` (
  `id` int(11) NOT NULL,
  `phoneNumber` varchar(10) NOT NULL,
  `email` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `dateOfBirth` date NOT NULL,
  `address` varchar(100) NOT NULL,
  `fontCMND` varchar(100) NOT NULL,
  `afterCMND` varchar(100) NOT NULL,
  `username` varchar(10) NOT NULL,
  `password` varchar(100) NOT NULL,
  `activated` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `position` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `account`
--

INSERT INTO `account` (`id`, `phoneNumber`, `email`, `name`, `dateOfBirth`, `address`, `fontCMND`, `afterCMND`, `username`, `password`, `activated`, `status`, `position`) VALUES
(1, '0123456789', 'nam@gmail.com', 'Hoai Nam', '2001-04-30', '741 huong lo 2, Binh Tan, HCM', '', '', '5539598180', '$2a$12$pYWPlmmiFt5QGy8y2Xxu2etKD/9FxMWuxfT9IwplFAA3h8Id3NVQq', 0, 0, 0),
(3, '0987654321', 'admin.vi.tien.loi@gmail.com', 'Admin', '0000-00-00', 'secret', '', '', 'admin', '$2a$12$yVwdhL5VkjpfjPoYiHpBr.9uCM4yQkh9oFhSW/v.uF6F9lh0sWIAq', 0, 0, 1),
(4, '0945678123', 'tran@gmail.com', 'Ngoc Tran', '2001-04-30', '99 Le Dinh Can,Binh Tan, HCM', '', '', '5539592180', '$2a$12$zjYDCCHtnrBaUuAdY2a2VuvRLTzEwcyo6FhIimdr5ErfEPMIB2voO', 1, 0, 0);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `account`
--
ALTER TABLE `account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
