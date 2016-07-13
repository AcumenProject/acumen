<?xml version="1.0" encoding="UTF-8"?>
<!--
		Copyright (c) 2015, The University of Alabama.
		
		Licensed under the Educational Community License, Version 2.0 (the "License"); you may not 
		use this file except in compliance with the License. You may obtain a copy of the License at
		http://www.osedu.org/licenses/ECL-2.0

		Unless required by applicable law or agreed to in writing, software distributed 
		under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS 
		OF ANY KIND, either express or implied. See the License for the specific language governing
		permissions and limitations under the License.
-->
<!--Created by KM 2015-->

<xsl:stylesheet
        version="1.0"
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
        xmlns:xs="http://www.w3.org/2001/XMLSchema"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xmlns:ead="urn:isbn:1-931666-22-9"
        xsi:schemaLocation="urn:isbn:1-931666-22-9 http://www.loc.gov/ead/ead.xsd"  xmlns="urn:isbn:1-931666-22-9">

    <xsl:output method="xml" encoding="utf-8" indent="no"/>

    <xsl:strip-space elements="*"/>

    <xsl:template match="//ead:ead">
        <oai_dc:dc
                xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/"
                xmlns:dc="http://purl.org/dc/elements/1.1/"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/
	 http://www.openarchives.org/OAI/2.0/oai_dc.xsd">
            <xsl:for-each select="ead:archdesc/ead:did">
                <dc:title>
                    <xsl:for-each select="ead:unittitle">
                        <xsl:value-of select="."/>
                    </xsl:for-each>
                    <xsl:text>, </xsl:text>
                    <xsl:for-each select="ead:unitid">
                        <xsl:value-of select="."/>
                    </xsl:for-each>
                </dc:title>
            </xsl:for-each>
            <xsl:for-each select="ead:archdesc/ead:did/ead:origination[@label='creator']/*">
                <dc:creator>
                    <xsl:value-of select="."/>
                </dc:creator>
            </xsl:for-each>
            <xsl:for-each select="ead:archdesc/ead:controlaccess/*[@source='aat'] | ead:archdesc/ead:controlaccess/*[@source='lcsh']">
                <dc:subject>
                    <xsl:value-of select="."/>
                </dc:subject>
            </xsl:for-each>
            <xsl:for-each select="ead:archdesc/ead:did/ead:abstract">
                <dc:description>Abstract: <xsl:value-of select="."/>
                </dc:description>
            </xsl:for-each>
            <dc:description>Scope and Content Note: <xsl:for-each select="ead:archdesc/ead:scopecontent/ead:p">
                <xsl:value-of select="."/>
            </xsl:for-each>
            </dc:description>
            <dc:description> Biographical/Historical Note: <xsl:for-each select="ead:archdesc/ead:bioghist/ead:p">
                <xsl:value-of select="."/>
            </xsl:for-each>
            </dc:description>
            <xsl:for-each select="ead:archdesc/ead:did/ead:repository/ead:corpname">
                <dc:publisher>
                    <xsl:value-of select="."/>
                </dc:publisher>
            </xsl:for-each>
            <xsl:for-each select="ead:archdesc/ead:did/ead:unitdate[@type='inclusive']">
                <dc:date>
                    <xsl:value-of select="."/>
                </dc:date>
            </xsl:for-each>
            <dc:type>Collection</dc:type>
            <xsl:for-each select="ead:eadheader/ead:eadid">
                <dc:identifier>
                    <xsl:value-of select="@url | @URL"/>
                </dc:identifier>
            </xsl:for-each>
            <xsl:if test="//ead:language[@langcode='eng']">
                <dc:language>English</dc:language>
            </xsl:if>
        </oai_dc:dc>
    </xsl:template>
</xsl:stylesheet>