<?xml version="1.0" encoding="UTF-8"?>
<!-- Copyright (c) 2011, The University of Alabama. Licensed under the Educational Community License, 
	Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may 
	obtain a copy of the License at http://www.osedu.org/licenses/ECL-2.0 Unless required by applicable law 
	or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT 
	WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language 
	governing permissions and limitations under the License. -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:ead="urn:isbn:1-931666-22-9">
    <xsl:output method="xml" encoding="utf-8" indent="no" />
    <xsl:strip-space elements="*" />

    <xsl:template match="*|node()">
        <xsl:value-of select="text()" />
        <xsl:text>&#32;</xsl:text>
        <xsl:apply-templates />
    </xsl:template>

    <xsl:template match="/">
        <add>
            <doc>
                <field name="title">
                    <xsl:value-of select=".//ead:titleproper" />
                </field>

                <field name="description">
                    <xsl:value-of select=".//ead:scopecontent/ead:p/text()"/>
                </field>

                <field name="description">
                    <xsl:value-of select=".//ead:bioghist/ead:p/text()"/>
                </field>

                <xsl:for-each select=".//ead:origination">
                    <xsl:call-template name="names"/>
                </xsl:for-each>

                <xsl:for-each select=".//ead:persname">
                    <xsl:call-template name="names"/>
                </xsl:for-each>

                <xsl:for-each select=".//ead:corpname">
                    <xsl:call-template name="names"/>
                </xsl:for-each>

                <xsl:for-each select=".//ead:author">
                    <field name="archivist">
                        <xsl:value-of select="text()" />
                    </field>
                </xsl:for-each>

                <xsl:for-each select=".//ead:archdesc[@level='collection']">
                    <field name="collection">
                        <xsl:value-of select="ead:did/ead:unittitle" />
                    </field>
                </xsl:for-each>

                <xsl:for-each select=".//ead:unitdate[@type='inclusive']">
                    <field name="display_date">
                        <xsl:value-of select="text()" />
                    </field>
                </xsl:for-each>

                <xsl:for-each select=".//ead:unitdate">
                    <field name="date">
                        <xsl:value-of select="text()" />
                    </field>
                </xsl:for-each>

                <xsl:for-each select=".//ead:subject[@source='localbroad']">
                    <field name="localbroad">
                        <xsl:value-of select="text()" />
                    </field>
                </xsl:for-each>

                <xsl:for-each select=".//ead:c/ead:did/ead:unittitle">
                    <field name="unit_title">
                        <xsl:value-of select="text()" />
                    </field>
                </xsl:for-each>

                <xsl:for-each select=".//ead/titleproper/ead:num">
                    <field name="collection_number">
                        <xsl:value-of select="text()" />
                    </field>
                </xsl:for-each>

                <xsl:for-each select=".//ead:physloc">
                    <field name="location">
                        <xsl:value-of select="text()" />
                    </field>
                </xsl:for-each>


                <xsl:for-each select=".//ead:controlaccess/ead:subject">
                    <field name="subject">
                        <xsl:value-of select="text()" />
                    </field>
                </xsl:for-each>

                <xsl:for-each select=".//ead:controlaccess/ead:genreform">
                    <field name="genre">
                        <xsl:value-of select="text()" />
                    </field>
                </xsl:for-each>

                <xsl:for-each select=".//ead:controlaccess/ead:geogname">
                    <field name="geog_name">
                        <xsl:value-of select="text()" />
                    </field>
                </xsl:for-each>

                <xsl:for-each select=".//ead:eadheader/ead:eadid[@url]">
                    <field name="_purl">
                        <xsl:value-of select="@url" />
                    </field>
                </xsl:for-each>

                <field name="type">
                    Archived Collection
                </field>


            </doc>
        </add>
    </xsl:template>

    <xsl:template name="names">
        <field name="name">
            <xsl:value-of select="text()" />
        </field>
    </xsl:template>
</xsl:stylesheet>