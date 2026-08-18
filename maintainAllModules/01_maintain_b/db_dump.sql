CREATE DATABASE  IF NOT EXISTS `ws1_module_b` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ws1_module_b`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 172.16.3.61    Database: ws1_module_b
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.22.04.3

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
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'eco_friendly'),(3,'food'),(4,'item'),(2,'luxury');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `address` text NOT NULL,
  `telephone` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `email` varchar(100) NOT NULL,
  `active` tinyint DEFAULT '1',
  `owner_id` bigint unsigned DEFAULT NULL,
  `contact_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_companies_owners_idx` (`owner_id`),
  KEY `fk_companies_contacts1_idx` (`contact_id`),
  CONSTRAINT `fk_companies_contacts1` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`),
  CONSTRAINT `fk_companies_owners` FOREIGN KEY (`owner_id`) REFERENCES `owners` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,'Innovateurs Tech SARL','123 Boulevard du Silicon 75001 Paris','+33 1 23 45 67 89','info@innovateurstech.fr',1,1,1),(2,'Solutions Vertes SAS','456 Parc Ã‰co 69002 Lyon','+33 4 56 78 90 12','contact@solutionsvertes.fr',1,2,2),(3,'Designs Urbains SARL','789 Avenue MÃ©tropolitaine 13001 Marseille','+33 4 12 34 56 78','support@designsurbains.fr',1,3,3),(4,'Cuisine Innovante SARL','22 Rue de la Cuisine 75005 Paris','+33 1 40 20 30 40','info@cuisineinnovante.fr',1,4,4),(5,'Ã‰nergies Renouvelables SAS','15 Chemin Vert 31000 Toulouse','+33 5 61 23 45 67','contact@energiesrenouvelables.fr',1,5,5),(6,'Technologie AvancÃ©e SARL','9 Rue de la Science 59800 Lille','+33 3 20 15 25 35','support@technologieavancee.fr',1,6,6),(7,'Artisanat Moderne SAS','28 Avenue de l\'Artisanat 67000 Strasbourg','+33 3 88 10 20 30','info@artisanatmoderne.fr',1,7,7);
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `mobile` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` VALUES (1,'Bob Martin','+33 6 98 76 54 32','bob.martin@innovateurstech.fr'),(2,'Tom Dubois','+33 6 87 65 43 21','tom.dubois@solutionsvertes.fr'),(3,'Emily Moreau','+33 6 54 32 10 98','emily.moreau@designsurbains.fr'),(4,'Chloe Dubois','+33 6 55 44 33 22','chloe.dubois@cuisineinnovante.fr'),(5,'Paul Leroy','+33 6 66 77 88 99','paul.leroy@energiesrenouvelables.fr'),(6,'Isabelle Thomas','+33 6 44 55 66 77','isabelle.thomas@technologieavancee.fr'),(7,'Julien Rousseau','+33 6 77 66 55 44','julien.rousseau@artisanatmoderne.fr');
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `owners`
--

DROP TABLE IF EXISTS `owners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `owners` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `mobile` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `owners`
--

