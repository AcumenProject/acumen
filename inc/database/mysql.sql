-- Adminer 4.2.5 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `asset`;
CREATE TABLE `asset` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `asset_type_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'file name, which should be unique',
  `orig_path` varchar(255) NOT NULL COMMENT 'where we found the original digital asset',
  `thumb_path` varchar(255) NOT NULL COMMENT 'where we found (or created) a smaller copy of the asset for distribution and/or previews',
  `file_id` bigint(20) DEFAULT NULL COMMENT 'id of the file to which this asset is believed to be linked -- names should match ',
  `file_size` bigint(20) NOT NULL COMMENT 'Secondary method of determining if file changed since we last checked it, probably also useful information if itself.',
  `file_last_modified` bigint(20) NOT NULL COMMENT 'Primary method of telling if the file has changed since we lasted looked at it.',
  `status_type_id` int(11) NOT NULL COMMENT 'Indicates the current status of the file.',
  `found` smallint(5) unsigned NOT NULL COMMENT 'Marked false at start of scan and true when found',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `type` (`file_id`),
  KEY `status_type_id` (`status_type_id`),
  KEY `found` (`found`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `asset_type`;
CREATE TABLE `asset_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(20) NOT NULL COMMENT 'E.g. text, image, photograph, audio, video',
  `asset_tails` varchar(255) NOT NULL COMMENT 'Comma-delimited list of file name tails (e.g. ".jpg" or "_512.jpg" for assets of this type.',
  `thumb_tails` varchar(255) NOT NULL COMMENT 'Comma delimited list of file name tails for thumbnails of files of this type',
  `parent_folder` varchar(255) DEFAULT NULL COMMENT 'regular expression parent folder''s name is required to match',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `authority`;
CREATE TABLE `authority` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `file_id` bigint(20) NOT NULL COMMENT 'file which this authority describes',
  `asset_id` bigint(20) DEFAULT NULL COMMENT 'Optional link to asset for assets which have associated metadata (e.g. transcripts)',
  `authority_type_id` int(11) NOT NULL,
  `value` text NOT NULL COMMENT 'content -- effectively the "value" of this authority',
  PRIMARY KEY (`id`),
  KEY `file_id` (`file_id`),
  KEY `authority_type_id` (`authority_type_id`),
  KEY `asset_id` (`asset_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `authority_type`;
CREATE TABLE `authority_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `type` varchar(20) NOT NULL COMMENT 'e.g. author, title, source',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `featured`;
CREATE TABLE `featured` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Auto increment table ID ',
  `link` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Acumen link to the collection or item',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Short description or title',
  `thumbnail` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'URI path to the thumbnail',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


DROP TABLE IF EXISTS `file`;
CREATE TABLE `file` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `parent_id` bigint(11) DEFAULT NULL COMMENT 'Parent (containing) file, if any',
  `file_type_id` int(11) NOT NULL COMMENT 'What kind of file is it?',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'this duplicates the title authority and is redundant but (possibly) convenient',
  `file_name` varchar(255) NOT NULL COMMENT 'file name, which should be unique',
  `file_path` varchar(255) NOT NULL COMMENT 'where we found the file',
  `file_size` int(11) NOT NULL COMMENT 'size of the file when we last checked it, in bytes. Secondary method of determining if a file has changed since we last scanned it.',
  `file_last_modified` bigint(11) NOT NULL COMMENT 'When the file was last modified (when we last scanned it) -- UNIX time stamp converted to a bigint. Primary method of determining if a file has changed since we last looked at it.',
  `status_type_id` int(11) NOT NULL COMMENT 'Indicates the current status of the file.',
  `found` smallint(5) unsigned NOT NULL COMMENT 'Marked false at start of scan and true when found',
  PRIMARY KEY (`id`),
  KEY `title` (`title`),
  KEY `file_name` (`file_name`),
  KEY `status_type_id` (`status_type_id`),
  KEY `parent_id` (`parent_id`),
  KEY `found` (`found`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `file_type`;
CREATE TABLE `file_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `priority` tinyint(4) DEFAULT NULL COMMENT 'Priority for indexing in case of multiple metadata files in one location. NULL values for non-parent metadata (i.e., tags, transcripts...etc).',
  `extension` varchar(16) NOT NULL COMMENT 'File extension for metadata type',
  `type` varchar(10) NOT NULL COMMENT 'This is the file type (e.g. EAD or METS)',
  `signature` varchar(255) NOT NULL COMMENT 'regular expression which, if it matches a file identifies is as being of this type',
  `summary_xsl` varchar(50) NOT NULL COMMENT 'The name of the vendor XSL file that creates a summary of this kind of file',
  `render_xsl` varchar(50) NOT NULL COMMENT 'The name of the xsl file that renders this kind of file',
  `stylesheet_insertion_point` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `status_type`;
CREATE TABLE `status_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `type` (`type`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `value` (`value`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `tags_assets`;
CREATE TABLE `tags_assets` (
  `tag_id` int(10) unsigned NOT NULL,
  `asset_name` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL,
  KEY `tag_id` (`tag_id`),
  KEY `asset_id` (`asset_name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `transcripts`;
CREATE TABLE `transcripts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `asset_name` varchar(255) NOT NULL,
  `status` tinyint(3) NOT NULL,
  `value` blob NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `asset_id` (`asset_name`),
  KEY `status` (`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


-- 2016-07-12 21:39:14
