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
	xmlns:mods="http://www.loc.gov/mods/v3"
	xmlns:etd="http://www.ndltd.org/standards/metadata/etdms/1.0/"
>
<xsl:output 
	method="xml" 
	encoding="utf-8"
	indent="no"
/>
<xsl:strip-space elements="*"/>

<xsl:template name="mods-subject">
	<xsl:for-each select="mods:topic|mods:geographic|mods:name|mods:genre|mods:temporal|mods:occupation|mods:titleInfo">
		<xsl:call-template name="mods-subject-parts" />
	</xsl:for-each>
</xsl:template>

<xsl:template name="mods-subject-parts">
	<xsl:if test="position()>1">
		<xsl:text> -- </xsl:text>
	</xsl:if>
	<xsl:apply-templates />
</xsl:template>

<xsl:template match="mods:namePart">
	<xsl:call-template name="mods-namePart" />
</xsl:template>

<xsl:template name="mods-namePart">
	<xsl:if test="@type">
		<xsl:text>, </xsl:text>
	</xsl:if>
	<xsl:value-of select="text()" />
</xsl:template>

<xsl:template match="/mods:modsCollection/mods:mods|/mods:mods">
<oai_dc:dc 
	 xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" 
	 xmlns:dc="http://purl.org/dc/elements/1.1/" 
	 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	 xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ 
	 http://www.openarchives.org/OAI/2.0/oai_dc.xsd">
	<xsl:for-each select="mods:titleInfo">
		<dc:title>
			<xsl:value-of select="mods:nonSort/text()"/>
			<xsl:value-of select="mods:title/text()"/>
			<xsl:if test="mods:subTitle/text()">: 
				<xsl:value-of select="mods:subTitle/text()"/>
			</xsl:if>
		</dc:title>
	</xsl:for-each>	
	<xsl:for-each select="mods:name">
		<xsl:for-each select="mods:role/mods:roleTerm">
			<xsl:if test="@type = 'text'">
				<xsl:choose>
					<!-- See http://www.loc.gov/marc/relators/relacode.html -->
					<xsl:when test="contains('Funder Donor Sponsor Distributor',normalize-space(text()))">
						<!-- omit from OAI output -->
					</xsl:when>
					<!-- the following are treated as contributors -->
					<xsl:when test="contains('Recipient Editor Contributor Performer Interviewer Advisor Committee Member',normalize-space(text()))">
						<dc:contributor>
							<xsl:for-each select="../../mods:namePart">
								<xsl:call-template name="mods-namePart" />
							</xsl:for-each>
						</dc:contributor>
					</xsl:when>
					<!-- anything else is treated as a creator -->
					<xsl:otherwise>
						<dc:creator>
							<xsl:for-each select="../../mods:namePart">
								<xsl:call-template name="mods-namePart" />
							</xsl:for-each>
						</dc:creator>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:if>
		</xsl:for-each>
	</xsl:for-each>
	<xsl:for-each select="mods:genre">
		<dc:subject><xsl:call-template name="mods-subject-parts" /></dc:subject>
	</xsl:for-each>
	<xsl:for-each select="mods:subject">
		<dc:subject><xsl:call-template name="mods-subject" /></dc:subject>
	</xsl:for-each>
	<xsl:if test="mods:abstract | mods:note[@displayLabel='Description'] | mods:originInfo/mods:publisher">
		<dc:description>
			<xsl:if test="mods:abstract">
				<xsl:value-of select="mods:abstract/text()"/>
			</xsl:if>	
			<xsl:if test="not(mods:abstract)">
				<xsl:value-of select="mods:note[@displayLabel='Description']/text()"/>
			</xsl:if>
			<xsl:if test="mods:originInfo/mods:publisher">
				<xsl:text> (Published By </xsl:text>
				<xsl:value-of select="mods:originInfo/mods:publisher/text()"/>
				<xsl:text>)</xsl:text>
			</xsl:if>
		</dc:description>
	</xsl:if>
	<xsl:if test="mods:originInfo/mods:dateCreated | mods:originInfo/mods:dateIssued | mods:originInfo/mods:dateOther">
		<dc:date>
			<xsl:for-each select="mods:originInfo/mods:dateCreated | mods:originInfo/mods:dateIssued | mods:originInfo/mods:dateOther">
				<xsl:value-of select="text()" />
				<xsl:choose>
					<xsl:when test="@point='start'">
						<xsl:text>–</xsl:text>
					</xsl:when>
					<xsl:otherwise>
						<!-- nothing -->
					</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>
		</dc:date>
	</xsl:if>
	<xsl:for-each select="mods:physicalDescription/mods:internetMediaType|mods:physicalDescription/mods:extent">
		<dc:format><xsl:value-of select="text()" /></dc:format>
	</xsl:for-each>
	<xsl:for-each select="mods:identifier[@type='local']">
		<dc:identifier><xsl:value-of select="text()" /></dc:identifier>
	</xsl:for-each>
	<xsl:for-each select="mods:identifier[@type='uri']">
    <dc:identifier><xsl:value-of select="text()" /></dc:identifier>
  </xsl:for-each>
	<xsl:for-each select="mods:language/mods:languageTerm[@type='text']">
		<dc:language><xsl:value-of select="text()"/></dc:language>
	</xsl:for-each>
	<xsl:if test="mods:location/mods:physicalLocation[@displayLabel='Repository Collection']|mods:location/mods:physicalLocation[@displayLabel='Repository']">
		<dc:relation>
			<xsl:if test="mods:location/mods:physicalLocation[@displayLabel='Repository Collection']">
				<xsl:value-of select="mods:location/mods:physicalLocation[@displayLabel='Repository Collection']/text()" />
				<xsl:if test="mods:location/mods:physicalLocation[@displayLabel='Repository']">
					<xsl:text>, </xsl:text>
				</xsl:if>
			</xsl:if>
			<xsl:if test="mods:location/mods:physicalLocation[@displayLabel='Repository']">
				<xsl:value-of select="mods:location/mods:physicalLocation[@displayLabel='Repository']/text()" />
			</xsl:if>
		</dc:relation>
	</xsl:if>
	<xsl:for-each select="mods:typeOfResource">
		<dc:type><xsl:value-of select="text()"/></dc:type>
	</xsl:for-each>
	<xsl:for-each select="mods:accessCondition">
		<dc:rights><xsl:value-of select="text()"/></dc:rights>
	</xsl:for-each>
</oai_dc:dc>
</xsl:template>

</xsl:stylesheet>