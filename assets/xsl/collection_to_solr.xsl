<?xml version="1.0" encoding="UTF-8"?>
<!-- Copyright (c) 2011, The University of Alabama. Licensed under the Educational Community License, 
	Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may 
	obtain a copy of the License at http://www.osedu.org/licenses/ECL-2.0 Unless required by applicable law 
	or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT 
	WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language 
	governing permissions and limitations under the License. -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:mods="http://www.loc.gov/mods/v3">
	<xsl:output method="xml" encoding="utf-8" indent="no" />
	<xsl:strip-space elements="*" />

	<xsl:template match="*|node()">
		<xsl:value-of select="text()" />
		<xsl:text>&#32;</xsl:text>
		<xsl:apply-templates />
	</xsl:template>

	<xsl:template match="collInfo">
		<add>
			<doc>
				<field name="title">
					<xsl:value-of select="Digital_Collection_Name/text()" />
				</field>

				<field name="type">
					<xsl:value-of select="Type_Of_Content/text()" />
				</field>

				<field name="description">
					<xsl:value-of select="Digital_Collection_Description/text()" />
				</field>
				<content>
          <xsl:apply-templates/>
        </content>
			</doc>
		</add>
	</xsl:template>
</xsl:stylesheet>