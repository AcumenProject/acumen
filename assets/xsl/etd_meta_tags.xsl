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
        xmlns:ns2="http://www.w3.org/1999/xlink"
        exclude-result-prefixes="xsl xs xsi xlink mods etd ns2">
    <!-- Make sure we generate DOCTYPE correctly, or IE8 will render everything incorrectly -->
    <xsl:output
            method="html"
            encoding="utf-8"
            omit-xml-declaration="yes"
            indent="yes"
    />
    <xsl:strip-space elements="*"/>

    <xsl:template match="*|node()">
        <xsl:value-of select="text()"/>
        <xsl:text>&#32;</xsl:text>
        <xsl:apply-templates/>
    </xsl:template>


    <xsl:template match="/">
        <xsl:for-each select=".//mods:mods/mods:titleInfo[not(@*)]">
            <meta name="citation_title">
                <xsl:attribute name="content">
                    <xsl:call-template name="mods-titletext" />
                </xsl:attribute>
            </meta>
        </xsl:for-each>

        <xsl:for-each select=".//mods:mods/mods:name/mods:namePart[following-sibling::mods:role/mods:roleTerm[text()='Author']]">
            <meta name="citation_author">
                <xsl:attribute name="content">
                    <xsl:value-of select="text()"></xsl:value-of>
                </xsl:attribute>
            </meta>
        </xsl:for-each>

        <xsl:for-each select=".//mods:dateIssued">
            <meta name="citation_publication_date">
                <xsl:attribute name="content">
                    <xsl:value-of select="text()"></xsl:value-of>
                </xsl:attribute>
            </meta>
        </xsl:for-each>

        <xsl:for-each select=".//mods:mods/mods:identifier[@type='local']">
            <meta name="citation_pdf_url">
                <xsl:attribute name="content">http://acumen.lib.ua.edu/<xsl:value-of select="translate(text(), '_', '/')"></xsl:value-of>/<xsl:value-of select="text()"></xsl:value-of>.pdf</xsl:attribute>
            </meta>
        </xsl:for-each>

        <xsl:if test=".//mods:subject">
            <meta name="keywords">
                <xsl:attribute name="content">
                    <xsl:for-each select=".//mods:mods/mods:subject">
                        <xsl:value-of select="mods:topic/text()"></xsl:value-of>
                        <xsl:if  test="position()!=last()">
                            <xsl:text>,</xsl:text>
                        </xsl:if>
                    </xsl:for-each>
                </xsl:attribute>
            </meta>
        </xsl:if>

        <meta name="citation_dissertation_institution" content="University of Alabama"></meta>
    </xsl:template>

    <!-- This templates processes titleInfo parts. -->
    <xsl:template name="mods-titletext">
        <xsl:value-of select="mods:nonSort/text()"/>
        <xsl:value-of select="mods:title/text()"/>

        <xsl:if test="mods:subTitle|mods:partName|mods:partNumber">
            <xsl:if test="mods:subTitle">
                <xsl:text>: </xsl:text>
                <xsl:value-of select="mods:subTitle/text()"/>
            </xsl:if>
            <xsl:if test="mods:partName|mods:partNumber">
                <xsl:if test="mods:title|mods:subTitle">
                    <xsl:text>, </xsl:text>
                </xsl:if>
                <xsl:for-each select="mods:partName|mods:partNumber">
                    <xsl:if test="position()>1">
                        <xsl:text>, </xsl:text>
                    </xsl:if>
                    <xsl:value-of select="text()"/>
                </xsl:for-each>
            </xsl:if>
        </xsl:if>
        <xsl:if test="following-sibling::mods:part and not(@*)">
            <xsl:if test="mods:title|mods:subTitle">
                <xsl:text>, </xsl:text>
            </xsl:if>
            <xsl:for-each select="following-sibling::mods:part/child::*">
                <xsl:if test="position()>1">
                    <xsl:text>, </xsl:text>
                </xsl:if>
                <xsl:call-template name="mods-part-detail" />
            </xsl:for-each>
        </xsl:if>
    </xsl:template>

    <!-- The following template places appropriate abbreviations for different partNumber and partName elements -->
    <xsl:template name="mods-part-detail">
        <xsl:choose>
            <xsl:when test="@type">
                <xsl:if test="@type='volume'">
                    <xsl:text>vol. </xsl:text>
                </xsl:if>
                <xsl:if test="@type='issue'">
                    <xsl:text>no. </xsl:text>
                </xsl:if>
                <xsl:if test="@type='issueTitle'">
                    <xsl:text>iss. </xsl:text>
                </xsl:if>
                <xsl:value-of select="child::*/text()"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="text()"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="description">
        <field name="description">
            <xsl:value-of select="text()" />
        </field>
    </xsl:template>
</xsl:stylesheet>