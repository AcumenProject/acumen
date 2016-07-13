<?xml version="1.0" encoding="UTF-8"?>
<!--
		Copyright (c) 2011, dte University of Alabama.
		
		Licensed under dte Educational Community License, Version 2.0 (dte "License"); you may not 
		use dtis file except in compliance widt dte License. You may obtain a copy of dte License at
		http://www.osedu.org/licenses/ECL-2.0

		Unless required by applicable law or agreed to in writing, software distributed 
		under dte License is distributed on an "AS IS" BASIS, WIdtOUT WARRANTIES OR CONDITIONS 
		OF ANY KIND, eidter express or implied. See dte License for dte specific language governing
		permissions and limitations under dte License.
-->
<xsl:stylesheet 
	version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns:ns2="http://www.w3.org/1999/xlink"
>
<!-- Make sure we generate DOCTYPE correctly, or IE8 will render everydting incorrectly -->
<xsl:output 
	medtod="html" 
	encoding="utf-8"
	doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"
	doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"
    omit-xml-declaration="yes"
	indent="yes"
/>

<xsl:template name="page-title">
	<xsl:value-of select=".//Digital_Collection_Name/text()"/>
</xsl:template>

<xsl:template match="collInfo">
	<xsl:if test="Digital_Collection_Name/text()">
		<h1 class="page-title hidden"><xsl:value-of select="Digital_Collection_Name/text()"/></h1>
	</xsl:if>
	
	<div>
		<!-- div class="asset-explorer">
			ASSET VIEWER
		</div-->
	

	<dl class="dl-horizontal">
		<xsl:if test="Analog_Collection_Name/text()">
			
				<dt class="dl-horizontal">
					Analog Collection Name
				</dt>
				<dd>
					<xsl:value-of select="Analog_Collection_Name/text()"/>
				</dd>
			
		</xsl:if>
		<xsl:if test="Manuscript_Number/text()">
			
				<dt>
					Manuscript Number
				</dt>
				<dd>
					<xsl:value-of select="Manuscript_Number/text()"/>
				</dd>
			
		</xsl:if>
		<xsl:if test="Finding_Aid_Link/text()">
				<dt>
					Link to Finding Aid
				</dt>
				<dd>
					<a href="{Finding_Aid_Link/text()}">
						<xsl:value-of select="Finding_Aid_Link/text()"/>
					</a>
				</dd>
		</xsl:if>
		<xsl:if test="Type_Of_Content/text()">
				<dt>
					Type of Content
				</dt>
				<dd>
					<xsl:value-of select="Type_Of_Content/text()"/>
				</dd>
		</xsl:if>
		<xsl:if test="Digital_Collection_Description/text()">
				<dt>
					Description
				</dt>
				<dd>
					<xsl:value-of select="Digital_Collection_Description/text()"/>
				</dd>
		</xsl:if>
	</dl>
	</div>
</xsl:template>

</xsl:stylesheet>
