<?xml version="1.0" encoding="UTF-8"?>
<!--
		Copyright (c) 2011, The University of Alabama.
		
		Licensed under the Educational Community License, Version 2.0 (the "License"); you may not 
		use this file except in compliance with the License. You may obtain a copy of the License at
		http://www.osedu.org/licenses/ECL-2.0

		Unless required by applicable law or agreed to in writing, software distributed 
		under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS 
		OF ANY KIND, either express or implied. See the License for the specific language governing
		permissions and limitations under the License.
-->
<xsl:stylesheet 
	version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns:ead="urn:isbn:1-931666-22-9"
	xmlns:mods="http://www.loc.gov/mods/v3"
	xmlns:etd="http://www.ndltd.org/standards/metadata/etdms/1.0/"
>
<xsl:output 
	method="xml" 
	encoding="utf-8"
	indent="no"
/>
<xsl:strip-space elements="*"/>

<xsl:template match="*|node()">
	<xsl:value-of select="text()"/>
	<xsl:text>&#32;</xsl:text>
	<xsl:apply-templates/>
</xsl:template>

<xsl:template match="/">
<oai_dc:dc 
	 xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" 
	 xmlns:dc="http://purl.org/dc/elements/1.1/" 
	 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	 xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ 
	 http://www.openarchives.org/OAI/2.0/oai_dc.xsd">
	<dc:title><xsl:value-of select="collInfo/Digital_Collection_Name/text()"/></dc:title>
	<dc:description><xsl:value-of select="collInfo/Digital_Collection_Description/text()"/></dc:description>
</oai_dc:dc>
</xsl:template>

</xsl:stylesheet>