CREATE TABLE IF NOT EXISTS `sensorData` (
  `id` mediumint UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `uid` mediumint UNSIGNED,
  `time` mediumint UNSIGNED,
  `temperature` float,
  `pressure` float,
  `altitude` float,
  `humidity` float
);

CREATE TABLE IF NOT EXISTS `accounts` (
  `id` mediumint UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `user` varchar(30),
  `pass` varchar(75)
);

ALTER TABLE `sensorData` ADD FOREIGN KEY (`uid`) REFERENCES `accounts` (`id`);



