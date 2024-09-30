CREATE DATABASE  IF NOT EXISTS `vacations` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `vacations`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: vacations
-- ------------------------------------------------------
-- Server version	8.4.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `vacationId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId_idx` (`userId`),
  KEY `vacationId_idx` (`vacationId`),
  CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `vacationId` FOREIGN KEY (`vacationId`) REFERENCES `vacations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (45,30,126),(46,29,133),(47,29,131),(48,31,133),(49,31,132),(50,31,129),(54,32,132),(56,32,127),(57,32,134),(59,32,129),(60,32,135),(61,32,126);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `roleId` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (28,'Nir','Davidovich','nir@gmail.com','ee41a5a6f76956f83707439ab2b396b7bae583d0c158408c7a4123bc27cf5c298b14a9a42392b6b498c456bf1ffd0adf03e156117e1e9edf576d14495fe5cefd','1'),(29,'Lior','Bass','lior@gmail.com','05afc42612bd1a838fcd2bdfa7f04d1c4ef49035e0daf63c721d8271823e2712dc74f822a264dbc9613ebe2ccc5bb82877ee499daad9ab97c72838e5d70a372d','2'),(30,'Adi','Vanunu','adi@gmail.com','05afc42612bd1a838fcd2bdfa7f04d1c4ef49035e0daf63c721d8271823e2712dc74f822a264dbc9613ebe2ccc5bb82877ee499daad9ab97c72838e5d70a372d','2'),(31,'Lior','Trosman','liort@gmail.com','05afc42612bd1a838fcd2bdfa7f04d1c4ef49035e0daf63c721d8271823e2712dc74f822a264dbc9613ebe2ccc5bb82877ee499daad9ab97c72838e5d70a372d','2'),(32,'Adi','Davidovich','adid@gmail.com','05afc42612bd1a838fcd2bdfa7f04d1c4ef49035e0daf63c721d8271823e2712dc74f822a264dbc9613ebe2ccc5bb82877ee499daad9ab97c72838e5d70a372d','2');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacations`
--

DROP TABLE IF EXISTS `vacations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `destination` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `price` decimal(7,2) NOT NULL,
  `imageName` varchar(400) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacations`
--

LOCK TABLES `vacations` WRITE;
/*!40000 ALTER TABLE `vacations` DISABLE KEYS */;
INSERT INTO `vacations` VALUES (126,'Paris - France','The romantic city of lights is known for its art, fashion, and culture. Visit iconic landmarks like the Eiffel Tower, the Louvre, and Notre-Dame Cathedral.','2024-05-15','2024-05-20',1500.00,'81e0c085-e30b-4c0c-b4ef-33ae3c2095f9.jpg'),(127,'Rome - Italy','Step back in time as you explore the ancient ruins of the Colosseum, the Vatican City, and the Sistine Chapel.','2024-06-01','2024-06-07',1200.00,'8290e2bf-bd59-47f3-8fe9-4dc6641ea58d.jpg'),(128,'Barcelona - Spain','Experience the vibrant city of Gaudí’s architecture, beaches, and lively street culture. Don\'t miss La Sagrada Familia.','2025-01-05','2025-01-12',1300.00,'0075e250-bf78-4dcc-bdc2-70fb934386dd.jpg'),(129,'Santorini - Greece','Famous for its whitewashed buildings with blue domes, Santorini offers stunning sunsets and luxurious beaches.','2025-08-08','2025-08-14',1800.00,'23fbc5bc-4ad5-4dfa-a4fc-999fc5ce0b26.jpg'),(130,'Amsterdam - Netherlands','Explore the picturesque canals, museums like the Van Gogh Museum, and enjoy a relaxed bike ride through the city.','2024-09-29','2024-10-07',1250.00,'c728b0d4-c4ab-4a38-bb79-4d15e0891bc3.jpg'),(131,'Vienna - Austria','Known for its classical music, stunning palaces like Schönbrunn, and rich history, Vienna is a cultural hub.','2024-10-15','2024-10-20',1400.00,'b3d5415e-f189-453a-a113-a7c21980e8c3.jpg'),(132,'Prague - Czech Republic','A medieval city with beautiful Gothic architecture, cobblestone streets, and the iconic Charles Bridge.','2024-11-05','2024-11-10',1100.00,'ed91ec36-efe5-4971-951a-a4ed0643b028.jpg'),(133,'Dubrovnik - Croatia','Walk the ancient city walls and soak in stunning views of the Adriatic Sea in this historical city known as the \"Pearl of the Adriatic\".','2024-09-12','2024-09-17',1500.00,'987e8b85-6cab-4eb0-84ea-98ed11eb076c.jpg'),(134,'Edinburgh - Scotland','Experience the charm of medieval Edinburgh, including Edinburgh Castle and the beautiful Royal Mile.','2024-08-01','2024-08-06',1300.00,'67c7153c-86f8-47db-a9d5-7228965d5a93.jpg'),(135,'Lisbon - Portugal','Lisbon offers historical neighborhoods, trams, and views of the Atlantic Ocean. Explore Belém Tower and the Jerónimos Monastery.','2025-10-01','2025-10-06',1200.00,'68358405-ca01-4ea1-af0a-f6a42a3d511c.jpg'),(136,'Budapest - Hungary','A city of thermal baths, majestic architecture, and vibrant nightlife. Visit Buda Castle and the Parliament Building.','2024-11-17','2024-11-20',1150.00,'59bf4ce6-57e0-4374-a0eb-6034d23bf43d.jpg'),(137,'Stockholm - Sweden','Enjoy the clean, beautiful city of Stockholm with its islands, museums, and rich history. Visit the Vasa Museum and Skansen.','2024-07-20','2024-07-25',1600.00,'445b78a8-17fa-49c0-ae99-ebd90c79393d.jpg');
/*!40000 ALTER TABLE `vacations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-29 21:33:03
