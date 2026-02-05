// @ts-ignore
import * as XLSX from 'xlsx/xlsx.mjs'
import { defineEventHandler, getQuery, createError, setHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const assessmentType = query.type as string || 'junior' // Default to junior

  try {
    // Create workbook
    const wb = XLSX.utils.book_new()

    // Define headers based on assessment type - MUST MATCH IMPORT MAPPINGS EXACTLY
    let headers: string[] = []
    let maxMarks: Record<string, number> = {}

    // Common fields for all types
    const commonHeaders = [
      'STUDENT CANDIDATE',  // Maps to candidateNo
      'SUBJECT',            // Maps to subject
      'TOPIC',              // Maps to topic
      'ASSESSMENT DATE',    // Maps to assessmentDate
      'FORM TYPE'           // Maps to formType - tells import which assessment type
    ]

    if (assessmentType === 'ecd') {
      headers = [
        ...commonHeaders,
        'PREPARATION MARK (15)',           // Maps to preparationMark
        'PREPARATION COMMENT',             // Maps to preparationComment
        'LESSON FACILITATION MARK (15)',   // Maps to lessonFacilitationMark (for ECD)
        'LESSON FACILITATION COMMENT',     // Maps to lessonFacilitationComment
        'DEPORTMENT MARK (5)',             // Maps to deportmentMark
        'DEPORTMENT COMMENT',              // Maps to deportmentComment
        'RECORDS MANAGEMENT MARK (15)',    // Maps to recordsMark
        'RECORDS MANAGEMENT COMMENT',      // Maps to recordsComment
        'ENVIRONMENT MARK (10)',           // Maps to environmentMark
        'ENVIRONMENT COMMENT',             // Maps to environmentComment
        'SELECTED RESEARCH CATEGORY',      // Maps to selectedResearchCategory (community_service, innovation, industrialisation)
        'COMMUNITY MARK (30)',             // Maps to communityMark
        'COMMUNITY COMMENT',               // Maps to communityComment
        'REMAINING 2 PILLARS MARK (10)',   // Maps to remainingPillarsMark (mapped to conclusionMark in DB)
        'REMAINING 2 PILLARS COMMENT',     // Maps to remainingPillarsComment (mapped to conclusionComment in DB)
        'OVERALL COMMENT'                  // Maps to overallComment
      ]
      maxMarks = {
        'PREPARATION MARK (15)': 15,
        'LESSON FACILITATION MARK (15)': 15,
        'DEPORTMENT MARK (5)': 5,
        'RECORDS MANAGEMENT MARK (15)': 15,
        'ENVIRONMENT MARK (10)': 10,
        'COMMUNITY MARK (30)': 30,
        'REMAINING 2 PILLARS MARK (10)': 10
      }
    } else if (assessmentType === 'junior') {
      headers = [
        ...commonHeaders,
        'PREPARATION MARK (15)',           // Maps to preparationMark
        'PREPARATION COMMENT',             // Maps to preparationComment
        'LESSON FACILITATION MARK (15)',   // Maps to lessonPlanningMark (shares field with facilitation for junior)
        'LESSON FACILITATION COMMENT',     // Maps to lessonPlanningComment
        'DEPORTMENT MARK (5)',             // Maps to deportmentMark -> personalDimensionsMark
        'DEPORTMENT COMMENT',              // Maps to deportmentComment -> personalDimensionsComment
        'RECORDS MANAGEMENT MARK (15)',    // Maps to documentsMark
        'RECORDS MANAGEMENT COMMENT',      // Maps to documentsComment
        'ENVIRONMENT MARK (10)',           // Maps to environmentMark
        'ENVIRONMENT COMMENT',             // Maps to environmentComment
        'SELECTED RESEARCH CATEGORY',      // Maps to selectedResearchCategory
        'COMMUNITY MARK (30)',             // Maps to communityMark
        'COMMUNITY COMMENT',               // Maps to communityComment
        'REMAINING 2 PILLARS MARK (10)',   // Maps to conclusionMark
        'REMAINING 2 PILLARS COMMENT',     // Maps to conclusionComment
        'OVERALL COMMENT'                  // Maps to overallComment
      ]
      maxMarks = {
        'PREPARATION MARK (15)': 15,
        'LESSON FACILITATION MARK (15)': 15,
        'DEPORTMENT MARK (5)': 5,
        'RECORDS MANAGEMENT MARK (15)': 15,
        'ENVIRONMENT MARK (10)': 10,
        'COMMUNITY MARK (30)': 30,
        'REMAINING 2 PILLARS MARK (10)': 10
      }
    } else if (assessmentType === 'secondary' || assessmentType === 'isen') {
      headers = [
        ...commonHeaders,
        'PREPARATION MARK (15)',           // Maps to preparationMark
        'PREPARATION COMMENT',             // Maps to preparationComment
        'RECORDS MANAGEMENT MARK (15)',    // Maps to recordsMark
        'RECORDS MANAGEMENT COMMENT',      // Maps to recordsComment
        'LESSON FACILITATION MARK (15)',   // Maps to lessonFacilitationMark
        'LESSON FACILITATION COMMENT',     // Maps to lessonFacilitationComment
        'DEPORTMENT MARK (5)',             // Maps to deportmentMark
        'DEPORTMENT COMMENT',              // Maps to deportmentComment
        'SELECTED RESEARCH CATEGORY',      // Maps to selectedResearchCategory
        'COMMUNITY MARK (30)',             // Maps to communityMark
        'COMMUNITY COMMENT',               // Maps to communityComment
        'REMAINING 2 PILLARS MARK (10)',   // Maps to remainingPillarsMark
        'REMAINING 2 PILLARS COMMENT',     // Maps to remainingPillarsComment
        'ENVIRONMENT MARK (10)',           // Maps to environmentMark (teaching environment)
        'ENVIRONMENT COMMENT',             // Maps to environmentComment
        'OVERALL COMMENT'                  // Maps to overallComment
      ]
      maxMarks = {
        'PREPARATION MARK (15)': 15,
        'RECORDS MANAGEMENT MARK (15)': 15,
        'LESSON FACILITATION MARK (15)': 15,
        'DEPORTMENT MARK (5)': 5,
        'COMMUNITY MARK (30)': 30,
        'REMAINING 2 PILLARS MARK (10)': 10,
        'ENVIRONMENT MARK (10)': 10
      }
    } else if (assessmentType === 'materials') {
      // Materials Development has many detailed sub-fields matching the online form exactly
      headers = [
        ...commonHeaders,
        // CONTENT section (20%)
        'CONTENT RELEVANCE MARK (10)',       // Maps to contentRelevanceMark
        'CONTENT RELEVANCE COMMENT',         // Maps to contentRelevanceComment
        'CONTENT ORGANIZATION MARK (10)',    // Maps to contentOrganizationMark
        'CONTENT ORGANIZATION COMMENT',      // Maps to contentOrganizationComment
        // PEDAGOGICAL VALUE section (20%)
        'PEDAGOGICAL ALIGNMENT MARK (5)',    // Maps to pedagogicalAlignmentMark
        'PEDAGOGICAL ALIGNMENT COMMENT',     // Maps to pedagogicalAlignmentComment
        'PEDAGOGICAL ENGAGEMENT MARK (5)',   // Maps to pedagogicalEngagementMark
        'PEDAGOGICAL ENGAGEMENT COMMENT',    // Maps to pedagogicalEngagementComment
        'PEDAGOGICAL CONNECTION MARK (5)',   // Maps to pedagogicalConnectionMark
        'PEDAGOGICAL CONNECTION COMMENT',    // Maps to pedagogicalConnectionComment
        'PEDAGOGICAL INCLUSIVE MARK (5)',    // Maps to pedagogicalInclusiveMark
        'PEDAGOGICAL INCLUSIVE COMMENT',     // Maps to pedagogicalInclusiveComment
        // DESIGN AND LAYOUT section (20%)
        'DESIGN VISUAL MARK (5)',            // Maps to designVisualMark
        'DESIGN VISUAL COMMENT',             // Maps to designVisualComment
        'DESIGN NAVIGATION MARK (5)',        // Maps to designNavigationMark
        'DESIGN NAVIGATION COMMENT',         // Maps to designNavigationComment
        'DESIGN QUALITY MARK (5)',           // Maps to designQualityMark
        'DESIGN QUALITY COMMENT',            // Maps to designQualityComment
        'DESIGN CONSISTENCY MARK (5)',       // Maps to designConsistencyMark
        'DESIGN CONSISTENCY COMMENT',        // Maps to designConsistencyComment
        // INNOVATION AND CREATIVITY section (20%)
        'INNOVATION ORIGINALITY MARK (10)',  // Maps to innovationOriginalityMark
        'INNOVATION ORIGINALITY COMMENT',    // Maps to innovationOriginalityComment
        'INNOVATION TECHNOLOGY MARK (10)',   // Maps to innovationTechnologyMark
        'INNOVATION TECHNOLOGY COMMENT',     // Maps to innovationTechnologyComment
        // EDUCATION 5.0 COMPLIANCE section (20%)
        'EDUCATION LOCAL MARK (5)',          // Maps to educationLocalMark
        'EDUCATION LOCAL COMMENT',           // Maps to educationLocalComment
        'EDUCATION HERITAGE MARK (5)',       // Maps to educationHeritageMark
        'EDUCATION HERITAGE COMMENT',        // Maps to educationHeritageComment
        'EDUCATION PROBLEM MARK (5)',        // Maps to educationProblemMark
        'EDUCATION PROBLEM COMMENT',         // Maps to educationProblemComment
        'EDUCATION COMMERCIAL MARK (5)',     // Maps to educationCommercialMark
        'EDUCATION COMMERCIAL COMMENT',      // Maps to educationCommercialComment
        'OVERALL COMMENT'                    // Maps to overallComment
      ]
      maxMarks = {
        'CONTENT RELEVANCE MARK (10)': 10,
        'CONTENT ORGANIZATION MARK (10)': 10,
        'PEDAGOGICAL ALIGNMENT MARK (5)': 5,
        'PEDAGOGICAL ENGAGEMENT MARK (5)': 5,
        'PEDAGOGICAL CONNECTION MARK (5)': 5,
        'PEDAGOGICAL INCLUSIVE MARK (5)': 5,
        'DESIGN VISUAL MARK (5)': 5,
        'DESIGN NAVIGATION MARK (5)': 5,
        'DESIGN QUALITY MARK (5)': 5,
        'DESIGN CONSISTENCY MARK (5)': 5,
        'INNOVATION ORIGINALITY MARK (10)': 10,
        'INNOVATION TECHNOLOGY MARK (10)': 10,
        'EDUCATION LOCAL MARK (5)': 5,
        'EDUCATION HERITAGE MARK (5)': 5,
        'EDUCATION PROBLEM MARK (5)': 5,
        'EDUCATION COMMERCIAL MARK (5)': 5
      }
    } else {
      // Default to junior format
      headers = [
        ...commonHeaders,
        'PREPARATION MARK (15)',
        'PREPARATION COMMENT',
        'LESSON FACILITATION MARK (15)',
        'LESSON FACILITATION COMMENT',
        'DEPORTMENT MARK (5)',
        'DEPORTMENT COMMENT',
        'RECORDS MANAGEMENT MARK (15)',
        'RECORDS MANAGEMENT COMMENT',
        'ENVIRONMENT MARK (10)',
        'ENVIRONMENT COMMENT',
        'SELECTED RESEARCH CATEGORY',
        'COMMUNITY MARK (30)',
        'COMMUNITY COMMENT',
        'REMAINING 2 PILLARS MARK (10)',
        'REMAINING 2 PILLARS COMMENT',
        'OVERALL COMMENT'
      ]
      maxMarks = {
        'PREPARATION MARK (15)': 15,
        'LESSON FACILITATION MARK (15)': 15,
        'DEPORTMENT MARK (5)': 5,
        'RECORDS MANAGEMENT MARK (15)': 15,
        'ENVIRONMENT MARK (10)': 10,
        'COMMUNITY MARK (30)': 30,
        'REMAINING 2 PILLARS MARK (10)': 10
      }
    }

    // Create worksheet with headers
    const ws = XLSX.utils.aoa_to_sheet([headers])

    // Set column widths for better visibility
    const colWidths = headers.map((header) => {
      if (header.includes('COMMENT')) return { wch: 40 }
      if (header.includes('MARK')) return { wch: 20 }
      return { wch: 25 }
    })
    ws['!cols'] = colWidths

    // Add sample data row with proper defaults
    const sampleData = headers.map((header) => {
      if (header.includes('MARK')) {
        return 0 // Default mark
      } else if (header.includes('COMMENT')) {
        return '' // Empty comment
      } else if (header === 'ASSESSMENT DATE') {
        return new Date().toISOString().slice(0, 16) // Current datetime
      } else if (header === 'FORM TYPE') {
        return assessmentType // Set the form type
      } else if (header === 'SELECTED RESEARCH CATEGORY') {
        return 'community_service' // Default: community_service, innovation, or industrialisation
      } else if (header === 'STUDENT CANDIDATE') {
        return '' // Candidate number to be filled
      } else {
        return '' // Empty for other fields
      }
    })

    XLSX.utils.sheet_add_aoa(ws, [sampleData], { origin: -1 })

    // Create instructions sheet
    const researchCategoryInstructions = assessmentType === 'ecd'
      ? '• community_service (Research-based Child Study & Community Service)\n• innovation (Research & Innovation)\n• industrialisation (Research & Industrialisation)'
      : '• community_service (Research-based Community Service)\n• innovation (Research & Innovation)\n• industrialisation (Research & Industrialisation)'

    const markLimitsText = Object.entries(maxMarks)
      .map(([field, max]) => `• ${field.replace(' MARK', '')}: 0-${max}`)
      .join('\n')

    const instructions = [
      ['OFFLINE ASSESSMENT TEMPLATE INSTRUCTIONS'],
      [''],
      [`ASSESSMENT TYPE: ${assessmentType.toUpperCase()}`],
      [''],
      ['REQUIRED FIELDS:'],
      ['• STUDENT CANDIDATE: Enter the student candidate number (e.g., 23/002/24)'],
      ['• SUBJECT: Enter the subject being assessed'],
      ['• TOPIC: Enter the topic of the lesson'],
      ['• ASSESSMENT DATE: Enter date in format YYYY-MM-DDTHH:MM (e.g., 2024-03-15T10:30)'],
      [`• FORM TYPE: Keep as "${assessmentType}" - DO NOT CHANGE THIS`],
      [''],
      ['MARK LIMITS:'],
      [markLimitsText],
      [''],
      ['RESEARCH CATEGORY OPTIONS (enter one of these exactly):'],
      [researchCategoryInstructions],
      [''],
      ['IMPORTANT NOTES:'],
      ['1. Student details (name, school, class) are automatically loaded from the database using candidate number'],
      ['2. Enter marks as whole numbers ONLY - no decimals'],
      ['3. Do not exceed the maximum mark for each field'],
      ['4. Comments should be descriptive and constructive'],
      ['5. The FORM TYPE field tells the system which assessment type this is - do not change it'],
      ['6. Save the file and upload it to the system when complete'],
      [''],
      ['TOTAL MARKS:'],
      [`• This assessment totals 100 marks distributed across all criteria`],
    ]

    const instructionsWs = XLSX.utils.aoa_to_sheet(instructions)
    instructionsWs['!cols'] = [{ wch: 100 }]

    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Assessment Data')
    XLSX.utils.book_append_sheet(wb, instructionsWs, 'Instructions')

    // Generate buffer data for direct download
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' })

    // Set headers for file download
    setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    setHeader(event, 'Content-Disposition', `attachment; filename="assessment_template_${assessmentType}_${Date.now()}.xlsx"`)

    return buffer
  } catch (error) {
    console.error('Error generating offline template:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to generate template: ${errorMessage}`
    })
  }
})