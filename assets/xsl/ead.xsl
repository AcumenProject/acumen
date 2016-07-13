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
        xmlns:ead="urn:isbn:1-931666-22-9"
        xmlns:ns2="http://www.w3.org/1999/xlink"
        >
    <xsl:output
            method="html"
            encoding="utf-8"
            doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"
            doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"
            indent="yes"
            />

    <!-- xsl:include href="../render_template.xsl.php"/ -->

    <xsl:template name="page-title">
        <xsl:value-of select="//ead:titlestmt/ead:titleproper[not(@type='filing')]"/>
        |
        <xsl:value-of select="//ead:eadid"/>
    </xsl:template>

    <xsl:template name="head-includes">
        <xsl:if test=".//ead:sponsor">
            <script type="text/javascript">
                <xsl:for-each select=".//ead:extptr">
                    <xsl:choose>
                        <xsl:when test="@ns2:role='image/gif'">
                            edu.ua.lib.logo = '<xsl:value-of select=".//@ns2:href" />';
                        </xsl:when>
                        <xsl:when test="@ns2:role='image/jpeg'">
                            edu.ua.lib.logo = '<xsl:value-of select=".//@ns2:href" />';
                        </xsl:when>
                        <xsl:when test="@ns2:role='image/png'">
                            edu.ua.lib.logo = '<xsl:value-of select=".//@ns2:href" />';
                        </xsl:when>
                        <xsl:when test="@ns2:role='text/html'">
                            edu.ua.lib.logo_click_url = '<xsl:value-of select=".//@ns2:href" />';
                        </xsl:when>
                    </xsl:choose>
                </xsl:for-each>
            </script>
        </xsl:if>
    </xsl:template>

    <xsl:template match="ead:eadid">
        <!-- We don't need to process this because it's done in the header -->
    </xsl:template>

    <xsl:template match="ead:emph">
        <xsl:choose>
            <xsl:when test="@render = 'italic'">
                <i>
                    <xsl:apply-templates/>
                </i>
            </xsl:when>
            <xsl:when test="@render = 'bold'">
                <b>
                    <xsl:apply-templates/>
                </b>
            </xsl:when>
            <xsl:otherwise>
                <xsl:apply-templates/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="ead:c|ead:c01|ead:c02">
        <xsl:choose>
            <xsl:when test="@level='series'">
                <h4 class="title-btn">
                    <xsl:for-each select="ead:did">
                        <xsl:call-template name="component-did"/>
                    </xsl:for-each>
                    <xsl:call-template name="c-link"/>
                </h4>
                <div class="initiallyVisible">
                    <xsl:for-each select="ead:scopecontent">
                        <xsl:apply-templates/>
                    </xsl:for-each>
                    <p class="title-btn">
                        <i>Components in Detail</i>
                    </p>
                    <div class="initiallyHidden">
                        <xsl:apply-templates select="ead:c|ead:c01|ead:c02" />
                    </div>
                </div>
            </xsl:when>
            <xsl:when test="@level='subseries'">
                <div class="indent">
                    <h5 class="title-btn">
                        <xsl:for-each select="ead:did">
                            <xsl:call-template name="component-did"/>
                        </xsl:for-each>
                        <xsl:call-template name="c-link"/>
                    </h5>
                    <xsl:call-template name="c-parts"/>
                </div>
            </xsl:when>
            <xsl:when test="@level='file'">
                <div class="indent">
                    <p class="title-btn">
                        <xsl:for-each select="ead:did">
                            <xsl:call-template name="component-did"/>
                        </xsl:for-each>
                        <xsl:call-template name="c-link"/>
                    </p>
                    <xsl:call-template name="c-parts"/>
                </div>
            </xsl:when>
            <!-- level = item among other thing? -->
            <xsl:otherwise>
                <div class="indent">
                    <p class="title-btn">
                        <xsl:for-each select="ead:did">
                            <xsl:call-template name="component-did"/>
                        </xsl:for-each>
                        <xsl:call-template name="c-link"/>
                    </p>
                </div>
                <xsl:call-template name="c-parts"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="c-parts">
        <xsl:if test="ead:c|ead:c01|ead:c02|ead:scopecontent">
            <div class="initiallyHidden">
                <xsl:for-each select="ead:scopecontent">
                    <xsl:apply-templates/>
                </xsl:for-each>
                <xsl:apply-templates select="ead:c|ead:c01|ead:c02" />
            </div>
        </xsl:if>
    </xsl:template>

    <xsl:template name="c-link">
        <xsl:if test="ead:dao">
            <a href="{ead:dao/@ns2:href}" target="_blank">
                <xsl:value-of select="ead:dao/@ns2:href"/>
            </a>
        </xsl:if>
    </xsl:template>

    <xsl:template name="component-did">
        <xsl:if test="ead:unittitle">
            <xsl:choose>
                <xsl:when test="ead:dao">
                    <a href="{ead:dao/@ns2:href}" target="_blank">
                        <xsl:value-of select="ead:unittitle"/>
                    </a>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="ead:unittitle" />
                </xsl:otherwise>
            </xsl:choose>
            <xsl:text> </xsl:text>
        </xsl:if>
        <xsl:if test="ead:unitid">
            <xsl:value-of select="ead:unitid" />
            <xsl:text> </xsl:text>
        </xsl:if>
        <xsl:if test="ead:origination">
            <xsl:value-of select="ead:origination" />
            <xsl:text> </xsl:text>
        </xsl:if>
        <xsl:if test="ead:physdesc">
            <span class="normal">
                <xsl:value-of select="ead:physdesc" />
            </span>
            <xsl:text> </xsl:text>
        </xsl:if>
        <xsl:if test="count(ead:container) > 0">
            <i>
                <xsl:for-each select="ead:container">
                    <xsl:call-template name="did-container" />
                </xsl:for-each>
            </i>
        </xsl:if>
    </xsl:template>

    <xsl:template name="did-container">
        <xsl:value-of select="@type" />
        <xsl:text> </xsl:text>
        <xsl:value-of select="text()" />
        <xsl:text> </xsl:text>
    </xsl:template>

    <!-- Blocks with [usually fixed] headings and indents -->
    <xsl:template name="definition-term-body">
        <xsl:param name="term"/>
        <dl>
            <dt>
                <xsl:value-of select="$term"/>
            </dt>
            <dd>
                <xsl:choose>
                    <xsl:when test=".//p">
                        <xsl:apply-templates/>
                    </xsl:when>
                    <xsl:otherwise>
                        <p>
                            <xsl:apply-templates/>
                        </p>
                    </xsl:otherwise>
                </xsl:choose>
            </dd>
        </dl>
    </xsl:template>

    <xsl:template match="ead:arrangement">
        <xsl:call-template name="definition-term-body">
            <xsl:with-param name="term">
                Arrangment:
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="ead:physloc">
        <xsl:call-template name="definition-term-body">
            <xsl:with-param name="term">
                Location:
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="ead:unittitle">
        <xsl:call-template name="definition-term-body">
            <xsl:with-param name="term">
                Collection Title:
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="ead:accessrestrict">
        <xsl:call-template name="definition-term-body">
            <xsl:with-param name="term">
                Access Restrictions:
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="ead:acqinfo">
        <xsl:call-template name="definition-term-body">
            <xsl:with-param name="term">
                Acquisition Information:
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="ead:userestrict">
        <xsl:call-template name="definition-term-body">
            <xsl:with-param name="term">
                Usage Restrictions:
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="ead:prefercite">
        <xsl:call-template name="definition-term-body">
            <xsl:with-param name="term">
                Preferred Citation:
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="ead:processinfo">
        <xsl:call-template name="definition-term-body">
            <xsl:with-param name="term">
                Processing Information:
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="ead:author">
        <xsl:call-template name="definition-term-body">
            <xsl:with-param name="term">
                Author:
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="ead:sponsor">
        <xsl:call-template name="definition-term-body">
            <xsl:with-param name="term">
                Sponsor:
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="ead:publicationstmt">
        <xsl:call-template name="definition-term-body">
            <xsl:with-param name="term">
                Publication:
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="ead:creation">
        <xsl:call-template name="definition-term-body">
            <xsl:with-param name="term">
                Creation:
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="ead:defitem">
        <!-- doesn't quite match definition-term-body -->
        <dl>
            <dt>
                <xsl:value-of select="ead:label" />
            </dt>
            <dd>
                <xsl:apply-templates select="ead:item" />
            </dd>
        </dl>
    </xsl:template>

    <xsl:template match="ead:langusage">
        <xsl:call-template name="definition-term-body">
            <xsl:with-param name="term">
                Language Usage:
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="ead:langmaterial">
        <xsl:if test="@label != ''">
            <xsl:call-template name="definition-term-body">
                <xsl:with-param name="term">
                    <xsl:value-of select=".//@label" />
                </xsl:with-param>
            </xsl:call-template>
        </xsl:if>
    </xsl:template>

    <xsl:template match="ead:descrules">
        <xsl:call-template name="definition-term-body">
            <xsl:with-param name="term">
                Description Rules:
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="ead:unitid">
        <xsl:call-template name="definition-term-body">
            <xsl:with-param name="term">
                Unit ID:
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="ead:origination">
        <xsl:call-template name="definition-term-body">
            <xsl:with-param name="term">
                <xsl:value-of select="@label"/>
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="ead:repository">
        <xsl:call-template name="definition-term-body">
            <xsl:with-param name="term">
                Repository:
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="ead:abstract">
        <xsl:if test="string-length(.)&gt;0">
            <xsl:call-template name="definition-term-body">
                <xsl:with-param name="term">
                    Abstract:
                </xsl:with-param>
            </xsl:call-template>
        </xsl:if>
    </xsl:template>

    <xsl:template match="ead:unitdate">
        <xsl:call-template name="definition-term-body">
            <xsl:with-param name="term">
                Dates:
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="ead:physdesc">
        <xsl:if test="string-length(.)>0">
            <xsl:choose>
                <xsl:when test="@label != ''">
                    <xsl:call-template name="definition-term-body">
                        <xsl:with-param name="term">
                            <xsl:value-of select=".//@label" />
                        </xsl:with-param>
                    </xsl:call-template>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:call-template name="definition-term-body">
                        <xsl:with-param name="term">
                            Quantity:
                        </xsl:with-param>
                    </xsl:call-template>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:if>
    </xsl:template>

    <!-- Containers -->
    <xsl:template match="ead:address">
        <p>
            <xsl:apply-templates/>
        </p>
    </xsl:template>

    <!-- Line Items -->
    <xsl:template match="ead:addressline">
        <xsl:value-of select="text()"/><br />
    </xsl:template>

    <xsl:template match="ead:list">
        <xsl:apply-templates/>
    </xsl:template>

    <!-- collapsibles -->

    <xsl:template match="ead:scopecontent
					|ead:custodhist
					|ead:bioghist
					|ead:odd">
        <xsl:choose>
            <xsl:when test="count(*)>1">
                <xsl:apply-templates select="*[position() = 1]"/>
                <div class="initiallyHidden">
                    <xsl:apply-templates select="*[position() &gt; 1]"/>
                </div>
            </xsl:when>
            <xsl:otherwise>
                <xsl:apply-templates />
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <!--
    <xsl:template match="ead:descgrp">
        <h3>Description</h3>
        <div class="initiallyHidden">
            <xsl:apply-templates/>
        </div>
    </xsl:template>
    -->

    <xsl:template match="ead:controlaccess">
        <h3 class="title-btn">Source(s)</h3>
        <div class="initiallyHidden">
            <xsl:apply-templates/>
        </div>
    </xsl:template>

    <xsl:template match="ead:controlaccess/*">
        <p>
            <xsl:value-of select="."/>
            <xsl:if test="@source">
                <i>
                    <xsl:text> (</xsl:text>
                    <xsl:value-of select="@source"/>
                    <xsl:text>)</xsl:text>
                </i>
            </xsl:if>
        </p>
    </xsl:template>

    <!-- Headings -->

    <!--xsl:template match="ead:unittitle">
        <h4>
            <xsl:value-of select="text()" />
        </h4>
    </xsl:template-->

    <xsl:template match="ead:head|ead:titleproper[not(@type='filing')]">
        <xsl:if test="name(..)!='arrangement' and name(..)!='accessrestrict' and name(..)!='userestrict' and name(..)!='acqinfo' and name(..)!='prefercite'">
            <h4 class="title-btn">
                <xsl:value-of select="text()"/>
                <span class="normal">
                    <xsl:text> </xsl:text>
                    <xsl:apply-templates select="*"/>
                </span>
            </h4>
        </xsl:if>
    </xsl:template>

    <xsl:template match="ead:titlestmt/ead:titleproper">
        <xsl:if test="not(@type='filing')">
                <h1 class="page-title hidden">
                    <xsl:value-of select="text()"/>
                    <span class="normal">
                        <xsl:text> </xsl:text>
                        <xsl:apply-templates select="*"/>
                    </span>
                </h1>
        </xsl:if>
    </xsl:template>

    <xsl:template match="ead:publisher">
        <h5>
            <xsl:apply-templates/>
        </h5>
    </xsl:template>

    <xsl:template match="ead:p">
        <p>
            <xsl:apply-templates/>
        </p>
    </xsl:template>

</xsl:stylesheet>