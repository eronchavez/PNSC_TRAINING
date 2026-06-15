CREATE DATABASE  IF NOT EXISTS `studysprint` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `studysprint`;
-- MySQL dump 10.13  Distrib 8.0.13, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: studysprint
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_04_28_120018_create_personal_access_tokens_table',2);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',1,'auth_token','0b36e15c9864b15fdf5ee25850f31d960fd99fc3ca60dc257fd827a06f791383','[\"*\"]','2026-04-28 06:25:13',NULL,'2026-04-28 05:54:53','2026-04-28 06:25:13');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_tips`
--

DROP TABLE IF EXISTS `study_tips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `study_tips` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `content` text NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_tips`
--

LOCK TABLES `study_tips` WRITE;
/*!40000 ALTER TABLE `study_tips` DISABLE KEYS */;
INSERT INTO `study_tips` VALUES (1,'Break large tasks down','Split complex work into smaller actions so you can start faster and track progress more clearly.',1,'2026-04-28 11:58:35','2026-04-28 11:58:35'),(2,'Study the difficult topic first','Handle the most mentally demanding task during your best focus window.',1,'2026-04-28 11:58:35','2026-04-28 11:58:35'),(3,'Review before building','Read the requirements and data contract first before writing code.',1,'2026-04-28 11:58:35','2026-04-28 11:58:35'),(4,'Keep your UI states clear','Loading, empty, success, and error states are part of a complete user experience.',1,'2026-04-28 11:58:35','2026-04-28 11:58:35'),(5,'Study in short focused blocks','Work in focused study sessions with short breaks in between to maintain concentration.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(6,'Start with the hardest subject first','Tackle the most difficult topic when your mind is freshest.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(7,'Review notes on the same day','Going over your notes soon after class helps improve long-term retention.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(8,'Break big tasks into smaller steps','Large assignments feel easier when divided into clear and manageable parts.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(9,'Set one clear goal per session','Before you begin, decide exactly what you want to finish during that study period.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(10,'Avoid multitasking','Studying one subject at a time is usually more effective than switching constantly between tasks.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(11,'Teach what you learned','Explaining a topic in your own words helps reveal what you understand and what you still need to review.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(12,'Use active recall','Test yourself without looking at your notes instead of only rereading material.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(13,'Practice regularly, not only before exams','Short and consistent study sessions are better than last-minute cramming.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(14,'Keep your study space organized','A clean and comfortable study area can make it easier to focus.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(15,'Remove distractions before starting','Silence unnecessary notifications and prepare your materials before you begin.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(16,'Stay hydrated while studying','Drinking enough water can help maintain focus and energy.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(17,'Take useful breaks','Stand up, stretch, or walk for a few minutes so your mind can reset.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(18,'Use a planner or checklist','Writing down tasks helps you track deadlines and reduces mental clutter.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(19,'Study a little every day','Daily progress builds understanding more effectively than studying everything at once.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(20,'Focus on understanding, not memorizing only','Learning why something works helps you remember it better.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(21,'Sleep before an exam','Rest is important because a tired mind struggles to recall information clearly.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(22,'Switch methods when you get stuck','If reading is not working, try summarizing, drawing, or answering practice questions.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(23,'Ask for help early','If you do not understand a topic, ask a teacher or classmate before confusion grows.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(24,'Use examples when studying concepts','Examples make abstract ideas easier to understand and remember.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(25,'Study with intention','Do not just spend time studying — know what you are trying to achieve.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(26,'Review mistakes carefully','Wrong answers can teach you a lot if you take time to understand them.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(27,'Create a realistic study schedule','Plan around your actual energy and available time instead of making impossible timetables.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(28,'Avoid comparing your pace to others','Steady personal progress matters more than trying to match someone else’s speed.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(29,'Reward small progress','Recognizing completed work can help you stay motivated over time.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(30,'Use practice questions often','Answering questions helps prepare you for how knowledge will actually be used.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(31,'Read instructions carefully','Many mistakes happen because students rush through directions.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(32,'Study one topic deeply before moving on','A strong foundation makes the next lesson easier to understand.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(33,'Keep important deadlines visible','Seeing due dates often can help you avoid last-minute panic.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27'),(34,'Stay consistent','Even small daily study habits can lead to strong results over time.',1,'2026-04-28 15:40:27','2026-04-28 15:40:27');
/*!40000 ALTER TABLE `study_tips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `title` varchar(150) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `due_date` datetime DEFAULT NULL,
  `priority` enum('Low','Medium','High') NOT NULL DEFAULT 'Medium',
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_tasks_user` (`user_id`),
  CONSTRAINT `fk_tasks_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,1,'Review CSS Shapes','Web','2026-06-01 08:00:00','High',0,'Practice circle(), ellipse(), and polygon() layouts.','2026-06-28 11:58:07','2026-06-10 03:18:54'),(2,1,'Build responsive navbar','Web','2026-06-03 10:00:00','High',1,'Test on desktop, tablet, and mobile breakpoints.','2026-04-28 11:58:07','2026-06-10 03:35:11'),(3,1,'Study fetch API and async/await','JavaScript','2026-06-03 13:00:00','Medium',0,'Focus on GET, POST, PATCH, DELETE flows.','2026-04-28 11:58:07','2026-06-10 03:35:11'),(4,1,'Create PWA manifest','Web','2026-06-04 16:00:00','Medium',0,'Include icons, start_url, display standalone.','2026-04-28 11:58:07','2026-06-10 03:34:29'),(5,1,'Prepare for quiz on accessibility','UI/UX','2026-06-08 08:00:00','Low',1,'Review focus states, labels, landmarks, and contrast.','2026-04-28 11:58:07','2026-06-10 03:35:11'),(6,1,'Refactor task card component','Frontend','2026-06-16 09:00:00','Medium',0,'Reduce duplication and improve readability.','2026-04-28 11:58:07','2026-06-10 03:18:54'),(7,2,'Read module brief carefully','Prep','2026-06-08 08:00:00','High',0,'List required views and API endpoints.','2026-04-28 11:58:07','2026-06-10 03:04:14'),(8,2,'Practice CRUD with token auth','Backend','2026-06-10 09:00:00','High',0,'Test login, task create, edit, delete.','2026-04-28 11:58:07','2026-06-10 03:18:54'),(9,2,'Improve loading and empty states','Frontend','2026-06-11 08:00:00','Medium',0,'Add polished messaging for no results and API failures.','2026-04-28 11:58:07','2026-06-10 03:18:54'),(10,2,'Finalize mobile spacing','UI Design','2026-06-13 10:00:00','Low',1,'Check touch targets and vertical rhythm.','2026-04-28 11:58:07','2026-06-10 03:35:11'),(12,2,'Review fetch error handling','Web Technologies','2026-06-11 14:00:00','Medium',0,NULL,'2026-06-09 19:23:19','2026-06-10 03:24:31');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Student User','student@pnsc2026.com',NULL,'$2y$12$fPpk4FeZnlKt.2qlrMEy8u3ujFACKOJceoKASNDeIIQxr/XDFCFYC',NULL,'2026-04-28 03:51:16','2026-04-28 03:51:16'),(2,'Demo User','demo@pnsc2026.com',NULL,'$2y$12$OXVhsjiE/4QrBsbXLz06cOyHgRFwUZeX4F594fpSwlbyqcQyVk3Oa',NULL,'2026-04-28 03:57:55','2026-04-28 03:57:55');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-29  5:53:50
