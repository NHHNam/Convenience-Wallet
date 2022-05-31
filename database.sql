-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost
-- Thời gian đã tạo: Th5 31, 2022 lúc 04:49 PM
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
-- Cơ sở dữ liệu: `paymentwallet`
--
CREATE DATABASE IF NOT EXISTS `paymentwallet` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `paymentwallet`;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `account`
--

CREATE TABLE `account` (
  `id` int(11) NOT NULL,
  `sdt` varchar(10) NOT NULL,
  `email` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `ngaysinh` date NOT NULL,
  `diachi` varchar(100) NOT NULL,
  `image_cccd_truoc` varchar(100) NOT NULL,
  `image_cccd_sau` varchar(100) NOT NULL,
  `username` varchar(10) NOT NULL,
  `password` varchar(100) NOT NULL,
  `status` varchar(50) NOT NULL,
  `password_first` int(11) NOT NULL,
  `position` int(11) NOT NULL,
  `activated` int(11) NOT NULL,
  `error` int(11) NOT NULL,
  `error_date` datetime NOT NULL DEFAULT current_timestamp(),
  `blocked` int(11) NOT NULL,
  `disabled` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `account`
--

INSERT INTO `account` (`id`, `sdt`, `email`, `name`, `ngaysinh`, `diachi`, `image_cccd_truoc`, `image_cccd_sau`, `username`, `password`, `status`, `password_first`, `position`, `activated`, `error`, `error_date`, `blocked`, `disabled`) VALUES
(1, '0123456789', 'admin.vi.tien.loi@gmail.com', 'Admin', '1998-05-21', 'Công ty Ví tiện lợi lala,Quận 1, TP.HCM. VietNam', '', '', 'admin', '$2a$12$eyZDmUIgFH12npy5CHymOui5B2C1EbkXMwrjnTwZXrz9l2kt.7DL.', 'đã xác minh', 1, 1, 1, 0, '2022-05-30 16:31:20', 0, 0),
(20, '0987654321', 'nguyenhunghoainam.dev@gmail.com', 'Hoài Nam', '2001-04-30', 'HL2', 'images/02D8293E-C623-4E44-849F-3001CDEDA69A.jpeg', 'images/B86A1FDB-330D-4C52-B9EE-1EFDDCF6E077.jpeg', '1957459648', '$2b$10$XKDpSeDu61aJHHeFkgkCXu8ZC1zeb7jKUrEyNNKfamesr5sM0.5eu', 'đã xác minh', 1, 0, 1, 0, '2022-05-31 14:41:57', 0, 0),
(29, '0773762943', 'nhhnam2001@gmail.com', 'Ngọc Trân', '1972-08-31', 'LK8, Binh Tan, HCM', 'images/noise.jpeg', 'images/noise_light.jpeg', '3331688142', '$2b$10$Aw71J28yGMc4NrEKbc4ROu342f5Fmh11miLdTE1bcIFAXhB0JIZNq', 'đã xác minh', 1, 0, 1, 0, '2022-05-31 20:58:57', 0, 0),
(30, '0741852963', 'nammaiyeutran@gmail.com', 'Nam 111', '2001-10-10', '4444 HL 2', 'images/1.png', 'images/Screenshot 2022-05-29 at 22.14.46.png', '8968042275', '$2b$10$tP/ubfVQ1rok7OEweLbU.Onb.rH28AWsJkWmCyQqWmap9O5IyOR.y', 'chờ xác minh', 0, 0, 0, 0, '2022-05-31 21:04:49', 0, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `creditCard`
--

CREATE TABLE `creditCard` (
  `id` int(11) NOT NULL,
  `numberCard` int(11) NOT NULL,
  `expirationDate` varchar(100) NOT NULL,
  `codeCVV` int(11) NOT NULL,
  `note` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `creditCard`
--

INSERT INTO `creditCard` (`id`, `numberCard`, `expirationDate`, `codeCVV`, `note`) VALUES
(1, 111111, '2022-10-10', 411, 'Không giới hạn số lần nạp và số tiền mỗi lần nạp.'),
(2, 222222, '2022-11-11', 443, 'Không giới hạn số lần nạp nhưng chỉ được nạp tối đa 1 triệu/lần.'),
(3, 333333, '2022-12-12', 577, 'Khi nạp bằng thẻ này thì luôn nhận được thông báo là “thẻ hết tiền”.');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `historyCodeCard`
--

CREATE TABLE `historyCodeCard` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `network` varchar(100) NOT NULL,
  `codeCard` varchar(100) NOT NULL,
  `cost` varchar(100) NOT NULL,
  `date` varchar(100) NOT NULL,
  `time` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `historyCodeCard`
--

INSERT INTO `historyCodeCard` (`id`, `email`, `network`, `codeCard`, `cost`, `date`, `time`) VALUES
(73, 'nguyenhunghoainam.dev@gmail.com', 'Viettel', '1111173098', '50000', '2022-5-31', '21:3:22'),
(74, 'nguyenhunghoainam.dev@gmail.com', 'Viettel', '1111120370', '50000', '2022-5-31', '21:3:22'),
(75, 'nguyenhunghoainam.dev@gmail.com', 'Viettel', '1111122232', '50000', '2022-5-31', '21:3:22'),
(76, 'nguyenhunghoainam.dev@gmail.com', 'Viettel', '1111129912', '50000', '2022-5-31', '21:3:22'),
(77, 'nguyenhunghoainam.dev@gmail.com', 'Viettel', '1111118180', '50000', '2022-5-31', '21:3:22'),
(78, 'nguyenhunghoainam.dev@gmail.com', 'Mobifone', '2222238618', '20000', '2022-5-31', '21:3:35'),
(79, 'nguyenhunghoainam.dev@gmail.com', 'Mobifone', '2222287827', '20000', '2022-5-31', '21:3:35'),
(80, 'nguyenhunghoainam.dev@gmail.com', 'Mobifone', '2222285861', '20000', '2022-5-31', '21:3:35'),
(81, 'nguyenhunghoainam.dev@gmail.com', 'Vinaphone', '3333336722', '50000', '2022-5-31', '21:3:44');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `historyServices`
--

CREATE TABLE `historyServices` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `numberCard` int(11) NOT NULL,
  `expirationDate` varchar(100) NOT NULL,
  `codeCVV` int(11) NOT NULL,
  `recharge` int(11) NOT NULL,
  `dateRecharge` varchar(100) NOT NULL,
  `timeRecharge` varchar(100) NOT NULL,
  `type` varchar(100) NOT NULL,
  `note` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `historyServices`
--

INSERT INTO `historyServices` (`id`, `email`, `numberCard`, `expirationDate`, `codeCVV`, `recharge`, `dateRecharge`, `timeRecharge`, `type`, `note`, `status`) VALUES
(90, 'nguyenhunghoainam.dev@gmail.com', 111111, '2022-10-10', 411, 1000000, '2022-5-31', '20:56:47', 'Nạp tiền', '', 'duyệt'),
(91, 'nguyenhunghoainam.dev@gmail.com', 111111, '2022-10-10', 411, 5000000, '2022-5-31', '20:57:7', 'Nạp tiền', '', 'từ chối'),
(92, 'nguyenhunghoainam.dev@gmail.com', 222222, '2022-11-11', 443, 1000000, '2022-5-31', '20:58:5', 'Nạp tiền', '', 'duyệt'),
(93, 'nguyenhunghoainam.dev@gmail.com', 333333, '2022-12-12', 577, 950000, '2022-5-31', '20:59:33', 'Rút tiền', 'rut 1 trieu', 'duyệt'),
(94, 'nguyenhunghoainam.dev@gmail.com', 111111, '2022-10-10', 411, 4750000, '2022-5-31', '21:0:15', 'Rút tiền', 'rut ve 5 trieu', 'duyệt'),
(95, 'nguyenhunghoainam.dev@gmail.com', 111111, '2022-10-10', 411, 1000000, '2022-5-31', '21:7:11', 'Nạp tiền', '', 'duyệt');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `historyTransfer`
--

CREATE TABLE `historyTransfer` (
  `id` int(11) NOT NULL,
  `emailReceive` varchar(100) NOT NULL,
  `emailSend` varchar(100) NOT NULL,
  `note` varchar(100) NOT NULL,
  `money` varchar(100) NOT NULL,
  `typeFee` varchar(100) NOT NULL,
  `date` varchar(100) NOT NULL,
  `time` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `historyTransfer`
--

INSERT INTO `historyTransfer` (`id`, `emailReceive`, `emailSend`, `note`, `money`, `typeFee`, `date`, `time`, `status`) VALUES
(31, 'nguyenhunghoainam.dev@gmail.com', 'nhhnam2001@gmail.com', 'aaaa', '1000000', 'send', '2022-5-31', '20:27:30', 'duyệt'),
(32, 'nguyenhunghoainam.dev@gmail.com', 'nhhnam2001@gmail.com', 'aaaa', '1000000', 'send', '2022-5-31', '20:28:42', 'duyệt'),
(33, 'nguyenhunghoainam.dev@gmail.com', 'nhhnam2001@gmail.com', 'chuyen 1 trieu', '1000000', 'receive', '2022-5-31', '20:31:47', 'duyệt'),
(34, 'nguyenhunghoainam.dev@gmail.com', 'nhhnam2001@gmail.com', 'chuyen 5 trieu', '5000000', 'receive', '2022-5-31', '20:32:58', 'từ chối'),
(35, 'nguyenhunghoainam.dev@gmail.com', 'nhhnam2001@gmail.com', 'chuyen cho ban 6 trieu', '6000000', 'receive', '2022-5-31', '20:34:42', 'duyệt'),
(36, 'nhhnam2001@gmail.com', 'nguyenhunghoainam.dev@gmail.com', 'chuyen 1 trieu', '1000000', 'receive', '2022-5-31', '21:2:35', 'duyệt'),
(37, 'nhhnam2001@gmail.com', 'nguyenhunghoainam.dev@gmail.com', 'chuyen cho 1 trieu', '1000000', 'receive', '2022-5-31', '21:45:30', 'duyệt'),
(38, 'nhhnam2001@gmail.com', 'nguyenhunghoainam.dev@gmail.com', '5 trieu', '5000000', 'receive', '2022-5-31', '21:46:23', 'duyệt');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `otpCode`
--

CREATE TABLE `otpCode` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `otp` int(11) NOT NULL,
  `date` varchar(100) NOT NULL,
  `time` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `otpCode`
--

INSERT INTO `otpCode` (`id`, `email`, `otp`, `date`, `time`, `status`) VALUES
(42, 'nhhnam2001@gmail.com', 7632, '2022-5-31', '20:27:16', 'thành công'),
(43, 'nhhnam2001@gmail.com', 7947, '2022-5-31', '20:28:31', 'thành công'),
(44, 'nhhnam2001@gmail.com', 3364, '2022-5-31', '20:31:31', 'thành công'),
(45, 'nhhnam2001@gmail.com', 3260, '2022-5-31', '20:32:25', 'thành công'),
(46, 'nhhnam2001@gmail.com', 3329, '2022-5-31', '20:34:29', 'thành công'),
(47, 'nguyenhunghoainam.dev@gmail.com', 2017, '2022-5-31', '21:2:8', 'thành công'),
(48, 'nguyenhunghoainam.dev@gmail.com', 688, '2022-5-31', '21:45:10', 'thành công'),
(49, 'nguyenhunghoainam.dev@gmail.com', 5073, '2022-5-31', '21:46:10', 'thành công');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `otpForget`
--

CREATE TABLE `otpForget` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `otp` varchar(10) NOT NULL,
  `date` varchar(100) NOT NULL,
  `time` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `otpForget`
--

INSERT INTO `otpForget` (`id`, `email`, `otp`, `date`, `time`, `status`) VALUES
(4, 'nhhnam2001@gmail.com', '8996', '2022-5-31', '20:36:33', 'thành công'),
(5, 'nhhnam2001@gmail.com', '6317', '2022-5-31', '20:55:11', 'thành công');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phoneNetwork`
--

CREATE TABLE `phoneNetwork` (
  `id` int(11) NOT NULL,
  `network` varchar(50) NOT NULL,
  `code` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `phoneNetwork`
--

INSERT INTO `phoneNetwork` (`id`, `network`, `code`) VALUES
(1, 'Viettel', '11111'),
(2, 'Mobifone', '22222'),
(3, 'Vinaphone', '33333');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `surplusAccount`
--

CREATE TABLE `surplusAccount` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `surplus` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `surplusAccount`
--

INSERT INTO `surplusAccount` (`id`, `email`, `surplus`) VALUES
(6, 'nguyenhunghoainam.dev@gmail.com', '3959000'),
(15, 'nhhnam2001@gmail.com', '6650000'),
(16, 'nammaiyeutran@gmail.com', '0');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `creditCard`
--
ALTER TABLE `creditCard`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `historyCodeCard`
--
ALTER TABLE `historyCodeCard`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `historyServices`
--
ALTER TABLE `historyServices`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `historyTransfer`
--
ALTER TABLE `historyTransfer`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `otpCode`
--
ALTER TABLE `otpCode`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `otpForget`
--
ALTER TABLE `otpForget`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `phoneNetwork`
--
ALTER TABLE `phoneNetwork`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `surplusAccount`
--
ALTER TABLE `surplusAccount`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `account`
--
ALTER TABLE `account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT cho bảng `creditCard`
--
ALTER TABLE `creditCard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `historyCodeCard`
--
ALTER TABLE `historyCodeCard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT cho bảng `historyServices`
--
ALTER TABLE `historyServices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT cho bảng `historyTransfer`
--
ALTER TABLE `historyTransfer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT cho bảng `otpCode`
--
ALTER TABLE `otpCode`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT cho bảng `otpForget`
--
ALTER TABLE `otpForget`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `phoneNetwork`
--
ALTER TABLE `phoneNetwork`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `surplusAccount`
--
ALTER TABLE `surplusAccount`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
