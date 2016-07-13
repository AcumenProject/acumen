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
        >
    <!-- Make sure we generate DOCTYPE correctly, or IE8 will render everything incorrectly -->
    <xsl:output
            method="html"
            encoding="utf-8"
            doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"
            doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"
            omit-xml-declaration="yes"
            indent="yes"
            />

    <!--The whole Shebang: This calls the other templates, and also populates the hidden stuff at the bottom
        of the page-->
    <xsl:template match="mods:mods">
        <span itemscope="itemscope" itemtype="http://schema.org/CreativeWork">
            <xsl:call-template name="mods-mainTitle" />

            <xsl:if test="mods:identifier[@type='uri']">
                <dl>
                    <dt class="purl">Permanent URL: <xsl:value-of select="mods:identifier[@type='uri']"/></dt>
                </dl>
            </xsl:if>

            <xsl:call-template name="mods-item-body" />

            <xsl:if test="mods:location/mods:physicalLocation[@displayLabel|@type]|//mods:location/mods:shelfLocator">
                <h3 class="title-btn">Location</h3>
                <dl class="initiallyHidden">
                    <xsl:for-each select=".//mods:location/mods:physicalLocation">
                        <xsl:choose>
                            <xsl:when test="@displayLabel = 'Repository Collection'">
                                <dt>Repository Collection</dt>
                                <dd>
                                    <xsl:choose>
                                        <xsl:when test="@xlink:href">
                                            <a>
                                                <xsl:attribute name="href">
                                                    <xsl:value-of select="@xlink:href" />
                                                </xsl:attribute>
                                                <xsl:value-of select="text()"/>
                                            </a>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <xsl:value-of select="text()"/>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </dd>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:choose>
                                    <xsl:when test="@displayLabel">
                                        <dt>
                                            <xsl:value-of select="@displayLabel"/>
                                        </dt>
                                        <dd>
                                            <xsl:value-of select="text()"/>
                                        </dd>
                                    </xsl:when>
                                    <xsl:when test="@type">
                                        <dt>
                                            <xsl:value-of select="@type"/>
                                        </dt>
                                        <dd>
                                            <xsl:value-of select="text()"/>
                                        </dd>
                                    </xsl:when>
                                </xsl:choose>
                            </xsl:otherwise>
                            <!-- work remains to be done -->
                        </xsl:choose>
                    </xsl:for-each>
                    <xsl:if test=".//mods:location/mods:shelfLocator">
                        <dt>
                            Call Number
                        </dt>
                        <dd>
                            <xsl:value-of select="mods:location/mods:shelfLocator/text()" />
                        </dd>
                    </xsl:if>
                </dl>
            </xsl:if>

            <!--Related Items processing-->
            <xsl:if test="mods:relatedItem">
                <!--Related Items "host" processing. These are put in the 'part of' section-->
                <xsl:if test="mods:relatedItem[@type='host']">
                    <h3 class="title-btn">Part of</h3>
                    <dl class="initiallyHidden">
                        <!--As of 2012-10-25, we're not displaying the 'Virtual Collections' (like Intellectual Underpinnings of the American Civil War), though that my change in the future.
                            This passes anything through that does not have the display label of 'Virtual Collection'.-->
                        <xsl:for-each select="mods:relatedItem[@displayLabel!='Virtual Collection']">
                            <dt>
                                <!-- Selects the display label from the displayLabel attribute-->
                                <xsl:value-of select="@displayLabel"/>
                            </dt>
                            <dd>
                                <!--If a uri identifier is present, the first "xsl:when" puts it in an <a href> link and the processes the title.
                                    If it's not present, then it just processes the title. N.B. There's probably a better way of selecting the
                                    mods:titleInfo for this, but I got lazy and just put a for-each loop. If, for some reason, there's more than
                                    one title in these, then things are probably going to get weird.-->
                                <xsl:choose>
                                    <xsl:when test="mods:identifier[@type='uri']">
                                        <a>
                                            <xsl:attribute name="href">
                                                <xsl:value-of select="mods:identifier[@type='uri']"/>
                                            </xsl:attribute>
                                            <xsl:for-each select="mods:titleInfo">
                                                <xsl:call-template name="mods-titletext"/>
                                            </xsl:for-each>
                                        </a>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:for-each select="mods:titleInfo">
                                            <xsl:call-template name="mods-titletext"/>
                                        </xsl:for-each>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </dd>
                        </xsl:for-each>
                    </dl>
                </xsl:if>
                <xsl:if test="mods:relatedItem[@type='constituent']">
                    <h3 class="title-btn">Constituent Items</h3>
                    <div class="initiallyHidden">
                        <xsl:for-each select="mods:relatedItem">
                            <xsl:if test="@type='constituent'">
                                <xsl:call-template name="mods-subitem-title" />
                                <div class="initiallyHidden">
                                    <xsl:call-template name="mods-item-body" />
                                </div>
                            </xsl:if>
                            <xsl:if test="mods:relatedItem[@type='constituent']">
                                <h4 class="title-btn">Constituent Items</h4>
                                <div class="initiallyHidden">
                                    <xsl:for-each select="mods:relatedItem">
                                        <xsl:if test="@type='constituent'">
                                            <xsl:call-template name="mods-subitem-title" />
                                            <div class="initiallyHidden">
                                                <xsl:call-template name="mods-item-body" />
                                            </div>
                                        </xsl:if>
                                    </xsl:for-each>
                                </div>
                            </xsl:if>
                        </xsl:for-each>
                    </div>
                </xsl:if>
            </xsl:if>

            <xsl:if test="//mods:note[not(@displayLabel='Description')]|//mods:accessCondition|mods:name[descendant::mods:role/mods:roleTerm[@type='text' and (text()='donor' or text()='Donor')]]|mods:name[descendant::mods:role/mods:roleTerm[@type='text' and (text()='Funder' or text()='Distributor')]]">
                <h3 class="title-btn">Additional Information</h3>
                <dl class="initiallyHidden">
                    <xsl:for-each select=".//mods:note">
                        <xsl:if test="@displayLabel != 'Description'">
                            <dt>
                                <xsl:value-of select="@displayLabel"/>
                            </dt>
                            <dd>
                                <xsl:value-of select="text()"/>
                            </dd>
                        </xsl:if>
                    </xsl:for-each>
                    <xsl:if test=".//mods:accessCondition/text()">
                        <xsl:choose>
                            <xsl:when test="count(.//mods:accessCondition/text())=1">
                                <dt>Access Condition</dt>
                            </xsl:when>
                            <xsl:otherwise>
                                <dt>Access Conditions</dt>
                            </xsl:otherwise>
                        </xsl:choose>
                        <dd>
                            <ul>
                                <xsl:for-each select=".//mods:accessCondition/text()">
                                    <li><xsl:value-of select="."/></li>
                                </xsl:for-each>
                            </ul>
                        </dd>
                    </xsl:if>
                    <!-- non-creator names -->
                    <dd>
                        <xsl:if test="mods:name[descendant::mods:role/mods:roleTerm[@type='text' and (text()='donor' or text()='Donor')]]">
                            <xsl:choose>
                                <xsl:when test="count(mods:name[descendant::mods:role/mods:roleTerm[@type='text' and (text()='donor' or text()='Donor')]])=1">
                                    <dt>Donor</dt>
                                </xsl:when>
                                <xsl:otherwise>
                                    <dt>Donors</dt>
                                </xsl:otherwise>
                            </xsl:choose>
                            <xsl:for-each select="mods:name[descendant::mods:role/mods:roleTerm[@type='text' and (text()='donor' or text()='Donor')]]">
                                <dd>
                                    <xsl:for-each select="mods:namePart">
                                        <xsl:call-template name="mods-namePart" />
                                    </xsl:for-each>
                                </dd>
                            </xsl:for-each>
                        </xsl:if>
                        <xsl:if test="mods:name[descendant::mods:role/mods:roleTerm[@type='text' and (text()='Funder' or text()='Distributor')]]">
                            <xsl:for-each select="mods:name[descendant::mods:role/mods:roleTerm[@type='text' and (text()='Funder' or text()='Distributor')]]">
                                <dt><xsl:value-of select="mods:role/mods:roleTerm[@type='text']"/></dt>
                                <dd>
                                    <xsl:for-each select="mods:namePart">
                                        <xsl:call-template name="mods-namePart" />
                                    </xsl:for-each>
                                </dd>
                            </xsl:for-each>
                        </xsl:if>
                    </dd>
                </dl>
            </xsl:if>
        </span>
    </xsl:template>

    <!-- TITLE PROCESSING TEMPLATES -->
    <!--This is the template for the type of titles that should appear above the asset viewer.-->
    <xsl:template name="mods-mainTitle" match="mods:titleInfo[not(@*)]|mods:titleInfo[@displayLabel='title']|mods:titleInfo[@type='uniform']">
        <xsl:for-each select="mods:titleInfo">
            <xsl:choose>
                <!-- This is for your normal run of the mill title: The main title without any attributes. It also takes into account
                    Titles from unremediated MODS which use the displayLabel='title' attribute.-->
                <xsl:when test="self::mods:titleInfo[not(@*)]|self::mods:titleInfo[@displayLabel='title']">
                    <h1 class="page-title hidden" itemprop="name">
                        <xsl:call-template name="mods-titletext" />
                    </h1>
                </xsl:when>
                <!-- This displays the uniform titles as a smaller <h2> header-->
                <xsl:when test="self::mods:titleInfo[@type='uniform']">
                    <h2 itemprop="alternativeHeadline">
                        <xsl:call-template name="mods-titletext" />
                    </h2>
                </xsl:when>
            </xsl:choose>
        </xsl:for-each>
    </xsl:template>

    <!-- This is used for alternative, translated, and abbreviated titles and should display under the Asset Viewer -->
    <xsl:template name="mods-titleinfo">
        <xsl:choose>
            <!-- This will grab alternative titles, and place whatever value their respective titleInfo displayLabel has before them -->
            <xsl:when test="@type='alternative' and @displayLabel">
                <dt>
                    <xsl:value-of select="@displayLabel" />
                </dt>
                <dd itemprop="alternativeHeadline">
                    <xsl:call-template name="mods-titletext" />
                </dd>
            </xsl:when>
            <!-- These next two xsl:when statements create an appropriate label for either abbreviated or translated titles and put the correct value after it -->
            <xsl:when test="@type='abbreviated'">
                <dt>
                    Abbreviated Title
                </dt>
                <dd itemprop="alternativeHeadline">
                    <xsl:call-template name="mods-titletext" />
                </dd>
            </xsl:when>
            <xsl:when test="@type='translated'">
                <dt>
                    Translated Title
                </dt>
                <dd itemprop="alternativeHeadline">
                    <xsl:call-template name="mods-titletext" />
                </dd>
            </xsl:when>
        </xsl:choose>
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

    <!-- This templates processes titleInfo parts. NAH 2013-07-16-->
    <xsl:template name="mods-titletext">
        <xsl:value-of select="mods:nonSort/text()"/>
        <xsl:text> </xsl:text>
        <xsl:value-of select="mods:title/text()"/>

        <xsl:if test="mods:subTitle|mods:partName|mods:partNumber">
            <xsl:if test="mods:subTitle">
                <xsl:text>: </xsl:text>
                <xsl:value-of select="mods:subTitle/text()"/>
            </xsl:if>
            <xsl:if test="mods:partName|mods:partNumber">
                <span>
                    <xsl:attribute name="style">font-weight: normal; font-style: italic; font-size: 16px;</xsl:attribute>
                    <xsl:if test="mods:title|mods:subTitle">
                        <xsl:text>, </xsl:text>
                    </xsl:if>
                    <xsl:for-each select="mods:partName|mods:partNumber">
                        <xsl:if test="position()>1">
                            <xsl:text>, </xsl:text>
                        </xsl:if>
                        <xsl:apply-templates />
                    </xsl:for-each>
                </span>
            </xsl:if>
        </xsl:if>
        <xsl:if test="following-sibling::mods:part and not(@*)">
            <span>
                <xsl:attribute name="style">font-weight: normal; font-style: italic; font-size: 16px;</xsl:attribute>
                <xsl:if test="mods:title|mods:subTitle">
                    <xsl:text>, </xsl:text>
                </xsl:if>
                <xsl:for-each select="following-sibling::mods:part/child::*">
                    <xsl:if test="position()>1">
                        <xsl:text>, </xsl:text>
                    </xsl:if>
                    <xsl:call-template name="mods-part-detail" />
                </xsl:for-each>
            </span>
        </xsl:if>
    </xsl:template>

    <!-- This populates the extent of the items. NAH 2013-07-16-->
    <xsl:template name="mods-extent">
        <xsl:choose>
            <xsl:when test="substring(text(),3,1)=':'">
                <dt>
                    Duration
                </dt>
                <dd>
                    <xsl:value-of select="text()"/>
                </dd>
            </xsl:when>
            <xsl:otherwise>
                <dt>
                    Physical Description
                </dt>
                <dd>
                    <xsl:value-of select="text()"/>
                </dd>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <!-- I have no idea what this does. NAH 2013-07-16-->
    <xsl:template name="mods-container-title">
        <xsl:for-each select="mods:titleInfo">
            <p><xsl:call-template name="mods-titleinfo" /></p>
        </xsl:for-each>
    </xsl:template>

    <!-- I have no idea what this does. NAH 2013-07-16-->
    <xsl:template name="mods-subitem-title">
        <p class="title-btn">
            <xsl:for-each select="mods:titleInfo">
                <xsl:choose>
                    <xsl:when test="@displayLabel='title'">
                        <xsl:attribute name="style">font-weight: bold;</xsl:attribute>
                        <xsl:call-template name="mods-titleinfo" />
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:call-template name="mods-titleinfo" />
                    </xsl:otherwise>
                </xsl:choose>
                <xsl:text> </xsl:text>
            </xsl:for-each>
        </p>
    </xsl:template>

    <!--I don't know why this comment is in here... I'll just leave it. NAH 2013-07-16
    <xsl:template match="mods:namePart">
        <xsl:call-template name="mods-namePart" />
    </xsl:template>-->

    <!-- Puts names together. NAH 2013-07-16 -->
    <xsl:template name="mods-namePart">
        <xsl:if test="@type">
            <xsl:text>, </xsl:text>
        </xsl:if>
        <xsl:value-of select="text()" />
    </xsl:template>

    <!-- This appears to do absolutely nothing. NAH 2013-07-16-->
    <xsl:template match="mods:roleTerm">
        <!-- hide this stuff -->
    </xsl:template>

    <!-- This tests whether an Author Name is a Person or a Corporate Body and places the correct schema.org data. NAH 2013-07-16-->
    <xsl:template name="microdata-AuthorName">
        <xsl:choose>
            <xsl:when test="@type='personal'">
                <dd itemprop="author" itemscope="itemscope" itemtype="http://schema.org/Person">
                    <span itemprop="name">
                        <xsl:for-each select="mods:namePart">
                            <xsl:call-template name="mods-namePart"/>
                        </xsl:for-each>
                    </span>
                </dd>
            </xsl:when>
        </xsl:choose>
        <xsl:choose>
            <xsl:when test="@type='corporate' or @type='conference'">
                <dd itemprop="author" itemscope="itemscope" itemtype="http://schema.org/Organization">
                    <span itemprop="name">
                        <xsl:for-each select="mods:namePart">
                            <xsl:call-template name="mods-namePart"/>
                        </xsl:for-each>
                    </span>
                </dd>
            </xsl:when>
        </xsl:choose>
    </xsl:template>

    <!-- This tests whether an Mentioned Name (like the recipient) is a Person or a Corporate Body and places the correct schema.org data. NAH 2013-07-16-->
    <xsl:template name="microdata-MentionsName">
        <xsl:choose>
            <xsl:when test="@type='personal'">
                <dd itemprop="mentions" itemscope="itemscope" itemtype="http://schema.org/Person">
                    <span itemprop="name">
                        <xsl:for-each select="mods:namePart">
                            <xsl:call-template name="mods-namePart"/>
                        </xsl:for-each>
                    </span>
                </dd>
            </xsl:when>
        </xsl:choose>
        <xsl:choose>
            <xsl:when test="@type='corporate' or @type='conference'">
                <dd itemprop="mentions" itemscope="itemscope" itemtype="http://schema.org/Organization">
                    <span itemprop="name">
                        <xsl:for-each select="mods:namePart">
                            <xsl:call-template name="mods-namePart"/>
                        </xsl:for-each>
                    </span>
                </dd>
            </xsl:when>
        </xsl:choose>
    </xsl:template>

    <!-- This tests whether a Contributor is a Person or a Corporate Body and places the correct schema.org data. NAH 2013-07-16-->
    <xsl:template name="microdata-ContributorName">
        <xsl:choose>
            <xsl:when test="@type='personal'">
                <dd itemprop="contributor" itemscope="itemscope" itemtype="http://schema.org/Person">
                    <span itemprop="name">
                        <xsl:for-each select="mods:namePart">
                            <xsl:call-template name="mods-namePart"/>
                        </xsl:for-each>
                    </span>
                </dd>
            </xsl:when>
        </xsl:choose>
        <xsl:choose>
            <xsl:when test="@type='corporate' or @type='conference'">
                <dd itemprop="" itemscope="itemscope" itemtype="http://schema.org/Organization">
                    <span itemprop="name">
                        <xsl:for-each select="mods:namePart">
                            <xsl:call-template name="mods-namePart"/>
                        </xsl:for-each>
                    </span>
                </dd>
            </xsl:when>
        </xsl:choose>
    </xsl:template>

    <!-- Puts the dash between subject subdivisions. NAH 2013-07-16-->
    <xsl:template name="mods-subject">
        <xsl:for-each select="mods:topic|mods:geographic|mods:name|mods:genre|mods:temporal|mods:occupation|mods:titleInfo">
            <xsl:choose>
                <xsl:when test="self::mods:name">
                    <xsl:for-each select="mods:namePart">
                        <xsl:call-template name="mods-namePart" />
                    </xsl:for-each>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:if test="position()>1">
                        <xsl:text> -- </xsl:text>
                    </xsl:if>
                    <xsl:apply-templates />
                </xsl:otherwise>
            </xsl:choose>
        </xsl:for-each>
    </xsl:template>

    <!-- This was an incredibly awesome template that formated the date in a more readable way than YYYY-MM-DD (ie. it will say January 31, 1981 instead of 1981-01-31)
        It's super cool! Unfortunately it also doesn't work. It needs an XSL 2.0 processer and, sadly, the server is not equipped with such fancy technology. So all this stupid
        template does is create a template called thisDate and call up "mods-date". I'm not optimistic that the server will be upgraded to 2.0, but I left this in there just because
        I worked really hard on it. :(-->
    <xsl:template name="dateFormater">
        <!--<xsl:choose>
            #This first tests if it's encoded as w3cdtf, if it's ten characters long, and if it's castable as a date. If those conditions are met, then it runs the format-date function
            <xsl:when test="@encoding='w3cdtf' and string-length(text())=10 and text() castable as xs:date">
                <xsl:variable name="aDate" as="xs:date" select="xs:date(text())"/>
                <xsl:variable name="thisDate" select="format-date($aDate, '[MNn] [D1], [Y]')"/>
                <xsl:call-template name="mods-date">
                    <xsl:with-param name="thisDate" select="$thisDate"/>
                </xsl:call-template>
            </xsl:when>
            #This tests if only the month is present (i.e. it's only seven characters long). If that's the case then it add a couple extra junk characters (-01) so that it can be formated
            #as a date. There's a very good chance that there's any easier way of doing this.
            <xsl:when test="@encoding='w3cdtf' and string-length(text())=7 and text() castable as xs:gYearMonth">
                <xsl:variable name="aDate" as="xs:date" select="xs:date(concat(text(), '-01'))"/>
                <xsl:variable name="thisDate" select="format-date($aDate, '[MNn], [Y]')"/>
                <xsl:call-template name="mods-date">
                    <xsl:with-param name="thisDate" select="$thisDate"/>
                </xsl:call-template>
            </xsl:when>
            #Finally, if it's neither a full date, nor a year with a month, it just uses the text as is.
            <xsl:otherwise>
                <xsl:variable name="thisDate" select="text()"/>
                <xsl:call-template name="mods-date">
                    <xsl:with-param name="thisDate" select="$thisDate"/>
                </xsl:call-template>
            </xsl:otherwise>
        </xsl:choose>-->
        <xsl:variable name="thisDate" select="text()"/>
        <xsl:call-template name="mods-date">
            <xsl:with-param name="thisDate" select="$thisDate"/>
        </xsl:call-template>
    </xsl:template>

    <!--This adds qualifiers to dates NAH 2013-07-16-->
    <xsl:template name="mods-date">
        <xsl:param name="thisDate"/>
        <xsl:if test="@qualifier='approximate'">
            <span>
                <xsl:attribute name="style">font-style: italic;</xsl:attribute>
                <xsl:text>ca. </xsl:text>
            </span>
        </xsl:if>
        <xsl:value-of select="$thisDate"/>
        <xsl:choose>
            <xsl:when test="@point='start'">
                <xsl:text>&#8211;</xsl:text>
            </xsl:when>
        </xsl:choose>
        <xsl:if test="@qualifier='questionable' and @point!='start'">
            <xsl:text>?</xsl:text>
        </xsl:if>
    </xsl:template>

    <!-- The pubInfo template puts correct ISBD punctuation inbetween publication elements-->
    <xsl:template name="pubInfo">
        <xsl:choose>
            <xsl:when test="self::mods:place">
                <xsl:value-of select="mods:placeTerm[@type='text']"/>
            </xsl:when>
            <xsl:when test="self::mods:dateIssued">
                <xsl:call-template name="dateFormater"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="."/>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:choose>
            <xsl:when test="following-sibling::*[1][self::mods:place]"> ; </xsl:when>
            <xsl:when test="following-sibling::*[1][self::mods:publisher]"> : </xsl:when>
            <xsl:when test="self::mods:publisher[following-sibling::*[1][self::mods:dateIssued]]">, </xsl:when>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="MODSNames">
        <!-- The following will display each Correspondent and if there is a sender location, it will display it under it.-->
        <xsl:if test="mods:name/mods:role/mods:roleTerm[@type='text' and text()='Correspondent']">
            <xsl:choose>
                <xsl:when test="count(mods:name[descendant::mods:role/mods:roleTerm[@type='text' and text()='Correspondent']])=1">
                    <dt>Sender</dt>
                </xsl:when>
                <xsl:otherwise>
                    <dt>Senders</dt>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:for-each select="mods:name[descendant::mods:role/mods:roleTerm[@type='text' and text()='Correspondent']]">
                <xsl:call-template name="microdata-AuthorName"/>
            </xsl:for-each>
            <xsl:if test="mods:originInfo[@displayLabel='Sender Location']">
                <xsl:choose>
                    <xsl:when test="count(mods:name[descendant::mods:role/mods:roleTerm[@type='text' and text()='Correspondent']])=1">
                        <dt>Sender Location</dt>
                    </xsl:when>
                    <xsl:otherwise>
                        <dt>Senders Location</dt>
                    </xsl:otherwise>
                </xsl:choose>
                <dd itemprop="contentLocation" itemscope="itemscope" itemtype="http://schema.org/Place">
                    <span itemprop="name">
                        <xsl:value-of select="mods:originInfo[@displayLabel='Sender Location']/mods:place/mods:placeTerm[@type='text']"/>
                    </span>
                </dd>
            </xsl:if>
        </xsl:if>
        <!-- The following will display each Recipient and if there is a recipient location, it will display it under it.-->
        <xsl:if test="mods:name/mods:role/mods:roleTerm[@type='text' and text()='Recipient']">
            <xsl:choose>
                <xsl:when test="count(mods:name[descendant::mods:role/mods:roleTerm[@type='text' and text()='Recipient']])=1">
                    <dt>Recipient</dt>
                </xsl:when>
                <xsl:otherwise>
                    <dt>Recipients</dt>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:for-each select="mods:name[descendant::mods:role/mods:roleTerm[@type='text' and text()='Recipient']]">
                <xsl:call-template name="microdata-MentionsName"/>
            </xsl:for-each>
            <xsl:if test="mods:originInfo[@displayLabel='Recipient Location']">
                <xsl:choose>
                    <xsl:when test="count(mods:name[descendant::mods:role/mods:roleTerm[@type='text' and text()='Recipient']])=1">
                        <dt>Recipient Location</dt>
                    </xsl:when>
                    <xsl:otherwise>
                        <dt>Recipients Location</dt>
                    </xsl:otherwise>
                </xsl:choose>
                <dd itemprop="contentLocation" itemscope="itemscope" itemtype="http://schema.org/Place">
                    <span itemprop="name">
                        <xsl:value-of select="mods:originInfo[@displayLabel='Recipient Location']/mods:place/mods:placeTerm[@type='text']"/>
                    </span>
                </dd>
            </xsl:if>
        </xsl:if>
        <!-- The following displays any name with a role other than "Donor," "Funder," "Distributor," "Correspondent," or "Recipient".
             It takes the display text from the roleTerm text. If there is more than one role, it'll seperate each by a comma.-->
        <xsl:for-each select="mods:name[descendant::mods:role/mods:roleTerm[@type='text' and (text()!='Donor' and text()!='donor' and text()!='Funder' and text()!='Distributor' and text()!='Correspondent' and text()!='Recipient')]]">
            <dt>
                <xsl:for-each select="mods:role/mods:roleTerm[@type='text']">
                    <xsl:choose>
                        <xsl:when test="position()=1">
                            <xsl:value-of select="text()"/>
                        </xsl:when>
                        <xsl:when test="position() &gt; 1">, <xsl:value-of select="text()"/></xsl:when>
                    </xsl:choose>
                </xsl:for-each>
            </dt>
            <xsl:call-template name="microdata-AuthorName"/>
        </xsl:for-each>
    </xsl:template>

    <xsl:template name="ETDNames">
        <xsl:if test="mods:name/mods:role/mods:roleTerm[@type='text' and text()='Author']">
            <xsl:choose>
                <xsl:when test="count(mods:name[descendant::mods:role/mods:roleTerm[@type='text' and text()='Author']])=1">
                    <dt>Author</dt>
                </xsl:when>
                <xsl:otherwise>
                    <dt>Authors</dt>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:for-each select="mods:name[descendant::mods:role/mods:roleTerm[@type='text' and text()='Author']]">
                <xsl:call-template name="microdata-AuthorName"/>
            </xsl:for-each>
        </xsl:if>
        <xsl:if test="mods:name/mods:role/mods:roleTerm[@type='text' and text()='Thesis advisor']">
            <xsl:choose>
                <xsl:when test="count(mods:name[descendant::mods:role/mods:roleTerm[@type='text' and text()='Thesis advisor']])=1">
                    <dt>Thesis advisor</dt>
                </xsl:when>
                <xsl:otherwise>
                    <dt>Thesis advisors</dt>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:for-each select="mods:name[descendant::mods:role/mods:roleTerm[@type='text' and text()='Thesis advisor']]">
                <xsl:call-template name="microdata-ContributorName"/>
            </xsl:for-each>
        </xsl:if>
        <xsl:if test="mods:name/mods:role/mods:roleTerm[@type='text' and text()='Department']">
            <xsl:choose>
                <xsl:when test="count(mods:name[descendant::mods:role/mods:roleTerm[@type='text' and text()='Department']])=1">
                    <dt>Department</dt>
                </xsl:when>
                <xsl:otherwise>
                    <dt>Departments</dt>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:for-each select="mods:name[descendant::mods:role/mods:roleTerm[@type='text' and text()='Department']]">
                <dd>
                    <xsl:for-each select="mods:namePart">
                        <xsl:call-template name="mods-namePart" />
                    </xsl:for-each>
                </dd>
            </xsl:for-each>
        </xsl:if>
        <xsl:if test="mods:name/mods:role/mods:roleTerm[@type='text' and text()='Committee member']">
            <xsl:choose>
                <xsl:when test="count(mods:name[descendant::mods:role/mods:roleTerm[@type='text' and text()='Committee member']])=1">
                    <dt>Committee member</dt>
                </xsl:when>
                <xsl:otherwise>
                    <dt>Committee members</dt>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:for-each select="mods:name[descendant::mods:role/mods:roleTerm[@type='text' and text()='Committee member']]">
                <xsl:call-template name="microdata-ContributorName"/>
            </xsl:for-each>
        </xsl:if>
        <dt>Degree</dt>
        <dd><xsl:value-of select="mods:extension/etd:degree/etd:name"/></dd>
        <dt>Discipline</dt>
        <dd><xsl:value-of select="mods:extension/etd:discipline"/></dd>
    </xsl:template>

    <xsl:template name="mods-item-body">
        <dl>
            <xsl:for-each select="mods:titleInfo[@type!='uniform' and @displayLabel!='title']">
                <xsl:call-template name="mods-titleinfo"/>
            </xsl:for-each>
            <!-- The following displays the edition statement... for those very few times where it's actually a factor -->
            <xsl:if test="mods:originInfo/mods:edition">
                <dt>Edition</dt>
                <dd>
                    <xsl:value-of select="mods:originInfo/mods:edition"/>
                </dd>
            </xsl:if>
            <!--The following displays the table of contents, if applicable. -->
            <xsl:for-each select="mods:tableOfContents">
                <dt>Table Of Contents</dt>
                <dd>
                    <xsl:value-of select="current()"/>
                </dd>
            </xsl:for-each>
            <xsl:if test="mods:abstract">
                <dt>Abstract</dt>
                <dd itemprop="description">
                    <xsl:value-of select="mods:abstract/text()"/>
                </dd>
            </xsl:if>
            <xsl:for-each select="mods:note">
                <xsl:if test="@displayLabel = 'Description'">
                    <dt>
                        <xsl:value-of select="@displayLabel"/>
                    </dt>
                    <dd itemprop="description">
                        <xsl:value-of select="text()"/>
                    </dd>
                </xsl:if>
            </xsl:for-each>
            <!-- The following displays the aat genre -->
            <xsl:if test="mods:genre[@authority='aat']">
                <xsl:choose>
                    <xsl:when test="count(mods:genre[@authority='aat'])=1">
                        <dt>Genre</dt>
                    </xsl:when>
                    <xsl:otherwise>
                        <dt>Genres</dt>
                    </xsl:otherwise>
                </xsl:choose>
                <xsl:for-each select="mods:genre[@authority='aat']">
                    <dd itemprop="additionalType">
                        <xsl:value-of select="text()"/>
                    </dd>
                </xsl:for-each>
            </xsl:if>
            <!-- Names -->
            <!-- The following will display each Correspondent (as "Sender") and if there is a sender location, it will display it under it.-->
            <xsl:choose>
                <xsl:when test="mods:extension/etd:degree">
                    <xsl:call-template name="ETDNames"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:call-template name="MODSNames"/>
                </xsl:otherwise>
            </xsl:choose>
            <!-- Publication information generator. This will first test if there's any originInfo tags without attributes (eliminating sender and recipient info)
                 It will then make sure that originInfo has either a publisher, a place of publication, or a date issued-->
            <xsl:if test="mods:originInfo[not(@*) and descendant::mods:publisher|descendant::mods:place|descendant::mods:dateIssued]">
                <dt>Publication Information</dt>
                <xsl:for-each select="mods:originInfo[not(@*) and descendant::mods:publisher|descendant::mods:place|descendant::mods:dateIssued]">
                    <dd>
                        <xsl:choose>
                            <!-- This first test looks to see if the originInfo has place, publisher, AND dateIssued, and that the first publisher is preceeded by
                                At least one place. If all these conditions are met then it calls the pubInfo template for each element-->
                            <xsl:when test="mods:place and mods:publisher and mods:dateIssued and not(mods:publisher[1][not(preceding-sibling::*[1][self::mods:place])])">
                                <xsl:for-each select="mods:place|mods:publisher|mods:dateIssued">
                                    <xsl:call-template name="pubInfo"/>
                                </xsl:for-each>
                            </xsl:when>
                            <!-- If the first publisher is not proceeded by any places, then this plops in the RDA phrase: "Place of publication not identified". It will then
                                Print out the rest of the publication info through the pubInfo template. NB as far as I can tell, there's really no way to know if the second
                                publisher listed doesn't have a name attached to it. If it's not directly preceeded by any place elements, that could just mean that the place(s)
                                associated with it are before the first publisher.-->
                            <xsl:when test="mods:publisher[1][not(preceding-sibling::*[1][self::mods:place])]">
                                <span>
                                    <xsl:attribute name="style">font-style: italic;</xsl:attribute>
                                    <xsl:text>Place of publication not identified</xsl:text>
                                </span> : <xsl:for-each select="mods:place|mods:publisher|mods:dateIssued"><xsl:call-template name="pubInfo"/></xsl:for-each>
                            </xsl:when>
                            <!-- If there's no publisher at all, then this will put the RDA phrase "publisher not identified" after all of the places and before the dateIssued-->
                            <xsl:when test="mods:place and mods:dateIssued and not(mods:publisher)">
                                <xsl:for-each select="mods:place">
                                    <xsl:call-template name="pubInfo"/>
                                </xsl:for-each> : <span><xsl:attribute name="style">font-style: italic;</xsl:attribute><xsl:text>publisher not identified</xsl:text></span>, <xsl:for-each select="mods:dateIssued"><xsl:call-template name="pubInfo"/></xsl:for-each>
                            </xsl:when>
                            <!--Finally,  if there's no mods:place nor mods:publisher, but there is a dateIssued, this prints out both RDA phrases and the dateIssued-->
                            <xsl:when test="mods:dateIssued and not(mods:place) and not(mods:publisher)">
                                <span><xsl:attribute name="style">font-style : italic;</xsl:attribute><xsl:text>Place of publication not identified</xsl:text></span> : <span><xsl:attribute name="style">font-style : italic;</xsl:attribute><xsl:text>publisher not identified</xsl:text></span>, <xsl:for-each select="mods:dateIssued"><xsl:call-template name="pubInfo"/></xsl:for-each>
                            </xsl:when>
                        </xsl:choose>
                    </dd>
                </xsl:for-each>
            </xsl:if>
            <!-- These display the various date functions -->
            <xsl:if test="mods:originInfo/mods:dateCreated">
                <dt>Date Created</dt>
                <xsl:element name="dd">
                    <xsl:attribute name="itemprop">dateCreated</xsl:attribute>
                    <xsl:if test="mods:originInfo/mods:dateCreated[@encoding='w3cdtf' and @keyDate='yes']">
                        <xsl:attribute name="content">
                            <xsl:value-of select="mods:originInfo[1]/mods:dateCreated[@encoding='w3cdtf' and @keyDate='yes']"/>
                        </xsl:attribute>
                    </xsl:if>
                    <xsl:choose>
                        <xsl:when test="count(//mods:dateCreated[@keyDate='yes']) &lt; 2">
                            <xsl:for-each select="mods:originInfo/mods:dateCreated">
                                <xsl:call-template name="dateFormater"/>
                            </xsl:for-each>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:for-each select="mods:originInfo[1]/mods:dateCreated[@keyDate='yes'][1]">
                                <xsl:call-template name="dateFormater"/>
                            </xsl:for-each>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:element>
            </xsl:if>
            <xsl:if test="mods:originInfo/mods:dateOther[@type='performanceDate']">
                <dt>Performance Date</dt>
                <dd>
                    <xsl:for-each select="mods:originInfo/mods:dateOther[@type='performanceDate']">
                        <xsl:call-template name="dateFormater"/>
                    </xsl:for-each>
                </dd>
            </xsl:if>
            <xsl:for-each select="mods:physicalDescription/mods:extent">
                <xsl:call-template name="mods-extent" />
            </xsl:for-each>
            <!--The following  prints out the subjects, unless they are from the TGN thesaurus. TGN is excluded from printing
                because in some cases, particularly with graphic material, TGN reproduces information found in LCSH fields
                for searchability purposes-->
            <xsl:if test="mods:subject[not(@authority='tgn')]">
                <xsl:choose>
                    <xsl:when test="count(mods:subject)=1">
                        <dt>Subject</dt>
                    </xsl:when>
                    <xsl:when test="count(mods:subject)>1">
                        <dt>Subjects</dt>
                    </xsl:when>
                </xsl:choose>
                <xsl:for-each select="mods:subject[not(@authority='tgn')]">
                    <dd itemprop="about"><xsl:call-template name="mods-subject" /></dd>
                </xsl:for-each>
            </xsl:if>
            <!-- The following displays the type of resource -->
            <xsl:if test="mods:typeOfResource">
                <xsl:choose>
                    <xsl:when test="count(mods:typeOfResource)=1">
                        <dt>Document Type</dt>
                    </xsl:when>
                    <xsl:otherwise>
                        <dt>Document Types</dt>
                    </xsl:otherwise>
                </xsl:choose>
                <xsl:for-each select="mods:typeOfResource">
                    <dd itemprop="additionalType">
                        <xsl:value-of select="text()"/>
                    </dd>
                </xsl:for-each>
            </xsl:if>
            <!-- The following prints out the languages the resoure is in. It won't print a language label for resources tagged with
                'zxx', though ('Cause, you see, that would be the no linguistic content tag) -->
            <xsl:if test="mods:language[child::mods:languageTerm[@type='code' and @authority='iso639-2b' and text()!='zxx' and string-length(text())=3] and child::mods:languageTerm[@type='text']]">
                <xsl:choose>
                    <xsl:when test="count(mods:language/mods:languageTerm[@type='code' and @authority='iso639-2b' and text()!='zxx' and string-length(text())=3])=1">
                        <dt>Language</dt>
                    </xsl:when>
                    <xsl:otherwise>
                        <dt>Languages</dt>
                    </xsl:otherwise>
                </xsl:choose>
                <xsl:for-each select="mods:language[child::mods:languageTerm[@type='code' and @authority='iso639-2b' and text()!='zxx' and string-length(text())=3] and child::mods:languageTerm[@type='text']]">
                    <xsl:element name="dd">
                        <xsl:attribute name="itemprop">inLanguage</xsl:attribute>
                        <xsl:attribute name="content">
                            <xsl:value-of select="mods:languageTerm[@type='code']"/>
                        </xsl:attribute>
                        <xsl:value-of select="mods:languageTerm[@type='text']"/>
                    </xsl:element>
                </xsl:for-each>
            </xsl:if>
        </dl>
    </xsl:template>

</xsl:stylesheet>