LOCK TABLES `owners` WRITE;
/*!40000 ALTER TABLE `owners` DISABLE KEYS */;
INSERT INTO `owners` VALUES (1,'Alice Dupont','+33 6 12 34 56 78','alice.dupont@innovateurstech.fr'),(2,'Sarah Lefevre','+33 6 23 45 67 89','sarah.lefevre@solutionsvertes.fr'),(3,'Michael Petit','+33 6 34 56 78 90','michael.petit@designsurbains.fr'),(4,'Jean Martin','+33 6 11 22 33 44','jean.martin@cuisineinnovante.fr'),(5,'Louise Garnier','+33 6 77 88 99 00','louise.garnier@energiesrenouvelables.fr'),(6,'Luc Bernard','+33 6 33 44 55 66','luc.bernard@technologieavancee.fr'),(7,'Emma Morel','+33 6 22 33 44 55','emma.morel@artisanatmoderne.fr');
/*!40000 ALTER TABLE `owners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `french_name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `french_description` text NOT NULL,
  `gtin` varchar(14) NOT NULL,
  `brand` varchar(45) NOT NULL,
  `category_id` bigint unsigned DEFAULT NULL,
  `country` varchar(45) NOT NULL,
  `gross_weight` decimal(6,2) NOT NULL,
  `net_weight` decimal(6,2) NOT NULL,
  `weight_unit` varchar(45) NOT NULL,
  `hidden` tinyint DEFAULT '0',
  `company_id` bigint unsigned DEFAULT NULL,
  `image` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `gtin_UNIQUE` (`gtin`),
  KEY `fk_products_companies1_idx` (`company_id`),
  KEY `fk_products_categories1_idx` (`category_id`),
  CONSTRAINT `fk_products_categories1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `fk_products_companies1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'French Herb and Lemon Infused Olive Oil','Huile d\'olive infusÃ©e aux herbes et au citron franÃ§ais','Add a touch of freshness to your dishes with our French herb and lemon infused olive oil, featuring a blend of fragrant herbs and citrus.','Ajoutez une touche de fraÃ®cheur Ã  vos plats avec notre huile d\'olive infusÃ©e aux herbes franÃ§aises et au citron, composÃ©e d\'un mÃ©lange d\'herbes parfumÃ©es et d\'agrumes.','37900123458228','Huiles de France',1,'France',0.50,0.40,'g',0,1,NULL),(2,'Artisanal French Quiche Lorraine Tartlets','Tartelettes de quiche lorraine artisanale franÃ§aise','Indulge in the rich flavors of France with our artisanal quiche Lorraine tartlets, featuring a blend of creamy eggs and cheese.','Laissez-vous tenter par les riches saveurs de la France avec nos tartelettes artisanales Ã  la quiche lorraine, composÃ©es d\'un mÃ©lange d\'Å“ufs crÃ©meux et de fromage.','37900123458345','PÃ¢tisseries Artisanales',2,'France',1.20,0.80,'g',0,2,NULL),(3,'French Lavender and Honey Body Scrub','Exfoliant corporel Ã  la lavande et au miel franÃ§ais','Exfoliate your skin with our French lavender and honey body scrub, featuring a soothing blend of fragrant herbs and citrus.','Exfoliez votre peau avec notre gommage corporel Ã  la lavande franÃ§aise et au miel, composÃ© d\'un mÃ©lange apaisant d\'herbes parfumÃ©es et d\'agrumes.','37900123458462','Soins Corporels de France',3,'France',0.60,0.50,'g',0,3,NULL),(4,'French Apple and Cinnamon Crumble Mix','MÃ©lange de crumble aux pommes et au cannelle franÃ§ais','Warm up with our French apple and cinnamon crumble mix, featuring a blend of fresh spices perfect for a comforting dessert.','RÃ©chauffez-vous avec notre mÃ©lange de crumble aux pommes et Ã  la cannelle franÃ§aise, composÃ© d\'un mÃ©lange d\'Ã©pices fraÃ®ches, parfait pour un dessert rÃ©confortant.','37900123458579','DessertÃ¨s de France',4,'France',0.80,0.60,'g',0,4,NULL),(5,'Artisanal French Creamy Garlic Dip','MÃ©lange de dip aux aromes et Ã  la crÃ¨me franÃ§aise','Savor the rich flavors of France with our artisanal creamy garlic dip, featuring a blend of fresh herbs and spices.','Savourez les riches saveurs de la France avec notre trempette crÃ©meuse Ã  l\'ail artisanale, composÃ©e d\'un mÃ©lange d\'herbes fraÃ®ches et d\'Ã©pices.','37900123458696','Fromages Artisanales',1,'France',0.60,0.50,'g',0,5,NULL),(6,'French Berry Jam','Confiture de fruits rouges franÃ§ais','Enjoy the sweetness of France with our French berry jam, featuring a blend of juicy fruits.','ApprÃ©ciez la douceur de la France avec notre confiture de baies franÃ§aises, composÃ©e d\'un mÃ©lange de fruits juteux.','37900123458713','Jams de France',2,'France',0.70,0.55,'g',0,6,NULL),(7,'Artisanal French Feta Cheese','Fromage feta artisanale franÃ§ais','Savor the rich flavors of Greece in France with our artisanal feta cheese, featuring a blend of creamy milk and herbs.','Savourez les riches saveurs de la GrÃ¨ce en France avec notre fromage feta artisanal, composÃ© d\'un mÃ©lange de lait crÃ©meux et d\'herbes.','37900123458830','Fromages Artisanales',3,'France',1.00,0.85,'g',0,7,NULL),(8,'French Herb and Garlic Sausages','Saucisses aux herbes et Ã  l\'ail franÃ§ais','Indulge in the rich flavors of France with our French herb and garlic sausages, featuring a blend of fragrant herbs and spices.','Laissez-vous tenter par les riches saveurs de la France avec nos saucisses franÃ§aises aux herbes et Ã  l\'ail, composÃ©es d\'un mÃ©lange d\'herbes parfumÃ©es et d\'Ã©pices.','37900123458947','Charcuterie de France',4,'France',1.20,0.90,'g',0,1,NULL),(9,'French Apple Tart','Tarte tatin aux pommes franÃ§aise','Enjoy the sweetness of France with our French apple tart, featuring a blend of juicy fruits and creamy pastry.','Savourez la douceur de la France avec notre tarte aux pommes franÃ§aise, composÃ©e d\'un mÃ©lange de fruits juteux et de pÃ¢tisserie crÃ©meuse.','37900123459064','PÃ¢tisseries Artisanales',1,'France',1.00,0.85,'g',0,2,NULL),(10,'Artisanal French Cream Cheese','Fromage Ã  la crÃ¨me artisanale franÃ§ais','Savor the rich flavors of France with our artisanal cream cheese, featuring a blend of creamy milk and herbs.','Savourez les riches saveurs de la France avec notre fromage Ã  la crÃ¨me artisanal, composÃ© d\'un mÃ©lange de lait crÃ©meux et d\'herbes.','37900123459171','Fromages Artisanales',2,'France',0.60,0.50,'g',0,3,NULL),(11,'French Herb and Lemon Marmalade','Marmelade aux herbes et au citron franÃ§ais','Enjoy the sweetness of France with our French herb and lemon marmalade, featuring a blend of fragrant herbs and citrus.','Savourez la douceur de la France avec notre marmelade d\'herbes et de citron franÃ§aise, composÃ©e d\'un mÃ©lange d\'herbes parfumÃ©es et d\'agrumes.','37900123459288','Jams de France',3,'France',0.70,0.55,'g',0,4,NULL),(12,'Artisanal French Goat Cheese','Fromage chÃ¨vre artisanale franÃ§ais','Savor the rich flavors of France with our artisanal goat cheese, featuring a blend of creamy milk and herbs.','Savourez les riches saveurs de la France avec notre fromage de chÃ¨vre artisanal, composÃ© d\'un mÃ©lange de lait crÃ©meux et d\'herbes.','37900123459395','Fromages Artisanales',4,'France',1.00,0.85,'g',0,5,NULL),(13,'French Apple Cider','Cidre aux pommes franÃ§ais','Enjoy the sweetness of France with our French apple cider, featuring a blend of juicy fruits and spices.','Savourez la douceur de la France avec notre cidre de pomme franÃ§ais, composÃ© d\'un mÃ©lange de fruits juteux et d\'Ã©pices.','37900123459412','Bieres de France',1,'France',0.80,0.60,'g',0,6,NULL),(14,'Artisanal French Creamy Cheese Dip','MÃ©lange de dip Ã  la crÃ¨me franÃ§aise','Savor the rich flavors of France with our artisanal creamy cheese dip, featuring a blend of fresh herbs and spices.','Savourez les riches saveurs de la France avec notre trempette au fromage crÃ©meuse artisanale, composÃ©e d\'un mÃ©lange d\'herbes fraÃ®ches et d\'Ã©pices.','37900123459529','Fromages Artisanales',2,'France',0.60,0.50,'g',0,7,NULL),(15,'French Herb and Garlic Sauce','Sauce aux herbes et Ã  l\'ail franÃ§aise','Enjoy the richness of France with our French herb and garlic sauce, featuring a blend of fragrant herbs and spices.','Savourez la richesse de la France avec notre sauce aux herbes et Ã  l\'ail franÃ§aise, composÃ©e d\'un mÃ©lange d\'herbes parfumÃ©es et d\'Ã©pices.','37900123459646','Charcuterie de France',3,'France',1.00,0.85,'g',0,1,NULL),(16,'Artisanal French Cream Cheese Spread','Fromage Ã  la crÃ¨me artisanale franÃ§aise pour tartiner','Savor the rich flavors of France with our artisanal cream cheese spread, featuring a blend of creamy milk and herbs.','Savourez les riches saveurs de la France avec notre tartinade de fromage Ã  la crÃ¨me artisanale, composÃ©e d\'un mÃ©lange de lait crÃ©meux et d\'herbes.','37900123459763','Fromages Artisanales',4,'France',0.60,0.50,'g',0,2,NULL),(17,'French Apple Compote','Compote de pommes franÃ§aise','Enjoy the sweetness of France with our French apple compote, featuring a blend of juicy fruits and spices.','Savourez la douceur de la France avec notre compote de pommes franÃ§aise, composÃ©e d\'un mÃ©lange de fruits juteux et d\'Ã©pices.','37900123459870','DessertÃ¨s de France',1,'France',0.70,0.55,'g',0,3,NULL),(18,'Eco-Friendly Reusable Water Bottle','Bouteille d\'eau rÃ©utilisable et Ã©cologique','Stay hydrated and reduce plastic waste with our eco-friendly reusable water bottle, featuring a BPA-free design.','Restez hydratÃ© et rÃ©duisez les dÃ©chets plastiques avec notre bouteille d\'eau rÃ©utilisable respectueuse de l\'environnement, dotÃ©e d\'une conception sans BPA.','37900234567890','HydroFlow',2,'USA',0.30,0.20,'g',0,4,NULL),(19,'Artisanal Handmade Soap Set','Ensemble de savons artisanaux faits Ã  la main','Nourish your skin with our artisanal handmade soap set, featuring a blend of natural ingredients and essential oils.','Nourrissez votre peau avec notre ensemble de savons artisanaux faits Ã  la main, contenant un mÃ©lange d\'ingrÃ©dients naturels et d\'huiles essentielles.','37900234567907','Purezza',3,'Italy',0.60,0.50,'g',0,5,NULL),(20,'French Luxury Candles Set','Ensemble de bougies de luxe franÃ§aises','Illuminate your space with our French luxury candles set, featuring a collection of scented candles in elegant packaging.','Illuminez votre espace avec notre coffret de bougies de luxe franÃ§aises, comprenant une collection de bougies parfumÃ©es dans un emballage Ã©lÃ©gant.','37900234568024','Cierges de France',4,'France',1.00,0.85,'g',0,6,NULL),(21,'Eco-Friendly Bamboo Toothbrush Set','Ensemble de brosses Ã  dents en bambou Ã©cologiques','Brush your teeth and reduce waste with our eco-friendly bamboo toothbrush set, featuring a set of biodegradable toothbrushes and replaceable heads.','Brossez-vous les dents et rÃ©duisez les dÃ©chets avec notre ensemble de brosses Ã  dents en bambou respectueux de l\'environnement, comprenant un ensemble de brosses Ã  dents biodÃ©gradables et des tÃªtes remplaÃ§ables.','37900234568141','Teeth & Smile',1,'Indonesia',0.20,0.10,'g',0,7,NULL),(22,'Artisanal Handmade Jewelry Box','Coffret Ã  bijoux artisanal fait Ã  la main','Store your treasured jewelry in style with our artisanal handmade jewelry box, featuring a beautifully crafted wooden design.','Rangez vos prÃ©cieux bijoux avec style grÃ¢ce Ã  notre boÃ®te Ã  bijoux artisanale faite Ã  la main, dotÃ©e d\'un design en bois magnifiquement conÃ§u.','37900234568258','JewelBox',2,'Mexico',0.50,0.40,'g',0,1,NULL),(23,'Luxury Essential Oil Diffuser','Diffuseur d\'huiles essentielles de luxe','Pamper yourself with the scent of luxury essential oils using our luxury essential oil diffuser, featuring a stylish and modern design.','Faites-vous plaisir avec le parfum des huiles essentielles de luxe en utilisant notre diffuseur d\'huiles essentielles de luxe, dotÃ© d\'un design Ã©lÃ©gant et moderne.','37900234568375','Aromaflo',3,'Australia',1.00,0.85,'g',0,2,NULL),(24,'Eco-Friendly Reusable Shopping Bag Set','Ensemble de sacs de courses rÃ©utilisables et Ã©cologiques','Reduce plastic waste and go green with our eco-friendly reusable shopping bag set, featuring a set of durable cotton bags and recycled material handles.','RÃ©duisez les dÃ©chets plastiques et passez au vert avec notre ensemble de sacs de courses rÃ©utilisables respectueux de l\'environnement, comprenant un ensemble de sacs en coton durables et des poignÃ©es en matÃ©riaux recyclÃ©s.','37900234568492','GreenEarth',4,'UK',0.50,0.40,'g',0,3,NULL),(25,'Artisanal Handmade Home Fragrance Spray','Spray de parfum d\'ambiance artisanal fait Ã  la main','Freshen up your home with our artisanal handmade home fragrance spray, featuring a blend of natural ingredients and essential oils.','RafraÃ®chissez votre maison avec notre spray parfumÃ© d\'intÃ©rieur artisanal fait Ã  la main, contenant un mÃ©lange d\'ingrÃ©dients naturels et d\'huiles essentielles.','37900234568509','Purezza',1,'Italy',0.20,0.10,'g',0,4,NULL),(26,'French Luxury Aromatherapy Set','Ensemble d\'aromathÃ©rapie de luxe franÃ§ais','Pamper yourself with the scent of luxury aromatherapy using our French luxury aromatherapy set, featuring a collection of scented candles and essential oils.','Faites-vous plaisir avec le parfum de l\'aromathÃ©rapie de luxe grÃ¢ce Ã  notre coffret d\'aromathÃ©rapie de luxe franÃ§ais, comprenant une collection de bougies parfumÃ©es et d\'huiles essentielles.','37900234568626','Cierges de France',2,'France',1.00,0.85,'g',0,5,NULL),(27,'Eco-Friendly Reusable Lunch Box Set','Ensemble de boÃ®tes Ã  lunch rÃ©utilisables et Ã©cologiques','Pack your lunch in style and reduce waste with our eco-friendly reusable lunch box set, featuring a set of durable cotton bags and recycled material handles.','Emballez votre dÃ©jeuner avec style et rÃ©duisez les dÃ©chets grÃ¢ce Ã  notre coffret Ã  lunch rÃ©utilisable respectueux de l\'environnement, comprenant un ensemble de sacs en coton durables et des poignÃ©es en matÃ©riaux recyclÃ©s.','37900234568733','GreenEarth',3,'UK',0.50,0.40,'g',0,6,NULL),(28,'Artisanal Handmade Stationery Set','Ensemble de papeterie artisanale faite Ã  la main','Stay organized and creative with our artisanal handmade stationery set, featuring a collection of handmade notebooks, pens, and pencils.','Restez organisÃ© et crÃ©atif avec notre ensemble de papeterie artisanale faite Ã  la main, comprenant une collection de cahiers, de stylos et de crayons faits Ã  la main.','37900234568850','PaperCraft',4,'USA',0.30,0.20,'g',0,7,NULL),(29,'Luxury Wall Art Print Set','Ensemble d\'impressions murales de luxe','Add some style to your walls with our luxury wall art print set, featuring a collection of high-quality prints from around the world.','Ajoutez du style Ã  vos murs avec notre ensemble d\'impressions murales de luxe, comprenant une collection d\'impressions de haute qualitÃ© du monde entier.','37900234568967','ArtScene',1,'Canada',1.00,0.85,'g',0,1,NULL),(30,'Eco-Friendly Reusable Phone Case Set','Ensemble de coques de tÃ©lÃ©phone rÃ©utilisables et Ã©cologiques','Protect your phone and reduce waste with our eco-friendly reusable phone case set, featuring a set of durable cotton cases and recycled material inserts.','ProtÃ©gez votre tÃ©lÃ©phone et rÃ©duisez les dÃ©chets avec notre ensemble de coques de tÃ©lÃ©phone rÃ©utilisables respectueuses de l\'environnement, comprenant un ensemble de coques en coton durables et d\'inserts en matÃ©riaux recyclÃ©s.','37900234569084','GreenEarth',2,'UK',0.50,0.40,'g',0,2,NULL),(31,'Artisanal Handmade Bookmarks Set','Ensemble de marque-pages artisanaux faits Ã  la main','Mark your favorite pages in style with our artisanal handmade bookmarks set, featuring a collection of handmade bookmarks and book lights.','Marquez vos pages prÃ©fÃ©rÃ©es avec style avec notre ensemble de marque-pages artisanaux faits Ã  la main, comprenant une collection de marque-pages et de lampes de lecture faits Ã  la main.','37900234569101','PageTurner',3,'Mexico',0.20,0.10,'g',0,3,NULL),(32,'French Luxury Desk Accessory Set','Ensemble d\'accessoires de bureau de luxe franÃ§ais','Elevate your workspace with our French luxury desk accessory set, featuring a collection of scented candles, essential oils, and handmade stationery.','AmÃ©liorez votre espace de travail avec notre ensemble d\'accessoires de bureau de luxe franÃ§ais, comprenant une collection de bougies parfumÃ©es, d\'huiles essentielles et de papeterie faite Ã  la main.','37900234569218','Cierges de France',4,'France',1.00,0.85,'g',0,4,NULL),(33,'Eco-Friendly Reusable Travel Bag Set','Ensemble de sacs de voyage rÃ©utilisables et Ã©cologiques','Travel in style and reduce waste with our eco-friendly reusable travel bag set, featuring a set of durable cotton bags and recycled material handles.','Voyagez avec style et rÃ©duisez les dÃ©chets avec notre ensemble de sacs de voyage rÃ©utilisables respectueux de l\'environnement, comprenant un ensemble de sacs en coton durables et de poignÃ©es en matÃ©riaux recyclÃ©s.','37900234569335','GreenEarth',1,'UK',0.50,0.40,'g',0,5,NULL),(34,'Artisanal Handmade Wall Hanging Set','Ensemble de tentures murales artisanales faites Ã  la main','Add some handmade charm to your walls with our artisanal handmade wall hanging set, featuring a collection of hand-painted ceramics and natural fibers.','Ajoutez un peu de charme artisanal Ã  vos murs avec notre ensemble de tentures murales artisanales faites Ã  la main, comprenant une collection de cÃ©ramiques peintes Ã  la main et de fibres naturelles.','37900234569452','WallDecor',2,'Italy',1.00,0.85,'g',0,6,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `review` varchar(200) DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `product_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_reviews_users1_idx` (`user_id`),
  KEY `fk_reviews_products1_idx` (`product_id`),
  CONSTRAINT `fk_reviews_products1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_reviews_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email_verified_at` timestamp NOT NULL,
  `avatar` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
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

-- Dump completed on 2026-08-18 10:46:02
